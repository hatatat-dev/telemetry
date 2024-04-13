import sys

is_running_on_device = sys.implementation.name == "micropython"
"""Whether program is running on VEX device"""

NEWLINE_FOR_STDOUT=b"\r\n" if is_running_on_device else b"\n"
"""Newline formatted for sys.stdout.buffer.write"""

def format_newline_for_stdout(buffer: bytearray):
    """Format newline at the end of the buffer for sys.stdout.buffer.write"""
    if not is_running_on_device:
        return

    if not buffer or buffer[-1] != 10:
        return

    buffer[-1] = 13
    buffer.append(10)