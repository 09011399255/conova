from django.urls import path
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from .views import (
    NotificationViewset,
    RespondToInviteView,
    RoomBookingViewset,
    RoomViewset,
    SeatBookingView,
    SeatViewset,
    WorkspaceViewSet,
    FloorViewset,
)

# Base routers
router = DefaultRouter()
router.register(r"workspaces", WorkspaceViewSet, basename="workspace")
router.register(r"rooms", RoomViewset, basename="rooms")
router.register(r"seats", SeatViewset, basename="seats")
router.register(r"seat-bookings", SeatBookingView, basename="seat-bookings")
router.register(r"notifications", NotificationViewset, basename="notifications")
router.register(r"room-bookings", RoomBookingViewset, basename="room-bookings")
# Nested routers
workspace_router = NestedDefaultRouter(router, r"workspaces", lookup="workspace")
workspace_router.register(r"floors", FloorViewset, basename="workspace-floors")

urlpatterns = [
    path(
        "booking-invite/<int:invite_id>/respond/",
        RespondToInviteView.as_view(),
        name="respond-to-invite",
    )
]

urlpatterns += router.urls + workspace_router.urls
