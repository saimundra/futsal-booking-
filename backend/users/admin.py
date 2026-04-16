from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff']
    search_fields = ['email', 'username', 'first_name', 'last_name', 'phone']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {
            'fields': ('phone', 'role', 'profile_photo', 'bio', 'location', 'date_of_birth')
        }),
        ('Preferences', {
            'fields': ('email_notifications', 'sms_notifications', 'push_notifications',
                      'preferred_court_type', 'preferred_time_slot', 'default_players')
        }),
    )

