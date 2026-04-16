from rest_framework import serializers
from .models import Futsal, Court, Booking, CourtSchedule, Activity, FutsalImage
from users.serializers import UserSerializer


class FutsalImageSerializer(serializers.ModelSerializer):
    """Serializer for FutsalImage model"""
    
    class Meta:
        model = FutsalImage
        fields = ['id', 'image', 'caption', 'is_featured', 'display_order', 'created_at']
        read_only_fields = ['id', 'created_at']


class FutsalSerializer(serializers.ModelSerializer):
    """Serializer for Futsal venue model"""
    
    owner_details = UserSerializer(source='owner', read_only=True)
    owner_name = serializers.SerializerMethodField()
    total_courts = serializers.SerializerMethodField()
    courts = serializers.SerializerMethodField()
    images = FutsalImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Futsal
        fields = [
            'id', 'name', 'owner', 'owner_details', 'owner_name',
            'address', 'city', 'state', 'postal_code', 'latitude', 'longitude',
            'contact_phone', 'contact_email', 'website', 'map_link',
            'description', 'amenities', 'operating_hours', 'payment_methods',
            'logo', 'cover_image', 'images', 'is_active', 'is_verified',
            'total_courts', 'courts', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'owner', 'is_verified', 'created_at', 'updated_at']
    
    def get_owner_name(self, obj):
        return obj.owner.get_full_name() if obj.owner else ""
    
    def get_total_courts(self, obj):
        return obj.courts.filter(is_active=True).count()
    
    def get_courts(self, obj):
        courts = obj.courts.filter(is_active=True)
        return CourtSimpleSerializer(courts, many=True).data


class FutsalCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating futsal venues"""
    
    class Meta:
        model = Futsal
        fields = [
            'name', 'address', 'city', 'state', 'postal_code',
            'latitude', 'longitude', 'contact_phone', 'contact_email',
            'website', 'map_link', 'description', 'amenities', 'operating_hours',
            'payment_methods', 'logo', 'cover_image', 'is_active'
        ]

class CourtSimpleSerializer(serializers.ModelSerializer):
    """Simplified Court serializer without futsal details to avoid circular imports"""
    
    class Meta:
        model = Court
        fields = [
            'id', 'name', 'court_number', 'court_type', 'surface_type',
            'description', 'length', 'width', 'max_players', 'hourly_rate',
            'is_active', 'has_lighting', 'has_changing_rooms', 'has_parking',
            'image'
        ]

class CourtSerializer(serializers.ModelSerializer):
    """Serializer for Court model"""
    
    futsal_details = FutsalSerializer(source='futsal', read_only=True)
    futsal_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Court
        fields = [
            'id', 'futsal', 'futsal_details', 'futsal_name',
            'name', 'court_number', 'court_type', 'surface_type',
            'description', 'length', 'width', 'max_players', 'hourly_rate',
            'is_active', 'has_lighting', 'has_changing_rooms', 'has_parking',
            'image', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_futsal_name(self, obj):
        return obj.futsal.name if obj.futsal else "N/A"


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for Booking model"""
    
    user_details = UserSerializer(source='user', read_only=True)
    court_details = CourtSerializer(source='court', read_only=True)
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()
    court_name = serializers.SerializerMethodField()
    futsal_name = serializers.SerializerMethodField()
    court_type = serializers.SerializerMethodField()
    court_image = serializers.SerializerMethodField()
    
    class Meta:
        model = Booking
        fields = [
            'id', 'booking_id', 'user', 'user_details', 'court', 'court_details',
            'customer_name', 'customer_email', 'customer_phone', 'court_name',
            'futsal_name', 'court_type', 'court_image',
            'date', 'start_time', 'end_time', 'duration', 'number_of_players',
            'status', 'amount', 'payment_status', 'payment_method', 'transaction_id',
            'notes', 'created_at', 'updated_at', 'confirmed_at', 'cancelled_at'
        ]
        read_only_fields = ['id', 'booking_id', 'created_at', 'updated_at']
    
    def get_customer_name(self, obj):
        return obj.user.get_full_name()
    
    def get_customer_email(self, obj):
        return obj.user.email
    
    def get_customer_phone(self, obj):
        return obj.user.phone
    
    def get_court_name(self, obj):
        return obj.court.name
    
    def get_futsal_name(self, obj):
        return obj.court.futsal.name if obj.court and obj.court.futsal else "N/A"
    
    def get_court_type(self, obj):
        return obj.court.court_type if obj.court else "indoor"
    
    def get_court_image(self, obj):
        request = self.context.get('request')
        
        # Try court image first
        if obj.court and obj.court.image:
            if request:
                return request.build_absolute_uri(obj.court.image.url)
            return obj.court.image.url
        
        # Fallback to futsal cover image
        if obj.court and obj.court.futsal and obj.court.futsal.cover_image:
            if request:
                return request.build_absolute_uri(obj.court.futsal.cover_image.url)
            return obj.court.futsal.cover_image.url
        
        return None


class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating bookings"""
    
    class Meta:
        model = Booking
        fields = [
            'court', 'date', 'start_time', 'end_time', 'duration',
            'number_of_players', 'amount', 'payment_method', 'notes'
        ]
    
    def validate(self, data):
        # Check if court is available for the given time slot
        court = data.get('court')
        date = data.get('date')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        
        # Check for overlapping bookings
        overlapping = Booking.objects.filter(
            court=court,
            date=date,
            status__in=['pending', 'confirmed']
        ).filter(
            start_time__lt=end_time,
            end_time__gt=start_time
        )
        
        if overlapping.exists():
            raise serializers.ValidationError("This time slot is already booked.")
        
        return data


class CourtScheduleSerializer(serializers.ModelSerializer):
    """Serializer for CourtSchedule model"""
    
    court_details = CourtSerializer(source='court', read_only=True)
    
    class Meta:
        model = CourtSchedule
        fields = [
            'id', 'court', 'court_details', 'day_of_week', 'start_time',
            'end_time', 'schedule_type', 'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ActivitySerializer(serializers.ModelSerializer):
    """Serializer for Activity model"""
    
    user_details = UserSerializer(source='user', read_only=True)
    booking_details = BookingSerializer(source='booking', read_only=True)
    
    class Meta:
        model = Activity
        fields = [
            'id', 'user', 'user_details', 'activity_type', 'description',
            'booking', 'booking_details', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class BookingStatisticsSerializer(serializers.Serializer):
    """Serializer for booking statistics"""
    
    total_bookings = serializers.IntegerField()
    confirmed_bookings = serializers.IntegerField()
    pending_bookings = serializers.IntegerField()
    cancelled_bookings = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=10, decimal_places=2)
    total_hours_booked = serializers.DecimalField(max_digits=10, decimal_places=2)
