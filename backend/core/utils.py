import os
import secrets
import qrcode
from io import BytesIO
from django.core.files import File
from django.core.cache import cache
from django.conf import settings
import qrcode.constants


def generate_otp(email):
    email = email.strip().lower()
    otp = f"{secrets.randbelow(10**6):06d}"
    cache.set(f"otp_{email}", otp, timeout=600)
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
    
def generate_qr_code(url):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=12,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    img = qr.make_image(fill="black", back_color="white")
    
    #save to memory buffer
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return File(buffer, name="qr_code.png")


def rename_avatar(instance, filename):
    ext = os.path.splitext(filename)[1]
    id = instance.id
    filename = f"user_{id}{ext}"
    return os.path.join("Avatars", filename)

def rename_qr_code(instance, filename):
    ext = os.path.splitext(filename)[1]
    id = instance.id
    filename = f"user_{id}{ext}"
    return os.path.join("QRcodes", filename)