from .serializers import (
    FloorSerializer,
    RoomSerializer,
    SeatSerializer,
    WorkspaceSerializer,
    SeatBookingSerializer,
    RoomBookingSerializer,
)
from .models import (
    ConovaUser,
    Floor,
    Room,
    Seat,
    Workspace,
    SeatBooking,
    RoomBooking,
    Notification,
)
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import ValidationError
from django.core.mail import send_mail
from django.db import transaction


class WorkspaceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows workspaces to be viewed or edited.

    - **List**: Returns all workspaces
    - **Create**: Adds a new workspace with availability
    - **Retrieve**: Gets a workspace and its schedule
    """

    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer


class FloorViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows floors to be viewed or edited.

    - **List**: Returns all floors for a particular workspace
    - **Create**: Adds a new to floor to a workspace
    - **Retrieve**: Gets a floor under a particular workspace
    """

    queryset = Floor.objects.all()
    serializer_class = FloorSerializer

    def get_queryset(self):
        return self.queryset.filter(workspace_id=self.kwargs["workspace_pk"])

    def perform_create(self, serializer):
        workspace_id = self.kwargs["workspace_pk"]
        return serializer.save(workspace_id=workspace_id)


class RoomViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows rooms to be viewed or edited.

    - **List**: Returns all rooms
    - **Create**: Adds a new room with availability
    - **Retrieve**: Gets a room and its schedule
    """

    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class SeatViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows seats to be viewed or edited.

    - **List**: Returns all seats
    - **Create**: Adds a new seat
    - **Retrieve**: Gets a seat
    """

    queryset = Seat.objects.all()
    serializer_class = SeatSerializer


class SeatBookingView(viewsets.ModelViewSet):
    """
    SeatBookingView handles all seat booking operations for authenticated users.

    Endpoints:
    - GET /seat-bookings/:
        Returns a list of all seat bookings (can be restricted or filtered as needed).

    - POST /seat-bookings/:
        Creates a new seat booking for the authenticated user for the current day.
        If the user already has a booking for the day, it will be automatically cancelled and replaced.
        Sends notification and email (if enabled) for both cancellation and new booking.
        Validates that a seat isn’t double-booked and prevents rebooking the same seat.

    - PATCH /seat-bookings/{id}/:
        Updates the booking status (e.g., to 'cancelled').
        When a booking is cancelled, the associated seat is marked as available again.

    - GET /seat-bookings/{id}/:
        Retrieves details of a single seat booking.

    - DELETE /seat-bookings/{id}/:
         Delete a booking.

    Important Logic:
    - Only one active seat booking is allowed per user per day.
    - Seats must be available to be booked.
    - Seat availability is toggled upon booking or cancellation.
    - Additional logic (like freeing up un-checked-in seats or resetting availability at midnight) is handled via background tasks.
    """

    permission_classes = [IsAuthenticated]
    queryset = SeatBooking.objects.all()
    serializer_class = SeatBookingSerializer

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        today = timezone.now().date()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        new_seat = validated_data["seat"]

        current_booking = SeatBooking.objects.filter(
            user=user, created_at__date=today
        ).first()
        if current_booking:
            if new_seat == current_booking.seat:
                raise ValidationError({"message": "You already booked this seat."})
            current_booking.seat.is_available = True
            current_booking.seat.save()
            current_booking.status = "cancelled"
            current_booking.save()
            Notification.objects.create(
                user=user,
                message=f"You cancelled seat {current_booking.seat.seat_no}",
                notification_type="booking",
            )
            if user.prefers_email_notification:
                send_mail(
                    subject="Booking cancelled",
                    message=f"Your seat {current_booking.seat.seat_no} has been cancelled.",
                    from_email="conova <noreply@conova.live>",
                    recipient_list=[user.email],
                )
        with transaction.atomic():
            new_seat = Seat.objects.select_for_update().get(id=new_seat.id)

            if not new_seat.is_available:
                raise ValidationError({"message": "This seat has already been booked."})
            new_seat.is_available = False
            new_seat.save()

            Notification.objects.create(
                user=user,
                message=f"You booked seat {new_seat.seat_no}",
                notification_type="booking",
            )
            if user.prefers_email_notification:
                send_mail(
                    subject="Booking successful",
                    message=f"Your seat {new_seat.seat_no} has been successfully booked.",
                    from_email="conova <noreply@conova.live>",
                    recipient_list=[user.email],
                )

            serializer.save(user=user)

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def update(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data

        if (
            validated_data.get("status") == "cancelled"
            and instance.status != "cancelled"
        ):
            instance.seat.is_available = True
            instance.seat.save()

            Notification.objects.create(
                user=user,
                message=f"You cancelled seat {instance.seat.seat_no}",
                notification_type="booking",
            )
            if user.prefers_email_notification:
                send_mail(
                    subject="Booking cancelled",
                    message=f"Your seat {instance.seat.seat_no} has been cancelled.",
                    from_email="conova <noreply@conova.live>",
                    recipient_list=[user.email],
                )
        self.perform_update(serializer)

        return Response(serializer.data)
