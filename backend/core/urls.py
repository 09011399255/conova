from django.urls import path
from .views import (
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
]
