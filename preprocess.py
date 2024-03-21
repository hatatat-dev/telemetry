#!/usr/bin/env python3

import argparse
import re
from pathlib import Path
import shlex
import subprocess
import hashlib
import stat
from typing import Set

parser = argparse.ArgumentParser(
    description="Preprocess Python program by replacing `from <module> import *` statements "
    + "with the content of <module>.py"
)
parser.add_argument(
    "--preprocessed",
    type=Path,
    default="vex/preprocessed.py",
    help="name of the preprocessed file",
)
parser.add_argument(
    "--sign", action="store_true", default=True, help="sign preprocessed file"
)
parser.add_argument("--no-sign", dest="sign", action="store_false")
parser.add_argument(
    "--overwrite",
    action="store_true",
    default=False,
    help="overwrite edits in preprocessed file",
)
parser.add_argument("--no-overwrite", dest="overwrite", action="store_false")
parser.add_argument(
    "--write",
    action="store_true",
    default=False,
    help="write preprocessed file to VEX Brain",
)
parser.add_argument("--no-write", dest="write", action="store_false")
parser.add_argument(
    "--read-only",
    action="store_true",
    default=True,
    help="after writing, make preprocessed file read-only",
)
parser.add_argument("--no-read-only", dest="read_only", action="store_false")
parser.add_argument(
    "--executable",
    action="store_true",
    default=True,
    help="after writing, make preprocessed file executable",
)
parser.add_argument("--no-executable", dest="executable", action="store_false")
parser.add_argument(
    "--external",
    default="vex,cte",
    help="comma-separated list of external modules to keep imported as-is",
)
parser.add_argument(
    "--vexcom",
    type=Path,
    default="~/.vscode/extensions/vexrobotics.vexcode-0.5.0/resources/tools/vexcom/osx/vexcom",
    help="path to vexcom tool for writing to VEX Brain",
)
parser.add_argument("--slot", type=int, default=1, help="slot for writing to VEX Brain")
parser.add_argument(
    "--chan", type=int, default=1, help="channel for writing to VEX Brain"
)
parser.add_argument(
    "--name", default="preprocessed", help="name for writing to VEX Brain"
)
parser.add_argument("program", type=Path)


def load_file(path: Path, external_modules: Set[str]) -> str:
    """Load a Python file, inlining content for `from <module> import *` statements"""

    imported_modules = set()

    def inner(path: Path) -> str:
        if path in imported_modules:
            return "# already imported\n"

        with open(path) as file:
            imported_modules.add(path)

            return (
                f'# begin "{path}"\n\n'
                + re.sub(
                    r"^[ \t]*from[ \t]+(\w+)[ \t]+import[ \t]*\*[ \t]*(#.*)?$",
                    lambda m: (
                        (
                            f"# begin inline `{m[0]}`\n\n"
                            + inner(path.parent / f"{m[1]}.py")
                            + f"\n# end inline `{m[0]}`"
                        )
                        if m[1] not in external_modules
                        else m[0]
                    ),
                    file.read(),
                    flags=re.MULTILINE,
                )
                + f'\n# end "{path}"\n'
            )

    return inner(path)


# To avoid overwriting accidental edits to preprocessed file, a signature line is added at the top
# with a hexadecimal hash of the remaining content
SIGNATURE_PREFIX = "#!/usr/bin/env python3\n# signature "
SIGNATURE_SUFFIX = "\n\n"
SIGNATURE_LEN = 64


def sign_content(content: str) -> str:
    """Sign given content by adding a signature line at the top"""
    return (
        SIGNATURE_PREFIX
        + hashlib.sha256(content.encode()).hexdigest()
        + SIGNATURE_SUFFIX
        + content
    )


def verify_signature(content: str) -> None:
    """Verify that the content has a matching singature line at the top"""
    if not content.startswith(SIGNATURE_PREFIX):
        raise Exception(
            f"content does not start with signature prefix {repr(SIGNATURE_PREFIX)}"
        )

    if len(content) < len(SIGNATURE_PREFIX) + SIGNATURE_LEN:
        raise Exception("content does not have signature")

    header_signature = bytes.fromhex(
        content[len(SIGNATURE_PREFIX) : len(SIGNATURE_PREFIX) + SIGNATURE_LEN]
    ).hex()

    if not content[len(SIGNATURE_PREFIX) + SIGNATURE_LEN :].startswith(
        SIGNATURE_SUFFIX
    ):
        raise Exception(
            f"content does not have signature suffix {repr(SIGNATURE_SUFFIX)}"
        )

    body_signature = hashlib.sha256(
        content[
            len(SIGNATURE_PREFIX) + SIGNATURE_LEN + len(SIGNATURE_SUFFIX) :
        ].encode()
    ).hexdigest()

    if header_signature != body_signature:
        raise Exception(
            f"header signature {header_signature} does not match body signature {body_signature}"
        )


args = parser.parse_args()

# Expand ~ in paths to home directory
args.vexcom = args.vexcom.expanduser()
args.preprocessed = args.preprocessed.expanduser()

if not args.overwrite and args.preprocessed.exists():
    # Verify signature of the existing preprocessed file
    with open(args.preprocessed) as file:
        try:
            verify_signature(file.read())
        except Exception as e:
            raise Exception(
                f"will not overwrite possible edits in the existing file {args.preprocessed}: {e}"
            )

# Load program, inlining `from <module> import *` statements
content = load_file(args.program, set(filter(None, args.external.split(","))))

if args.sign:
    # Add signature line at the top
    content = sign_content(content)

if args.preprocessed.exists():
    # Delete existing preprocessed file
    args.preprocessed.unlink()

with open(args.preprocessed, "w") as file:
    # Write preprocessed content to the file
    file.write(content)

if args.read_only:
    # Remove write permissions to the file
    args.preprocessed.chmod(args.preprocessed.stat().st_mode & ~stat.S_IWUSR)

if args.executable:
    # Add executable permissions to the file
    args.preprocessed.chmod(args.preprocessed.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)


if args.write:
    # Also try writing preprocessed file to VEX Brain

    # First, try stopping VEX Brain
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
