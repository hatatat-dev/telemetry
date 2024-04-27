import sys
import os
from pathlib import Path

APPLICATION_SUPPORT_DIRECTORY = Path(
    os.path.expandvars(
        "%APPDATA%" if sys.platform == "win32" else "$HOME/Library/ApplicationSupport"
    )
)


VEXCODE_DIRECTORY = (
    APPLICATION_SUPPORT_DIRECTORY
    / "Code"
    / "User"
    / "globalStorage"
    / "vexrobotics.vexcode"
)


SDK_MAJOR_VERSION = "V5"

SDK_MINOR_VERSION = "V5_1_0_1_19"

SDK_DIRECTORY = (
    VEXCODE_DIRECTORY
    / "sdk"
    / "python"
    / SDK_MAJOR_VERSION
    / SDK_MINOR_VERSION
    / "vexv5"
)
