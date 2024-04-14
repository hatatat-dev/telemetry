#!/usr/bin/env python3

from log import *

open_log("rover.csv")

from rover import *

controller.buttonA.pressed(lambda: run_steps(get_steps_forward()))
controller.buttonB.pressed(lambda: run_steps(get_steps_backward()))

controller.buttonX.pressed(close_log)
