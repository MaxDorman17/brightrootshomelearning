"""Error reports to the owner: what goes in one, and what never does."""
import json

from conftest import PASSWORD

DSN = "https://abc123@errors.example.test/7"


def _capture(monkey_target):
    """Swap the real sender for one that keeps the reports, and switch reporting on."""
    import error_reports
    from config import settings

    sent = []
    real_send, real_dsn = error_reports.send, settings.GLITCHTIP_DSN
    error_reports.send = lambda event: sent.append(event) or True
    settings.GLITCHTIP_DSN = DSN
    error_reports._sent_at.clear()

    def restore():
        error_reports.send, settings.GLITCHTIP_DSN = real_send, real_dsn

    return sent, restore


def test_a_dsn_becomes_the_right_address_and_key():
    import error_reports

    assert error_reports._endpoint(DSN) == ("https://errors.example.test/api/7/store/", "abc123")
    assert error_reports._endpoint("") is None and error_reports._endpoint("not a dsn") is None


def test_nothing_is_sent_when_reporting_is_off():
    import error_reports
    from config import settings

    assert settings.GLITCHTIP_DSN == "" and not error_reports.configured()
    assert error_reports.report(ValueError("x"), "GET", "/api/thing") is None


def test_a_server_error_is_reported_without_any_family_details(family):
    from config import settings

    child = family.add_child("Private Name")
    sent, restore = _capture(None)
    real_admins = settings.ADMIN_EMAILS
    settings.ADMIN_EMAILS = family.email
    try:
        try:
            family.parent.post("/api/backup/test-error-report?secret=in-the-address")
            raise AssertionError("the test route should have failed")
        except RuntimeError:
            pass
        for thread in __import__("threading").enumerate():
            if thread.daemon and thread.is_alive() and thread is not __import__("threading").current_thread():
                thread.join(timeout=2)
    finally:
        settings.ADMIN_EMAILS = real_admins
        restore()

    assert len(sent) == 1
    event = sent[0]
    assert event["transaction"] == "POST /api/backup/test-error-report"
    error = event["exception"]["values"][0]
    assert error["type"] == "RuntimeError" and "on purpose" in error["value"]
    assert error["stacktrace"]["frames"][-1]["function"] == "test_error_report"
    # No request details, cookies, people or addresses are in the report at all.
    assert "request" not in event and "user" not in event
    text = json.dumps(event)
    for private in (family.email, child["username"], "Private Name", PASSWORD, "in-the-address", "cookie"):
        assert private not in text, private


def test_a_route_with_a_private_value_is_reported_by_its_pattern():
    import error_reports

    event = error_reports.build_event(KeyError("boom"), "GET", "/api/children/{child_id}")
    assert event["transaction"] == "GET /api/children/{child_id}" and event["tags"]["route"] == "/api/children/{child_id}"


def test_a_burst_of_errors_is_capped():
    import error_reports

    sent, restore = _capture(None)
    try:
        threads = [error_reports.report(ValueError(str(i)), "GET", "/x") for i in range(error_reports.MAX_PER_MINUTE + 5)]
        for thread in threads:
            if thread:
                thread.join(timeout=2)
        assert len([t for t in threads if t]) == error_reports.MAX_PER_MINUTE
        assert len(sent) == error_reports.MAX_PER_MINUTE
    finally:
        restore()
        error_reports._sent_at.clear()


def test_only_the_owner_can_trigger_the_test_error(family):
    assert family.parent.post("/api/backup/test-error-report").status_code == 403
