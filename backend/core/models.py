from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager



class ConovaUserManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):    
        if not email:
            raise ValueError({"message": "User must have an email address"})
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)  
        user.set_password(password)
        user.save(using=self._db)
        
        return user
        
    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        
        return self.create_user(email, password, **extra_fields)

class ConovaUser(AbstractUser):
    ROLES = [
        ("learners", "Learners"),
        ("employee", "Employee"),
        ("admin", "Admin")
    ]
    username = None
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLES, blank=True)
    
    objects = ConovaUserManager()
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
    
    
