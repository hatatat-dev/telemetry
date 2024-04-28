from lib.record import *
from lib.state import *
from lib.log import *
from lib.thread import *


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

    def get_state(self, tag: str = ""):
        """Get state and save telemetry record for that"""
        return get_controller_state(self, tag)


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

    def get_state(self, tag: str = ""):
        """Get state and save telemetry record for that"""
        return get_gps_state(self, tag)


class TeleMotor(Motor):
    """Motor that saves telemetry records when its methods are called"""

    methods = {
        "set_velocity": (None, VelocityUnits_values),
        "set_reversed": (bool,),
        "set_stopping": (BrakeType_values,),
        "reset_position": (),
        "set_position": (None, RotationUnits_values),
        "set_timeout": (None, TimeUnits_values),
        "spin": (DirectionType_values, None, VelocityUnits_values),
        "spin_to_position": (
            None,
            RotationUnits_values,
            None,
            VelocityUnits_values,
            bool,
        ),
        "spin_for": (
            DirectionType_values,
            None,
            RotationUnits_values,
            None,
            VelocityUnits_values,
            bool,
        ),
        "stop": (BrakeType_values,),
        "set_max_torque": (None, TorqueUnits_values),
        "spin_volts": (DirectionType_values, None),
        "spin_volts_to_position": (
            None,
            RotationUnits_values,
            None,
            bool,
        ),
        "spin_volts_for": (
            DirectionType_values,
            None,
            RotationUnits_values,
            None,
            bool,
        ),
    }

    def __init__(self, port: int, *args, name: str = "", tag: str = "", **kwargs):
        super().__init__(port, *args, **kwargs)
        self.name = name
        self.tag = tag

        for method_name in TeleMotor.methods:
            method = getattr(self, method_name)

            setattr(self, "no_log_" + method_name, method)

            setattr(
                self,
                method_name,
                wrap_method_with_log(self, method_name, tag, method),
            )

    def spin_volts(self, direction: DirectionType.DirectionType, volts: vexnumber):
        return self.no_log_spin(direction, volts, VoltageUnits.VOLT)  # type: ignore

    def spin_volts_to_position(
        self,
        rotation: vexnumber,
        units: RotationUnits.RotationUnits,
        volts: vexnumber,
        wait: bool,
    ):
        return self.no_log_spin_to_position(  # type: ignore
            rotation, units, volts, VoltageUnits.VOLT, wait
        )

    def spin_volts_for(
        self,
        direction: DirectionType.DirectionType,
        rot_or_time: vexnumber,
        units: RotationUnits.RotationUnits,
        volts: vexnumber,
        wait: bool,
    ):
        return self.no_log_spin_for(  # type: ignore
            direction, rot_or_time, units, volts, VoltageUnits.VOLT, wait
        )

    def get_state(self, tag: str = ""):
        """Get state and save telemetry record for that"""
        return get_motor_state(self, tag)


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
