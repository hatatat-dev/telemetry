#!/usr/bin/env python3

from log import *

open_log("rover.csv")

from rover import *

controller.buttonUp.pressed(lambda: run_steps(get_steps_forward()))
controller.buttonDown.pressed(lambda: run_steps(get_steps_backward()))
controller.buttonLeft.pressed(lambda: run_steps(get_steps_turn_left()))
controller.buttonRight.pressed(lambda: run_steps(get_steps_turn_right()))


def turn_to_zero():
    """Turn to zero heading"""
    before = inertial.get_state()
    _ = gps.get_state()

    pid_turn(-before.heading)

    after = inertial.get_state()
    _ = gps.get_state()


controller.buttonA.pressed(calibrate_inertial_and_gps)

controller.buttonB.pressed(turn_to_zero)

controller.buttonX.pressed(close_log)

calibrate_inertial_and_gps()
