from typing import *  # type: ignore
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
    def __init__(
        self,
        gains: Gains,
        setpoint: float,
        *,
        wrap: float = 0,
        name: str = "pid",
        tag: str = ""
    ):
        self.gains: Gains = gains
        self.setpoint = setpoint

        self.wrap = wrap
        self.name = name
        self.tag = tag

        self.integral: float = 0
        self.previous_error: Union[float, None] = None

    def step(self, current: float) -> Tuple[float, float]:
        error = self.setpoint - current
        if self.wrap:
            error = (error + self.wrap / 2) % self.wrap - self.wrap / 2

        self.integral += error
        derivative = 0 if self.previous_error is None else error - self.previous_error

        result = (
            self.gains.proportional * error
            + self.gains.integral * self.integral
            + self.gains.derivative * derivative
        )

        self.previous_error = error

        log_method_call(
            self,
            "step",
            self.tag,
            self.setpoint,
            current,
            error,
            self.integral,
            derivative,
            result,
        )

        return error, result
