from vex import *
from mock_timer import *
from device import *

brain = Brain()
"""Global brain instance"""

# User timer from the global brain instance"
set_timer(brain.timer)
