#!/usr/bin/env python3

from log import *

open_log("vision.csv")

from rover import *

GREEN_TRIBALL_SIG = Signature(1, -4805, -3921, -4363, -5601, -4643, -5122, 2.5, 0)

RED_TRIBALL_SIG = Signature(
    2,
    8191,
    9095,
    8643,
    -1153,
    -439,
    -796,
    2.5,
    0,
)

vision = Vision(Ports.PORT7, 50, GREEN_TRIBALL_SIG, RED_TRIBALL_SIG)

VisionObjectState = namedtuple(
    "VisionObjectState",
    [
        "id",
        "originX",
        "originY",
        "centerX",
        "centerY",
        "width",
        "height",
        "exists",
        "angle",
    ],
)


def get_vision_object_state(obj: VisionObject) -> VisionObjectState:
    return VisionObjectState(
        obj.id,
        obj.originX,
        obj.originY,
        obj.centerX,
        obj.centerY,
        obj.width,
        obj.height,
        obj.exists,
        obj.angle,
    )


def handle_vision_a():
    for name, sig in (("green", GREEN_TRIBALL_SIG), ("red", RED_TRIBALL_SIG)):
        objs = vision.take_snapshot(sig, 4)

        if objs:
            for obj in objs:
                print(name, get_vision_object_state(obj))


controller.buttonX.pressed(close_log)

controller.buttonA.pressed(handle_vision_a)

calibrate_inertial_and_gps()
