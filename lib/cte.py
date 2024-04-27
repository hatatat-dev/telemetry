from sdk import *

# Import everything from cte.py stub
with open(SDK_DIRECTORY / "stubs" / "cte.py") as file:
    exec(file.read(), globals())
