class MockTimer:
    """Mock timer that just increments the latest time value each time"""

    def __init__(self):
        self.latest_time = 0

    def time(self) -> int:
        """Increment latest time value and return it as current time"""
        self.latest_time += 1
        return self.latest_time


mock_timer = MockTimer()
"""Global mock timer instance"""

timer = MockTimer()
"""Global timer"""


def get_timestamp():
    """Get current timestamp from the global timer"""
    return timer.time()


def set_timer(new_timer):
    """Set timer to another compatible instance, such as brain.timer"""
    global timer
    timer = new_timer
