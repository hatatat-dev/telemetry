#!/usr/bin/env python3

from tele import *
from brain import *
from log import *

open_log("gps.csv")

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

gps = TeleGps(Ports.PORT6, name="gps")


def get_volts_for_axis_value(value: int) -> float:
    return 12.0 * value / 127


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

controller.buttonX.pressed(close_log)

while is_log_open():
    # controller_state = get_controller_state(controller)
    _ = inertial.get_state()
    _ = gps.get_state()

    _ = motor_lf.get_state()
    _ = motor_lb.get_state()
    _ = motor_rf.get_state()
    _ = motor_rb.get_state()

    sleep(1000)
