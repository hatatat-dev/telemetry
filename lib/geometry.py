from collections import namedtuple
import math


def compute_angle(heading_from: float, heading_to: float) -> float:
    return (heading_to - heading_from + 180) % 360 - 180


def reverse_heading(heading: float) -> float:
    return (heading + 180) % 360


FlatPosition = namedtuple(
    "FloatPosition",
    [
        "x_position",
        "y_position",
        "heading",
    ],
)


def reverse_position_heading(position: FlatPosition) -> FlatPosition:
    return FlatPosition(
        position.x_position, position.y_position, reverse_heading(position.heading)
    )


FlatDimensions = namedtuple("FlatDimensions", ["x_size", "y_size"])


def compute_dimensions_radius(dimensions: FlatDimensions) -> float:
    return math.sqrt((dimensions.x_size / 2) ** 2 + (dimensions.y_size / 2) ** 2)


FIELD_DIMENSIONS = FlatDimensions(3600, 3600)


def compute_heading_range(position: FlatPosition, radius: float = 0) -> float:
    heading_radians = position.heading * math.pi / 180

    heading_sin = math.sin(heading_radians)
    heading_cos = math.cos(heading_radians)

    if heading_sin >= 0:
        x_range = (FIELD_DIMENSIONS.x_size / 2 - position.x_position - radius) / max(
            heading_sin, 0.01
        )
    else:
        x_range = (FIELD_DIMENSIONS.x_size / 2 + position.x_position - radius) / max(
            -heading_sin, 0.01
        )

    if heading_cos >= 0:
        y_range = (FIELD_DIMENSIONS.y_size / 2 - position.y_position - radius) / max(
            heading_cos, 0.01
        )
    else:
        y_range = (FIELD_DIMENSIONS.y_size / 2 + position.y_position - radius) / max(
            -heading_cos, 0.01
        )

    return max(min(x_range, y_range), 0)
