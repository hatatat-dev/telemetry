#!/usr/bin/env python3

import random

from log import *
from gps import *
from motor import *

open_log("random_walk.csv")

from drivetrain import *

done = False


def set_done(value: bool):
    global done
    done = value


controller.buttonX.pressed(lambda: set_done(True))

inertial.collision(lambda: log_method_call(inertial, "collision", ""))

COOLDOWN_MS = 500

INTERVAL_MS = 500

DISTANCE_BUFFER = 100

sample = 0

while not done:
    if sample % 10 == 0:
        calibrate_inertial_and_gps()

    tag = "s" + str(sample)

    gps_before = gps.get_state(tag)
    inertial.set_heading(gps_before.heading)
    inertial_before = inertial.get_state(tag)

    distance_limit_forward = compute_distance_forward(
        gps_before.heading, gps_before.x_position, gps_before.y_position
    )
    distance_limit_reverse = compute_distance_reverse(
        gps_before.heading, gps_before.x_position, gps_before.y_position
    )

    volts = random.randrange(1, int(MAX_MOTOR_VOLTS * 10)) / 10.0
    duration_ms = random.randrange(1, 3 * 20) * 50

    distance_estimate = (volts / MAX_MOTOR_VOLTS) * (
        duration_ms / 1000.0
    ) * GPS_HALF_FIELD_SIZE + DISTANCE_BUFFER

    directions = [(FORWARD, REVERSE), (REVERSE, FORWARD)]

    if distance_estimate < distance_limit_forward:
        directions.append((FORWARD, FORWARD))

    if distance_estimate < distance_limit_reverse:
        directions.append((REVERSE, REVERSE))

    left_direction, right_direction = random.choice(directions)

    log_method_call(
        ("RandomWalk", "random_walk"),
        "start",
        tag,
        distance_limit_forward,
        distance_limit_reverse,
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

    _inertial_cooldown = inertial.get_state(tag)
    _gps_cooldown = gps.get_state(tag)

    sleep(INTERVAL_MS)

    sample += 1

close_log()
