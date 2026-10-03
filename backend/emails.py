"""Every email Bright Roots sends, in one look.

`layout()` wraps a message in the Bright Roots design: cream background, the house mark, a white card,
a green button and a quiet footer. It uses tables and inline styles because that is what email apps
(Outlook, Gmail, Apple Mail) display reliably. `send()` hands the finished email to Resend.
"""
import base64
import html
import os
import re
from typing import Optional

import httpx

from config import settings

GREEN = "#2F5D3A"
DEEP = "#24452C"
INK = "#2E342F"
EARTH = "#6E5A46"
CREAM = "#F6F1E6"
LINE = "#E4DCCD"
FONT = "'Segoe UI',Helvetica,Arial,sans-serif"
SERIF = "Georgia,'Times New Roman',serif"


# The logo travels inside each email (an inline attachment) instead of being fetched from the website.
# Email providers fetch pictures through their own servers, and those requests can be turned away.
LOGO_CID = "brightroots-logo"
_LOGO_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets", "email-logo.png")
try:
    with open(_LOGO_PATH, "rb") as _f:
        _LOGO_B64 = base64.b64encode(_f.read()).decode()
except OSError:
    _LOGO_B64 = ""


def for_browser(body_html: str) -> str:
    """The same email for showing on a web page, where an attached picture can't be used."""
    return body_html.replace(f"cid:{LOGO_CID}", f"data:image/png;base64,{_LOGO_B64}")


def configured() -> bool:
    return bool(settings.RESEND_API_KEY and settings.RESEND_FROM_EMAIL)


def site() -> str:
    return settings.FRONTEND_URL.rstrip("/")


def plain_text(body_html: str) -> str:
    """A plain-text copy of an email. Spam filters trust emails more when they carry one alongside the designed version."""
    text = re.sub(r"<(head|style|script)\b.*?</\1>", "", body_html, flags=re.S | re.I)
    text = re.sub(r'<div style="display:none.*?</div>', "", text, flags=re.S)  # the hidden inbox preview line
    text = re.sub(r'<a\b[^>]*href="([^"]+)"[^>]*>(.*?)</a>', lambda m: f"{m.group(2)} ({html.unescape(m.group(1))})", text, flags=re.S | re.I)
    text = re.sub(r"<li\b[^>]*>", "\n- ", text, flags=re.I)
    text = re.sub(r"</(p|h1|h2|h3|tr|ul|ol|table|div)>|<br\s*/?>", "\n", text, flags=re.I)
    text = html.unescape(re.sub(r"<[^>]+>", "", text))
    lines = [re.sub(r"[ \t\xa0]+", " ", line).strip() for line in text.split("\n")]
    out, blank = [], True
    for line in lines:
        if line:
            out.append(line)
            blank = False
        elif not blank:
            out.append("")
            blank = True
    return "\n".join(out).strip() + "\n"


def send(to: str, subject: str, body_html: str, unsubscribe_url: Optional[str] = None) -> None:
    payload = {"from": settings.RESEND_FROM_EMAIL, "to": [to], "subject": subject, "html": body_html, "text": plain_text(body_html)}
    if unsubscribe_url:
        payload["headers"] = {"List-Unsubscribe": f"<{unsubscribe_url}>"}
    if _LOGO_B64 and f"cid:{LOGO_CID}" in body_html:
        payload["attachments"] = [{"filename": "bright-roots.png", "content": _LOGO_B64, "content_type": "image/png", "content_id": LOGO_CID}]
    response = httpx.post(
        "https://api.resend.com/emails",
        headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}", "Content-Type": "application/json"},
        json=payload,
        timeout=15.0,
    )
    response.raise_for_status()


def button(label: str, url: str) -> str:
    return (
        f'<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 8px"><tr>'
        f'<td style="background:{GREEN};border-radius:999px">'
        f'<a href="{html.escape(url, quote=True)}" style="display:inline-block;padding:13px 28px;font-family:{FONT};font-size:15px;'
        f'font-weight:700;color:#ffffff;text-decoration:none">{html.escape(label)}</a></td></tr></table>'
    )


def paragraph(text_html: str, small: bool = False) -> str:
    size, colour = ("13px", EARTH) if small else ("15px", INK)
    return f'<p style="margin:0 0 14px;font-family:{FONT};font-size:{size};line-height:1.6;color:{colour}">{text_html}</p>'


def steps(items: list[tuple[str, str]]) -> str:
    """A numbered list of (title, detail) pairs."""
    rows = "".join(
        f'<tr><td valign="top" style="padding:0 12px 14px 0"><div style="width:28px;height:28px;border-radius:14px;background:#E3E7D9;'
        f'font-family:{FONT};font-size:14px;font-weight:700;line-height:28px;text-align:center;color:{DEEP}">{n}</div></td>'
        f'<td valign="top" style="padding:0 0 14px;font-family:{FONT};font-size:15px;line-height:1.5;color:{INK}">'
        f'<strong>{html.escape(title)}</strong><br><span style="color:{EARTH}">{html.escape(detail)}</span></td></tr>'
        for n, (title, detail) in enumerate(items, 1)
    )
    return f'<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 4px">{rows}</table>'


def panel(inner_html: str) -> str:
    return (
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px"><tr>'
        f'<td style="background:#F4F1E8;border:1px solid {LINE};border-radius:14px;padding:16px 18px">{inner_html}</td></tr></table>'
    )


def _logo_html() -> str:
    if not _LOGO_B64:
        return ""
    return f'<img src="cid:{LOGO_CID}" width="50" alt="Bright Roots" style="display:block;margin:0 auto 6px;border:0">'


def layout(title: str, body_html: str, *, preview: str = "", eyebrow: str = "", footer: str = "") -> str:
    """The whole email. `preview` is the line inboxes show after the subject; `footer` says why they got it."""
    hidden = (
        f'<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:{CREAM}">{html.escape(preview)}</div>' if preview else ""
    )
    eyebrow_html = (
        f'<p style="margin:0 0 8px;font-family:{FONT};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;'
        f'color:#8FA382">{html.escape(eyebrow)}</p>' if eyebrow else ""
    )
    return f"""<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{html.escape(title)}</title></head>
<body style="margin:0;padding:0;background:{CREAM}">
{hidden}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:{CREAM}">
  <tr><td align="center" style="padding:28px 14px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px">
      <tr><td align="center" style="padding:0 0 18px">
        <a href="{site()}" style="text-decoration:none">
{_logo_html()}
          <span style="font-family:{SERIF};font-size:21px;font-weight:700;color:{DEEP}">Bright Roots</span>
        </a>
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid {LINE};border-radius:20px;padding:30px 28px 24px">
        {eyebrow_html}
        <h1 style="margin:0 0 16px;font-family:{SERIF};font-size:25px;line-height:1.25;font-weight:700;color:{DEEP}">{html.escape(title)}</h1>
        {body_html}
      </td></tr>
      <tr><td align="center" style="padding:18px 16px 0;font-family:{FONT};font-size:12px;line-height:1.6;color:#8A7A69">
        {footer}
        <div style="margin-top:6px">Bright Roots Home Learning &middot; <a href="{site()}" style="color:#8A7A69">brightrootshomelearning.co.uk</a></div>
        <div style="margin-top:2px;font-family:{SERIF};font-style:italic;color:#9DB08F">Learn &middot; Grow &middot; Belong</div>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>"""


# ---------- the account emails ----------

def welcome_email(name: str, verify_url: str, trial_days: int) -> tuple[str, str]:
    """Sent the moment someone signs up: a welcome, and the button that confirms their email address."""
    body = (
        paragraph(f"Hi {html.escape(name)},")
        + paragraph(
            "Thank you for joining Bright Roots. It was built by a home-educating parent to take the organising off "
            "your plate, so there is more time for learning together."
        )
        + paragraph(f"Your <strong>{trial_days}-day free trial</strong> starts as soon as you confirm your email address. No card is needed.")
        + button("Confirm my email", verify_url)
        + paragraph("This link works for 24 hours.", small=True)
        + panel(
            paragraph("<strong>What happens next</strong>")
            + steps([
                ("Add your children", "Each child gets their own login and their own Today page."),
                ("Set your timetable", "Choose the subjects you teach on each day."),
                ("Fill your first week", "Use the ready-made starter week of Oak National Academy lessons, or add your own."),
            ])
        )
        + paragraph("If you didn't sign up for Bright Roots, you can ignore this email and nothing will happen.", small=True)
    )
    return "Welcome to Bright Roots: please confirm your email", layout(
        "Welcome to Bright Roots", body, eyebrow="Your free trial", preview="One click to confirm your email and start your free trial."
    )


def verify_email(verify_url: str) -> tuple[str, str]:
    """Sent when a parent asks for a fresh confirmation link."""
    body = (
        paragraph("Please confirm that this email address belongs to your Bright Roots account.")
        + button("Confirm my email", verify_url)
        + paragraph("This link works for 24 hours. If you didn't expect this email, you can ignore it.", small=True)
    )
    return "Confirm your Bright Roots email", layout("Confirm your email", body, preview="One click to confirm your email address.")


def getting_started_email(name: str) -> tuple[str, str]:
    """Sent once, when a new parent's email is confirmed."""
    body = (
        paragraph(f"Hi {html.escape(name)}, your email is confirmed and your free trial has started.")
        + paragraph("Here is the quickest way to get going. It takes about ten minutes.")
        + steps([
            ("Add each child", "Go to Family, then Children. Give them a name and a password they can remember."),
            ("Set your week", "Go to Plan, then Timetable, and add the subjects you teach on each day."),
            ("Add the starter week", "Open the Planner and press “Add the starter week” for a full week of Oak lessons."),
            ("Hand over the logins", "Your children log in on the same page as you and see just their lessons for today."),
        ])
        + button("Open Bright Roots", f"{site()}/parent/dashboard")
        + paragraph(
            f'Stuck on anything? The <a href="{site()}/parent/help" style="color:{GREEN}">how-to guides</a> cover each step, '
            "or just reply to this email and we'll help.",
            small=True,
        )
    )
    return "You're in! Here's how to get started", layout(
        "You're all set", body, eyebrow="Getting started", preview="Four quick steps to plan your first week."
    )


def password_reset_email(reset_url: str) -> tuple[str, str]:
    body = (
        paragraph("We received a request to reset the password for your Bright Roots account.")
        + button("Choose a new password", reset_url)
        + paragraph("This link works for 30 minutes.", small=True)
        + paragraph("If you didn't ask for this, you can ignore this email. Your password stays the same.", small=True)
    )
    return "Reset your Bright Roots password", layout("Reset your password", body, preview="Choose a new password. The link works for 30 minutes.")


def newsletter_confirm_email(confirm_url: str) -> tuple[str, str]:
    body = (
        paragraph("Please confirm you'd like home learning tips and news from Bright Roots.")
        + button("Yes, sign me up", confirm_url)
        + paragraph("If you didn't ask for this, you can ignore this email and you won't be added.", small=True)
    )
    return "Please confirm your Bright Roots newsletter", layout("Confirm your newsletter", body, eyebrow="Newsletter", preview="One click to confirm.")
