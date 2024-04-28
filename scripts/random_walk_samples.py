#!/usr/bin/env -S PYTHONPATH=.:lib python3

import argparse
from pathlib import Path

from lib.log_reader import LogReader
from lib.random_walk import RandomWalkSample, read_random_walk_sample


parser = argparse.ArgumentParser(
    description="Normalize random walk samples from a telemetry CSV file"
)
parser.add_argument("--csv", default=True, action=argparse.BooleanOptionalAction)
parser.add_argument("log", nargs="?", type=Path)

args = parser.parse_args()

if not args.log:
    args.log = Path("random_walk.csv")

log_reader = LogReader(str(args.log))

if args.csv:
    print(",".join(RandomWalkSample._fields))


while True:
    sample = read_random_walk_sample(log_reader)

    if not sample:
        break

    if args.csv:
        print(",".join((map(str, sample))))
    else:
        print(sample)
