from lib.tele import *
from lib.inertial import *
from lib.geometry import *

# Red cartridge: GearSetting.RATIO_36_1, 100 RPM
# Green cartridge: GearSetting.RATIO_18_1, 200 RPM
# Blue cartridge: GearSetting.RATIO_6_1, 600 RPM

MOTOR_DIRECTION = False

INERTIAL_ROTATION_SCALE = 1.0135

DRIVERTRAIN_DIMENSIONS = FlatDimensions(460, 460)

DRIVERTRAIN_RADIUS = compute_dimensions_radius(DRIVERTRAIN_DIMENSIONS)

controller = TeleController(PRIMARY)
inertial = TeleInertial(Ports.PORT18, rotation_scale=INERTIAL_ROTATION_SCALE)

motor_lf = TeleMotor(
    Ports.PORT11, GearSetting.RATIO_6_1, MOTOR_DIRECTION, name="motor_lf"
)
motor_lc = TeleMotor(
    Ports.PORT16, GearSetting.RATIO_6_1, MOTOR_DIRECTION, name="motor_cf"
)
motor_lb = TeleMotor(
    Ports.PORT20, GearSetting.RATIO_6_1, MOTOR_DIRECTION, name="motor_lb"
)

motor_rf = TeleMotor(
    Ports.PORT1, GearSetting.RATIO_6_1, not MOTOR_DIRECTION, name="motor_rf"
)
motor_rc = TeleMotor(
    Ports.PORT6, GearSetting.RATIO_6_1, not MOTOR_DIRECTION, name="motor_rc"
)
motor_rb = TeleMotor(
    Ports.PORT10, GearSetting.RATIO_6_1, not MOTOR_DIRECTION, name="motor_rb"
)

motors = {
    "motor_lf": motor_lf,
    "motor_lc": motor_lc,
    "motor_lb": motor_lb,
    "motor_rf": motor_rf,
    "motor_rc": motor_rc,
    "motor_rb": motor_rb,
}

gps = TeleGps(Ports.PORT19, name="gps")


def calibrate_inertial_and_gps():
    """Calibrate both inertial and GPS sensors"""
    _ = inertial.get_state()
    inertial.calibrate()
    while inertial.is_calibrating():
        wait(100, MSEC)
    _ = inertial.get_state()

    _ = gps.get_state()
    gps.calibrate()
    while gps.is_calibrating():
        wait(100, MSEC)
    _ = gps.get_state()

    inertial.set_heading(gps.heading())
