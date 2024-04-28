#!/usr/bin/env -S PYTHONPATH=. python3

import argparse
import re
from pathlib import Path
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
    default=Path("build") / "preprocessed.py",
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
    default="vex",
    help="comma-separated list of external modules to keep imported as-is",
)
parser.add_argument(
    "--implicit",
    default="typing",
    help="comma-separated list of modules that are available implicitly with micropython",
)
parser.add_argument("--import-path", type=Path, default=Path(__file__).parent.parent)
parser.add_argument("program", type=Path)


args = parser.parse_args()


IMPORT_PATTERN = re.compile(
    r"^from[ \t]+(?P<module>[\w.]+)[ \t]+import[ \t]*\*(?P<comment>[ \t]*(?:#.*)?)$",
    re.MULTILINE,
)

# To avoid overwriting accidental edits to preprocessed file, a signature line is added at the top
# with a hexadecimal hash of the remaining content
SIGNATURE_PREFIX = "#!/usr/bin/env -S PYTHONPATH=. python3\n# signature "
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


if not args.overwrite and args.preprocessed.exists():
    # Verify signature of the existing preprocessed file
    with open(args.preprocessed) as file:
        try:
            verify_signature(file.read())
        except Exception as e:
            raise Exception(
                f"will not overwrite possible edits in the existing file {args.preprocessed}: {e}"
            )

imported_modules = set()

external_modules = set(filter(None, args.external.split(",")))

implicit_modules = set(filter(None, args.implicit.split(",")))


def import_module(module: str, comment: str = "") -> str:
    if module in imported_modules:
        return f"# module {module} already imported\n"

    imported_modules.add(module)

    if module in external_modules:
        return f"# external module {module}\n" + f"from {module} import *{comment}\n"

    if module in implicit_modules:
        return (
            f"# implicit module {module}\n"
            "from sys import implementation as _sys_implementation\n"
            + 'if _sys_implementation.name != "micropython":\n'
            + f"    from {module} import *{comment}\n"
        )

    module_path: Path = (args.import_path / Path(*module.split("."))).with_suffix(".py")

    if not module_path.exists():
        raise Exception(f"Module {module} file does not exist at {module_path}")

    with open(module_path) as module_file:
        return (
            f"# begin module {module}\n\n"
            + IMPORT_PATTERN.sub(
                lambda m: import_module(m["module"], m["comment"]),
                module_file.read(),
            )
            + f"\n# end module {module}\n"
        )


if not args.program.exists():
    raise Exception(f"Program does not exist at {args.program}")

with open(args.program) as program_file:
    content = (
        f"# begin program {args.program}\n\n"
        + IMPORT_PATTERN.sub(
            lambda m: import_module(m["module"], m["comment"]), program_file.read()
        )
        + f"\n# end program {args.program}\n"
    )


if args.sign:
    # Add signature line at the top
    content = sign_content(content)

if args.preprocessed.exists():
    # Add write permissions to the file
    args.preprocessed.chmod(args.preprocessed.stat().st_mode | stat.S_IWUSR)

    # Delete existing preprocessed file
    args.preprocessed.unlink()

# Create parent directory for the preprocessed file, if it doesn't exist
args.preprocessed.parent.mkdir(parents=True, exist_ok=True)

with open(args.preprocessed, "w") as file:
    # Write preprocessed content to the file
    file.write(content)

if args.read_only:
    # Remove write permissions to the file
    args.preprocessed.chmod(args.preprocessed.stat().st_mode & ~stat.S_IWUSR)

if args.executable:
    # Add executable permissions to the file
    args.preprocessed.chmod(
        args.preprocessed.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH
    )
