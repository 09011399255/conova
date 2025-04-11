from rest_framework import serializers
from rest_framework import status
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.contrib.auth import get_user_model
from .models import ConovaUser


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
            "first_name",
            "last_name",
            "role",
            "email",
            "password",
            "re_password",
        )


class ConovaActivateUserSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    otp = serializers.CharField(required=True)

    def validate_email(self, data):
        return data.strip().lower()


# class ConovaLoginSerializer(serializers.Serializer):
#     email = serializers.EmailField(required=True)
#     otp = serializers.CharField(
#         required=True,
#         write_only=True,
#         style={"input_field": "password"},
#     )
    
#     def validate_email(self, data):
#         return data.strip().lower()
