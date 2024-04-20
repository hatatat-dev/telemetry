from math import sin, cos, pi

GPS_RADIUS = 1800


def distance_forward(
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

    heading_sin = sin(heading * pi / 180)
    heading_cos = cos(heading * pi / 180)

    left_x = x_position - heading_cos * width
    left_y = y_position - heading_sin * width

    right_x = x_position + heading_cos * width
    right_y = y_position + heading_sin * width

    if (
        left_x >= GPS_RADIUS
        or left_y >= GPS_RADIUS
        or right_x >= GPS_RADIUS
        or right_y >= GPS_RADIUS
    ):
        return 0.0

    # TODO: calculate distance to the boundary
    return 0.0


def distance_reverse(
    heading: float, x_position: float, y_position: float, width: float = 0
) -> float:
    return distance_forward((heading + 180) % 360, x_position, y_position, width)
