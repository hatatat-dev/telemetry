#!/usr/bin/env -S PYTHONPATH=. python3

import sys
import vex

print("from vex import *")

for cls in dir(vex):
    outer = getattr(vex, cls)

    if type(outer) != type:
        continue

    inner = getattr(outer, cls, None)
    if not inner:
        continue

    if type(inner) != type:
        continue

    if vex.vexEnum not in inner.__mro__:  # type: ignore
        continue

    names = []

    for name in dir(outer):
        if name.startswith("_"):
            continue

        value = getattr(outer, name)
        if not isinstance(value, inner):
            continue

        while len(names) <= value.value:
            names.append(None)

        if names[value.value] is not None:
            print(
                f"duplicate names for value {value.value} in {cls}: "
                + f"{names[value.value]}, {name}",
                file=sys.stderr,
            )
        else:
            names[value.value] = name

    if not names:
        print(f"no values for {cls}", file=sys.stderr)
    else:
        print()
        print(
            f'{cls}_values = ('
            + ", ".join(f"{cls}.{name}" if name else "None" for name in names)
            + ("," if len(names) == 1 else "")
            + ")"
        )
        print(f'"""enum values for {cls}"""')
