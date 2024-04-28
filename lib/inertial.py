from lib.record import *
from lib.state import *
from lib.log import *


def get_inertial_state(inertial: Inertial, tag: str = "") -> InertialState:
    """Get inertial sensor state and save the telemetry record for that"""

    timestamp = get_timestamp()
    state = get_inertial_state_no_record(inertial)

    log_record(
        Record(
            create_record_header(
                timestamp, get_current_thread(), inertial, "state", tag
            ),
            state,
        )
    )

    return state


class TeleInertial(Inertial):
    """Inertial with a default name"""

    def __init__(
        self,
        *args,
        rotation_scale: float = 1.0,
        heading_shift: float = 0.0,
        name: str = "inertial",
        tag: str = "",
        **kwargs
    ):
        super().__init__(*args, **kwargs)
        self.name = name
        self.tag = tag
        self.rotation_scale = rotation_scale
        self.heading_shift = heading_shift

        for method_name in [
            "calibrate",
            "set_turn_type",
        ]:
            method = getattr(self, method_name)

            setattr(self, "no_log_" + method_name, method)

            setattr(
                self,
                method_name,
                wrap_method_with_log(self, method_name, tag, method),
            )

    def set_heading(self, value, *args):
        log_method_call(self, "set_heading", self.tag, value, *args)
        self.no_log_set_heading(value, *args)

    def no_log_set_heading(self, value, units=RotationUnits.DEG):
        if not units is RotationUnits.DEG:
            raise Exception("expected units=RotationUnits.DEG: " + str(units))

        self.heading_shift = self.rotation() - value

    def reset_heading(self):
        log_method_call(self, "reset_heading", self.tag)
        self.no_log_reset_heading()

    def no_log_reset_heading(self):
        self.heading_shift = self.rotation()

    def heading(self, units=RotationUnits.DEG):
        return (self.rotation() - self.heading_shift) % 360.0

    def set_rotation(self, value, *args):
        log_method_call(self, "set_rotation", self.tag, value)
        self.no_log_set_rotation(value, *args)

    def no_log_set_rotation(self, value, units=RotationUnits.DEG):
        if not units is RotationUnits.DEG:
            raise Exception("expected units=RotationUnits.DEG: " + str(units))
        self.heading_shift = (
            self.heading_shift + value / self.rotation_scale - super().rotation()
        )
        super().set_rotation(value / self.rotation_scale)

    def reset_rotation(self):
        log_method_call(self, "reset_rotation", self.tag)
        self.no_log_reset_rotation()

    def no_log_reset_rotation(self):
        super().reset_rotation()

    def rotation(self, units=RotationUnits.DEG):
        if not units is RotationUnits.DEG:
            raise Exception("expected units=RotationUnits.DEG: " + str(units))

        return super().rotation() * self.rotation_scale

    def orientation(
        self, axis: OrientationType.OrientationType, units=RotationUnits.DEG
    ):
        return (
            self.heading() if axis == OrientationType.YAW else super().orientation(axis)
        )

    def collision(self, callback: Callable[..., None], arg: tuple = ()):
        return super().collision(
            wrap_callback_with_log,
            (self, "collision", self.tag, callback) + arg,
        )

    def get_state(self, tag: str = ""):
        """Get state and save telemetry record for that"""
        return get_inertial_state(self, tag)
