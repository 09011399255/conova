from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import RoomBookingInvite, RoomBooking


@receiver(post_save, sender=RoomBookingInvite)
def update_booking_status(sender, instance, **kwargs):
    """
    when an invite is accepted, check if enough users has accepted to update
    the booking status to 'confirmed'
    """
    
    if not instance.has_accepted:
        return
    
    booking = instance.booking
    invites = booking.invites.all()
    
    accepted_count = invites.filter(has_accepted=True).count()
    
    if accepted_count >=2 and booking.status == "pending":
        booking.status = "confirmed"
        booking.save()
    