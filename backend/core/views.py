from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import ConovaCreateUserSerializer, ConovaActivateUserSerializer
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework import status
from .utils import generate_otp, verify_otp, set_cookies
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer


User = get_user_model()


class ConovaUserRegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        data = request.data
        email = data.get("email")
        serializer = ConovaCreateUserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        otp = generate_otp(email)
        send_mail(
            subject="Verify your account",
            message=f"Your otp is {otp} and is valid for 5 minutes.",
            from_email="<Conova <noreply@conova.ng.com>",
            recipient_list=[
                email,
            ],
        )
        return Response(
            {
                "message": "User registered successfully. An OTP has been sent to your email for verification.",
                "user": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class ConovaActivateUserView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ConovaActivateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        email = data.get("email")
        otp = data.get("otp")

        if verify_otp(email, otp):
            try:
                user = User.objects.get(email=email)
                user.is_active = True
                user.save()
            except User.DoesNotExist:
                return Response(
                    {"message": "No user with this email exist"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            return Response(
                {"message": "OTP verified, Account activated."},
                status=status.HTTP_200_OK,
            )
        return Response(
            {"message": "Invalid or expired OTP"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class ConovaLoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        email_field = User.EMAIL_FIELD
        email = request.data.get(email_field)

        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                return Response(
                    {"message": "Account is inactive, Please Verify your email."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        except User.DoesNotExist:
            pass

        try:
            response = super().post(request, *args, **kwargs)
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            set_cookies(response, "access_token", access_token)
            set_cookies(response, "refresh_token", refresh_token)

            response.data = {
                key: value
                for key, value in response.data.items()
                if key not in ["access", "refresh"]
            }

            response.data["message"] = "Login Successful."
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return response


class ConovaTokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response(
                {"message": "Refresh Token missing"},
            )
        serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
        try:
            serializer.is_valid(raise_exception=True)
            new_access_token = serializer.validated_data["access"]
        except TokenError:
            Response(
                {"message": "Invalid refresh Token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        
        response = Response({"message": "Token refreshed successfully."})
        
        set_cookies(response, "access_token", new_access_token)
        
        return response
