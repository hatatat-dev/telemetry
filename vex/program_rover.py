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


controller.buttonX.pressed(close_log)
