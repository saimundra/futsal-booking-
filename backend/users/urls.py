from django.urls import path
from .views import (
    UserRegistrationView, UserLoginView, UserProfileView,
    ChangePasswordView, UserListView, AdminUserListCreateView, AdminUserDetailView,
    GoogleAuthView, VerifyEmailOtpView, ResendEmailOtpView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('google-auth/', GoogleAuthView.as_view(), name='google-auth'),
    path('verify-email-otp/', VerifyEmailOtpView.as_view(), name='verify-email-otp'),
    path('resend-email-otp/', ResendEmailOtpView.as_view(), name='resend-email-otp'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('list/', UserListView.as_view(), name='user-list'),
    path('manage/', AdminUserListCreateView.as_view(), name='admin-user-list-create'),
    path('manage/<int:pk>/', AdminUserDetailView.as_view(), name='admin-user-detail'),
]
