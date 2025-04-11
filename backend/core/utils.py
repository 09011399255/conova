from django.core.cache import cache
from django.conf import settings
import secrets


def generate_otp(email):
    email = email.strip().lower()
    otp = f"{secrets.randbelow(10**6):06d}"
    cache.set(f"otp_{email}", otp, timeout=300)
    return otp


def verify_otp(email, typed_otp):
    email = email
    stored_otp = cache.get(f"otp_{email}")
    if stored_otp == typed_otp:
        cache.delete(f"otp_{email}")
        return True
    return False


def set_cookies(response, key, value):
    secure_flag = not settings.DEBUG
    response.set_cookie(
        key=key,
        value=value,
        httponly=True,
        samesite="Lax",
        secure=secure_flag,
    )
