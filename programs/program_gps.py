#!/usr/bin/env -S PYTHONPATH=. python3

from lib.log import *

open_log("gps.csv")

from lib.rover import *


controller.buttonA.pressed(print, ("buttonA", "pressed"))
controller.buttonA.released(print, ("buttonA", "released"))

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
