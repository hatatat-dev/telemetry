import time
import threading
from typing import *  # type: ignore

from lib.sdk import *
from lib.timestamp import *

# Import everything from vex.py stub
with open(SDK_DIRECTORY / "stubs" / "vex.py") as file:
    exec(file.read(), globals())


def sleep(duration: vexnumber, units=TimeUnits.MSEC) -> None:
    """Replace stub sleep and fix incorrect SECONDS/MSEC computation"""
    if units == TimeUnits.MSEC:
        time.sleep(duration / 1000.0)
    else:
        time.sleep(duration)


class Timer:
    """Replace stub Timer with this one that uses time.time()"""

    def __init__(self):
        self.start_time = time.time()

    def time(self, units=TimeUnits.MSEC) -> float:
        return get_timestamp() / (1000.0 if units == TimeUnits.SEC else 1)

    def value(self) -> float:
        return get_timestamp() / 1000.0

    def clear(self) -> None:
        global _start_time
        _start_time = time.time()

    def reset(self) -> None:
        global _start_time
        _start_time = time.time()

    def system(self) -> int:
        return get_timestamp()

    def system_high_res(self) -> int:
        return int((time.time() - _start_time) * 1000000)

    def event(self, callback: Callable[..., None], delay: int, arg: tuple = ()) -> None:
        # TODO: implement
        raise NotImplemented()


class Thread:
    """Replace stub Thread with this one that uses threading.Thread"""

    def __init__(self, callback: Callable[..., None], arg: tuple = ()):
        self.thread = threading.Thread(target=callback, args=arg)
        self.thread.start()

    def stop(self) -> None:
        # TODO: implement
        raise NotImplemented()

    @staticmethod
    def sleep_for(duration, units=TimeUnits.MSEC) -> None:
        sleep(duration, units)
