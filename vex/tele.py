from record import *
from state import *
from log import *


def get_controller_state(controller: Controller, tag: str) -> ControllerState:
    """Get controller state and save the telemetry record for that"""

    timestamp = get_timestamp()
    state = get_controller_state_no_record(controller)

    log_record(
        Record(
            create_record_header(timestamp, controller, "state", tag),
            state,
        )
    )

    return state


def get_inertial_state(inertial: Inertial, tag: str) -> InertialState:
    """Get inertial sensor state and save the telemetry record for that"""

    timestamp = get_timestamp()
    state = get_inertial_state_no_record(inertial)

    log_record(
        Record(
            create_record_header(timestamp, inertial, "state", tag),
            state,
        )
    )

    return state


def get_motor_state(motor: Motor, tag: str) -> MotorState:
    """Get motor sensor state and save the telemetry record for that"""

    timestamp = get_timestamp()
    state = get_motor_state_no_record(motor)

    log_record(
        Record(
            create_record_header(timestamp, motor, "state", tag),
            state,
        )
    )

    return state


class TeleMotor(Motor):
    """Motor that saves telemetry records when its methods are called"""

    def __init__(self, port: int, *args, name: str = "", tag: str = "", **kwargs):
        super().__init__(port, *args, **kwargs)
        self.name = name
        self.tag = tag

        for method in [
            "set_velocity",
            "set_reversed",
            "set_stopping",
            "reset_position",
            "set_position",
            "set_timeout",
            "spin",
            "spin_to_position",
            "spin_for",
            "stop",
            "set_max_torque",
        ]:
            setattr(
                self,
                method,
                wrap_method_with_log(self, method, tag, getattr(self, method)),
            )


class TeleInertial(Inertial):
    """Inertial with a default name"""

    def __init__(self, *args, name: str = "inertial", tag: str = "", **kwargs):
        super().__init__(*args, **kwargs)
        self.name = name
        self.tag = tag

        for method in [
            "set_heading",
            "reset_heading",
            "set_rotation",
            "reset_rotation",
            "calibrate",
            "set_turn_type",
        ]:
            setattr(
                self,
                method,
                wrap_method_with_log(self, method, tag, getattr(self, method)),
            )

    def changed(self, callback: Callable[..., None], arg: tuple = ()):
        return super().changed(
            wrap_callback_with_log,
            (self, "changed", self.tag, callback, False) + arg,
        )

    def collision(self, callback: Callable[..., None], arg: tuple = ()):
        return super().collision(
            wrap_callback_with_log,
            (self, "collision", self.tag, callback, False) + arg,
        )


class TeleController(Controller):
    """Controller that saves telemetry records when its methods are called"""

    class TeleAxis:
        """Axis wrapper that saves telemetry records for callbacks"""

        def __init__(
            self, controller: "TeleController", name: str, original: Controller.Axis
        ):
            self.controller = controller
            self.name = name
            self.original = original

        def value(self):
            return self.original.value()

        def position(self):
            return self.original.position()

        def changed(self, callback: Callable[..., None], arg: tuple = ()):
            return self.original.changed(
                wrap_callback_with_log,
                (
                    self.controller,
                    self.name + "_changed",
                    self.controller.tag,
                    callback,
                    False,
                )
                + arg,
            )

    class TeleButton:
        """Button wrapper that saves telemetry records for callbacks"""

        def __init__(
            self, controller: "TeleController", name: str, original: Controller.Button
        ):
            self.controller = controller
            self.name = name
            self.original = original

        def pressing(self):
            return self.original.pressing()

        def pressed(self, callback: Callable[..., None], arg: tuple = ()):
            return self.original.pressed(
                wrap_callback_with_log,
                (
                    self.controller,
                    self.name + "_pressed",
                    self.controller.tag,
                    callback,
                    True,
                )
                + arg,
            )

        def released(self, callback: Callable[..., None], arg: tuple = ()):
            return self.original.released(
                wrap_callback_with_log,
                (
                    self.controller,
                    self.name + "_released",
                    self.controller.tag,
                    callback,
                    True,
                )
                + arg,
            )

    def __init__(self, *args, name: str = "controller", tag: str = "", **kwargs):
        super().__init__(*args, **kwargs)
        self.name = name
        self.tag = tag

        for axis_name in ["axis1", "axis2", "axis3", "axis4"]:
            setattr(
                self,
                axis_name,
                TeleController.TeleAxis(self, axis_name, getattr(self, axis_name)),
            )

        for button_name in [
            "buttonL1",
            "buttonL2",
            "buttonR1",
            "buttonR2",
            "buttonUp",
            "buttonDown",
            "buttonLeft",
            "buttonRight",
            "buttonA",
            "buttonB",
            "buttonX",
            "buttonY",
        ]:
            setattr(
                self,
                button_name,
                TeleController.TeleButton(
                    self, button_name, getattr(self, button_name)
                ),
            )
