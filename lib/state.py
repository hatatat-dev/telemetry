from collections import namedtuple
import math

from vex import *

from record import *
from enums import *
from geometry import *


ControllerState = namedtuple(
    "ControllerState",
    [
        "axis1",  # arg_0
        "axis2",  # arg_1
        "axis3",  # arg_2
        "axis4",  # arg_3
        "buttonL1",  # arg_4
        "buttonL2",  # arg_5
        "buttonR1",  # arg_6
        "buttonR2",  # arg_7
        "buttonUp",  # arg_8
        "buttonDown",  # arg_9
        "buttonLeft",  # arg_10
        "buttonRight",  # arg_11
        "buttonA",  # arg_12
        "buttonB",  # arg_13
        "buttonX",  # arg_14
        "buttonY",  # arg_15
    ],
)
"""State of a controller"""


def ControllerState_from_args(args: Tuple[float, ...]):
    """Create ControllerState from float args"""
    return ControllerState(
        *map_args(
            (
                int,  # arg_0
                int,  # arg_1
                int,  # arg_2
                int,  # arg_3
                bool,  # arg_4
                bool,  # arg_5
                bool,  # arg_6
                bool,  # arg_7
                bool,  # arg_8
                bool,  # arg_9
                bool,  # arg_10
                bool,  # arg_11
                bool,  # arg_12
                bool,  # arg_13
                bool,  # arg_14
                bool,  # arg_15
            ),
            args,
        )
    )


def get_controller_state_no_record(controller: Controller) -> ControllerState:
    """Get state of a controller without writing a telemetry record"""
    return ControllerState(
        controller.axis1.value(),  # arg_0
        controller.axis2.value(),  # arg_1
        controller.axis3.value(),  # arg_2
        controller.axis4.value(),  # arg_3
        controller.buttonL1.pressing(),  # arg_4
        controller.buttonL2.pressing(),  # arg_5
        controller.buttonR1.pressing(),  # arg_6
        controller.buttonR2.pressing(),  # arg_7
        controller.buttonUp.pressing(),  # arg_8
        controller.buttonDown.pressing(),  # arg_9
        controller.buttonLeft.pressing(),  # arg_10
        controller.buttonRight.pressing(),  # arg_11
        controller.buttonA.pressing(),  # arg_12
        controller.buttonB.pressing(),  # arg_13
        controller.buttonX.pressing(),  # arg_14
        controller.buttonY.pressing(),  # arg_15
    )


InertialState = namedtuple(
    "InertialState",
    [
        "installed",  # arg_0
        "timestamp",  # arg_1
        "heading",  # arg_2
        "rotation",  # arg_3
        "is_calibrating",  # arg_4
        "orientation_roll",  # arg_5
        "orientation_pitch",  # arg_6
        "orientation_yaw",  # arg_7
        "gyro_rate_xaxis",  # arg_8
        "gyro_rate_yaxis",  # arg_9
        "gyro_rate_zaxis",  # arg_10
        "acceleration_xaxis",  # arg_11
        "acceleration_yaxis",  # arg_12
        "acceleration_zaxis",  # arg_13
        "turn_type",  # arg_14
    ],
)
"""State of an inertial sensor"""


def InertialState_from_args(args: Tuple[float, ...]):
    """Create InertialState from float args"""
    return InertialState(
        *map_args(
            (
                bool,  # arg_0
                int,  # arg_1
                None,  # arg_2
                None,  # arg_3
                bool,  # arg_4
                None,  # arg_5
                None,  # arg_6
                None,  # arg_7
                None,  # arg_8
                None,  # arg_9
                None,  # arg_10
                None,  # arg_11
                None,  # arg_12
                None,  # arg_13
                TurnType_values,  # arg_14
            ),
            args,
        )
    )


def get_inertial_state_no_record(inertial: Inertial) -> InertialState:
    """Get state of a inertial without writing a telemetry record"""
    return InertialState(
        inertial.installed(),  # arg_0
        inertial.timestamp(),  # arg_1
        inertial.heading(),  # arg_2
        inertial.rotation(),  # arg_3
        inertial.is_calibrating(),  # arg_4
        inertial.orientation(OrientationType.ROLL),  # arg_5
        inertial.orientation(OrientationType.PITCH),  # arg_6
        inertial.orientation(OrientationType.YAW),  # arg_7
        inertial.gyro_rate(AxisType.XAXIS),  # arg_8
        inertial.gyro_rate(AxisType.YAXIS),  # arg_9
        inertial.gyro_rate(AxisType.ZAXIS),  # arg_10
        inertial.acceleration(AxisType.XAXIS),  # arg_11
        inertial.acceleration(AxisType.YAXIS),  # arg_12
        inertial.acceleration(AxisType.ZAXIS),  # arg_13
        inertial.get_turn_type(),  # arg_14
    )


GpsState = namedtuple(
    "GpsState",
    [
        "installed",  # arg_0
        "timestamp",  # arg_1
        "heading",  # arg_2
        "rotation",  # arg_3
        "x_position",  # arg_4
        "y_position",  # arg_5
        "quality",  # arg_6
        "is_calibrating",  # arg_7
        "orientation_roll",  # arg_8
        "orientation_pitch",  # arg_9
        "orientation_yaw",  # arg_10
        "gyro_rate_xaxis",  # arg_11
        "gyro_rate_yaxis",  # arg_12
        "gyro_rate_zaxis",  # arg_13
        "acceleration_xaxis",  # arg_14
        "acceleration_yaxis",  # arg_15
        "acceleration_zaxis",  # arg_16
        "turn_type",  # arg_17
    ],
)
"""State of Gps"""


def get_gps_state_position(gps_state: GpsState) -> FlatPosition:
    return FlatPosition(gps_state.x_position, gps_state.y_position, gps_state.heading)


def GpsState_from_args(args: Tuple[float, ...]):
    """Create GpsState from float args"""
    return GpsState(
        *map_args(
            (
                bool,  # arg_0
                int,  # arg_1
                None,  # arg_2
                None,  # arg_3
                None,  # arg_4
                None,  # arg_5
                None,  # arg_6
                bool,  # arg_7
                None,  # None
                None,  # None
                None,  # None
                None,  # None
                None,  # None
                None,  # None
                None,  # None
                None,  # None
                None,  # None
                TurnType_values,  # arg_17
            ),
            args,
        )
    )


def get_gps_state_no_record(gps: Gps) -> GpsState:
    """Get state of a Gps without writing a telemetry record"""
    return GpsState(
        gps.installed(),  # arg_0
        gps.timestamp(),  # arg_1
        gps.heading(),  # arg_2
        gps.rotation(),  # arg_3
        gps.x_position(),  # arg_4
        gps.y_position(),  # arg_5
        gps.quality(),  # arg_6
        gps.is_calibrating(),  # arg_7
        gps.orientation(OrientationType.ROLL),  # arg_8
        gps.orientation(OrientationType.PITCH),  # arg_9
        gps.orientation(OrientationType.YAW),  # arg_10
        gps.gyro_rate(AxisType.XAXIS),  # arg_11
        gps.gyro_rate(AxisType.YAXIS),  # arg_12
        gps.gyro_rate(AxisType.ZAXIS),  # arg_13
        gps.acceleration(AxisType.XAXIS),  # arg_14
        gps.acceleration(AxisType.YAXIS),  # arg_15
        gps.acceleration(AxisType.ZAXIS),  # arg_16
        gps.get_turn_type(),  # arg_17
    )


def compute_gps_distance(gps_from: GpsState, gps_to: GpsState) -> float:
    return math.sqrt(
        (gps_to.x_position - gps_from.x_position) ** 2
        + (gps_to.y_position - gps_from.y_position) ** 2
    )


MotorState = namedtuple(
    "MotorState",
    [
        "installed",  # arg_0
        "timestamp",  # arg_1
        "get_timeout",  # arg_2
        "is_spinning",  # arg_3
        "is_done",  # arg_4
        "is_spinning_mode",  # arg_5
        "direction",  # arg_6
        "position",  # arg_7
        "velocity",  # arg_8
        "current",  # arg_9
        "power",  # arg_10
        "torque",  # arg_11
        "efficiency",  # arg_12
        "temperature",  # arg_13
        "command",  # arg_14
    ],
)
"""State of a motor"""


def MotorState_from_args(args: Tuple[float, ...]):
    """Create MotorState from float args"""
    return MotorState(
        *map_args(
            (
                bool,  # arg_0
                int,  # arg_1
                None,  # arg_2
                bool,  # arg_3
                bool,  # arg_4
                bool,  # arg_5
                DirectionType_values,  # arg_6
                None,  # arg_7
                None,  # arg_8
                None,  # arg_9
                None,  # arg_10
                None,  # arg_11
                None,  # arg_12
                None,  # arg_13
                None,  # arg_14
            ),
            args,
        )
    )


def get_motor_state_no_record(motor: Motor) -> MotorState:
    """Get state of a motor without writing a telemetry record"""
    return MotorState(
        motor.installed(),  # arg_0
        motor.timestamp(),  # arg_1
        motor.get_timeout(),  # arg_2
        motor.is_spinning(),  # arg_3
        motor.is_done(),  # arg_4
        motor.is_spinning_mode(),  # arg_5
        motor.direction(),  # arg_6
        motor.position(),  # arg_7
        motor.velocity(),  # arg_8
        motor.current(),  # arg_9
        motor.power(),  # arg_10
        motor.torque(),  # arg_11
        motor.efficiency(),  # arg_12
        motor.temperature(),  # arg_13
        motor.command(),  # arg_14
    )
