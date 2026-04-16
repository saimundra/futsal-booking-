from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FutsalViewSet, CourtViewSet, BookingViewSet, CourtScheduleViewSet, ActivityViewSet, FutsalImageViewSet

router = DefaultRouter()
router.register(r'futsals', FutsalViewSet, basename='futsal')
router.register(r'courts', CourtViewSet, basename='court')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'schedules', CourtScheduleViewSet, basename='schedule')
router.register(r'activities', ActivityViewSet, basename='activity')
router.register(r'futsal-images', FutsalImageViewSet, basename='futsal-image')

urlpatterns = [
    path('', include(router.urls)),
]
