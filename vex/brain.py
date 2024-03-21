import sys
from vex import *
from mock_timer import *

brain = Brain()
"""Global brain instance"""

if sys.implementation.name == "cpython":
    # Override brain properties
    setattr(brain, "timer", mock_timer)

# User timer from the global brain instance"
set_timer(brain.timer)
