import sys

IS_RUNNING_ON_DEVICE = sys.implementation.name == "micropython"
"""Whether program is running on VEX device"""

NEWLINE_FOR_STDOUT = b"\r\n" if IS_RUNNING_ON_DEVICE else b"\n"
"""Newline formatted for sys.stdout.buffer.write"""


def format_newline_for_stdout(buffer: bytearray):
    """Format newline at the end of the buffer for sys.stdout.buffer.write"""
    if not IS_RUNNING_ON_DEVICE:
        return

    if not buffer or buffer[-1] != 10:
        return

    buffer[-1] = 13
    buffer.append(10)


LOG_DIRECTORY = "" if IS_RUNNING_ON_DEVICE else "csvs/"
"""Directory for logs"""

if not IS_RUNNING_ON_DEVICE:
    from typing import *  # type: ignore
    from vex import *
