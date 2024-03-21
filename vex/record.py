from collections import namedtuple

# Tuple with header information for individual telemetry records
RecordHeader = namedtuple("RecordHeader", ["timestamp", "cls", "name", "method", "tag"])

# Tuple with telemetry record
Record = namedtuple("Record", ["header", "args"])


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


def format_csv_arg(arg) -> str:
    """Format CSV argument, treating falsy values as zeroes"""
    if not arg:
        return "0"

    cls = arg.__class__.__name__
    if cls.endswith("Type") or cls.endswith("Units"):
        # vexEnum are these classes that need to be resolved to ordinal numbers
        arg = arg.__class__.value(arg)
        return str(arg)

    # Convert everything, including bools, to floats
    s = str(float(arg))

    if len(s) > 2 and s[-2] == "." and s[-1] == "0":
        # Remove trailing .0 for the integers
        return s[:-2]

    return s
