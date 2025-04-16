from django.urls import path
from .views import (
    ConovaCheckInView,
    ConovaLogoutView,
    ConovaPasswordChangeView,
    ConovaPasswordResetConfirmView,
    ConovaResendOTPView,
    ConovaUserDetailView,
    ConovaUserProfileView,
    ConovaUserRegistrationView,
    ConovaActivateUserView,
    ConovaLoginView,
    ConovaTokenRefreshView,
    ConovaResetPasswordView,
    ConovaUserView,
    ConovaVerifyOTPView,
    GoogleLoginView,
    # GoogleLogin,
)

urlpatterns = [
    path(
        "auth/register/",
        ConovaUserRegistrationView.as_view(),
        name="register",
    ),
    path(
        "auth/activate-user/",
        ConovaActivateUserView.as_view(),
        name="activate-user",
    ),
    path("auth/login/", ConovaLoginView.as_view(), name="login"),
    path("auth/refresh/", ConovaTokenRefreshView.as_view(), name="refresh"),
    path("auth/logout/", ConovaLogoutView.as_view(), name="logout"),
    path("auth/resend-otp/", ConovaResendOTPView.as_view(), name="resend-otp"),
    path(
        "auth/reset-password/",
        ConovaResetPasswordView.as_view(),
        name="reset-password",
    ),
    path("auth/verify-otp/", ConovaVerifyOTPView.as_view(), name="verify-otp"),
    path(
        "auth/reset-password-confirm/",
        ConovaPasswordResetConfirmView.as_view(),
        name="password-reset-confirm",
    ),
    path(
        "auth/change-password/",
        ConovaPasswordChangeView.as_view(),
        name="change-password",
    ),
    path("auth/users/", ConovaUserView.as_view(), name="users"),
    path(
        "auth/users/<int:pk>/",
        ConovaUserDetailView.as_view(),
        name="user-detail",
    ),
    path("auth/profile/", ConovaUserProfileView.as_view(), name="profile"),
    path("auth/google/", GoogleLoginView.as_view(), name="google_login"),
    path(
        "auth/check-in/<uuid:personal_token>/",
        ConovaCheckInView.as_view(),
        name="checkin-view",
    ),
]
