import _thread

_thread.get_ident()

_thread_names = {}

MAIN_THREAD = "main"
"""Main thread"""


def get_current_thread() -> str:
    """Get current thread name"""
    ident = _thread.get_ident()
    if ident not in _thread_names:
        _thread_names[ident] = "t" + str(ident)

    return _thread_names[ident]


def set_current_thread(thread: str):
    """Set current thread name"""
    _thread_names[_thread.get_ident()] = thread


# Current is the main thread
set_current_thread(MAIN_THREAD)
