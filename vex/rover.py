from tele import *
from brain import *
from log import *
from pid import *

# Red cartridge: GearSetting.RATIO_36_1, 100 RPM
# Green cartridge: GearSetting.RATIO_18_1, 200 RPM
# Blue cartridge: GearSetting.RATIO_6_1, 600 RPM

MOTOR_DIRECTION = False

controller = TeleController(PRIMARY)
inertial = TeleInertial(Ports.PORT5)

motor_lf = TeleMotor(
    Ports.PORT11, GearSetting.RATIO_18_1, MOTOR_DIRECTION, name="motor_lf"
)
motor_lb = TeleMotor(
    Ports.PORT20, GearSetting.RATIO_18_1, MOTOR_DIRECTION, name="motor_lb"
)

motor_rf = TeleMotor(
    Ports.PORT1, GearSetting.RATIO_18_1, not MOTOR_DIRECTION, name="motor_rf"
)
motor_rb = TeleMotor(
    Ports.PORT10, GearSetting.RATIO_18_1, not MOTOR_DIRECTION, name="motor_rb"
)

motors = {
    "motor_lf": motor_lf,
    "motor_lb": motor_lb,
    "motor_rf": motor_rf,
    "motor_rb": motor_rb,
}

gps = TeleGps(Ports.PORT6, name="gps")


def get_volts_for_axis_value(value: int) -> float:
    return 11.0 * value / 127


def control_motors_by_axis(axis_name, motor_front, motor_back):
    """Control front and back motors by the given axis like axis3 or axis2"""

    axis = getattr(controller, axis_name)
    method = axis_name + "_changed"

    def axis_changed():
        """Callback when left axis changed"""

        value = axis.value()
        volts = get_volts_for_axis_value(value)

        log_method_call(controller, method, "", value, volts)

        motor_front.spin(FORWARD, volts, VoltageUnits.VOLT)
        motor_back.spin(FORWARD, volts, VoltageUnits.VOLT)

    axis.changed(axis_changed)


control_motors_by_axis("axis3", motor_lf, motor_lb)
control_motors_by_axis("axis2", motor_rf, motor_rb)


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
        motors[motor_name].spin(FORWARD, volts, VoltageUnits.VOLT)


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


TURN_GAINS = Gains(0.05, 0, 0)
"""Gain factors for turn PID"""

# Turn is done when voltage AND angle are below thresholds
TURN_VOLTAGE_THRESHOLD = 0.5
"""Turn voltage threshold"""

TURN_ANGLE_THRESHOLD = 5.0
"""Turn angle threshold"""

TURN_SLEEP_MS = 50
"""Interval between turn PID iterations"""

TURN_VOLTAGE_OFFSET = 2.0
"""Add that much voltage to the spin"""


def pid_turn(angle: float):
    """Turn by that angle in degrees using PID controller"""

    # Calculate target heading for inertial sensor
    target = (inertial.heading() + angle) % 360

    # Create PID controller
    pid = TelePID(TURN_GAINS, name="turn")

    while True:
        # Calculate error (angle difference) between target and current heading
        error = (target - inertial.heading()) % 360

        if error > 180:
            # Angles above 180 are in opposite direction
            error = error - 360

        # Calculate voltage using PID controller
        voltage = pid.step(error)

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
        motor_lf.super_spin(DirectionType.FORWARD, voltage, VoltageUnits.VOLT)
        motor_lb.super_spin(DirectionType.FORWARD, voltage, VoltageUnits.VOLT)
        motor_rf.super_spin(DirectionType.FORWARD, -voltage, VoltageUnits.VOLT)
        motor_rb.super_spin(DirectionType.FORWARD, -voltage, VoltageUnits.VOLT)

        if done:
            # Turn is done
            break

        # Wait until the next PID controller iteration
        sleep(TURN_SLEEP_MS, TimeUnits.MSEC)
