#!/usr/bin/python3

import argparse
import re
from pathlib import Path
import shlex
import subprocess

parser = argparse.ArgumentParser(description="Deploy Python program to VEX Brain")
parser.add_argument(
    "--vexcom",
    type=Path,
    default="~/.vscode/extensions/vexrobotics.vexcode-0.5.0/resources/tools/vexcom/osx/vexcom",
)
parser.add_argument("--preprocessed", type=Path, default="preprocessed.py")
parser.add_argument("--slot", type=int, default=1)
parser.add_argument("--chan", type=int, default=1)
parser.add_argument("--name", default="preprocessed")
parser.add_argument("program", type=Path)


def load_file(path: Path) -> str:
    with open(path) as file:
        return (
            f'# begin "{path}"\n\n'
            + re.sub(
                r"^[ \t]*from[ \t]+(\w+)[ \t]+import[ \t]*\*[ \t]*(#.*)?$",
                lambda m: (
                    (
                        f"# begin inline `{m[0]}`\n\n"
                        + load_file(path.parent / f"{m[1]}.py")
                        + f"\n# end inline `{m[0]}`"
                    )
                    if (path.parent / f"{m[1]}.py").exists()
                    else m[0]
                ),
                file.read(),
                flags=re.MULTILINE,
            )
            + f'\n# end "{path}"\n'
        )


args = parser.parse_args()
args.vexcom = args.vexcom.expanduser()

with open(args.preprocessed, "w") as file:
    file.write(load_file(args.program))

vexcom_stop = [
    str(args.vexcom),
    "--json",
    "--progress",
    "--chan",
    str(args.chan),
    "--stop",
]

print(shlex.join(vexcom_stop))

subprocess.run(vexcom_stop)

vexcom_write = [
    str(args.vexcom),
    "--name",
    args.name,
    "--slot",
    str(args.slot),
    "--write",
    str(args.preprocessed),
    "--progress",
    "--json",
    "--chan",
    str(args.chan),
    "--progress",
]

print(shlex.join(vexcom_write))

subprocess.run(vexcom_write)
