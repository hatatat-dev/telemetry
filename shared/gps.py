import math

GPS_HALF_FIELD_SIZE = 1800


def compute_distance_forward(
    heading: float, x_position: float, y_position: float, width: float = 0
) -> float:
    heading = heading % 360

    if heading >= 270:
        heading -= 270
        x_position, y_position = y_position, -x_position
    elif heading >= 180:
        heading -= 180
        x_position, y_position = -x_position, -y_position
    elif heading >= 90:
        heading -= 90
        x_position, y_position = -y_position, x_position

    heading_radians = heading * math.pi / 180

    heading_sin = math.sin(heading_radians)
    heading_cos = math.cos(heading_radians)

    left_x = x_position - heading_cos * width
    left_y = y_position + heading_sin * width

    right_x = x_position + heading_cos * width
    right_y = y_position - heading_sin * width

    if (
        left_x >= GPS_HALF_FIELD_SIZE
        or left_y >= GPS_HALF_FIELD_SIZE
        or right_x >= GPS_HALF_FIELD_SIZE
        or right_y >= GPS_HALF_FIELD_SIZE
    ):
        return 0.0

    return min(
        (GPS_HALF_FIELD_SIZE - left_x) / max(heading_sin, 0.01),
        (GPS_HALF_FIELD_SIZE - left_y) / max(heading_cos, 0.01),
        (GPS_HALF_FIELD_SIZE - right_x) / max(heading_sin, 0.01),
        (GPS_HALF_FIELD_SIZE - right_x) / max(heading_cos, 0.01),
    )


def compute_distance_reverse(
    heading: float, x_position: float, y_position: float, width: float = 0
) -> float:
    return compute_distance_forward(
        (heading + 180) % 360, x_position, y_position, width
    )
