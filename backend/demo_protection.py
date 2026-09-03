import os
from typing import Any


DEMO_PROTECTED_TICKET_NUMBERS = {
    f"SEC-{number:06d}" for number in range(4, 34)
}

DEMO_PROTECTED_TICKET_TITLES = {
    "Suspicious Microsoft 365 Password Reset Email",
    "QR Code Login Verification Email",
    "Suspicious Attachment from Unknown Sender",
    "Fake Invoice Approval Request",
    "Phishing Report Button Question",
    "Possible Executive Impersonation Email",
    "Payroll Direct Deposit Change Email",
    "Phone Call Requesting Badge Information",
    "Vendor Impersonation Chat Message",
    "Unusual Text Message About Company Account",
    "Reception Desk Visitor Verification Concern",
    "Possible Password Sharing Concern",
    "Password Reset After Public WiFi Login",
    "Password Manager Setup Assistance",
    "Customer Spreadsheet Shared with External Recipient",
    "Sensitive File Shared to Personal Email",
    "Removable Media Use Question",
    "Confidential Contract Uploaded to Public Folder",
    "Unpatched Browser Version Report",
    "Outdated VPN Client on Workstations",
    "Vulnerable Collaboration Plugin Report",
    "Quarterly Phishing Awareness Training Request",
    "Manager Security Briefing Request",
    "New Hire Security Training Access",
    "Security Awareness Poster Request",
    "Department Cyber Safety Presentation",
    "Repeated MFA Approval Requests",
    "Suspicious Login Notification While Traveling",
    "Account Lockout After Credential Exposure Concern",
    "Security Mailbox Triage Question",
}

DEMO_PROTECTED_KNOWLEDGE_TITLES = {
    "How to Report a Suspicious Email",
    "Recognizing Social Engineering Requests",
    "Password Manager Basics",
    "Handling Sensitive Files",
    "Responding to Unexpected MFA Prompts",
    "Security Training Request Checklist",
    "Office Security Awareness Reminders",
    "When to Open a General Security Ticket",
}

DEFAULT_MAX_EXTRA_TICKETS = 25
DEFAULT_MAX_EXTRA_KNOWLEDGE_ARTICLES = 10


def is_demo_mode_enabled() -> bool:
    value = os.getenv("DEMO_MODE", "").strip().lower()
    return value in {"1", "true", "yes", "on"}


def get_demo_limit(env_name: str, default: int) -> int:
    try:
        value = int(os.getenv(env_name, str(default)))
    except ValueError:
        return default

    if value < 0:
        return default

    return value


def get_max_extra_tickets() -> int:
    return get_demo_limit("DEMO_MAX_EXTRA_TICKETS", DEFAULT_MAX_EXTRA_TICKETS)


def get_max_extra_knowledge_articles() -> int:
    return get_demo_limit(
        "DEMO_MAX_EXTRA_KNOWLEDGE_ARTICLES",
        DEFAULT_MAX_EXTRA_KNOWLEDGE_ARTICLES,
    )


def is_protected_ticket(ticket: Any) -> bool:
    if not is_demo_mode_enabled():
        return False

    return getattr(ticket, "title", None) in DEMO_PROTECTED_TICKET_TITLES


def is_protected_ticket_title(title: str | None) -> bool:
    return title in DEMO_PROTECTED_TICKET_TITLES


def is_protected_knowledge_article(article: Any) -> bool:
    if not is_demo_mode_enabled():
        return False

    return getattr(article, "title", None) in DEMO_PROTECTED_KNOWLEDGE_TITLES


def is_protected_knowledge_title(title: str | None) -> bool:
    return title in DEMO_PROTECTED_KNOWLEDGE_TITLES
