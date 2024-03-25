#!/usr/bin/env python3

from tele import *
from brain import *
from log import *

open_log("manual.csv")

controller = TeleController(PRIMARY)
inertial = TeleInertial(Ports.PORT2)
motor_a = TeleMotor(Ports.PORT10, GearSetting.RATIO_18_1, False, name="motor_a")
motor_b = TeleMotor(Ports.PORT20, GearSetting.RATIO_18_1, False, name="motor_b")

controller.buttonA.pressed(lambda: motor_a.spin(FORWARD))
controller.buttonA.released(lambda: motor_a.stop())

controller.buttonB.pressed(lambda: motor_b.spin(FORWARD))
controller.buttonB.released(lambda: motor_b.stop())

controller.buttonX.pressed(close_log)

while log_writer:
    get_controller_state(controller)
    get_inertial_state(inertial)
    get_motor_state(motor_a)
    get_motor_state(motor_a)

    sleep(1000)
