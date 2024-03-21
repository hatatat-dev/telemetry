import sys
import os

# Import everything from cte.py stub
with open(
    os.path.expanduser(
        "~/Library/Application Support/Code/User/globalStorage/"
        + "vexrobotics.vexcode/sdk/python/V5/V5_1_0_1_19/vexv5/stubs/cte.py"
    )
) as file:
    exec(file.read(), globals())
