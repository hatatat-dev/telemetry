import io

from record import *
from mock_timer import *
from device import *

records = []
"""(Partial) list of telemetry records in this run"""

log_writer = None
"""Writer to the log file"""


def open_log(filename: str):
    """Open log file for writing"""
    global log_writer
    close_log()
    log_writer = open(filename, "wb")

def flush_log():
    """Flush content written to log file"""
    if log_writer:
        log_writer.flush()

def close_log():
    """Close log file"""
    global log_writer
    if log_writer:
        log_writer.flush()
        log_writer.close()
        log_writer = None


def log_record(record: Record) -> None:
    """Save the telemetry record to the record list and the record file"""

    # Append record to the list of records
    records.append(record)

    if not is_running_on_device:
        print(record)

    if log_writer:
        # Append record to the file as a line in CSV format
        buffer = bytearray()
        append_record(buffer, record)
        log_writer.write(buffer)


def log_method_call(
    timestamp: int, obj: object, method: str, tag: str, *args: float, **kwargs: float
):
    """Save telemetry record for the method call"""
    log_record(create_method_call_record(timestamp, obj, method, tag, *args, **kwargs))


def wrap_method_with_log(obj, method: str, tag: str, original):
    """Wrap given method to log a telemetry record"""

    def wrapped(*args, **kwargs):
        timestamp = get_timestamp()
        result = original(*args, **kwargs)
        log_method_call(timestamp, obj, method, tag, *args, **kwargs)
        return result

    return wrapped


def wrap_callback_with_log(
    obj, method: str, tag: str, callback, unconditional: bool, *args
):
    """Wrap given callback to log a telemetry record"""

    timestamp = get_timestamp()
    result = callback(*args)
    if result is None:
        # No value returned from the callback
        if unconditional:
            # Only save telemetry record if it is unconditional
            log_method_call(timestamp, obj, method, tag)
    else:
        # Some value returned from the callback, save telemetry record
        log_method_call(timestamp, obj, method, tag, result)
