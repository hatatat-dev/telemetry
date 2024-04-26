#!/usr/bin/env -S PYTHONPATH=.:lib python3

import math

from lib.log import *

open_log("rover.csv")

from lib.rover import *

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


def turn_to_center():
    """Turn to face the center of the field"""
    gps_before = gps.get_state()

    direction = (
        math.atan2(gps_before.x_position, gps_before.y_position) * 180 / math.pi + 180
    ) % 360
    angle = direction - gps_before.heading

    pid_turn(angle)

    _ = inertial.get_state()


controller.buttonA.pressed(calibrate_inertial_and_gps)

controller.buttonB.pressed(turn_to_zero)

controller.buttonY.pressed(turn_to_center)

controller.buttonX.pressed(close_log)

calibrate_inertial_and_gps()
