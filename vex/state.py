from collections import namedtuple

from vex import *

from record import *
from enums import *


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


def ControllerState_from_args(args):
    """Create ControllerState from float args"""
    return ControllerState(
        *map_args(
            (
                int,
                int,
                int,
                int,
                bool,
                bool,
                bool,
                bool,
                bool,
                bool,
                bool,
                bool,
                bool,
                bool,
                bool,
                bool,
            ),
            args,
        )
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


def InertialState_from_args(args):
    """Create InertialState from float args"""
    return InertialState(
        *map_args(
            (
                bool,
                int,
                None,
                None,
                bool,
                AxisType_values,
                AxisType_values,
                AxisType_values,
                OrientationType_values,
                OrientationType_values,
                OrientationType_values,
                OrientationType_values,
                OrientationType_values,
                OrientationType_values,
                TurnType_values,
            ),
            args,
        )
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


GpsState = namedtuple(
    "GpsState",
    [
        "installed",
        "timestamp",
        "heading",
        "rotation",
        "x_position",
        "y_position",
        "quality",
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
"""State of Gps"""


def GpsState_from_args(args):
    """Create GpsState from float args"""
    return GpsState(
        *map_args(
            (
                bool,
                int,
                None,
                None,
                None,
                None,
                None,
                bool,
                AxisType_values,
                AxisType_values,
                AxisType_values,
                OrientationType_values,
                OrientationType_values,
                OrientationType_values,
                OrientationType_values,
                OrientationType_values,
                OrientationType_values,
                TurnType_values,
            ),
            args,
        )
    )


def get_gps_state_no_record(gps: Gps) -> GpsState:
    """Get state of a Gps without writing a telemetry record"""
    return GpsState(
        gps.installed(),
        gps.timestamp(),
        gps.heading(),
        gps.rotation(),
        gps.x_position(),
        gps.y_position(),
        gps.quality(),
        gps.is_calibrating(),
        gps.orientation(OrientationType.ROLL),
        gps.orientation(OrientationType.PITCH),
        gps.orientation(OrientationType.YAW),
        gps.gyro_rate(AxisType.XAXIS),
        gps.gyro_rate(AxisType.YAXIS),
        gps.gyro_rate(AxisType.ZAXIS),
        gps.acceleration(AxisType.XAXIS),
        gps.acceleration(AxisType.YAXIS),
        gps.acceleration(AxisType.ZAXIS),
        gps.get_turn_type(),
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


def MotorState_from_args(args):
    """Create MotorState from float args"""
    return MotorState(
        *map_args(
            (
                bool,
                int,
                None,
                bool,
                bool,
                bool,
                DirectionType_values,
                None,
                None,
                None,
                None,
                None,
                None,
                None,
                None,
            ),
            args,
        )
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
