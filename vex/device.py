import sys

is_running_on_device = sys.implementation.name == "micropython"
"""Whether program is running on VEX device"""
