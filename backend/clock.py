"""What day it is for the families using the site, whatever clock the server is set to."""
from datetime import date, datetime
from zoneinfo import ZoneInfo

UK = ZoneInfo("Europe/London")


def uk_today() -> date:
    """Today's date in the UK. A server on UTC is a day behind for an hour after midnight in summer."""
    return datetime.now(UK).date()
