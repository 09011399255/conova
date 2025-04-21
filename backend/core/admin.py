from django.contrib import admin
from .models import (
    ConovaUser,
    Floor,
    Notification,
    Room,
    RoomBooking,
    RoomBookingInvite,
    Seat,
    Team,
    Workspace,
    AvailabilitySchedule,
    SeatBooking,
)

admin.site.register(ConovaUser)
admin.site.register(Workspace)
admin.site.register(AvailabilitySchedule)
admin.site.register(Room)
admin.site.register(Floor)
admin.site.register(Seat)
admin.site.register(SeatBooking)
admin.site.register(Notification)
admin.site.register(Team)
admin.site.register(RoomBookingInvite)
admin.site.register(RoomBooking)
