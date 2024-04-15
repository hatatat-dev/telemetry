from collections import namedtuple

from log import *

Gains = namedtuple(
    "Gains",
    [
        "proportional",
        "integral",
        "derivative",
    ],
)
"""Gains for PID controller"""


class TelePID:
    def __init__(self, gains: Gains, *, name: str = "pid", tag: str = ""):
        self.gains: Gains = gains

        self.name = name
        self.tag = tag

        self.integral: float = 0
        self.previous_error: float = 0

    def step(self, error: float) -> float:
        self.integral += error
        derivative = error - self.previous_error

        result = (
            self.gains.proportional * error
            + self.gains.integral * self.integral
            + self.gains.derivative * derivative
        )

        self.previous_error = error

        log_method_call(
            self, "step", self.tag, error, self.integral, derivative, result
        )

        return result
