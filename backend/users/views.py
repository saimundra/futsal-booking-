from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from django.conf import settings
from django.utils.crypto import get_random_string
from django.utils import timezone
from django.core.mail import send_mail
from datetime import timedelta
import random
import re
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    ChangePasswordSerializer, UserProfileSerializer, AdminUserManageSerializer,
    GoogleAuthSerializer, VerifyEmailOtpSerializer, ResendEmailOtpSerializer
)

User = get_user_model()

OTP_EXPIRY_MINUTES = 10


def _build_unique_username(base_value):
    base = (base_value or 'player').strip().lower().replace(' ', '')
    base = re.sub(r'[^a-z0-9._+-]', '', base)
    base = base[:32]
    if not base:
        base = 'player'
    candidate = base
    while User.objects.filter(username=candidate).exists():
        candidate = f"{base}{get_random_string(4).lower()}"
    return candidate


def _generate_email_otp():
    return f"{random.randint(0, 999999):06d}"


def _set_user_email_otp(user):
    user.email_otp = _generate_email_otp()
    user.email_otp_expires_at = timezone.now() + timedelta(minutes=OTP_EXPIRY_MINUTES)
    user.save(update_fields=['email_otp', 'email_otp_expires_at'])


def _send_signup_otp_email(user):
    if not settings.EMAIL_HOST_PASSWORD:
        raise ValueError('EMAIL_HOST_PASSWORD is not configured for OTP email delivery.')

    subject = 'Your FutsalBooker verification code'
    message = (
        f"Hello {user.get_full_name() or user.username},\n\n"
        f"Your verification OTP is: {user.email_otp}\n"
        f"This code will expire in {OTP_EXPIRY_MINUTES} minutes.\n\n"
        "If you did not create this account, you can ignore this email.\n\n"
        "FutsalBooker Team"
    )

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )


class IsAdminRole(permissions.BasePermission):
    """Allow access only to users with admin role."""

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'admin')


class UserRegistrationView(generics.CreateAPIView):
    """API endpoint for user registration"""
    
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        try:
            _set_user_email_otp(user)
            _send_signup_otp_email(user)
        except Exception as exc:
            return Response({
                'error': f'Could not send verification OTP: {str(exc)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({
            'user': UserSerializer(user).data,
            'requires_verification': True,
            'email': user.email,
            'message': 'Signup successful. Please verify your email with OTP.'
        }, status=status.HTTP_201_CREATED)


class UserLoginView(APIView):
    """API endpoint for user login"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        # Get user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        if not user.email_verified and user.has_usable_password():
            return Response({
                'error': 'Email not verified. Please verify your email with OTP before login.'
            }, status=status.HTTP_403_FORBIDDEN)

        # Authenticate user using email (USERNAME_FIELD)
        user = authenticate(email=email, password=password)
        
        if user is None:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)


class GoogleAuthView(APIView):
    """API endpoint for login/signup with Google and JWT issuance."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        google_client_id = getattr(settings, 'GOOGLE_CLIENT_ID', '')
        if not google_client_id:
            return Response({'error': 'Google auth is not configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        credential = serializer.validated_data['credential']

        try:
            token_info = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                google_client_id,
            )
        except ValueError:
            return Response({'error': 'Invalid Google token.'}, status=status.HTTP_401_UNAUTHORIZED)

        email = token_info.get('email')
        email_verified = token_info.get('email_verified', False)
        if not email or not email_verified:
            return Response({'error': 'Google account email is not verified.'}, status=status.HTTP_400_BAD_REQUEST)

        first_name = token_info.get('given_name', '')
        last_name = token_info.get('family_name', '')
        preferred_username = token_info.get('name') or email.split('@')[0]

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': _build_unique_username(preferred_username),
                'first_name': first_name,
                'last_name': last_name,
                'role': 'player',
                'email_verified': True,
            },
        )

        if created:
            user.set_unusable_password()
            user.save(update_fields=['password'])
        else:
            updated_fields = []
            if not user.email_verified:
                user.email_verified = True
                user.email_otp = None
                user.email_otp_expires_at = None
                updated_fields.extend(['email_verified', 'email_otp', 'email_otp_expires_at'])
            if not user.first_name and first_name:
                user.first_name = first_name
                updated_fields.append('first_name')
            if not user.last_name and last_name:
                user.last_name = last_name
                updated_fields.append('last_name')
            if updated_fields:
                user.save(update_fields=updated_fields)

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Google signup successful' if created else 'Google login successful'
        }, status=status.HTTP_200_OK)


class VerifyEmailOtpView(APIView):
    """Verify manual signup email OTP and issue JWT tokens."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyEmailOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user.email_verified:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'message': 'Email already verified.'
            }, status=status.HTTP_200_OK)

        if not user.email_otp or user.email_otp != otp:
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.email_otp_expires_at or user.email_otp_expires_at < timezone.now():
            return Response({'error': 'OTP expired. Please request a new OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        user.email_verified = True
        user.email_otp = None
        user.email_otp_expires_at = None
        user.save(update_fields=['email_verified', 'email_otp', 'email_otp_expires_at'])

        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Email verified successfully.'
        }, status=status.HTTP_200_OK)


class ResendEmailOtpView(APIView):
    """Resend OTP for manual signup email verification."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResendEmailOtpSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        if user.email_verified:
            return Response({'message': 'Email is already verified.'}, status=status.HTTP_200_OK)

        try:
            _set_user_email_otp(user)
            _send_signup_otp_email(user)
        except Exception as exc:
            return Response({
                'error': f'Could not resend OTP: {str(exc)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': 'OTP sent successfully.'}, status=status.HTTP_200_OK)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """API endpoint for user profile"""
    
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """API endpoint for changing password"""
    
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        
        # Check old password
        if not user.check_password(serializer.validated_data['old_password']):
            return Response({
                'error': 'Old password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Set new password
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)


class UserListView(generics.ListAPIView):
    """API endpoint for listing all users (admin only)"""
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role != 'admin':
            return User.objects.none()
        return User.objects.all()


class AdminUserListCreateView(generics.ListCreateAPIView):
    """Admin-only endpoint for listing and creating users."""

    queryset = User.objects.all()
    serializer_class = AdminUserManageSerializer
    permission_classes = [IsAdminRole]


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Admin-only endpoint for updating and deleting users."""

    queryset = User.objects.all()
    serializer_class = AdminUserManageSerializer
    permission_classes = [IsAdminRole]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.id == request.user.id:
            return Response({'error': 'You cannot delete your own account.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

