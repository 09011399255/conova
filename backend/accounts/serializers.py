from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth import get_user_model
from core.models import ConovaUser


User = get_user_model()


class ConovaCreateUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        style={"input_field": "password"},
    )

    re_password = serializers.CharField(
        write_only=True,
        style={"input_field": "password"},
    )

    def validate(self, attrs):
        password = attrs["password"]
        confirm_password = attrs["re_password"]
        email = attrs["email"]
        attrs["is_active"] = False

        if password != confirm_password:
            raise serializers.ValidationError(
                {"message": "Passwords do not match"},
            )
        try:
            validate_password(password, user=User(email=email))
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        return attrs

    def create(self, validated_data):
        validated_data.pop("re_password")
        return ConovaUser.objects.create_user(**validated_data)

    class Meta:
        model = ConovaUser
        fields = (
            "id",
            "full_name",
            "role",
            "email",
            "password",
            "re_password",
        )


class ConovaUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConovaUser
        fields = (
            "id",
            "full_name",
            "email",
            "role",
            "qr_code_image",
        )


class ConovaActivateUserSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(required=True)

    def validate_email(self, data):
        return data.strip().lower()


class ConovaResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, data):
        return data.strip().lower()


class ConovaPasswordResetConfirmSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    new_password = serializers.CharField(
        write_only=True,
        style={"input_field": "password"},
    )
    re_new_password = serializers.CharField(
        write_only=True,
        style={"input_field": "password"},
    )
    token = serializers.CharField()

    def validate(self, attrs):
        password = attrs["new_password"]
        confirm__password = attrs["re_new_password"]

        if password != confirm__password:
            raise serializers.ValidationError(
                {"message": "Passwords do not match."},
            )
        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        return attrs

    def create(self, validated_data):
        validated_data.pop("re_new_password")
        return super().create(validated_data)


class ConovaPasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(
        write_only=True,
        style={"input_field": "password"},
    )
    new_password = serializers.CharField(
        write_only=True,
        style={"input_field": "password"},
    )
    re_new_password = serializers.CharField(
        write_only=True,
        style={"input_field": "password"},
    )

    def validate(self, attrs):
        current_password = attrs["current_password"]
        password = attrs["new_password"]
        re_password = attrs["re_new_password"]

        if password != re_password:
            raise serializers.ValidationError(
                {"message": "Passwords do not match."},
            )
        if password == current_password:
            raise serializers.ValidationError(
                {"message": "Current password can't be the same with new password."},
            )
        try:
            validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})

        return attrs

    def validate_current_password(self, data):
        user = self.context["request"].user
        if not user.check_password(data):
            raise serializers.ValidationError({"message": "Invalid credentials."})
        return data

    def create(self, validated_data):
        validated_data.pop("re_new_password")
        return super().create(validated_data)

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user
