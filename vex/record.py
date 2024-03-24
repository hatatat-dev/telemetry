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


RECORD_HEADER_HEADER = ",".join(RecordHeader._fields)
"""CSV header with just the RecordHeader fields without args"""


def append_csv_header(buffer: bytearray, args_len: int = 20):
    """Append CSV header with both RecordHeader and arg_* fields"""
    buffer.extend(RECORD_HEADER_HEADER.encode())

    for index in range(args_len):
        buffer.extend(b",arg_")
        buffer.extend(str(index).encode())

    buffer.append(10)


def parse_record_header(line: str, line_number: int):
    """Parse the line into a record header and the rest of the line

    Return (RecordHeader, str) when there are args after the header,
    return (RecordHeader, None) when there are no args after the header.
    """

    if not line.endswith("\n"):
        raise Exception("no newline on line " + str(line_number))

    offset = 0

    index = line.find(",", offset)
    if index < 0:
        raise Exception("no record timestamp on line " + str(line_number))

    try:
        timestamp = int(line[offset:index])
    except ValueError:
        raise Exception("invalid timestamp on line " + str(line_number))

    offset = index + 1

    index = line.find(",", offset)
    if index < 0:
        raise Exception("no record cls on line " + str(line_number))

    cls = line[offset:index]

    offset = index + 1

    index = line.find(",", offset)
    if index < 0:
        raise Exception("no record name on line " + str(line_number))

    name = line[offset:index]

    offset = index + 1

    index = line.find(",", offset)
    if index < 0:
        raise Exception("no record method on line " + str(line_number))

    method = line[offset:index]

    offset = index + 1

    index = line.find(",", offset)
    if index < 0:
        return RecordHeader(timestamp, cls, name, method, line[offset:-1]), None

    return (
        RecordHeader(timestamp, cls, name, method, line[offset:index]),
        line[index + 1 : -1],
    )


def create_record_header(
    timestamp: int, obj: object, method: str, tag: str
) -> RecordHeader:
    """Create a header for telemetry record with current timestamp"""
    cls = obj.__class__.__name__
    if cls.startswith("Tele"):
        cls = cls[4:]

    name = getattr(obj, "name", "") or ("id_" + str(id(obj)))

    return RecordHeader(timestamp, cls, name, method, tag)


Record = namedtuple("Record", ["header", "args"])
"""Tuple with telemetry record"""


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

    if isinstance(arg, bool):
        # bool is a subtype of int https://peps.python.org/pep-0285/
        # so check for it before checking for actual int
        buffer.append(49 if arg else 48)
        return

    if isinstance(arg, int):
        buffer.extend(str(arg).encode())
        return

    if isinstance(arg, float):
        s = str(float(arg)).encode()

        if len(s) > 2 and s[-2] == 46 and s[-1] == 48:
            # Remove trailing .0 for the integers
            buffer.extend(s[:-2])
            return

        buffer.extend(s)
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


def parse_record_args(rest, line_number: int):
    """Parse rest of the line after record header into tuple of float args"""
    if rest is None:
        return ()

    args = []

    offset = 0

    while True:
        index = rest.find(",", offset + 1)
        if index < 0:
            try:
                arg = float(rest[offset:])
            except ValueError:
                raise Exception("expected number arg on line " + str(line_number))
            args.append(arg)
            return tuple(args)

        try:
            arg = float(rest[offset:index])
        except ValueError:
            raise Exception("expected number arg on line " + str(line_number))

        args.append(arg)
        offset = index + 1


def map_arg(mapping, arg: float):
    """Map arg value according to the mapping"""
    if mapping is None:
        return arg

    if isinstance(mapping, (list, tuple, dict)):
        return mapping[int(arg)]

    return mapping(arg)


def map_args(mappings, args):
    """Map args value according to their mappings"""
    return tuple(
        map_arg(mappings[index], args[index]) if index < len(mappings) else args[index]
        for index in range(len(args))
    )
