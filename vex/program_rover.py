#!/usr/bin/env python3

from log import *

open_log("rover.csv")

from rover import *

controller.buttonUp.pressed(lambda: run_steps(get_steps_forward()))
controller.buttonDown.pressed(lambda: run_steps(get_steps_backward()))
controller.buttonLeft.pressed(lambda: run_steps(get_steps_turn_left()))
controller.buttonRight.pressed(lambda: run_steps(get_steps_turn_right()))

controller.buttonA.pressed(
    lambda: run_steps(
        get_steps_forward()
        + get_steps_turn_left()
        + get_steps_backward()
        + get_steps_turn_right()
    )
)

# For current heading, turn back to zero heading by negative heading value
controller.buttonB.pressed(lambda: pid_turn(-gps.heading()))

controller.buttonX.pressed(close_log)

# Calibrate both inertial and GPS sensors
inertial.calibrate()
gps.calibrate()

while inertial.is_calibrating():
    wait(100, MSEC)

while gps.is_calibrating():
    wait(100, MSEC)

_ = inertial.get_state()
_ = gps.get_state()
