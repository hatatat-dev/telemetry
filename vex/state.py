from collections import namedtuple

from vex import *

from record import *

AXIS_TYPES = (AxisType.XAXIS, AxisType.YAXIS, AxisType.ZAXIS)
"""AxisType enum objects, indexed by their values"""


ORIENTATION_TYPES = (OrientationType.ROLL, OrientationType.PITCH, OrientationType.YAW)
"""OrientationType enum objects, indexed by their values"""

TURN_TYPES = (TurnType.LEFT, TurnType.RIGHT, TurnType.UNDEFINED)
"""TurnType enum objects, indexed by their values"""

DIRECTION_TYPES = (
    DirectionType.FORWARD,
    DirectionType.REVERSE,
    DirectionType.UNDEFINED,
)
"""DirectionType enum objects, indexed by their values"""


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
"""State of a controller"""


def controller_state_from_args(args) -> ControllerState:
    """Get controller state from a tuple of float args"""
    return ControllerState(
        int(args[0]),
        int(args[1]),
        int(args[2]),
        int(args[3]),
        bool(args[4]),
        bool(args[5]),
        bool(args[6]),
        bool(args[7]),
        bool(args[8]),
        bool(args[9]),
        bool(args[10]),
        bool(args[11]),
        bool(args[12]),
        bool(args[13]),
        bool(args[14]),
        bool(args[15]),
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
"""State of an inertial sensor"""


def inertial_state_from_args(args) -> InertialState:
    """Get inertial state from a tuple of float args"""
    return InertialState(
        bool(args[0]),
        int(args[1]),
        args[2],
        args[3],
        bool(args[4]),
        AXIS_TYPES[int(args[5])],
        AXIS_TYPES[int(args[6])],
        AXIS_TYPES[int(args[7])],
        ORIENTATION_TYPES[int(args[6])],
        ORIENTATION_TYPES[int(args[7])],
        ORIENTATION_TYPES[int(args[8])],
        ORIENTATION_TYPES[int(args[9])],
        ORIENTATION_TYPES[int(args[10])],
        ORIENTATION_TYPES[int(args[11])],
        TURN_TYPES[int(args[12])],
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
"""State of a motor"""


def motor_state_from_args(args) -> MotorState:
    """Get motor state from a tuple of float args"""
    return MotorState(
        bool(args[0]),
        int(args[1]),
        args[2],
        bool(args[3]),
        bool(args[4]),
        bool(args[5]),
        DIRECTION_TYPES[int(args[6])],
        args[7],
        args[6],
        args[7],
        args[8],
        args[9],
        args[10],
        args[11],
        args[12],
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
