from django.contrib.auth.models import AnonymousUser
from rest_framework import permissions


class BonitaPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if isinstance(request.user, AnonymousUser):
            return False
        else:
            return True
