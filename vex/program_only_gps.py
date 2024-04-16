#!/usr/bin/env python3

from tele import *
from brain import *
from log import *

open_log("only_gps.csv")

# Red cartridge: GearSetting.RATIO_36_1, 100 RPM
# Green cartridge: GearSetting.RATIO_18_1, 200 RPM
# Blue cartridge: GearSetting.RATIO_6_1, 600 RPM

MOTOR_DIRECTION = False

controller = TeleController(PRIMARY)
inertial = TeleInertial(Ports.PORT5)

motor_lf = Motor(Ports.PORT11, GearSetting.RATIO_18_1, MOTOR_DIRECTION)
motor_lb = Motor(Ports.PORT20, GearSetting.RATIO_18_1, MOTOR_DIRECTION)

motor_rf = Motor(Ports.PORT1, GearSetting.RATIO_18_1, not MOTOR_DIRECTION)
motor_rb = Motor(Ports.PORT10, GearSetting.RATIO_18_1, not MOTOR_DIRECTION)

gps = TeleGps(Ports.PORT6, name="gps")

controller.buttonA.pressed(lambda: gps.get_state() and None)
controller.buttonB.pressed(lambda: inertial.get_state() and None)


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

        motor_front.spin(FORWARD, volts, VoltageUnits.VOLT)
        motor_back.spin(FORWARD, volts, VoltageUnits.VOLT)

    axis.changed(axis_changed)


control_motors_by_axis("axis3", motor_lf, motor_lb)
control_motors_by_axis("axis2", motor_rf, motor_rb)

controller.buttonX.pressed(close_log)
