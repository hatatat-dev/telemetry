#!/usr/bin/env python3

from tele import *
from brain import *
from log import *
from log_reader import *

open_log("replay.csv")

motors = {
    "motor_a": TeleMotor(Ports.PORT10, GearSetting.RATIO_18_1, False, name="motor_a"),
    "motor_b": TeleMotor(Ports.PORT20, GearSetting.RATIO_18_1, False, name="motor_b"),
}

log_reader = LogReader("manual.csv")

method_mappings = {
    "spin": (DirectionType_values,),
    "stop": (),
}

while True:
    header, rest = log_reader.read_record_header()

    if not header:
        break

    if header.cls != "Motor":
        continue

    motor = motors.get(header.name)

    if not motor:
        continue

    mappings = method_mappings.get(header.method)

    if mappings is None:
        continue

    args = map_args(mappings, parse_record_args(rest, log_reader.line_number))

    delay_ms = header.timestamp - get_timestamp()

    if delay_ms > 0:
        sleep(delay_ms, TimeUnits.MSEC)

    getattr(motor, header.method)(*args)

close_log()
