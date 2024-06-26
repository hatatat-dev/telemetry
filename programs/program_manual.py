#!/usr/bin/env -S PYTHONPATH=. python3

from lib.tele import *
from lib.log import *
from lib.inertial import *

open_log("manual.csv")

controller = TeleController(PRIMARY)
inertial = TeleInertial(Ports.PORT2)
motor_a = TeleMotor(Ports.PORT10, GearSetting.RATIO_18_1, False, name="motor_a")
motor_b = TeleMotor(Ports.PORT20, GearSetting.RATIO_18_1, False, name="motor_b")

controller.buttonA.pressed(lambda: motor_a.spin(FORWARD))
controller.buttonA.released(lambda: motor_a.stop())

controller.buttonB.pressed(lambda: motor_b.spin(FORWARD))
controller.buttonB.released(lambda: motor_b.stop())

controller.buttonY.pressed(lambda: motor_a.spin_for(FORWARD, 10, TURNS))

controller.buttonX.pressed(close_log)

while is_log_open():
    controller_state = get_controller_state(controller)
    inertial_state = get_inertial_state(inertial)
    motor_a_state = get_motor_state(motor_a)
    motor_b_state = get_motor_state(motor_a)

    sleep(1000)
