import uuid
from django.db import models
from .utils import rename_file
from django.contrib.auth.models import AbstractUser, BaseUserManager
from cloudinary_storage.storage import MediaCloudinaryStorage
from phonenumber_field.modelfields import PhoneNumberField
from django.db.models import UniqueConstraint
from django.core.mail import send_mail
from django.db import transaction


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
    ROLES = [
        ("learners", "Learners"),
        ("employee", "Employee"),
        ("admin", "Admin"),
        ("manager", "Manager"),
    ]
    username = None
    first_name = None
    last_name = None
    full_name = models.CharField(max_length=100, help_text="Full name")
    email = models.EmailField(unique=True, help_text="Email address")
    phone_no = PhoneNumberField(
        blank=True, null=True, help_text="Contact phone number."
    )
    role = models.CharField(
        max_length=10,
        choices=ROLES,
        blank=True,
        default="employee",
    )
    qr_code_image = models.ImageField(
        storage=MediaCloudinaryStorage, upload_to=rename_file
    )
    avatar = models.ImageField(
        storage=MediaCloudinaryStorage,
        upload_to=rename_file,
        help_text="Profile picture",
        blank=True,
        null=True,
    )
    personal_token = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
    )
    prefers_email_notification = models.BooleanField(default=True)

    objects = ConovaUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []


class Team(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(ConovaUser, related_name="teams")

    def __str__(self):
        return self.name


class Workspace(models.Model):
    name = models.CharField(max_length=200, help_text="Name of the workspace")
    location = models.CharField(
        max_length=200, help_text="Where the workspace is located"
    )
    floor_nos = models.IntegerField(
        help_text="Number of floors in the workspace building"
    )

    def __str__(self):
        return self.name


class Floor(models.Model):
    floor_no = models.IntegerField(help_text="Floor number e.g 'Floor 1' ")
    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="floors",
        help_text="The workspace you are adding the floor to",
    )
    floorplan = models.ImageField(
        storage=MediaCloudinaryStorage,
        upload_to=rename_file,
        help_text="Floor plan Image",
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=["floor_no", "workspace"], name="unique_floor_per_workspace"
            )
        ]

    def __str__(self):
        return f"Floor {self.floor_no}"


class Room(models.Model):
    room_type = models.CharField(
        max_length=100, help_text="Type of room e.g conference."
    )
    floor = models.ForeignKey(
        Floor,
        on_delete=models.CASCADE,
        related_name="rooms",
        help_text="The floor number you adding the room to. e.g Floor 1",
    )
    room_no = models.IntegerField(help_text="The number of the room e.g 1, 2, e.t.c")
    x_coordinate = models.FloatField(
        null=True,
        blank=True,
        help_text="Coordinate of room relative to the X-axis.",
    )
    y_coordinate = models.FloatField(
        null=True,
        blank=True,
        help_text="Coordinate of room relative to the Y-axis.",
    )
    room_img = models.ImageField(
        storage=MediaCloudinaryStorage,
        upload_to=rename_file,
        help_text="The image of the room.",
    )
    room_capacity = models.IntegerField(
        help_text="The number of people room can accomodate.",
    )
    is_restricted = models.BooleanField(
        default=False,
        help_text="Is the room restricted to users.",
    )
    is_required_approval = models.BooleanField(
        default=False,
        help_text="Does the room requires approval.",
    )
    is_available = models.BooleanField(
        default=True,
        help_text="Status of the room",
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=["room_no", "floor", "room_type"],
                name="unique_room_per_floor",
            )
        ]

    def __str__(self):
        return f"{self.room_type} room {self.room_no}"


class Seat(models.Model):
    seat_no = models.CharField(
        max_length=100,
        help_text="Seat number e.g 15, 15c, 23a, e.t.c.",
    )
    floor = models.ForeignKey(
        Floor,
        on_delete=models.CASCADE,
        related_name="seats",
        help_text="The floor number you adding the seat to. e.g Floor 1",
    )
    is_available = models.BooleanField(
        default=True,
        help_text="Status of the room",
    )
    x_coordinate = models.FloatField(
        null=True,
        blank=True,
        help_text="Coordinate of room relative to the X-axis.",
    )
    y_coordinate = models.FloatField(
        null=True,
        blank=True,
        help_text="Coordinate of room relative to the Y-axis.",
    )
    seat_img = models.ImageField(
        storage=MediaCloudinaryStorage,
        upload_to=rename_file,
        help_text="The image of the room.",
        blank=True,
        null=True,
    )

    class Meta:
        constraints = [
            UniqueConstraint(
                fields=["floor", "seat_no"],
                name="unique_seat_per_floor",
            )
        ]

    def __str__(self):
        return self.seat_no


class AvailabilitySchedule(models.Model):
    DAY_CHOICES = [
        ("MON", "Monday"),
        ("TUE", "Tuesday"),
        ("WED", "Wednesday"),
        ("THU", "Thursday"),
        ("FRI", "Friday"),
        ("SAT", "Saturday"),
        ("SUN", "Sunday"),
    ]

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="The workspace you are adding availability schedule to",
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="The room you are adding availability schedule to.",
    )
    # seat = models.ForeignKey(
    #     Seat,
    #     on_delete=models.CASCADE,
    #     null=True,
    #     blank=True,
    #     help_text="The seat you are adding availability schedule to.",
    # )
    day = models.CharField(
        max_length=5,
        choices=DAY_CHOICES,
        help_text="Day of the week e.g MON, TUE, WED",
    )
    is_available = models.BooleanField(
        default=False,
        help_text="Status of the day",
    )
    start_time = models.TimeField(
        null=True,
        blank=True,
        help_text="The time booking should start for the day",
    )
    end_time = models.TimeField(
        null=True,
        blank=True,
        help_text="The time booking should ends for the day",
    )

    class Meta:
        unique_together = ["workspace", "room", "day"]
        default_related_name = "availability"
        ordering = ["day"]

    def __str__(self):
        if self.is_available:
            return f"{self.get_day_display()}: {self.start_time} - {self.end_time}"
        return f"{self.get_day_display()}: closed"


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
        help_text="The status of the booking e.g confirmed, pending, cancelled",
    )
    start_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text="The time and date booking starts from",
    )
    ends_at = models.DateTimeField(
        blank=True,
        null=True,
        help_text="The time and date when the booking ends",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SeatBooking(Booking):
    user = models.ForeignKey(
        ConovaUser,
        on_delete=models.CASCADE,
        help_text="The user booking a seat",
    )
    seat = models.ForeignKey(
        Seat,
        on_delete=models.CASCADE,
        help_text="The seat that is being booked",
    )

    def __str__(self):
        return f"{self.user.full_name} booked {self.seat.seat_no}"

    class Meta:
        default_related_name = "SeatBookings"
        unique_together = ("user", "seat", "status")


class RoomBooking(Booking):
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name="bookings",
        help_text="The seat that is being booked",
    )
    meeting_title = models.CharField(
        max_length=200,
        help_text="The title of the meeting to be held in the room",
    )
    meeting_description = models.TextField(help_text="Meeting description")
    created_by = models.ForeignKey(
        ConovaUser,
        on_delete=models.CASCADE,
        related_name="created_roombookings",
        help_text="user making a room booking",
    )
    invited_users = models.ManyToManyField(ConovaUser, related_name="room_invites")

    def __str__(self):
        return f"{self.created_by.full_name} booked {self.room.room_type} {self.room.room_no}"

    class Meta:
        pass
        # unique_together = ("room")


class Notification(models.Model):
    user = models.ForeignKey(
        ConovaUser,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    notification_type = models.CharField(
        max_length=15,
        choices=[("booking", "Booking"), ("invite", "Invite")],
    )
    created_at = models.DateTimeField(auto_now_add=True)


class RoomBookingInvite(models.Model):
    booking = models.ForeignKey(
        RoomBooking, on_delete=models.CASCADE, related_name="invites"
    )
    user = models.ForeignKey(
        ConovaUser,
        on_delete=models.CASCADE,
        related_name="invites",
        blank=True,
        null=True,
    )
    has_accepted = models.BooleanField(default=False)
    has_declined = models.BooleanField(default=False)
    invited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.full_name} was invited to {self.booking.meeting_title}"

    @transaction.atomic
    def respond_to_invite(self, response, acting_user):
        print(acting_user)
        print(self.user)
        if self.user != acting_user:
            raise ValueError("You are not allowed to respond to this invite.")

        if self.has_accepted or self.has_declined:
            raise ValueError("You have already responded to this invite.")

        if response == "accept":
            self.has_accepted = True
        elif response == "decline":
            self.has_declined = True
        else:
            raise ValueError("Invalid response. Must be 'accept' or 'decline'.")

        self.save()

        action = "accepted" if response == "accept" else "declined"

        Notification.objects.create(
            user=self.booking.created_by,
            message=f"{self.user.full_name} has {action} your invite for {self.booking.meeting_title}",
            notification_type = "invite",
        )
        Notification.objects.create(
            user = self.user,
            message=f"You have {action} your invitation for {self.booking.meeting_title}",
            notification_type = "invite",
        )
        send_mail(
            subject=f"Invitation {action}",
            message=f"{self.user.full_name} has {action} your invite for {self.booking.meeting_title}",
            from_email="conova <noreply@conova.live>",
            recipient_list=[self.booking.created_by.email]
        )
        send_mail(
            subject=f"Invitation {action}",
            message=f"You have {action} your invitation for {self.booking.meeting_title}",
            from_email="conova <noreply@conova.live>",
            recipient_list=[self.user.email],
        )


class Attendance(models.Model):
    user = models.ForeignKey(
        ConovaUser, on_delete=models.CASCADE, related_name="attendance"
    )
    is_checked = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
