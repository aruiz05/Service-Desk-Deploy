from datetime import UTC, datetime, timedelta
import hmac
import os
from typing import Any

import bcrypt
import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import InvalidTokenError


ADMIN_ROLE = "admin"
DEFAULT_TOKEN_EXPIRE_MINUTES = 60
TOKEN_ALGORITHM = "HS256"

bearer_scheme = HTTPBearer(auto_error=False)


def get_admin_username() -> str | None:
    value = os.getenv("ADMIN_USERNAME")
    if value is None or not value.strip():
        return None
    return value


def get_admin_password_hash() -> str | None:
    value = os.getenv("ADMIN_PASSWORD_HASH")
    if value is None or not value.strip():
        return None
    return value


def get_admin_token_secret() -> str | None:
    value = os.getenv("ADMIN_TOKEN_SECRET")
    if value is None or not value.strip():
        return None
    return value


def get_token_expire_minutes() -> int:
    try:
        value = int(
            os.getenv(
                "ADMIN_TOKEN_EXPIRE_MINUTES",
                str(DEFAULT_TOKEN_EXPIRE_MINUTES),
            )
        )
    except ValueError:
        return DEFAULT_TOKEN_EXPIRE_MINUTES

    if value <= 0:
        return DEFAULT_TOKEN_EXPIRE_MINUTES

    return value


def get_token_expire_seconds() -> int:
    return get_token_expire_minutes() * 60


def is_admin_auth_configured() -> bool:
    return all(
        [
            get_admin_username(),
            get_admin_password_hash(),
            get_admin_token_secret(),
        ]
    )


def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except ValueError:
        return False


def verify_admin_credentials(username: str, password: str) -> bool:
    configured_username = get_admin_username()
    password_hash = get_admin_password_hash()

    if not configured_username or not password_hash:
        return False

    username_matches = hmac.compare_digest(username, configured_username)
    password_matches = verify_password(password, password_hash)

    return username_matches and password_matches


def create_admin_access_token() -> str:
    username = get_admin_username()
    secret = get_admin_token_secret()
    if not username or not secret:
        raise RuntimeError("Admin authentication is not configured.")

    now = datetime.now(UTC)
    expires_at = now + timedelta(minutes=get_token_expire_minutes())
    payload: dict[str, Any] = {
        "sub": username,
        "role": ADMIN_ROLE,
        "iat": int(now.timestamp()),
        "exp": expires_at,
    }
    return jwt.encode(payload, secret, algorithm=TOKEN_ALGORITHM)


def decode_admin_access_token(token: str) -> dict[str, Any] | None:
    username = get_admin_username()
    secret = get_admin_token_secret()
    if not username or not secret:
        return None

    try:
        payload = jwt.decode(token, secret, algorithms=[TOKEN_ALGORITHM])
    except InvalidTokenError:
        return None

    if payload.get("role") != ADMIN_ROLE:
        return None

    subject = payload.get("sub")
    if not isinstance(subject, str):
        return None

    if not hmac.compare_digest(subject, username):
        return None

    return payload


def is_admin_token(token: str | None) -> bool:
    if not token:
        return False

    return decode_admin_access_token(token) is not None


def get_optional_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> bool:
    if credentials is None:
        return False

    return is_admin_token(credentials.credentials)
