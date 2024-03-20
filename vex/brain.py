# Library imports
from vex import *

# Brain should be defined by default
brain = Brain()


def get_timestamp() -> int:
    """Get current timestamp for a telemetry record"""
    return brain.timer.time()