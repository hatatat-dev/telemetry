#!/usr/bin/env -S PYTHONPATH=. python3

import math

from lib.log import *
from lib.rover import *

open_log("rover.csv")

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


def motors_temperature_thread_func():
    while is_log_open():
        log_motors_temperature()
        sleep(1000)


calibrate_inertial_and_gps()

motors_temperature_thread = TeleThread(
    motors_temperature_thread_func, (), "motors_temperature_thread"
)
