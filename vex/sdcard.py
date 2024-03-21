import io

from record import *
from mock_timer import *

records = []
"""(Partial) list of telemetry records in this run"""

record_file_writer = None
"""Writer to the records file"""


def open_record_file(filename: str):
    """Open telemetry records file for writing"""
    global record_file_writer
    if record_file_writer:
        record_file_writer.close()
    record_file_writer = open(filename, "wb")


def close_record_file():
    """Close telemetry records file"""
    global record_file_writer
    if record_file_writer:
        record_file_writer.close()
        record_file_writer = None


def save_record(record: Record) -> None:
    """Save the telemetry record to the record list and the record file"""

    # Append record to the list of records
    records.append(record)

    if record_file_writer:
        # Append record to the file as a line in CSV format
        buffer = bytearray()
        append_record(buffer, record)
        record_file_writer.write(buffer)


def save_method_call(
    timestamp: int, obj: object, method: str, tag: str, *args: float, **kwargs: float
):
    """Save telemetry record for the method call"""
    save_record(create_method_call_record(timestamp, obj, method, tag, *args, **kwargs))


def decorate_method_call(obj, method: str, tag: str, original):
    """Decorate method call by first saving a telemetry record for it"""

    def decorated(*args, **kwargs):
        timestamp = get_timestamp()
        result = original(*args, **kwargs)
        save_method_call(timestamp, obj, method, tag, *args, **kwargs)
        return result

    return decorated


def callback_with_record(
    obj, method: str, tag: str, callback, unconditional: bool, *args
):
    """Invoke callback after saving a telemetry record"""
    timestamp = get_timestamp()
    result = callback(*args)
    if result is None:
        # No value returned from the callback
        if unconditional:
            # Only save telemetry record if it is unconditional
            save_method_call(timestamp, obj, method, tag)
    else:
        # Some value returned from the callback, save telemetry record
        save_method_call(timestamp, obj, method, tag, result)
