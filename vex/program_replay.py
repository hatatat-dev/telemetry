#!/usr/bin/env python3

from tele import *
from brain import *
from log import *
from log_reader import *

open_log("replay.csv")

cls_targets = {
    "Motor": {
        "motor_a": TeleMotor(
            Ports.PORT10, GearSetting.RATIO_18_1, False, name="motor_a"
        ),
        "motor_b": TeleMotor(
            Ports.PORT20, GearSetting.RATIO_18_1, False, name="motor_b"
        ),
    },
}

log_reader = LogReader("manual.csv")

while True:
    header, rest = log_reader.read_record_header()

    if not header:
        break

    targets = cls_targets.get(header.cls)

    if not targets:
        continue

    target = targets.get(header.name)

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

close_log()
