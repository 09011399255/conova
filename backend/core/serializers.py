from datetime import timedelta
from .models import (
    ConovaUser,
    Floor,
    AvailabilitySchedule,
    Room,
    RoomBooking,
    RoomBookingInvite,
    Seat,
    SeatBooking,
    Team,
    Workspace,
)
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils import timezone


User = get_user_model()


class AvailabilityMixin:
    availability_field = ""

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        availability_data = AvailabilitySchedule.objects.filter(
            **{self.availability_field: instance}
        )

        availability_dict = {}

        for availability in availability_data:
            day_code = availability.day
            availability_dict[day_code] = {
                "is_available": availability.is_available,
                "start_time": availability.start_time,
                "end_time": availability.end_time,
            }

        representation["availbility"] = availability_dict
        return representation

    def create(self, validated_data):
        availability_data = validated_data.pop("availability", None)

        instance = super().create(validated_data)

        if availability_data:
            for day_code, day_data in availability_data.items():
                AvailabilitySchedule.objects.create(
                    **{self.availability_field: instance},
                    day=day_code,
                    is_available=day_data.get("is_available", False),
                    start_time=day_data.get("start_time"),
                    end_time=day_data.get("end_time"),
                )
        return instance

    def update(self, instance, validated_data):
        availability_data = validated_data.pop("availability", None)

        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()

        if availability_data:
            for day_code, day_data in availability_data.items():
                AvailabilitySchedule.objects.update_or_create(
                    availability_field=instance,
                    day=day_code,
                    defaults={
                        "is_available": day_data.get("is_available", False),
                        "start_time": day_data.get("start_time"),
                        "end_time": day_data.get("end_time"),
                    },
                )

        return instance


class AvailabilityScheduleSerializer(serializers.ModelSerializer):
    is_available = serializers.BooleanField()
    start_time = serializers.TimeField(required=False, allow_null=True)
    end_time = serializers.TimeField(required=False, allow_null=True)

    def validate(self, attrs):
        if attrs.get("is_available"):
            if not attrs.get("start_time") and not attrs.get("end_time"):
                raise serializers.ValidationError(
                    {
                        "message": "Start time and end time are required when day is available."
                    }
                )
            if attrs.get("start_time") >= attrs.get("end_time"):
                raise serializers.ValidationError(
                    {"message": "End time must be after start time."}
                )
        return attrs

    class Meta:
        model = AvailabilitySchedule
        fields = ("day", "is_available", "start_time", "end_time")


class AvailabilityScheduleUpdateSerializer(serializers.Serializer):
    MON = AvailabilityScheduleSerializer(required=False)
    TUE = AvailabilityScheduleSerializer(required=False)
    WED = AvailabilityScheduleSerializer(required=False)
    THU = AvailabilityScheduleSerializer(required=False)
    FRI = AvailabilityScheduleSerializer(required=False)
    SAT = AvailabilityScheduleSerializer(required=False)
    SUN = AvailabilityScheduleSerializer(required=False)


class WorkspaceSerializer(AvailabilityMixin, serializers.ModelSerializer):
    availability = AvailabilityScheduleUpdateSerializer(required=False)
    availability_field = "workspace"

    class Meta:
        model = Workspace
        fields = ("id", "name", "location", "floor_nos", "availability")


class RoomSerializer(AvailabilityMixin, serializers.ModelSerializer):
    availability = AvailabilityScheduleUpdateSerializer()
    availability_field = "room"

    class Meta:
        model = Room
        fields = (
            "id",
            "floor",
            "room_type",
            "room_no",
            "x_coordinate",
            "x_coordinate",
            "room_img",
            "room_capacity",
            "is_restricted",
            "is_required_approval",
            "is_available",
            "availability",
        )


class SeatBookingSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = SeatBooking
        fields = ("id", "user", "seat", "status", "created_at", "updated_at")


class SeatSerializer(AvailabilityMixin, serializers.ModelSerializer):
    SeatBookings = SeatBookingSerializer(many=True, read_only=True)
    availability = AvailabilityScheduleUpdateSerializer()
    availability_field = "seat"

    class Meta:
        model = Seat
        fields = (
            "id",
            "floor",
            "seat_no",
            "is_available",
            "x_coordinate",
            "y_coordinate",
            "seat_img",
            "SeatBookings",
            "availability",
        )


class FloorSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True)
    seats = SeatSerializer(many=True, read_only=True)

    class Meta:
        model = Floor
        fields = ("id", "floor_no", "floorplan", "rooms", "seats")


class RoomBookingSerializer(serializers.ModelSerializer):
    created_by = serializers.PrimaryKeyRelatedField(read_only=True)
    invited_users = serializers.PrimaryKeyRelatedField(
        many=True, queryset=ConovaUser.objects.all(), required=False
    )
    start_at = serializers.DateTimeField(required=True)
    ends_at = serializers.DateTimeField(required=True)

    class Meta:
        model = RoomBooking
        fields = "__all__"

    def validate(self, attrs):
        buffer_time = timedelta(minutes=30)
        start_at = attrs.get("start_at", getattr(self.instance, "start_at", None))
        ends_at = attrs.get("ends_at", getattr(self.instance, "ends_at", None))

        if "start_at" in attrs or "ends_at" in attrs:
            # Add buffer to end time before validating booking overlaps
            if ends_at:
                ends_at += buffer_time
            now = timezone.now()
            room = attrs.get("room", getattr(self.instance, "room", None))

            if start_at <= now:
                raise serializers.ValidationError("Start time must be in the future.")

            if ends_at <= start_at:
                raise serializers.ValidationError("Ends time must be after start time.")

            booking_day = start_at.strftime("%a").upper()
            availability = AvailabilitySchedule.objects.filter(
                room=room, day=booking_day
            ).first()

            if not availability or not availability.is_available:
                raise serializers.ValidationError(
                    "Room is not available for booking on this day."
                )

            start_time = start_at.time()
            end_time = ends_at.time()

            if start_time < availability.start_time or end_time > availability.end_time:
                raise serializers.ValidationError(
                    "Booking time must be within the room's available hours."
                )

            overlapping_booking = RoomBooking.objects.filter(
                room=room,
                start_at__lt=ends_at,
                ends_at__gt=start_at,
            )

            if self.instance:
                overlapping_booking = overlapping_booking.exclude(id=self.instance.id)

            if overlapping_booking.exists():
                raise serializers.ValidationError(
                    "The room is already booked for this time slot."
                )

        # validating invited users
        invited_users = attrs.get("invited_users", [])
        creator = self.context["request"].user

        # check for duplicates
        if len(invited_users) > len(set(invited_users)):
            raise serializers.ValidationError("Invited Users list contains duplicates.")

        # ensure the person booking is not part of invitees
        if creator in invited_users:
            raise serializers.ValidationError("You cannot invite yourself.")

        user_ids = [user.id for user in invited_users]
        if not ConovaUser.objects.filter(id__in=user_ids).count() == len(invited_users):
            raise serializers.ValidationError("One or more invited users do not exist.")
        return attrs

    def create(self, validated_data):
        creator = self.context["request"].user
        invited_users = validated_data.pop("invited_users", [])

        validated_data["status"] = "pending"

        booking = RoomBooking.objects.create(created_by=creator, **validated_data)

        if invited_users:
            booking.invited_users.add(*invited_users)

        for user in invited_users:
            RoomBookingInvite.objects.create(
                booking=booking,
                user=user,
            )

        return booking

    def update(self, instance, validated_data):
        invited_users = validated_data.pop("invited_users", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if invited_users is not None:
            instance.invited_users.clear()
            RoomBookingInvite.objects.filter(booking=instance).delete()

            instance.invited_users.add(*invited_users)
            for user in invited_users:
                RoomBookingInvite.objects.create(
                    booking=instance,
                    user=user,
                )

        return instance


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = "__all__"
