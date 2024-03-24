from vex import *

AnalogUnits_values = (
    AnalogUnits.PCT,
    AnalogUnits.EIGHTBIT,
    AnalogUnits.TENBIT,
    AnalogUnits.TWELVEBIT,
    AnalogUnits.MV,
)
"""enum values for AnalogUnits"""

AxisType_values = (AxisType.XAXIS, AxisType.YAXIS, AxisType.ZAXIS)
"""enum values for AxisType"""

BrakeType_values = (BrakeType.COAST, BrakeType.BRAKE, BrakeType.HOLD)
"""enum values for BrakeType"""

ControllerType_values = (ControllerType.PRIMARY, ControllerType.PARTNER)
"""enum values for ControllerType"""

CurrentUnits_values = (CurrentUnits.AMP,)
"""enum values for CurrentUnits"""

DirectionType_values = (
    DirectionType.FORWARD,
    DirectionType.REVERSE,
    DirectionType.UNDEFINED,
)
"""enum values for DirectionType"""

DistanceUnits_values = (DistanceUnits.MM, DistanceUnits.IN, DistanceUnits.CM)
"""enum values for DistanceUnits"""

FontType_values = (
    FontType.MONO20,
    FontType.MONO30,
    FontType.MONO40,
    FontType.MONO60,
    FontType.PROP20,
    FontType.PROP30,
    FontType.PROP40,
    FontType.PROP60,
    FontType.MONO15,
    FontType.MONO12,
    FontType.CJK16,
)
"""enum values for FontType"""

GearSetting_values = (
    GearSetting.RATIO_36_1,
    GearSetting.RATIO_18_1,
    GearSetting.RATIO_6_1,
)
"""enum values for GearSetting"""

GestureType_values = (
    GestureType.NONE,
    GestureType.UP,
    GestureType.DOWN,
    GestureType.LEFT,
    GestureType.RIGHT,
)
"""enum values for GestureType"""

LedStateType_values = (LedStateType.OFF, LedStateType.ON, LedStateType.BLINK)
"""enum values for LedStateType"""

ObjectSizeType_values = (
    ObjectSizeType.NONE,
    ObjectSizeType.SMALL,
    ObjectSizeType.MEDIUM,
    ObjectSizeType.LARGE,
)
"""enum values for ObjectSizeType"""

OrientationType_values = (
    OrientationType.ROLL,
    OrientationType.PITCH,
    OrientationType.YAW,
)
"""enum values for OrientationType"""

PercentUnits_values = (PercentUnits.PERCENT,)
"""enum values for PercentUnits"""

PowerUnits_values = (PowerUnits.WATT,)
"""enum values for PowerUnits"""

RotationUnits_values = (
    RotationUnits.DEG,
    RotationUnits.REV,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    None,
    RotationUnits.RAW,
)
"""enum values for RotationUnits"""

TemperatureUnits_values = (TemperatureUnits.CELSIUS, TemperatureUnits.FAHRENHEIT)
"""enum values for TemperatureUnits"""

ThreeWireType_values = (
    ThreeWireType.ANALOG_IN,
    ThreeWireType.ANALOG_OUT,
    ThreeWireType.DIGITAL_IN,
    ThreeWireType.DIGITAL_OUT,
    ThreeWireType.SWITCH,
    ThreeWireType.POTENTIOMETER,
    ThreeWireType.LINE_SENSOR,
    ThreeWireType.LIGHT_SENSOR,
    ThreeWireType.GYRO,
    ThreeWireType.ACCELEROMETER,
    ThreeWireType.MOTOR,
    ThreeWireType.SERVO,
    ThreeWireType.ENCODER,
    ThreeWireType.SONAR,
    ThreeWireType.SLEW_MOTOR,
)
"""enum values for ThreeWireType"""

TimeUnits_values = (TimeUnits.SECONDS, TimeUnits.MSEC)
"""enum values for TimeUnits"""

TorqueUnits_values = (TorqueUnits.NM, TorqueUnits.INLB)
"""enum values for TorqueUnits"""

TurnType_values = (TurnType.LEFT, TurnType.RIGHT, TurnType.UNDEFINED)
"""enum values for TurnType"""

VelocityUnits_values = (VelocityUnits.PERCENT, VelocityUnits.RPM, VelocityUnits.DPS)
"""enum values for VelocityUnits"""

VexlinkType_values = (
    None,
    VexlinkType.MANAGER,
    VexlinkType.WORKER,
    VexlinkType.GENERIC,
)
"""enum values for VexlinkType"""

VoltageUnits_values = (VoltageUnits.VOLT, VoltageUnits.MV)
"""enum values for VoltageUnits"""
