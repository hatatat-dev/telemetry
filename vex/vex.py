import sys
import os
import time

# Import everything from vex.py stub
with open(
    os.path.expanduser(
        "~/Library/Application Support/Code/User/globalStorage/"
        + "vexrobotics.vexcode/sdk/python/V5/V5_1_0_1_19/vexv5/stubs/vex.py"
    )
) as file:
    exec(file.read(), globals())


def sleep(duration: vexnumber, units=TimeUnits.MSEC) -> None:  # type: ignore
    """Override fixes SECONDS/MSEC issue with original vex.py sleep"""
    if units == TimeUnits.MSEC:  # type: ignore
        time.sleep(duration / 1000)
    else:
        time.sleep(duration)
