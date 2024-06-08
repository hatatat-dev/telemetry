from lib.tele import *
from lib.log import *
from lib.pid import *
from lib.drivetrain import *
from lib.motor import *


def get_volts_for_axis_value(value: int) -> float:
    return MAX_MOTOR_VOLTS * value / 127


MOTOR_FLOOR_VOLTS = 1


def control_motors_by_axis(axis_name: str, *motors: TeleMotor):
    """Control front and back motors by the given axis like axis3 or axis2"""

    axis = getattr(controller, axis_name)
    method = axis_name + "_changed"

    def axis_changed():
        """Callback when left axis changed"""

        value = axis.value()
        volts = get_volts_for_axis_value(value)

        if volts < 0:
            volts -= MOTOR_FLOOR_VOLTS
        elif volts > 0:
            volts += MOTOR_FLOOR_VOLTS

        log_method_call(controller, method, "", value, volts)

        for motor in motors:
            motor.spin_volts(FORWARD, volts)
            motor.spin_volts(FORWARD, volts)

    axis.changed(axis_changed)


control_motors_by_axis("axis3", motor_lf, motor_lc, motor_lb)
control_motors_by_axis("axis2", motor_rf, motor_rc, motor_rb)


def run_steps(steps):
    """Run steps each being either a time to sleep or motor to spin"""
    timestamp = get_timestamp()

    for step in steps:
        if isinstance(step, int):
            # Step is time to sleep/wait, in milliseconds
            next_timestamp = timestamp + step
            delay_ms = next_timestamp - get_timestamp()
            if delay_ms > 0:
                sleep(delay_ms, TimeUnits.MSEC)
            timestamp = next_timestamp
            continue

        # Step is (motor name, spin voltage)
        motor_name, volts = step
        motors[motor_name].spin_volts(FORWARD, volts)


def get_steps_forward():
    """Simple steps to drive short distance forward"""
    return [
        ("motor_lf", 4),
        ("motor_lb", 4),
        ("motor_rf", 4),
        ("motor_rb", 4),
        500,
        ("motor_lf", 0),
        ("motor_lb", 0),
        ("motor_rf", 0),
        ("motor_rb", 0),
    ]


def get_steps_backward():
    """Simple steps to drive short distance backward"""
    return [
        ("motor_lf", -4),
        ("motor_lb", -4),
        ("motor_rf", -4),
        ("motor_rb", -4),
        500,
        ("motor_lf", 0),
        ("motor_lb", 0),
        ("motor_rf", 0),
        ("motor_rb", 0),
    ]


def get_steps_turn_left():
    """Simple steps to turn short distance left"""
    return [
        ("motor_lf", -4),
        ("motor_lb", -4),
        ("motor_rf", 4),
        ("motor_rb", 4),
        500,
        ("motor_lf", 0),
        ("motor_lb", 0),
        ("motor_rf", 0),
        ("motor_rb", 0),
    ]


def get_steps_turn_right():
    """Simple steps to turn short distance right"""
    return [
        ("motor_lf", 4),
        ("motor_lb", 4),
        ("motor_rf", -4),
        ("motor_rb", -4),
        500,
        ("motor_lf", 0),
        ("motor_lb", 0),
        ("motor_rf", 0),
        ("motor_rb", 0),
    ]


TURN_GAINS = Gains(0.1, 0, 0.01)
"""Gain factors for turn PID"""

# Turn is done when voltage AND angle are below thresholds
TURN_VOLTAGE_THRESHOLD = 2
"""Turn voltage threshold"""

TURN_ANGLE_THRESHOLD = 5.0
"""Turn angle threshold"""

TURN_SLEEP_MS = 20
"""Interval between turn PID iterations"""

TURN_VOLTAGE_OFFSET = 0.5
"""Add that much voltage to the spin"""


def pid_turn(angle: float):
    """Turn by that angle in degrees using PID controller"""

    # Calculate target heading for inertial sensor
    setpoint = (inertial.heading() + angle) % 360

    # Create PID controller
    pid = TelePID(TURN_GAINS, setpoint, wrap=360, name="turn")

    while True:
        # Calculate error (angle difference) between target and current heading
        error, voltage = pid.step(inertial.heading())

        # See if turn is done based on voltage AND angle thresholds
        done = (
            abs(error) < TURN_ANGLE_THRESHOLD and abs(voltage) < TURN_VOLTAGE_THRESHOLD
        )

        if done:
            # When turn is done, stop the motors by setting voltage to zero
            voltage = 0
        elif voltage < 0:
            # Offset voltage in negative direction
            voltage -= TURN_VOLTAGE_OFFSET
        elif voltage > 0:
            # Offset voltage in positive direction
            voltage += TURN_VOLTAGE_OFFSET

        # PID controller already reports telemetry; avoid telemetry overhead here
        motor_lf.no_log_spin_volts(DirectionType.FORWARD, voltage)  # type: ignore
        motor_lc.no_log_spin_volts(DirectionType.FORWARD, voltage)  # type: ignore
        motor_lb.no_log_spin_volts(DirectionType.FORWARD, voltage)  # type: ignore
        motor_rf.no_log_spin_volts(DirectionType.FORWARD, -voltage)  # type: ignore
        motor_rc.no_log_spin_volts(DirectionType.FORWARD, -voltage)  # type: ignore
        motor_rb.no_log_spin_volts(DirectionType.FORWARD, -voltage)  # type: ignore

        if done:
            # Turn is done
            break

        # Wait until the next PID controller iteration
        sleep(TURN_SLEEP_MS, TimeUnits.MSEC)
