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

motor_group_left = MotorGroup(motor_lf, motor_lb)

motor_rf = TeleMotor(
    Ports.PORT1, GearSetting.RATIO_18_1, not MOTOR_DIRECTION, name="motor_rf"
)
motor_rb = TeleMotor(
    Ports.PORT10, GearSetting.RATIO_18_1, not MOTOR_DIRECTION, name="motor_rb"
)

motor_group_right = MotorGroup(motor_rf, motor_rb)

drivetrain = DriveTrain(
    motor_group_left,
    motor_group_right,
    wheelTravel=320,
    trackWidth=254,
    wheelBase=229,
    units=DistanceUnits.MM,
    externalGearRatio=1.0,
)

gps = TeleGps(Ports.PORT6, name="gps")


controller.buttonA.pressed(lambda: motor_group_left.spin(FORWARD))
controller.buttonA.released(lambda: motor_group_left.stop())

controller.buttonB.pressed(lambda: motor_group_right.spin(FORWARD))
controller.buttonB.released(lambda: motor_group_right.stop())

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
