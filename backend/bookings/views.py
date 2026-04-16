from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Q, Count
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Futsal, Court, Booking, CourtSchedule, Activity, FutsalImage
from .serializers import (
    FutsalSerializer, FutsalCreateSerializer,
    CourtSerializer, BookingSerializer, BookingCreateSerializer,
    CourtScheduleSerializer, ActivitySerializer, BookingStatisticsSerializer,
    FutsalImageSerializer
)


class IsAdminUser(permissions.BasePermission):
    """Custom permission to only allow admin users"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'admin'


class IsFutsalOwnerOrAdmin(permissions.BasePermission):
    """Custom permission for futsal owners to manage their own futsals"""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and \
               request.user.role in ['futsal_owner', 'admin']
    
    def has_object_permission(self, request, view, obj):
        # Admin can access all
        if request.user.role == 'admin':
            return True
        # Owner can only access their own futsal
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        # For courts, check if user owns the futsal
        if hasattr(obj, 'futsal') and obj.futsal:
            return obj.futsal.owner == request.user
        return False


class FutsalViewSet(viewsets.ModelViewSet):
    """ViewSet for Futsal venue management"""
    
    queryset = Futsal.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return FutsalCreateSerializer
        return FutsalSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsFutsalOwnerOrAdmin()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        queryset = Futsal.objects.all()
        
        # Debug logging
        import logging
        logger = logging.getLogger(__name__)
        logger.info(f"User: {self.request.user}, Is authenticated: {self.request.user.is_authenticated}, Role: {self.request.user.role if self.request.user.is_authenticated else 'N/A'}")
        
        # For delete/update operations, allow access to owned futsals
        if self.action in ['destroy', 'update', 'partial_update', 'retrieve']:
            if self.request.user.is_authenticated and self.request.user.role == 'futsal_owner':
                return queryset.filter(Q(owner=self.request.user) | Q(is_active=True))
            elif self.request.user.is_authenticated and self.request.user.role == 'admin':
                return queryset
        
        # Filter by city
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(city__icontains=city)
        
        # Check if requesting own futsals (my=true parameter)
        my_param = self.request.query_params.get('my', None)
        logger.info(f"my_param: {my_param}, Action: {self.action}")
        if my_param and my_param.lower() == 'true' and self.request.user.is_authenticated:
            if self.request.user.role == 'futsal_owner':
                logger.info(f"Filtering futsals for owner: {self.request.user.email}")
                return queryset.filter(owner=self.request.user)
            elif self.request.user.role == 'admin':
                return queryset  # Admins can see all
        
        # For public listing, show only active futsals
        # Futsal owners can see all futsals (including their own inactive ones) when not using my=true
        if self.request.user.is_authenticated and self.request.user.role == 'futsal_owner':
            queryset = queryset.filter(
                Q(is_active=True) | Q(owner=self.request.user)
            )
        else:
            # For players and unauthenticated users, show only active futsals
            queryset = queryset.filter(is_active=True)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
    
    def perform_destroy(self, instance):
        """Override destroy to ensure proper permission checking"""
        if self.request.user.role != 'admin' and instance.owner != self.request.user:
            raise permissions.PermissionDenied("You can only delete your own futsals.")
        instance.delete()
    
    @action(detail=False, methods=['get'], permission_classes=[IsFutsalOwnerOrAdmin])
    def my_futsals(self, request):
        """Get futsals owned by the current user"""
        futsals = Futsal.objects.filter(owner=request.user)
        serializer = self.get_serializer(futsals, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def courts(self, request, pk=None):
        """Get all courts for a specific futsal"""
        futsal = self.get_object()
        courts = futsal.courts.filter(is_active=True)
        from .serializers import CourtSerializer
        serializer = CourtSerializer(courts, many=True)
        return Response(serializer.data)


class CourtViewSet(viewsets.ModelViewSet):
    """ViewSet for Court model"""
    
    queryset = Court.objects.select_related('futsal', 'futsal__owner').all()
    serializer_class = CourtSerializer
    
    def get_permissions(self):
        # Require authentication for list/retrieve if ?my=true is present
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsFutsalOwnerOrAdmin()]
        if self.action in ['list', 'retrieve']:
            my_param = self.request.query_params.get('my')
            if my_param:
                return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        queryset = Court.objects.select_related('futsal', 'futsal__owner').all()
        
        # Check if requesting own courts (my=true parameter)
        my_param = self.request.query_params.get('my', None)
        if my_param and my_param.lower() == 'true' and self.request.user.is_authenticated:
            if self.request.user.role == 'futsal_owner':
                # Return only courts belonging to futsals owned by this user
                queryset = queryset.filter(futsal__owner=self.request.user)
            elif self.request.user.role == 'admin':
                pass  # Admins can see all
        else:
            # For public listing, only show active courts
            if self.action in ['list', 'retrieve']:
                queryset = queryset.filter(is_active=True)
        
        # Filter by futsal
        futsal_id = self.request.query_params.get('futsal', None)
        if futsal_id:
            queryset = queryset.filter(futsal_id=futsal_id)
        
        # Filter by city
        city = self.request.query_params.get('city', None)
        if city:
            queryset = queryset.filter(futsal__city__icontains=city)
        
        return queryset
    
    def perform_create(self, serializer):
        # Ensure futsal owner can only create courts for their own futsal
        futsal = serializer.validated_data.get('futsal')
        if self.request.user.role == 'futsal_owner' and futsal.owner != self.request.user:
            raise permissions.PermissionDenied("You can only create courts for your own futsal.")
        serializer.save()
    
    def perform_update(self, serializer):
        # Ensure futsal owner can only update their own courts
        court = self.get_object()
        if self.request.user.role == 'futsal_owner':
            if not court.futsal or court.futsal.owner != self.request.user:
                raise permissions.PermissionDenied("You can only update your own courts.")
        serializer.save()
    
    def perform_destroy(self, instance):
        # Ensure futsal owner can only delete their own courts
        if self.request.user.role == 'futsal_owner':
            if not instance.futsal or instance.futsal.owner != self.request.user:
                raise permissions.PermissionDenied("You can only delete your own courts.")
        instance.delete()
    
    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        """Get court availability for a specific date"""
        court = self.get_object()
        date_str = request.query_params.get('date')
        
        if not date_str:
            return Response({
                'error': 'Date parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({
                'error': 'Invalid date format. Use YYYY-MM-DD'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get all bookings for this court on this date
        bookings = Booking.objects.filter(
            court=court,
            date=date,
            status__in=['pending', 'confirmed']
        ).values('start_time', 'end_time')
        
        return Response({
            'court': CourtSerializer(court).data,
            'date': date,
            'booked_slots': list(bookings)
        })


class BookingViewSet(viewsets.ModelViewSet):
    """ViewSet for Booking model"""
    
    queryset = Booking.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer
    
    def get_serializer_context(self):
        """Ensure request is in serializer context for building absolute URIs"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        user = self.request.user
        queryset = Booking.objects.all()
        
        if user.role == 'admin':
            return queryset
        elif user.role == 'futsal_owner':
            # Check if requesting own bookings
            my_param = self.request.query_params.get('my', None)
            if my_param and my_param.lower() == 'true':
                # Return bookings for courts in futsals owned by this user
                return queryset.filter(court__futsal__owner=user)
            # Otherwise return bookings made by this user as a player
            return queryset.filter(user=user)
        else:
            # Players see only their own bookings
            return queryset.filter(user=user)
    
    def perform_create(self, serializer):
        booking = serializer.save(user=self.request.user)
        
        # Create activity log
        Activity.objects.create(
            user=self.request.user,
            activity_type='booking',
            description=f'Created booking for {booking.court.name} on {booking.date}',
            booking=booking
        )
    
    @action(detail=True, methods=['post'])
    def confirm(self, request, pk=None):
        """Confirm a booking (admin only)"""
        if request.user.role != 'admin':
            return Response({
                'error': 'Only admins can confirm bookings'
            }, status=status.HTTP_403_FORBIDDEN)
        
        booking = self.get_object()
        booking.status = 'confirmed'
        booking.confirmed_at = timezone.now()
        booking.save()
        
        Activity.objects.create(
            user=request.user,
            activity_type='booking',
            description=f'Confirmed booking {booking.booking_id}',
            booking=booking
        )
        
        return Response({
            'message': 'Booking confirmed successfully',
            'booking': BookingSerializer(booking).data
        })
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a booking"""
        booking = self.get_object()
        
        # Check if user is allowed to cancel
        if request.user != booking.user and request.user.role != 'admin':
            return Response({
                'error': 'You do not have permission to cancel this booking'
            }, status=status.HTTP_403_FORBIDDEN)
        
        booking.status = 'cancelled'
        booking.cancelled_at = timezone.now()
        booking.save()
        
        Activity.objects.create(
            user=request.user,
            activity_type='cancellation',
            description=f'Cancelled booking {booking.booking_id}',
            booking=booking
        )
        
        return Response({
            'message': 'Booking cancelled successfully',
            'booking': BookingSerializer(booking).data
        })
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming bookings for the current user"""
        today = timezone.now().date()
        bookings = self.get_queryset().filter(
            date__gte=today,
            status__in=['pending', 'confirmed']
        ).order_by('date', 'start_time')
        
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def past(self, request):
        """Get past bookings for the current user"""
        today = timezone.now().date()
        bookings = self.get_queryset().filter(
            Q(date__lt=today) | Q(status='completed')
        ).order_by('-date', '-start_time')
        
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get booking statistics (admin only)"""
        if request.user.role != 'admin':
            return Response({
                'error': 'Only admins can view statistics'
            }, status=status.HTTP_403_FORBIDDEN)
        
        total_bookings = Booking.objects.count()
        confirmed_bookings = Booking.objects.filter(status='confirmed').count()
        pending_bookings = Booking.objects.filter(status='pending').count()
        cancelled_bookings = Booking.objects.filter(status='cancelled').count()
        
        total_revenue = Booking.objects.filter(
            payment_status='paid'
        ).aggregate(Sum('amount'))['amount__sum'] or 0
        
        total_hours = Booking.objects.filter(
            status__in=['confirmed', 'completed']
        ).aggregate(Sum('duration'))['duration__sum'] or 0
        
        data = {
            'total_bookings': total_bookings,
            'confirmed_bookings': confirmed_bookings,
            'pending_bookings': pending_bookings,
            'cancelled_bookings': cancelled_bookings,
            'total_revenue': total_revenue,
            'total_hours_booked': total_hours
        }
        
        serializer = BookingStatisticsSerializer(data)
        return Response(serializer.data)


class CourtScheduleViewSet(viewsets.ModelViewSet):
    """ViewSet for CourtSchedule model"""
    
    queryset = CourtSchedule.objects.all()
    serializer_class = CourtScheduleSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsFutsalOwnerOrAdmin()]
        return [permissions.IsAuthenticated()]
    
    def perform_create(self, serializer):
        # Verify the user owns the futsal that the court belongs to
        court = serializer.validated_data.get('court')
        user = self.request.user
        
        print(f"DEBUG: User role: {user.role}")
        print(f"DEBUG: Court ID: {court.id}")
        print(f"DEBUG: Court futsal: {court.futsal}")
        print(f"DEBUG: Court futsal owner: {court.futsal.owner if court.futsal else 'No futsal'}")
        print(f"DEBUG: Current user: {user}")
        
        if user.role == 'futsal_owner':
            if not court.futsal:
                raise permissions.PermissionDenied("Court does not belong to any futsal venue")
            if court.futsal.owner != user:
                raise permissions.PermissionDenied(f"You can only create schedules for your own courts. Court belongs to {court.futsal.owner}, you are {user}")
        serializer.save()


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Activity model"""
    
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Activity.objects.all()
        return Activity.objects.filter(user=user)


class FutsalImageViewSet(viewsets.ModelViewSet):
    """ViewSet for FutsalImage model - manage futsal gallery images"""
    
    queryset = FutsalImage.objects.all()
    serializer_class = FutsalImageSerializer
    permission_classes = [IsFutsalOwnerOrAdmin]
    
    def get_queryset(self):
        queryset = FutsalImage.objects.all()
        
        # Filter by futsal if provided
        futsal_id = self.request.query_params.get('futsal', None)
        if futsal_id:
            queryset = queryset.filter(futsal_id=futsal_id)
        
        # For futsal owners, only show images from their own futsals
        if self.request.user.is_authenticated and self.request.user.role == 'futsal_owner':
            queryset = queryset.filter(futsal__owner=self.request.user)
        
        return queryset
    
    def perform_create(self, serializer):
        # Verify the user owns the futsal
        futsal_id = self.request.data.get('futsal')
        if not futsal_id:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'futsal': 'Futsal ID is required'})
        
        try:
            futsal = Futsal.objects.get(id=futsal_id)
            if self.request.user.role != 'admin' and futsal.owner != self.request.user:
                raise permissions.PermissionDenied("You can only add images to your own futsals.")
            serializer.save(futsal=futsal)
        except Futsal.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'futsal': 'Futsal not found'})

