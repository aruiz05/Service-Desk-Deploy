
from collections.abc import Generator
import os
from urllib.parse import urlsplit, urlunsplit

# SQLAlchemy creates the database engine and manages database sessions
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker


DEFAULT_DATABASE_URL = "sqlite:///./cybersecurity_service_desk.db"


def normalize_database_url(database_url: str) -> str:
    parsed_url = urlsplit(database_url)

    if parsed_url.scheme in {"postgres", "postgresql"}:
        return urlunsplit(
            (
                "postgresql+psycopg",
                parsed_url.netloc,
                parsed_url.path,
                parsed_url.query,
                parsed_url.fragment,
            )
        )

    return database_url


def is_sqlite_url(database_url: str) -> bool:
    return urlsplit(database_url).scheme.startswith("sqlite")


def is_postgresql_url(database_url: str) -> bool:
    return urlsplit(database_url).scheme.startswith("postgresql")


# Use a deployment database when configured, otherwise keep the local SQLite file.
SQLALCHEMY_DATABASE_URL = normalize_database_url(
    os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)
)

engine_kwargs = {}

if is_sqlite_url(SQLALCHEMY_DATABASE_URL):
    # Required for SQLite when FastAPI handles requests across threads.
    engine_kwargs["connect_args"] = {"check_same_thread": False}

if is_postgresql_url(SQLALCHEMY_DATABASE_URL):
    # Keeps stale pooled PostgreSQL connections from being reused.
    engine_kwargs["pool_pre_ping"] = True

# create the SQLAlchemy engine 
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    **engine_kwargs,
)

# factory for creating database session objects
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# base class future SQLAlchemy models will inherit from
class Base(DeclarativeBase):
    pass


# FastAPI dependency that gives each request a database session
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        # provide the active session to the endpoint using this dependency
        yield db
    finally:
        # always close the session after the request finishes
        db.close()
