import sys
import os

with open(
    os.path.expanduser(
        "~/Library/Application Support/Code/User/globalStorage/"
        + "vexrobotics.vexcode/sdk/python/V5/V5_1_0_1_19/vexv5/stubs/vex.py"
    )
) as file:
    exec(file.read(), globals())
