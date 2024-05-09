from lib.device import *

if IS_RUNNING_ON_DEVICE:
    from vex import *

    _timer = Brain().timer

    def get_timestamp() -> int:
        """Get current timestamp, in milliseconds"""
        return _timer.time()

else:
    import time

    _start_time = time.time()

    def get_timestamp() -> int:
        """Get current timestamp, in milliseconds"""
        return int((time.time() - _start_time) * 1000)
