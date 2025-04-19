from django.contrib import admin
from .models import ConovaUser, Floor, Notification, Room, Seat, Workspace, AvailabilitySchedule, SeatBooking

admin.site.register(ConovaUser)
admin.site.register(Workspace)
admin.site.register(AvailabilitySchedule)
admin.site.register(Room)
admin.site.register(Floor)
admin.site.register(Seat)
admin.site.register(SeatBooking)
admin.site.register(Notification)