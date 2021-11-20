from rest_framework import authentication


class BonitaAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        return None
