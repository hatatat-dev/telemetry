#!/usr/bin/env -S PYTHONPATH=.:lib python3

import argparse
from pathlib import Path
import os
import sys
import shutil

EXTENSIONS_DIRECTORY = (
    Path(os.path.expandvars("%USERPROFILE%" if sys.platform == "win32" else "$HOME"))
    / ".vscode"
    / "extensions"
)

EXTENSION_VERSION = "0.5.0"

DIST_DIRECTORY = (
    EXTENSIONS_DIRECTORY / f"vexrobotics.vexcode-{EXTENSION_VERSION}" / "dist"
)

parser = argparse.ArgumentParser(
    description="Extends VEX Visual Studio Code Extension with telemetry"
)
parser.add_argument(
    "--target",
    type=Path,
    default=DIST_DIRECTORY / "extension.js",
    help="extension.js target filename",
)
parser.add_argument(
    "--backup",
    type=Path,
    default=DIST_DIRECTORY / "extension.js.bak",
    help="extension.js backup filename",
)
parser.add_argument("--no-backup", dest="backup", action="store_const", const=None)
parser.add_argument(
    "--source",
    type=Path,
    default=Path("extension.js"),
    help="extension.js source filename",
)
parser.add_argument(
    "--force-backup",
    action="store_true",
    default=False,
    help="force backup for extension.js target",
)
parser.add_argument("--no-force-backup", dest="force_backup", action="store_false")
parser.add_argument(
    "--restore",
    action="store_true",
    default=False,
    help="restore extension.js target from backup",
)
parser.add_argument("--no-restore", dest="restore", action="store_false")

args = parser.parse_args()

if args.restore:
    print(f"Copying {args.backup} to {args.target}")
    shutil.copy(args.backup, args.target)
    exit()


if args.target.exists() and args.backup:
    copy_backup = args.force_backup

    if not copy_backup:
        with open(args.target) as target_file:
            first_line = target_file.readline()

        copy_backup = (
            "VEX Visual Studio Code Extension with telemetry" not in first_line
        )

    if copy_backup:
        print(f"Copying {args.target} to {args.backup}")
        shutil.copy(args.target, args.backup)

print(f"Copying {args.source} to {args.target}")
shutil.copy(args.source, args.target)
