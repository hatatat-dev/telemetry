from record import *
from state import *
from log import *
from thread import *


def get_controller_state(controller: Controller, tag: str = "") -> ControllerState:
    """Get controller state and save the telemetry record for that"""

    timestamp = get_timestamp()
    state = get_controller_state_no_record(controller)

    log_record(
        Record(
            create_record_header(
                timestamp, get_current_thread(), controller, "state", tag
            ),
            state,
        )
    )

    return state


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


def get_gps_state(gps: Gps, tag: str = "") -> GpsState:
    """Get Gps sensor state and save the telemetry record for that"""

    timestamp = get_timestamp()
    state = get_gps_state_no_record(gps)

    log_record(
        Record(
            create_record_header(timestamp, get_current_thread(), gps, "state", tag),
            state,
        )
    )

    return state


def get_motor_state(motor: Motor, tag: str = "") -> MotorState:
    """Get motor sensor state and save the telemetry record for that"""

    timestamp = get_timestamp()
    state = get_motor_state_no_record(motor)

    log_record(
        Record(
            create_record_header(timestamp, get_current_thread(), motor, "state", tag),
            state,
        )
    )

    return state


class TeleController(Controller):
    """Controller that saves telemetry records when its methods are called"""

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

    def collision(self, callback: Callable[..., None], arg: tuple = ()):
        return super().collision(
            wrap_callback_with_log,
            (self, "collision", self.tag, callback, False) + arg,
        )


class TeleGps(Gps):
    """Gps with a default name"""

    def __init__(self, *args, name: str = "gps", tag: str = "", **kwargs):
        super().__init__(*args, **kwargs)
        self.name = name
        self.tag = tag

        for method in [
            "set_heading",
            "reset_heading",
            "set_rotation",
            "reset_rotation",
            "set_origin",
            "set_location",
            "calibrate",
            "set_sensor_rotation",
            "set_turn_type",
        ]:
            setattr(
                self,
                method,
                wrap_method_with_log(self, method, tag, getattr(self, method)),
            )


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


class TeleThread(Thread):
    def __init__(
        self,
        callback: Callable[..., None],
        arg: tuple = (),
        name: str = "",
        tag: str = "",
    ):
        self.callback = callback
        self.arg = arg

        self.name = name
        self.tag = tag

        super().__init__(self.callback_wrapper, arg)

    def callback_wrapper(self):
        set_current_thread(self.name)
        log_method_call(self, "enter", self.tag)
        try:
            self.callback(*self.arg)
        except Exception as e:
            print(e)
            log_method_call(self, "leave", self.tag, 1)
            raise

        log_method_call(self, "leave", self.tag)

    def stop(self):
        log_method_call(self, "stop", self.tag)
        return self.stop()
