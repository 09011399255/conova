import uuid
from django.db import models
from .utils import rename_object
from django.contrib.auth.models import AbstractUser, BaseUserManager
from cloudinary_storage.storage import MediaCloudinaryStorage
from phonenumber_field.modelfields import PhoneNumberField


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
    phone_no = PhoneNumberField(blank=True, null=True, help_text="Contact phone number.")
    role = models.CharField(max_length=10, choices=ROLES, blank=True)
    qr_code_image = models.ImageField(
        storage=MediaCloudinaryStorage, upload_to=rename_object("Profile_pictures")
    )
    avatar = models.ImageField(storage=MediaCloudinaryStorage, upload_to=rename_object("GRcodes"))
    personal_token = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )

    objects = ConovaUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []


class Location(models.Model):
    state = models.CharField(max_length=200)
    country = models.CharField(max_length=200, default="Nigeria")

class Workspace(models.Model):
    capacity = models.IntegerField()
    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name="workspaces",
    )
    floorplan = models.ImageField(storage=MediaCloudinaryStorage, upload_to=rename_object("Floorplans"))


class Floor(models.Model):
    floor_no = models.IntegerField()
    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name="floors"
    )


class Room(models.Model):
    room_type = models.CharField(max_length=100)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, related_name="rooms")
