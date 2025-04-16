import uuid
from django.db import models
from .utils import rename_file
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
    phone_no = PhoneNumberField(
        blank=True, null=True, help_text="Contact phone number."
    )
    role = models.CharField(max_length=10, choices=ROLES, blank=True, default="employee")
    qr_code_image = models.ImageField(
        storage=MediaCloudinaryStorage, upload_to=rename_file
    )
    avatar = models.ImageField(
        storage=MediaCloudinaryStorage,
        upload_to=rename_file,
    )
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

    def __str__(self):
        return f"{self.state} state, {self.country}"


class Workspace(models.Model):
    name = models.CharField(max_length=200)
    capacity = models.IntegerField()
    location = models.ForeignKey(
        Location,
        on_delete=models.CASCADE,
        related_name="workspaces",
    )

    def __str__(self):
        return self.name


class Floor(models.Model):
    floor_no = models.IntegerField()
    workspace = models.ForeignKey(
        Workspace, on_delete=models.CASCADE, related_name="floors"
    )
    floorplan = models.ImageField(storage=MediaCloudinaryStorage, upload_to=rename_file,)

    def __str__(self):
        return f"Floor {self.floor_no}"


class Room(models.Model):
    room_type = models.CharField(max_length=100)
    floor = models.ForeignKey(Floor, on_delete=models.CASCADE, related_name="rooms")
    room_no = models.IntegerField()
    room_plan = models.ImageField(
        storage=MediaCloudinaryStorage,
        upload_to=rename_file,
    )
    room_capacity = models.IntegerField()
    is_restricted = models.BooleanField(default=False)
    is_required_approval = models.BooleanField(default=False)
    is_available = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.room_type} room {self.room_no}"


class Seat(models.Model):
    seat_no = models.CharField(max_length=100)
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="seats",
    )
    is_available = models.BooleanField(default=False)
    seat_img = models.ImageField(
        storage=MediaCloudinaryStorage, upload_to=rename_file
    )

    def __str__(self):
        return self.seat_no


class Booking(models.Model):
    STATUS_CHOICE = [
        ("confirmed", "Confirmed"),
        ("pending", "Pending"),
        ("cancelled", "Cancelled"),
    ]
    status = models.CharField(
        max_length=100,
        choices=STATUS_CHOICE,
        default="confirmed",
    )
    start_at = models.DateTimeField()
    ends_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SeatBooking(Booking):
    user = models.ForeignKey(ConovaUser, on_delete=models.CASCADE)
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.full_name} booked {self.seat.seat_no}"

    class Meta:
        default_related_name = "SeatBookings"


class RoomBooking(Booking):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    meeting_title = models.CharField(max_length=200)
    meeting_description = models.TextField()
    teams = models.ManyToManyField(ConovaUser)

    def __str__(self):
        return f"{self.user.full_name} booked {self.room.room_type} {self.room.room_no}"

    class Meta:
        default_related_name = "RoomBookings"


class Attendance(models.Model):
    user = models.ForeignKey(
        ConovaUser, on_delete=models.CASCADE, related_name="attendance"
    )
    is_checked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
