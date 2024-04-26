#!/usr/bin/env -S PYTHONPATH=.:lib python3

from lib.log_reader import *
from lib.log import *

log_reader = LogReader("simple.csv")

open_log("copy.csv")

while True:
    header, rest = log_reader.read_record_header()

    if header is None:
        break

    args = parse_record_args(rest, log_reader.line_number)

    log_record(Record(header, args))

log_reader.close()

close_log()
