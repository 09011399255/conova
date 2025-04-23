from .serializers import (
    FloorSerializer,
    Notificationerializer,
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
    RoomBookingInvite,
    Seat,
    Team,
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
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404


class NotificationViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows teams to be viewed or edited.

    - **List**: Returns all teams
    - **Create**: Adds a new team with availability
    - **Retrieve**: Gets a team and its schedule
    """

    serializer_class = Notificationerializer
    queryset = Team.objects.all()


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
    # filterset_fields = ["room_type", "floor", "room_capacity", "workspace"]


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
    # fielterset_fields = ["status"]

    def perform_create(self, serializer):
        return serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        user = request.user
        today = timezone.now().date()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated_data = serializer.validated_data
        requested_seat = validated_data["seat"]

        with transaction.atomic():
            new_seat = Seat.objects.select_for_update().get(id=requested_seat.id)

            current_booking = SeatBooking.objects.select_for_update().filter(
                user=user, created_at__date=today, status="confirmed"
            ).first()
            if current_booking:
                if new_seat.id == current_booking.seat.id:
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


class RoomBookingViewset(viewsets.ModelViewSet):
    queryset = RoomBooking.objects.all()
    serializer_class = RoomBookingSerializer
    permission_classes = [IsAuthenticated]
    # filterset_fields = ["status"]

    def create(self, request, *args, **kwargs):
        user = request.user

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        booking = serializer.save()
        invites = RoomBookingInvite.objects.filter(booking=booking)

        for invitee in booking.invited_users.all():
            invite = invites.filter(user=invitee).first()
            if invite:
                cta = f"https://conova.live/respond-invite/?invite_id={invite.id}"
                Notification.objects.create(
                    user=invitee,
                    message=f"You've been invited to a booking in room {booking.room.room_no} by {user.full_name}",
                    notification_type="invite",
                )
                send_mail(
                    subject="meeting invite",
                    message=(
                        f"You've been invited to a booking in room {booking.room.room_no} by {user.full_name}, "
                        f"Click the link below to respond to the invite:\n\n{cta}"
                    ),
                    from_email="conova <noreply@conova.live>",
                    recipient_list=[invitee.email],
                )
        return Response(
            self.get_serializer(booking).data, status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        booking = self.get_object()

        original_start = booking.start_at
        original_end = booking.ends_at
        original_title = booking.meeting_title
        original_description = booking.meeting_description
        original_status = booking.status

        serializer = self.get_serializer(booking, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data.get("status")
        if new_status == "confirmed":
            accepted_count = RoomBookingInvite.objects.filter(
                booking=booking,
                has_accepted=True,
            ).count()

            if accepted_count < 2:
                return Response(
                    {
                        "error": "At least 2 users must accept the invite before confirming the booking."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )
                
        serializer.save()

        changes = []

        if booking.start_at != original_start or booking.ends_at != original_end:
            changes.append("time")

        if (
            booking.meeting_title != original_title
            or booking.meeting_description != original_description
        ):
            changes.append("details")

        if booking.status != original_status:
            changes.append("status")

        messages = []
        if "time" in changes:
            messages.append(
                f"Meeting details updated:\nTitle: {booking.meeting_title}\n"
                f"New start: {booking.start_at}\nNew End: {booking.ends_at}"
            )

        if "details" in changes:
            messages.append(
                f"Meeting details updated\nTitle: {booking.meeting_title}\n"
                f"Description:{booking.meeting_description}"
            )

        if "status" in changes:
            if booking.status == "cancelled":
                messages.append(
                    f"The meeting {booking.meeting_title} has been cancelled."
                )
            elif booking.status == "confirmed":
                messages.append(
                    f"The meeting {booking.meeting_title} has been confirmed."
                )
        if messages:
            full_message = "\n\n".join(messages)
            for invitee in booking.invited_users.all():
                Notification.objects.create(
                    user=invitee,
                    message=full_message,
                    notification_type="invite",
                )
                send_mail(
                    subject="Meeting update",
                    message=full_message,
                    from_email="conova <noreply@conova.live>",
                    recipient_list=[invitee.email],
                )

        return Response(self.get_serializer(booking).data)


class RespondToInviteView(APIView):
    """
    API endpoint for responding to a room booking invite.

    This endpoint allows an invited user to either accept or decline a meeting invitation.
    The user must be authenticated and must be the same person who was invited.

    Expected request:
        POST /api/room-booking/{invited_id}/respond/
        Body: {
            "response": "accept" | "decline"
        }

    Responses:
    - 200 OK: Invite successfully accepted or declined.
    - 400 Bad Request: If the response is invalid, invite does not exist, or user has already responded.
    - 403 Forbidden: If the invite does not belong to the requesting user.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, invite_id):
        user = request.user
        response = request.data.get("response")
        invite = get_object_or_404(RoomBookingInvite, id=invite_id, user=user)

        if response not in ["accept", "decline"]:
            return Response(
                {"message": "Response must be either 'accept' or 'decline'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            invite.respond_to_invite(response, user)
        except ValueError as e:
            return Response(
                {"message": str(e)},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(
            {"message": f"Invite successfully {response}ed."},
            status=status.HTTP_200_OK,
        )


class RoomCheckIn(APIView):
    def post(self, request, room_id):
        pass
