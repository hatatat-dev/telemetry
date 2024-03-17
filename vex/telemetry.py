# ---------------------------------------------------------------------------- #
#                                                                              #
# 	Module:       telemetry.py                                                 #
# 	Author:       SystemError                                                  #
# 	Created:      3/16/2024, 10:52:27 AM                                       #
# 	Description:  V5 project                                                   #
#                                                                              #
# ---------------------------------------------------------------------------- #

# Library imports
from vex import *

from collections import namedtuple

# Brain should be defined by default
brain = Brain()

# Tuple with header information for individual telemetry records
RecordHeader = namedtuple("RecordHeader", ["timestamp", "cls", "name", "method", "tag"])

# Tuple with telemetry record
Record = namedtuple("Record", ["header", "args"])

# State of a controller
ControllerState = namedtuple(
    "ControllerState",
    [
        "axis1",
        "axis2",
        "axis3",
        "axis4",
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
    ],
)


def get_controller_state_no_record(controller: Controller) -> ControllerState:
    """Get state of a controller without writing a telemetry record"""
    return ControllerState(
        controller.axis1.value(),
        controller.axis2.value(),
        controller.axis3.value(),
        controller.axis4.value(),
        controller.buttonL1.pressing(),
        controller.buttonL2.pressing(),
        controller.buttonR1.pressing(),
        controller.buttonR2.pressing(),
        controller.buttonUp.pressing(),
        controller.buttonDown.pressing(),
        controller.buttonLeft.pressing(),
        controller.buttonRight.pressing(),
        controller.buttonA.pressing(),
        controller.buttonB.pressing(),
        controller.buttonX.pressing(),
        controller.buttonY.pressing(),
    )


# State of an inertial sensor
InertialState = namedtuple(
    "InertialState",
    [
        "installed",
        "timestamp",
        "heading",
        "rotation",
        "is_calibrating",
        "orientation_roll",
        "orientation_pitch",
        "orientation_yaw",
        "gyro_rate_xaxis",
        "gyro_rate_yaxis",
        "gyro_rate_zaxis",
        "acceleration_xaxis",
        "acceleration_yaxis",
        "acceleration_zaxis",
        "turn_type",
    ],
)


def get_inertial_state_no_record(inertial: Inertial) -> InertialState:
    """Get state of a inertial without writing a telemetry record"""
    return InertialState(
        inertial.installed(),
        inertial.timestamp(),
        inertial.heading(),
        inertial.rotation(),
        inertial.is_calibrating(),
        inertial.orientation(OrientationType.ROLL),
        inertial.orientation(OrientationType.PITCH),
        inertial.orientation(OrientationType.YAW),
        inertial.gyro_rate(AxisType.XAXIS),
        inertial.gyro_rate(AxisType.YAXIS),
        inertial.gyro_rate(AxisType.ZAXIS),
        inertial.acceleration(AxisType.XAXIS),
        inertial.acceleration(AxisType.YAXIS),
        inertial.acceleration(AxisType.ZAXIS),
        inertial.get_turn_type(),
    )


# State of a motor
MotorState = namedtuple(
    "MotorState",
    [
        "installed",
        "timestamp",
        "get_timeout",
        "is_spinning",
        "is_done",
        "is_spinning_mode",
        "direction",
        "position",
        "velocity",
        "current",
        "power",
        "torque",
        "efficiency",
        "temperature",
        "command",
    ],
)


def get_motor_state_no_record(motor: Motor) -> MotorState:
    """Get state of a motor without writing a telemetry record"""
    return MotorState(
        motor.installed(),
        motor.timestamp(),
        motor.get_timeout(),
        motor.is_spinning(),
        motor.is_done(),
        motor.is_spinning_mode(),
        motor.direction(),
        motor.position(),
        motor.velocity(),
        motor.current(),
        motor.power(),
        motor.torque(),
        motor.efficiency(),
        motor.temperature(),
        motor.command(),
    )


def create_record_header(obj: object, method: str, tag: str) -> RecordHeader:
    """Create a header for telemetry record with current timestamp"""
    cls = obj.__class__.__name__
    if cls.startswith("Tele"):
        cls = cls[4:]

    name = getattr(obj, "name", "") or ("id_" + str(id(obj)))

    return RecordHeader(brain.timer.time(), cls, name, method, tag)


def create_method_call_record(
    obj: object, method: str, tag: str, *args: float, **kwargs: float
) -> Record:
    """Create a telemetry record for a method call"""
    return Record(
        create_record_header(obj, method, tag),
        args + tuple(kwargs.values()),
    )


# List of telemetry records in this run
records = []

# Name of the file for saving telemetry records in CSV (comma-separated values) format
records_filename = "/records.csv"


def format_csv_arg(arg) -> str:
    """Format CSV argument, treating zeroes and falsy values as empty"""
    if not arg:
        return ""

    cls = arg.__class__.__name__
    if cls.endswith("Type") or cls.endswith("Units"):
        # vexEnum are these classes that need to be resolved to ordinal numbers
        arg = arg.__class__.value(arg)
        return str(arg) if arg else ""

    # Convert everything, including bools, to floats
    s = str(float(arg))

    if len(s) > 2 and s[-2] == "." and s[-1] == "0":
        # Remove trailing .0 for the integers
        return s[:-2]

    return s


def save_record(record: Record) -> None:
    """Save the telemetry record to the record list and the record file"""

    # Append record to the list of records
    records.append(record)

    # Append record to the file as a line in CSV format
    brain.sdcard.appendfile(
        records_filename,
        bytearray(
            ",".join(map(str, record.header))
            + ","
            + ",".join(map(format_csv_arg, record.args))
            + "\n",
            "utf-8",
        ),
    )


def save_method_call(obj: object, method: str, tag: str, *args: float, **kwargs: float):
    """Save telemetry record for the method call"""
    save_record(create_method_call_record(obj, method, tag, *args, **kwargs))


def decorate_method_call(obj, method: str, tag: str, original):
    """Decorate method call by first saving a telemetry record for it"""

    def decorated(*args, **kwargs):
        save_method_call(obj, method, tag, *args, **kwargs)
        return original(*args, **kwargs)

    return decorated


def callback_with_record(obj, method, tag, callback, *args):
    """Invoke callback after saving a telemetry record"""
    save_method_call(obj, method, tag)
    callback(*args)


def get_controller_state(controller: Controller, tag: str) -> ControllerState:
    """Get controller state and save the telemetry record for that"""

    state = get_controller_state_no_record(controller)

    save_record(
        Record(
            create_record_header(controller, "state", tag),
            state,
        )
    )

    return state


def get_inertial_state(inertial: Inertial, tag: str) -> InertialState:
    """Get inertial sensor state and save the telemetry record for that"""

    state = get_inertial_state_no_record(inertial)

    save_record(
        Record(
            create_record_header(inertial, "state", tag),
            state,
        )
    )

    return state


def get_motor_state(motor: Motor, tag: str) -> MotorState:
    """Get motor sensor state and save the telemetry record for that"""

    state = get_motor_state_no_record(motor)

    save_record(
        Record(
            create_record_header(motor, "state", tag),
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
                decorate_method_call(self, method, tag, getattr(self, method)),
            )


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
                callback_with_record,
                (self.controller, self.name + "_pressed", self.controller.tag, callback)
                + arg,
            )

        def released(self, callback: Callable[..., None], arg: tuple = ()):
            return self.original.released(
                callback_with_record,
                (
                    self.controller,
                    self.name + "_released",
                    self.controller.tag,
                    callback,
                )
                + arg,
            )

    def __init__(self, *args, name: str = "", tag: str = "", **kwargs):
        super().__init__(*args, **kwargs)
        self.name = name
        self.tag = tag

    def setup(self):
        for axis_name in ["axis1", "axis2", "axis3", "axis4"]:
            axis: Controller.Axis = getattr(self, axis_name)

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


controller = TeleController(PRIMARY, name="controller")
controller.setup()
inertial = Inertial(Ports.PORT2)
motor_a = TeleMotor(Ports.PORT10, GearSetting.RATIO_18_1, False, name="motor_a")


brain.screen.print("clear", records_filename)
brain.screen.next_row()

brain.sdcard.savefile(records_filename, bytearray())

controller.buttonA.pressed(print, ("buttonA", "pressed"))
controller.buttonA.released(print, ("buttonA", "released"))

controller.buttonB.pressed(print, ("buttonB", "pressed"))
controller.buttonB.released(print, ("buttonB", "released"))

for step in range(2):
    get_controller_state(controller, "test")
    get_inertial_state(inertial, "test")
    get_motor_state(motor_a, "test")
    motor_a.spin(DirectionType.FORWARD if step % 2 == 0 else DirectionType.REVERSE)
    sleep(1000, MSEC)

motor_a.stop()

brain.screen.print("done")
brain.screen.next_row()
