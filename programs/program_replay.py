#!/usr/bin/env -S PYTHONPATH=. python3

from lib.tele import *
from lib.log import *
from lib.log_reader import *
from lib.drivetrain import *

open_log("replay.csv")

MOTOR_DIRECTION = False

targets = {"Motor": motors}

for motor in targets.get("Motor", {}).values():
    _ = get_motor_state(motor)

log_reader = LogReader("rover.csv")

while True:
    header, rest = log_reader.read_record_header()

    if not header:
        break

    cls_targets = targets.get(header.cls)

    if not cls_targets:
        continue

    target = cls_targets.get(header.name)

    if not target:
        continue

    mappings = target.methods.get(header.method)

    if mappings is None:
        continue

    args = map_args(mappings, parse_record_args(rest, log_reader.line_number))

    delay_ms = header.timestamp - get_timestamp()

    if delay_ms > 0:
        sleep(delay_ms, TimeUnits.MSEC)

    getattr(target, header.method)(*args)

    _ = target.get_state()

close_log()
