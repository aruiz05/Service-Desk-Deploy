from getpass import getpass

from .auth import hash_password


def main() -> None:
    password = getpass("Admin password: ")
    confirm_password = getpass("Confirm admin password: ")

    if password != confirm_password:
        raise SystemExit("Passwords do not match.")

    print(hash_password(password))


if __name__ == "__main__":
    main()
