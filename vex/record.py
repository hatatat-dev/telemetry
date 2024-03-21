from collections import namedtuple

RecordHeader = namedtuple("RecordHeader", ["timestamp", "cls", "name", "method", "tag"])
"""Tuple with header information for individual telemetry records"""


def append_record_header(buffer: bytearray, header: RecordHeader):
    """Append the record header to the buffer"""
    buffer.extend(str(header.timestamp).encode())
    buffer.append(44)
    buffer.extend(header.cls.encode())
    buffer.append(44)
    buffer.extend(header.name.encode())
    buffer.append(44)
    buffer.extend(header.method.encode())
    buffer.append(44)
    buffer.extend(header.tag.encode())


Record = namedtuple("Record", ["header", "args"])
"""Tuple with telemetry record"""


def create_record_header(
    timestamp: int, obj: object, method: str, tag: str
) -> RecordHeader:
    """Create a header for telemetry record with current timestamp"""
    cls = obj.__class__.__name__
    if cls.startswith("Tele"):
        cls = cls[4:]

    name = getattr(obj, "name", "") or ("id_" + str(id(obj)))

    return RecordHeader(timestamp, cls, name, method, tag)


def create_method_call_record(
    timestamp: int, obj: object, method: str, tag: str, *args: float, **kwargs: float
) -> Record:
    """Create a telemetry record for a method call"""
    return Record(
        create_record_header(timestamp, obj, method, tag),
        args + tuple(kwargs.values()),
    )


def append_csv_arg(buffer: bytearray, arg):
    """Append the CSV argument to the buffer, treating falsy values as zeroes"""
    if not arg:
        buffer.append(48)
        return

    if isinstance(arg, int):
        buffer.extend(str(arg).encode())
        return

    if isinstance(arg, bool):
        buffer.append(49 if arg else 48)
        return

    if isinstance(arg, float):
        s = str(float(arg))

        if len(s) > 2 and s[-2] == 46 and s[-1] == 48:
            # Remove trailing .0 for the integers
            buffer.extend(s[:-2].encode())
            return

        buffer.extend(s.encode())
        return

    cls = arg.__class__.__name__
    if cls.endswith("Type") or cls.endswith("Units"):
        # vexEnum are these classes that need to be resolved to ordinal numbers
        value = arg.__class__.value
        if callable(value):
            value = value(arg)
        buffer.extend(str(value).encode())
        return

    buffer.extend(str(arg).encode())


def append_record(buffer: bytearray, record: Record):
    """Append the record to the buffer"""
    append_record_header(buffer, record.header)
    for arg in record.args:
        buffer.append(44)
        append_csv_arg(buffer, arg)
    buffer.append(10)
