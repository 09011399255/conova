import os
import secrets
import uuid
import qrcode
from io import BytesIO
from django.core.files import File
from django.core.cache import cache
from django.conf import settings
import qrcode.constants
import requests
from decouple import config
from django.template.loader import render_to_string


def generate_otp(email):
    email = email.strip().lower()
    otp = f"{secrets.randbelow(10**6):06d}"
    cache.set(f"otp_{email}", otp, timeout=60)
    return otp


def generate_token(email):
    token = str(uuid.uuid4().hex)
    cache.set(f"token_{email}", token, timeout=60)
    return token


def verify_token(email, token):
    stored_token = cache.get(f"token_{email}")
    if stored_token == token:
        cache.delete(f"token_{email}")
        return True
    return False


def verify_otp(email, typed_otp):
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
        samesite="None",
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

    # save to memory buffer
    buffer = BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return File(buffer, name="qr_code.png")


def rename_file(instance, filename):
    ext = os.path.splitext(filename)[1]
    id = instance.id
    filename = f"user_{id}{ext}"
    return filename


def send_conova_email(
    to, subject, template_name=None, context=None, text_body=None, from_email=None
):
    MAILGUN_API_KEY = config("MAILGUN_API_KEY")
    MAILGUN_DOMAIN = config("MAILGUN_DOMAIN")
    DEFAULT_FROM_EMAIL = config("DEFAULT_FROM_EMAIL")

    if not from_email:
        from_email = DEFAULT_FROM_EMAIL

    if isinstance(to, str):
        to = [to]

    html_body = ""
    if template_name:
        html_body = render_to_string(template_name, context or {})

    if not text_body:
        text_body = "This email requires an HTMl-capable client"

    response = requests.post(
        f"https://api.mailgun.net/v3/{MAILGUN_DOMAIN}/messages",
        auth=("api", MAILGUN_API_KEY),
        data={
            "from": from_email,
            "to": to,
            "subject": subject,
            "text": text_body,
            "html": html_body,
        },
    )

    if response.status_code != 200:
        print("Mailgun failed:", response.text)
        return False

    return True
