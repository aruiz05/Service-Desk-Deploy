from fastapi import APIRouter, Depends, HTTPException, status

from .. import auth, schemas


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=schemas.AdminLoginResponse)
def login(login_request: schemas.AdminLoginRequest) -> schemas.AdminLoginResponse:
    if not auth.is_admin_auth_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin authentication is not configured.",
        )

    if not auth.verify_admin_credentials(
        login_request.username,
        login_request.password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials.",
        )

    return schemas.AdminLoginResponse(
        access_token=auth.create_admin_access_token(),
        expires_in=auth.get_token_expire_seconds(),
    )


@router.get("/me", response_model=schemas.AdminStatusResponse)
def get_current_admin(
    is_admin: bool = Depends(auth.get_optional_admin),
) -> schemas.AdminStatusResponse:
    if not is_admin:
        return schemas.AdminStatusResponse(authenticated=False)

    return schemas.AdminStatusResponse(authenticated=True, role=auth.ADMIN_ROLE)
