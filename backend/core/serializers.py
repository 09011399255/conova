from .models import (
    Floor,
    AvailabilitySchedule,
    Room,
    RoomBooking,
    Seat,
    SeatBooking,
    Workspace,
)
from rest_framework import serializers
from django.contrib.auth import get_user_model

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
    availability = AvailabilityScheduleUpdateSerializer(required=False)
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


class SeatSerializer(serializers.ModelSerializer):
    SeatBookings = SeatBookingSerializer(many=True, read_only=True)
    # availability = AvailabilityScheduleUpdateSerializer(required=False)
    # availability_field = "seat"

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
            # "availability",
        )


class FloorSerializer(serializers.ModelSerializer):
    rooms = RoomSerializer(many=True, read_only=True)
    seats = SeatSerializer(many=True, read_only=True)

    class Meta:
        model = Floor
        fields = ("id", "floor_no", "floorplan", "rooms", "seats")


class RoomBookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomBooking
        fields = "__all__"
