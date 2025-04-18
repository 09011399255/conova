from django.contrib import admin
from .models import ConovaUser, Floor, Room, Seat, Workspace, AvailabilitySchedule

admin.site.register(ConovaUser)
admin.site.register(Workspace)
admin.site.register(AvailabilitySchedule)
admin.site.register(Room)
admin.site.register(Floor)
admin.site.register(Seat)