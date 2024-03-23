import sys
from vex import *
from mock_timer import *
from device import *

brain = Brain()
"""Global brain instance"""

if not is_running_on_device:
    # Override brain properties
    setattr(brain, "timer", mock_timer)

# User timer from the global brain instance"
set_timer(brain.timer)
