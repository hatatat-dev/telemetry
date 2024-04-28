class MockTimer:
    """Mock timer that just increments the latest time value each time"""

    def __init__(self):
        self.latest_time = 0

    def time(self) -> int:
        """Increment latest time value and return it as current time"""
        self.latest_time += 1
        return self.latest_time


_timer = MockTimer()
"""Global timer"""


def get_timestamp() -> int:
    """Get current timestamp from lib.the global timer"""
    return _timer.time()


def set_timer(new_timer):
    """Set timer to another compatible instance, such as brain.timer"""
    global _timer
    _timer = new_timer
