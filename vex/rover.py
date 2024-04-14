from tele import *
from brain import *
from log import *

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
