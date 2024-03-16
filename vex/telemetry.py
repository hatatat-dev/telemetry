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
RecordHeader = namedtuple("RecordHeader", ["timestamp", "cls", "id", "method", "tag"])

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
    """Get state of a controller without writing telemetry record"""
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
    """Get state of a inertial without writing telemetry record"""
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
        TurnType.value(inertial.get_turn_type()),  # type: ignore
    )


def create_record_header(obj: object, method: str, tag: str) -> RecordHeader:
    """Create a header for telemetry record with current timestamp"""
    return RecordHeader(
        brain.timer.time(), obj.__class__.__name__, str(id(obj)), method, tag
    )


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

    s = str(float(arg))

    if len(s) > 2 and s[-2] == "." and s[-1] == "0":
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


controller = Controller(PRIMARY)
inertial = Inertial(Ports.PORT2)


brain.screen.print("clear", records_filename)
brain.screen.next_row()

brain.sdcard.savefile(records_filename, bytearray())

for _ in range(10):
    get_controller_state(controller, "test")
    get_inertial_state(inertial, "test")
    sleep(1000, MSEC)

brain.screen.print("done")
brain.screen.next_row()
