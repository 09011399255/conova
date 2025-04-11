from django.urls import path
from .views import (
    ConovaLogoutView,
    ConovaUserRegistrationView,
    ConovaActivateUserView,
    ConovaLoginView,
    ConovaTokenRefreshView,
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
]
