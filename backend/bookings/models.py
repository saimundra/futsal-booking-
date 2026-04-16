from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


class Futsal(models.Model):
    """Futsal venue model representing individual futsal businesses"""
    
    name = models.CharField(max_length=200)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='owned_futsals',
        limit_choices_to={'role': 'futsal_owner'}
    )
    
    # Location details
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Contact information
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField()
    website = models.URLField(blank=True)
    map_link = models.URLField(blank=True, help_text="Google Maps link for the venue location")
    
    # Business information
    description = models.TextField(blank=True)
    amenities = models.JSONField(default=list, blank=True)  # ["Parking", "Changing Rooms", "Cafeteria"]
    
    # Operating hours (stored as JSON)
    operating_hours = models.JSONField(default=dict, blank=True)
    
    # Payment methods
    payment_methods = models.JSONField(default=list, blank=True)  # ["cash", "credit_card", "online"]
    
    # Media
    logo = models.ImageField(upload_to='futsal_logos/', null=True, blank=True)
    cover_image = models.ImageField(upload_to='futsal_covers/', null=True, blank=True)
    
    # Status
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)  # Admin verification
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'futsals'
        ordering = ['name']
    
    def __str__(self):
        return f"{self.name} - {self.city}"


class Court(models.Model):
    """Court model representing futsal courts"""
    
    COURT_TYPE_CHOICES = (
        ('indoor', 'Indoor'),
        ('outdoor', 'Outdoor'),
    )
    
    SURFACE_TYPE_CHOICES = (
        ('artificial_turf', 'Artificial Turf'),
        ('natural_grass', 'Natural Grass'),
        ('synthetic', 'Synthetic'),
    )
    
    # Futsal venue relationship
    futsal = models.ForeignKey(
        Futsal,
        on_delete=models.CASCADE,
        related_name='courts',
        null=False,
        blank=False,
        help_text="Courts must belong to a futsal venue"
    )
    
    name = models.CharField(max_length=100)
    court_number = models.CharField(max_length=20, unique=True)
    court_type = models.CharField(max_length=20, choices=COURT_TYPE_CHOICES)
    surface_type = models.CharField(max_length=50, choices=SURFACE_TYPE_CHOICES)
    description = models.TextField(blank=True)
    
    # Specifications
    length = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    width = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    max_players = models.IntegerField(default=10)
    
    # Pricing
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    
    # Availability
    is_active = models.BooleanField(default=True)
    
    # Features
    has_lighting = models.BooleanField(default=True)
    has_changing_rooms = models.BooleanField(default=True)
    has_parking = models.BooleanField(default=True)
    
    # Media
    image = models.ImageField(upload_to='courts/', null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'courts'
        ordering = ['court_number']
    
    def __str__(self):
        return f"{self.name} - {self.court_number}"


class Booking(models.Model):
    """Booking model for court reservations"""
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    
    PAYMENT_STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
        ('failed', 'Failed'),
    )
    
    PAYMENT_METHOD_CHOICES = (
        ('cash', 'Cash'),
        ('credit_card', 'Credit Card'),
        ('debit_card', 'Debit Card'),
        ('paypal', 'PayPal'),
        ('online_transfer', 'Online Transfer'),
    )
    
    booking_id = models.CharField(max_length=50, unique=True, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookings')
    court = models.ForeignKey(Court, on_delete=models.CASCADE, related_name='bookings')
    
    # Booking details
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration = models.DecimalField(max_digits=4, decimal_places=2)  # in hours
    
    # Participants
    number_of_players = models.IntegerField(default=10)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Payment
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, choices=PAYMENT_METHOD_CHOICES, blank=True)
    transaction_id = models.CharField(max_length=100, blank=True)
    
    # Additional information
    notes = models.TextField(blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['date', 'start_time']),
            models.Index(fields=['user', 'status']),
        ]
    
    def __str__(self):
        return f"Booking {self.booking_id} - {self.user.email} - {self.court.name}"
    
    def save(self, *args, **kwargs):
        if not self.booking_id:
            # Generate booking ID
            last_booking = Booking.objects.order_by('-id').first()
            if last_booking:
                last_id = int(last_booking.booking_id.split('BK')[-1])
                self.booking_id = f"BK{str(last_id + 1).zfill(3)}"
            else:
                self.booking_id = "BK001"
        super().save(*args, **kwargs)


class CourtSchedule(models.Model):
    """Court availability schedule"""
    
    SCHEDULE_TYPE_CHOICES = (
        ('available', 'Available'),
        ('maintenance', 'Maintenance'),
        ('blocked', 'Blocked'),
    )
    
    DAY_CHOICES = (
        ('monday', 'Monday'),
        ('tuesday', 'Tuesday'),
        ('wednesday', 'Wednesday'),
        ('thursday', 'Thursday'),
        ('friday', 'Friday'),
        ('saturday', 'Saturday'),
        ('sunday', 'Sunday'),
    )
    
    court = models.ForeignKey(Court, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.CharField(max_length=10, choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    schedule_type = models.CharField(max_length=20, choices=SCHEDULE_TYPE_CHOICES, default='available')
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'court_schedules'
        ordering = ['day_of_week', 'start_time']
    
    def __str__(self):
        return f"{self.court.name} - {self.day_of_week} {self.start_time}-{self.end_time}"


class Activity(models.Model):
    """Activity log for tracking user and admin actions"""
    
    ACTIVITY_TYPE_CHOICES = (
        ('booking', 'Booking'),
        ('cancellation', 'Cancellation'),
        ('modification', 'Modification'),
        ('payment', 'Payment'),
    )
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='activities')
    activity_type = models.CharField(max_length=20, choices=ACTIVITY_TYPE_CHOICES)
    description = models.TextField()
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, null=True, blank=True, related_name='activities')
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activities'
        ordering = ['-created_at']
        verbose_name_plural = 'Activities'
    
    def __str__(self):
        return f"{self.user.email} - {self.activity_type} - {self.created_at}"


class FutsalImage(models.Model):
    """Model for storing multiple images for each futsal venue"""
    
    futsal = models.ForeignKey(
        Futsal,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='futsal_gallery/')
    caption = models.CharField(max_length=200, blank=True)
    is_featured = models.BooleanField(default=False)
    display_order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'futsal_images'
        ordering = ['display_order', '-created_at']
    
    def __str__(self):
        return f"{self.futsal.name} - Image {self.id}"

