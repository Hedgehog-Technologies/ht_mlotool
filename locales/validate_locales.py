#!/usr/bin/env python3
"""
validate_locales.py

Validate JSON syntax and key parity for locale files against en.json.

Usage:
  python validate_locales.py [--dir PATH] [--base BASE_FILENAME] [--report-json OUTFILE]

Exit code:
  0 - all files parsed and keys match base
  1 - any parse error or key mismatches found

This script intentionally keeps dependencies to the Python standard library.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Dict, List, Set


def load_json(path: Path) -> Dict:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def main(argv: List[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Validate locale JSON files vs en.json")
    p.add_argument("--dir", "-d", default=Path(__file__).parent, type=Path,
                   help="Directory containing locale JSON files (default: script dir)")
    p.add_argument("--base", "-b", default="en.json",
                   help="Filename of base locale (defaults to en.json)")
    p.add_argument("--report-json", "-r", default=None,
                   help="Write machine-readable JSON report to this path")
    args = p.parse_args(argv)

    locales_dir: Path = args.dir
    base_name: str = args.base
    report_out = Path(args.report_json) if args.report_json else None

    if not locales_dir.exists() or not locales_dir.is_dir():
        print(f"ERROR: locales directory does not exist: {locales_dir}")
        return 1

    base_path = locales_dir / base_name
    if not base_path.exists():
        print(f"ERROR: base file not found: {base_path}")
        return 1

    errors = []
    report = {"files": {}, "summary": {}}

    # Load base
    try:
        base = load_json(base_path)
    except Exception as e:
        print(f"ERROR: failed to parse base file {base_path}: {e}")
        return 1

    base_keys: Set[str] = set(base.keys())

    json_files = sorted([p for p in locales_dir.glob("*.json")])
    for jf in json_files:
        name = jf.name
        info = {"parse_error": None, "missing_keys": [], "extra_keys": []}
        try:
            data = load_json(jf)
        except Exception as e:
            msg = str(e)
            info["parse_error"] = msg
            errors.append((name, "parse", msg))
            report["files"][name] = info
            print(f"PARSE ERROR: {name}: {msg}")
            continue

        keys = set(data.keys())
        missing = sorted(list(base_keys - keys))
        extra = sorted(list(keys - base_keys))
        info["missing_keys"] = missing
        info["extra_keys"] = extra

        if missing:
            errors.append((name, "missing", missing))
            print(f"MISSING KEYS in {name}: {len(missing)}")
            for k in missing[:20]:
                print(f"  - {k}")
            if len(missing) > 20:
                print(f"  ... and {len(missing)-20} more")

        if extra:
            errors.append((name, "extra", extra))
            print(f"EXTRA KEYS in {name}: {len(extra)}")
            for k in extra[:20]:
                print(f"  + {k}")
            if len(extra) > 20:
                print(f"  ... and {len(extra)-20} more")

        if not info["parse_error"] and not missing and not extra:
            print(f"OK: {name} (parsed, keys match)")

        report["files"][name] = info

    summary = {
        "files_checked": len(json_files),
        "issues_found": len(errors),
    }
    report["summary"] = summary

    print("\nSummary:")
    print(f"  Files checked: {summary['files_checked']}")
    print(f"  Issues found : {summary['issues_found']}")

    if report_out:
        try:
            with report_out.open("w", encoding="utf-8") as f:
                json.dump(report, f, indent=2, ensure_ascii=False)
            print(f"Report written to: {report_out}")
        except Exception as e:
            print(f"Failed to write report to {report_out}: {e}")

    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
