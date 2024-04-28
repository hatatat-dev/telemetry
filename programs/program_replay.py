#!/usr/bin/env -S PYTHONPATH=. python3

from lib.tele import *
from lib.brain import *
from lib.log import *
from lib.log_reader import *

open_log("replay.csv")

MOTOR_DIRECTION = False

targets = {
    "Motor": {
        "motor_lf": TeleMotor(
            Ports.PORT11, GearSetting.RATIO_18_1, MOTOR_DIRECTION, name="motor_lf"
        ),
        "motor_lb": TeleMotor(
            Ports.PORT20, GearSetting.RATIO_18_1, MOTOR_DIRECTION, name="motor_lb"
        ),
        "motor_rf": TeleMotor(
            Ports.PORT1, GearSetting.RATIO_18_1, not MOTOR_DIRECTION, name="motor_rf"
        ),
        "motor_rb": TeleMotor(
            Ports.PORT10, GearSetting.RATIO_18_1, not MOTOR_DIRECTION, name="motor_rb"
        ),
    },
}

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
