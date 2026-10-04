"""Get Bright Roots back from its backup.

Downloads the newest database copy and every uploaded file into a folder. It uses the same BACKUP_S3_*
settings as the site, so run it somewhere those are set (the server, or your own computer with a .env file).

    python restore_backup.py --to ./restored
    python restore_backup.py --to ./restored --date 2026-10-18     (the last copy on or before that day)

You end up with:
    ./restored/homeschool.db      the database
    ./restored/uploads/...        every photo and file

To put it on a server: stop the backend, copy homeschool.db and the uploads folder into the data folder
(where DATABASE_URL points), and start the backend again.
"""
import argparse
import sys
from datetime import date

import backups


def main() -> int:
    parser = argparse.ArgumentParser(description="Download the latest Bright Roots backup into a folder.")
    parser.add_argument("--to", required=True, help="folder to restore into")
    parser.add_argument("--date", help="use the last database copy on or before this day (YYYY-MM-DD)")
    args = parser.parse_args()
    if not backups.configured():
        print("Backups are not set up: the BACKUP_S3_* settings are missing.")
        return 1
    day = date.fromisoformat(args.date) if args.date else None
    result = backups.restore(backups.S3Store(), args.to, day)
    print(f"Restored {result['database']} and {result['files']} uploaded file(s) into {args.to}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
