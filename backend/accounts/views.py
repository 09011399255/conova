from django.urls import reverse
from rest_framework.generics import ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.views import APIView
from .serializers import (
    ConovaUserSerializer,
    ConovaCreateUserSerializer,
    ConovaActivateUserSerializer,
    ConovaPasswordChangeSerializer,
    ConovaPasswordResetConfirmSerializer,
    ConovaResetPasswordSerializer,
)
from .serializers import ConovaResetPasswordSerializer as ConovaResendOTPSerializer
from django.core.mail import send_mail
from rest_framework.response import Response
from rest_framework import status
from core.utils import (
    generate_otp,
    generate_qr_code,
    generate_token,
    verify_otp,
    set_cookies,
    verify_token,
    send_conova_email,
)
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.serializers import (
    TokenRefreshSerializer,
    TokenObtainPairSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from google.oauth2 import id_token
from google.auth.transport import requests
from django.utils.crypto import get_random_string
from drf_spectacular.utils import extend_schema, OpenApiTypes


User = get_user_model()


class ConovaUserView(ListAPIView):
    serializer_class = ConovaUserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]


class ConovaUserDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ConovaUserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]


class ConovaUserProfileView(RetrieveUpdateDestroyAPIView):
    serializer_class = ConovaUserSerializer
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ConovaUserRegistrationView(APIView):

    @extend_schema(
        request=ConovaCreateUserSerializer,
        responses={
            status.HTTP_201_CREATED: ConovaCreateUserSerializer,
            status.HTTP_400_BAD_REQUEST: OpenApiTypes.OBJECT,
        },
        description="The Enpoints registers a new user and send OTP for verification",
    )
    def post(self, request, *args, **kwargs):
        data = request.data
        email = data.get("email")
        serializer = ConovaCreateUserSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        otp = generate_otp(email)
        checkin_url = request.build_absolute_uri(
            reverse("checkin-view", kwargs={"personal_token": user.personal_token})
        )
        user.qr_code_image = generate_qr_code(checkin_url)
        user.save()
        send_conova_email(
                subject="Verify your account",
                template_name="emails/test_email.html",
                to=[email],
                context={"otp": otp, "user": user.full_name}
            )
        return Response(
            {
                "message": "User registered successfully. An OTP has been sent to your email for verification.",
                "user": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class ConovaActivateUserView(APIView):

    @extend_schema(
        request=ConovaActivateUserSerializer,
        responses={
            status.HTTP_200_OK: "OTP verified, Accounts activated successfully.",
            status.HTTP_400_BAD_REQUEST: OpenApiTypes.OBJECT,
        },
        description="Activates a user account using an OTP sent to their email.",
    )
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
    @extend_schema(
        request=TokenObtainPairSerializer,
        responses={
            status.HTTP_200_OK: OpenApiTypes.OBJECT,  # Adjust if you have a specific success serializer
            status.HTTP_401_UNAUTHORIZED: OpenApiTypes.OBJECT,
        },
        description="Logs in an existing user and returns access and refresh tokens (set as cookies).",
    )
    def post(self, request, *args, **kwargs):
        email_field = User.EMAIL_FIELD
        email = request.data.get(email_field)

        try:
            user = User.objects.get(email=email)
            print(user.role)
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
            response.data["role"] = user.role

        except TokenError as e:
            raise InvalidToken(e.args[0])

        return response


class ConovaTokenRefreshView(APIView):
    @extend_schema(
        # request=TokenRefreshSerializer,n
        responses={
            status.HTTP_200_OK: OpenApiTypes.OBJECT,
            status.HTTP_401_UNAUTHORIZED: OpenApiTypes.OBJECT,
        },
        description="The endpoint receives a post request from authenticated user to refresh token ",
    )
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


class ConovaLogoutView(APIView):
    @extend_schema(
        request=TokenObtainPairSerializer,
        responses={
            status.HTTP_200_OK: OpenApiTypes.OBJECT,
            status.HTTP_401_UNAUTHORIZED: OpenApiTypes.OBJECT,
        },
        description="Logs out an authenticated user and clear access and refresh tokens from cookies.",
    )
    def post(self, request):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            return Response({"message": "Refresh Token missing"})
        try:
            refresh = RefreshToken(refresh_token)
            refresh.blacklist()
        except Exception:
            pass

        response = Response(
            {"message": "Logged out successfully."},
            status=status.HTTP_200_OK,
        )

        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response


class ConovaResetPasswordView(APIView):
    def post(self, request):
        data = request.data
        serializer = ConovaResetPasswordSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serialized_data = serializer.data
        email = serialized_data.get("email").strip().lower()
        try:
            user = User.objects.get(email=email)
            otp = generate_otp(email)
            send_conova_email(
                subject="Password reset",
                template_name="emails/test_email.html",
                to=[email],
                context={"otp": otp, "user": user.full_name}
            )
        except User.DoesNotExist:
            pass

        return Response(
            {
                "message": "If you entered a valid email, you'll receive an OTP to reset your password."
            },
            status=status.HTTP_200_OK,
        )


class ConovaVerifyOTPView(APIView):
    def post(self, request):
        serializer = ConovaActivateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        email = data.get("email")
        otp = data.get("otp")

        if verify_otp(email, otp):
            User.objects.get(email=email)
            token = generate_token(email)

            return Response(
                {"message": "OTP verified successully.", "token": token},
                status=status.HTTP_200_OK,
            )

        return Response(
            {"message": "Invalid or expired otp"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class ConovaPasswordResetConfirmView(APIView):
    def post(self, request):
        serializer = ConovaPasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        password = request.data.get("new_password")
        email = serializer.data.get("email").strip().lower()
        token = serializer.data.get("token")
        if verify_token(email, token):
            try:
                user = User.objects.get(email=email)
                user.set_password(password)
                user.save()
                send_mail(
                    subject="Password reset successful",
                    message="Your password was successfully reset. If this wasn't you, please contact support immediately.",
                    from_email="<Conova <noreply@conova.ng.com>",
                    recipient_list=[
                        email,
                    ],
                )
                return Response({"message": "Password reset successful."})
            except User.DoesNotExist:
                pass
        return Response({"message": "Invalid or expired token."})


class ConovaPasswordChangeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ConovaPasswordChangeSerializer(
            data=request.data,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        response = Response(
            {"message": "Password change successfully and you've been logged out."},
            status=status.HTTP_200_OK,
        )
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        return response


class ConovaResendOTPView(APIView):
    def post(self, request):
        serializer = ConovaResendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.data.get("email")
        otp = generate_otp(email)
        try:
            User.objects.get(email=email)
            send_mail(
                subject="Verify your account",
                message=f"Your otp is {otp} and is valid for 10 minutes.",
                from_email="<Conova <noreply@conova.ng.com>",
                recipient_list=[
                    email,
                ],
            )
        except User.DoesNotExist:
            pass
        return Response(
            {"message": "OTP resend successfully."},
            status=status.HTTP_200_OK,
        )


class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get("token", None)
        if not token:
            return Response(
                {"message": "Google token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # verify the token
            id_info = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_OAUTH2_CLIENT_ID,
            )

            # Check issure
            if id_info["iss"] not in [
                "accounts.google.com",
                "https://accounts.google.com",
            ]:
                return Response(
                    {"message": "Wrong issuer"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Get or create user
            email = id_info["email"]

            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Create a new user
                user = User.objects.create_user(
                    email=email,
                    full_name=id_info.get("name", ""),
                    password=get_random_string(12),
                    avatar=id_info.get("picture"),
                )

            checkin_url = request.build_absolute_uri(
                reverse("checkin-view", kwargs={"personal_token": user.personal_token})
            )
            user.qr_code_image = generate_qr_code(checkin_url)
            user.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response = Response(
                {
                    "message": "User Sign in successfully.",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "full_name": user.full_name,
                    },
                }
            )

            set_cookies(response, "access_token", access_token)
            set_cookies(response, "refresh_token", refresh_token)

            return response

        except ValueError:
            return Response(
                {"message": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
            )

        print(token)
        return Response("Sucess")


class ConovaCheckInView(APIView):
    def post(self, request):
        pass
