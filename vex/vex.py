import sys
import os
import time
from typing import Callable

# Import everything from vex.py stub
with open(
    os.path.expanduser(
        "~/Library/Application Support/Code/User/globalStorage/"
        + "vexrobotics.vexcode/sdk/python/V5/V5_1_0_1_19/vexv5/stubs/vex.py"
    )
) as file:
    exec(file.read(), globals())


def sleep(duration: vexnumber, units=TimeUnits.MSEC) -> None:  # type: ignore
    """Replace stub sleep and fix incorrect SECONDS/MSEC computation"""
    if units == TimeUnits.MSEC:  # type: ignore
        time.sleep(duration / 1000)
    else:
        time.sleep(duration)


class Timer:
    """Replace stub Timer with this one that uses time.time()"""

    def __init__(self):
        self.start_time = time.time()

    def time(self, units=TimeUnits.MSEC):  # type: ignore
        return (
            int(self.value() * 1000)
            if units == TimeUnits.MSEC  # type: ignore
            else self.value()
        )

    def value(self):
        return time.time() - self.start_time

    def clear(self):
        self.start_time = time.time()

    def reset(self):
        self.start_time = time.time()

    def system(self):
        return int(self.value() * 1000)

    def system_high_res(self):
        return int(self.value() * 1000000)

    def event(self, callback: Callable[..., None], delay: int, arg: tuple = ()):
        # TODO: implement
        raise NotImplemented()
