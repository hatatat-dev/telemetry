#!/usr/bin/env python3

from tele import *
from brain import *
from log import *

open_log("drivetrain.csv")

controller = TeleController(PRIMARY)
inertial = TeleInertial(Ports.PORT2)
motor_a = TeleMotor(Ports.PORT10, GearSetting.RATIO_18_1, False, name="motor_a")
motor_b = TeleMotor(Ports.PORT20, GearSetting.RATIO_18_1, False, name="motor_b")


brain.screen.print("clear", get_log_filename())
brain.screen.next_row()

controller.buttonA.pressed(print, ("buttonA", "pressed"))
controller.buttonA.released(print, ("buttonA", "released"))

controller.buttonB.pressed(print, ("buttonB", "pressed"))
controller.buttonB.released(print, ("buttonB", "released"))


def detect_axis_threshold(
    axis: TeleController.Axis, threshold: int, reported: List[int]
) -> None:
    """Detect and report axis value crossing a threshold"""

    # Get the current value
    value = axis.value()

    # Compare the current value to the previous reported
    if abs(value - reported[0]) >= threshold or value == 0 and reported[0] != 0:
        # Report the current value
        reported[0] = value
        return value  # type: ignore


controller.axis1.changed(detect_axis_threshold, (controller.axis1, 32, [0]))
controller.axis2.changed(detect_axis_threshold, (controller.axis2, 32, [0]))

for step in range(5):
    get_controller_state(controller, "test")
    get_inertial_state(inertial, "test")
    get_motor_state(motor_a, "test")
    motor_a.spin(DirectionType.FORWARD if step % 2 == 0 else DirectionType.REVERSE)
    motor_b.spin(DirectionType.REVERSE if step % 2 == 0 else DirectionType.FORWARD)
    sleep(1000)

motor_a.stop()
motor_b.stop()

brain.screen.print("done")
brain.screen.next_row()

close_log()
