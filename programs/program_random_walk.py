#!/usr/bin/env -S PYTHONPATH=.:lib python3

import random

from lib.log import *
from lib.geometry import *
from lib.motor import *
from lib.drivetrain import *

open_log("random_walk.csv")

from lib.drivetrain import *

done = False


def set_done(value: bool):
    global done
    done = value


controller.buttonX.pressed(lambda: set_done(True))

inertial.collision(lambda: log_method_call(inertial, "collision", ""))

COOLDOWN_MS = 2000

FINAL_MS = 2000

INTERVAL_MS = 1000

RANGE_BUFFER = 250

VOLTS_TO_SPEED = 0.13

sample = 0

while not done:
    if sample % 10 == 0:
        calibrate_inertial_and_gps()

    tag = "s" + str(sample)

    gps_before = gps.get_state(tag)
    inertial.set_heading(gps_before.heading)
    inertial_before = inertial.get_state(tag)

    position_before = get_gps_state_position(gps_before)

    range_forward = compute_heading_range(position_before, DRIVERTRAIN_RADIUS)

    range_reverse = compute_heading_range(
        reverse_position_heading(position_before), DRIVERTRAIN_RADIUS
    )

    volts = random.randrange(1, int(MAX_MOTOR_VOLTS * 10)) / 10.0
    duration_ms = random.randrange(1, 3 * 20) * 50

    speed = volts * VOLTS_TO_SPEED

    distance_estimate = speed * duration_ms

    directions = [(FORWARD, REVERSE), (REVERSE, FORWARD)]

    if distance_estimate < range_forward:
        directions.append((FORWARD, FORWARD))

    if distance_estimate < range_reverse:
        directions.append((REVERSE, REVERSE))

    left_direction, right_direction = random.choice(directions)

    log_method_call(
        ("RandomWalk", "random_walk"),
        "start",
        tag,
        range_forward,
        range_reverse,
        distance_estimate,
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

    log_method_call(
        ("RandomWalk", "random_walk"),
        "stop",
        tag,
    )

    motor_lf.no_log_stop()  # type: ignore
    motor_lb.no_log_stop()  # type: ignore
    motor_rf.no_log_stop()  # type: ignore
    motor_rb.no_log_stop()  # type: ignore

    _inertial_after = inertial.get_state(tag)
    _gps_after = gps.get_state(tag)

    sleep(COOLDOWN_MS)

    _inertial_after = inertial.get_state(tag)
    _gps_after = gps.get_state(tag)

    sleep(FINAL_MS)

    _inertial_cooldown = inertial.get_state(tag)
    _gps_cooldown = gps.get_state(tag)

    sleep(INTERVAL_MS)

    sample += 1

close_log()
