import math
from collections import namedtuple
from typing import *  # type: ignore
from log_reader import *
from state import *


RandomWalkSample = namedtuple(
    "RandomWalkSample",
    [
        "sample",
        "gps_start_heading",
        "gps_start_x_position",
        "gps_start_y_position",
        "inertial_start_heading",
        "inertial_start_rotation",
        "distance_limit_forward",
        "distance_limit_reverse",
        "distance_estimate",
        "left_direction",
        "right_direction",
        "volts",
        "duration_ms",
        "gps_stop_heading",
        "gps_stop_x_position",
        "gps_stop_y_position",
        "inertial_stop_heading",
        "inertial_stop_rotation",
        "gps_cooldown_heading",
        "gps_cooldown_x_position",
        "gps_cooldown_y_position",
        "inertial_cooldown_heading",
        "inertial_cooldown_rotation",
        "gps_final_heading",
        "gps_final_x_position",
        "gps_final_y_position",
        "inertial_final_heading",
        "inertial_final_rotation",
        "gps_stop_angle",
        "gps_cooldown_angle",
        "gps_final_angle",
        "inertial_stop_angle",
        "inertial_cooldown_angle",
        "inertial_final_angle",
        "inertial_stop_travel",
        "inertial_cooldown_travel",
        "inertial_final_travel",
        "gps_stop_distance",
        "gps_cooldown_distance",
        "gps_final_distance",
    ],
)
"""Random walk sample"""

# 4219,main,Gps,gps,state,s0,1,4625,6.970912,6.970912,-272.939,-563.0187,100,0,-0.6022052,0.5334883,6.970912,0,0,0.09155553,0.05249023,-0.0003662109,-1.006836,1
# 4220,main,Inertial,inertial,set_heading,,6.970912
# 4224,main,Inertial,inertial,state,s0,1,4626,6.970912,-0.07124828,0,3.021206,-2.697148,-0.07124828,0,0,0,-0.04870605,0.0534668,1.010498,1
# 4225,main,RandomWalk,random_walk,start,s0,2088.377,1246.193,262.75,0,1,0.7,1550
# 5776,main,RandomWalk,random_walk,stop,s0
# 5776,main,Inertial,inertial,state,s0,1,6174,6.97071,-0.07144935,0,3.025886,-2.690219,-0.07144935,0,0,0,-0.04711914,0.05407715,1.010986,1
# 5776,main,Gps,gps,state,s0,1,6172,6.579648,6.579648,-275.9193,-563.3484,100,0,-0.3853004,0.880218,6.579648,0,0,0,0.05285645,-0.002807617,-1.007324,1
# 6281,main,Inertial,inertial,state,s0,1,6664,6.971793,-0.07036667,0,3.003065,-2.71482,-0.07036667,0,0,0,-0.04821777,0.0546875,1.010742,1
# 6281,main,Gps,gps,state,s0,1,6668,6.528293,6.528293,-275.1875,-564.1791,100,0,-0.3301452,0.9805665,6.528293,0,0,0,0.05249023,-0.0008544922,-1.007813,1


def parse_tag_sample(tag: str) -> Optional[int]:
    if not tag.startswith("s"):
        return None

    try:
        return int(tag[1:])
    except ValueError:
        return None


def read_random_walk_sample(log_reader: LogReader) -> Optional[RandomWalkSample]:
    while True:
        header, rest = log_reader.read_record_header("Gps", "gps", "state")
        if not header:
            return None

        sample_tag = header.tag
        sample = parse_tag_sample(sample_tag)

        if sample is None:
            continue

        gps_start = GpsState_from_args(parse_record_args(rest, log_reader.line_number))

        header, rest = log_reader.read_record_header("Inertial", "inertial", "state")
        if not header:
            return None

        if header.tag != sample_tag:
            raise Exception(
                "expected tag "
                + sample_tag
                + " actual "
                + header.tag
                + " on line "
                + str(log_reader.line_number)
            )

        inertial_start = InertialState_from_args(
            parse_record_args(rest, log_reader.line_number)
        )

        header, rest = log_reader.read_record_header(
            "RandomWalk", "random_walk", "start"
        )
        if not header:
            return None

        if header.tag != sample_tag:
            raise Exception(
                "expected tag "
                + sample_tag
                + " actual "
                + header.tag
                + " on line "
                + str(log_reader.line_number)
            )

        start_args = parse_record_args(rest, log_reader.line_number)

        header, rest = log_reader.read_record_header("Inertial", "inertial", "state")
        if not header:
            return None

        if header.tag != sample_tag:
            raise Exception(
                "expected tag "
                + sample_tag
                + " actual "
                + header.tag
                + " on line "
                + str(log_reader.line_number)
            )

        inertial_stop = InertialState_from_args(
            parse_record_args(rest, log_reader.line_number)
        )

        header, rest = log_reader.read_record_header("Gps", "gps", "state")
        if not header:
            return None

        if header.tag != sample_tag:
            raise Exception(
                "expected tag "
                + sample_tag
                + " actual "
                + header.tag
                + " on line "
                + str(log_reader.line_number)
            )

        gps_stop = GpsState_from_args(parse_record_args(rest, log_reader.line_number))

        header, rest = log_reader.read_record_header("Inertial", "inertial", "state")
        if not header:
            return None

        if header.tag != sample_tag:
            raise Exception(
                "expected tag "
                + sample_tag
                + " actual "
                + header.tag
                + " on line "
                + str(log_reader.line_number)
            )

        inertial_cooldown = InertialState_from_args(
            parse_record_args(rest, log_reader.line_number)
        )

        header, rest = log_reader.read_record_header("Gps", "gps", "state")
        if not header:
            return None

        if header.tag != sample_tag:
            raise Exception(
                "expected tag "
                + sample_tag
                + " actual "
                + header.tag
                + " on line "
                + str(log_reader.line_number)
            )

        gps_cooldown = GpsState_from_args(
            parse_record_args(rest, log_reader.line_number)
        )

        header, rest = log_reader.read_record_header("Inertial", "inertial", "state")
        if not header:
            return None

        if header.tag != sample_tag:
            raise Exception(
                "expected tag "
                + sample_tag
                + " actual "
                + header.tag
                + " on line "
                + str(log_reader.line_number)
            )

        inertial_final = InertialState_from_args(
            parse_record_args(rest, log_reader.line_number)
        )

        header, rest = log_reader.read_record_header("Gps", "gps", "state")
        if not header:
            return None

        if header.tag != sample_tag:
            raise Exception(
                "expected tag "
                + sample_tag
                + " actual "
                + header.tag
                + " on line "
                + str(log_reader.line_number)
            )

        gps_final = GpsState_from_args(parse_record_args(rest, log_reader.line_number))

        return RandomWalkSample(
            sample,
            gps_start.heading,
            gps_start.x_position,
            gps_start.y_position,
            inertial_start.heading,
            inertial_start.rotation,
            start_args[0],
            start_args[1],
            start_args[2],
            start_args[3],
            start_args[4],
            start_args[5],
            start_args[6],
            gps_stop.heading,
            gps_stop.x_position,
            gps_stop.y_position,
            inertial_stop.heading,
            inertial_stop.rotation,
            gps_cooldown.heading,
            gps_cooldown.x_position,
            gps_cooldown.y_position,
            inertial_cooldown.heading,
            inertial_cooldown.rotation,
            gps_final.heading,
            gps_final.x_position,
            gps_final.y_position,
            inertial_final.heading,
            inertial_final.rotation,
            round(compute_gps_angle(gps_start, gps_stop), 4),
            round(compute_gps_angle(gps_start, gps_cooldown), 4),
            round(compute_gps_angle(gps_start, gps_final), 4),
            round(compute_inertial_angle(inertial_start, inertial_stop), 4),
            round(compute_inertial_angle(inertial_start, inertial_cooldown), 4),
            round(compute_inertial_angle(inertial_start, inertial_final), 4),
            round(inertial_stop.rotation - inertial_start.rotation, 4),
            round(inertial_cooldown.rotation - inertial_start.rotation, 4),
            round(inertial_final.rotation - inertial_start.rotation, 4),
            round(compute_gps_distance(gps_start, gps_stop), 4),
            round(compute_gps_distance(gps_start, gps_cooldown), 4),
            round(compute_gps_distance(gps_start, gps_final), 4),
        )
