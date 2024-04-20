#!/usr/bin/env python3

from log import *

open_log("random_walk.csv")

from drivetrain import *

calibrate_inertial_and_gps()

done = False


def set_done(value: bool):
    global done
    done = value


controller.buttonX.pressed(lambda: set_done(True))

INTERVAL_MS = 500

sample = 0

while not done:
    sample += 1
    tag = "s" + str(sample)

    gps_before = gps.get_state(tag)
    inertial_before = inertial.get_state(tag)

    left_direction = FORWARD
    right_direction = FORWARD
    volts = 5.0
    duration_ms = 100

    log_method_call(
        ("RandomWalk", "random_walk"),
        "sample",
        "tag",
        left_direction,  # type: ignore
        right_direction,  # type: ignore
        volts,
        duration_ms,
    )

    motor_lf.no_log_spin_volts(left_direction, volts)  # type: ignore
    motor_lb.no_log_spin_volts(left_direction, volts)  # type: ignore
    motor_rf.no_log_spin_volts(right_direction, volts)  # type: ignore
    motor_rb.no_log_spin_volts(right_direction, volts)  # type: ignore

    sleep(duration_ms)

    _inertial_after = inertial.get_state(tag)
    _gps_after = gps.get_state(tag)

    sleep(INTERVAL_MS)

close_log()
