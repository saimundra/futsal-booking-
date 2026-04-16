from django.contrib import admin
from .models import Futsal, Court, Booking, CourtSchedule, Activity, FutsalImage


class FutsalImageInline(admin.TabularInline):
    model = FutsalImage
    extra = 3
    fields = ['image', 'caption', 'is_featured', 'display_order']


@admin.register(Futsal)
class FutsalAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'city', 'contact_phone', 'is_active', 'is_verified']
    list_filter = ['is_active', 'is_verified', 'city']
    search_fields = ['name', 'city', 'owner__email', 'description']
    ordering = ['name']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [FutsalImageInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'owner', 'description')
        }),
        ('Location', {
            'fields': ('address', 'city', 'state', 'postal_code', 'latitude', 'longitude', 'map_link')
        }),
        ('Contact', {
            'fields': ('contact_phone', 'contact_email', 'website')
        }),
        ('Business Details', {
            'fields': ('amenities', 'operating_hours', 'payment_methods')
        }),
        ('Media', {
            'fields': ('logo', 'cover_image')
        }),
        ('Status', {
            'fields': ('is_active', 'is_verified', 'created_at', 'updated_at')
        }),
    )


@admin.register(Court)
class CourtAdmin(admin.ModelAdmin):
    list_display = ['court_number', 'name', 'futsal', 'court_type', 'surface_type', 'hourly_rate', 'is_active']
    list_filter = ['court_type', 'surface_type', 'is_active', 'futsal']
    search_fields = ['name', 'court_number', 'description', 'futsal__name']
    ordering = ['futsal', 'court_number']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['booking_id', 'user', 'court', 'date', 'start_time', 'end_time', 'status', 'payment_status', 'amount']
    list_filter = ['status', 'payment_status', 'date']
    search_fields = ['booking_id', 'user__email', 'court__name']
    ordering = ['-created_at']
    readonly_fields = ['booking_id', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Booking Information', {
            'fields': ('booking_id', 'user', 'court', 'date', 'start_time', 'end_time', 'duration', 'number_of_players')
        }),
        ('Status', {
            'fields': ('status', 'confirmed_at', 'cancelled_at')
        }),
        ('Payment', {
            'fields': ('amount', 'payment_status', 'payment_method', 'transaction_id')
        }),
        ('Additional', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )


@admin.register(CourtSchedule)
class CourtScheduleAdmin(admin.ModelAdmin):
    list_display = ['court', 'day_of_week', 'start_time', 'end_time', 'schedule_type']
    list_filter = ['day_of_week', 'schedule_type', 'court']
    search_fields = ['court__name']
    ordering = ['court', 'day_of_week', 'start_time']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['user', 'activity_type', 'booking', 'created_at']
    list_filter = ['activity_type', 'created_at']
    search_fields = ['user__email', 'description']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


@admin.register(FutsalImage)
class FutsalImageAdmin(admin.ModelAdmin):
    list_display = ['futsal', 'caption', 'is_featured', 'display_order', 'created_at']
    list_filter = ['is_featured', 'futsal']
    search_fields = ['futsal__name', 'caption']
    ordering = ['futsal', 'display_order', '-created_at']

