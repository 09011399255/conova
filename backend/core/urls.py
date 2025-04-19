from django.urls import path
from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter
from .views import RoomViewset, SeatBookingView, SeatViewset, WorkspaceViewSet, FloorViewset

# Base routers
router = DefaultRouter()
router.register(r"workspaces", WorkspaceViewSet, basename="workspace")
router.register(r"rooms", RoomViewset, basename="rooms")
router.register(r"seats", SeatViewset, basename="seats")
router.register(r"seat-bookings", SeatBookingView, basename="seat-bookings")

# Nested routers
workspace_router = NestedDefaultRouter(router, r"workspaces", lookup="workspace")
workspace_router.register(r"floors", FloorViewset, basename="workspace-floors")

urlpatterns = router.urls + workspace_router.urls
