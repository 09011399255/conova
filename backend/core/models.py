import uuid
from django.db import models
from .utils import rename_avatar, rename_qr_code
from django.contrib.auth.models import AbstractUser, BaseUserManager
from cloudinary_storage.storage import MediaCloudinaryStorage


class ConovaUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError({"message": "User must have an email address"})
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(email, password, **extra_fields)


class ConovaUser(AbstractUser):
    ROLES = [("learners", "Learners"), ("employee", "Employee"), ("admin", "Admin")]
    username = None
    first_name = None
    last_name = None
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLES, blank=True)
    qr_code_image = models.ImageField(storage=MediaCloudinaryStorage, upload_to=rename_qr_code)
    avatar = models.ImageField(storage=MediaCloudinaryStorage, upload_to=rename_avatar)
    personal_token = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )

    objects = ConovaUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
