#!/usr/bin/env python3

from log import *

open_log("rover.csv")

from rover import *

GREEN_TRIBALL_SIG = Signature(0, -4805, -3921, -4363, -5601, -4643, -5122, 7381610, 0)

RED_TRIBALL_SIG = Signature(
    1,
    8191,
    9095,
    8643,
    -1153,
    -439,
    -796,
    11294286,
    0,
)

vision = Vision(Ports.PORT7, 50, GREEN_TRIBALL_SIG, RED_TRIBALL_SIG)

def handle_vision():
    vision.take_snapshot(GREEN_TRIBALL_SIG,)
    pass

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

controller.buttonY.pressed(handle_vision)

calibrate_inertial_and_gps()
