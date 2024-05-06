import sys

from lib.record import *
from lib.mock_timer import *
from lib.device import *
from lib.thread import *
from lib.device import *

_log_writer = None
"""Writer to the log file"""

_log_filename = None
"""Log filename"""


def open_log(filename: str):
    """Open log file for writing"""
    global _log_writer
    global _log_filename

    # Close log file if it's open
    close_log()

    # Open file for binary (byte-based) writing
    _log_writer = open(LOG_DIRECTORY + filename, "wb")
    _log_filename = filename

    sys.stdout.buffer.write(
        NEWLINE_FOR_STDOUT
        + b'open_log("'
        + filename.encode()
        + b'")'
        + NEWLINE_FOR_STDOUT
    )

    # Write CSV header
    _log_writer.write(CSV_HEADER)
    sys.stdout.buffer.write(CSV_HEADER_FOR_STDOUT)


def is_log_open():
    """Tell whether log file is open for writing"""
    return bool(_log_writer)


def get_log_filename():
    """Get log filename, if it is open"""
    return _log_filename


def log(obj, method: str, tag: str = "", *args, **kwargs):
    """Shortcut for logging a telemetry record"""
    log_record(
        Record(
            create_record_header(
                get_timestamp(), get_current_thread(), obj, method, tag
            ),
            args,
        )
    )


def flush_log():
    """Flush content written to log file"""
    if _log_writer:
        _log_writer.flush()

        sys.stdout.buffer.write(
            NEWLINE_FOR_STDOUT + b"flush_log()" + NEWLINE_FOR_STDOUT
        )


def close_log():
    """Close log file"""
    global _log_writer
    global _log_filename
    if _log_writer:
        _log_writer.flush()
        _log_writer.close()
        _log_writer = None
        _log_filename = None

        sys.stdout.buffer.write(
            NEWLINE_FOR_STDOUT + b"close_log()" + NEWLINE_FOR_STDOUT
        )


def log_record(record: Record):
    """Save the telemetry record to the record list and the record file"""

    if not _log_writer:
        return

    # Append record to the file as a line in CSV format
    buffer = bytearray()
    append_record(buffer, record)
    _log_writer.write(buffer)
    format_newline_for_stdout(buffer)
    sys.stdout.buffer.write(buffer)


def log_method_call(obj: object, method: str, tag: str, *args: float, **kwargs: float):
    """Save telemetry record for the method call"""
    log_record(
        create_method_call_record(
            get_timestamp(), get_current_thread(), obj, method, tag, *args, **kwargs
        )
    )


def wrap_method_with_log(obj, method: str, tag: str, original):
    """Wrap given method to log a telemetry record"""

    def wrapped(*args, **kwargs):
        log_method_call(obj, method, tag, *args, **kwargs)
        return original(*args, **kwargs)

    return wrapped


def wrap_callback_with_log(obj, method: str, tag: str, callback, *args):
    """Wrap given callback to log a telemetry record"""
    log_method_call(obj, method, tag)
    return callback(*args)
