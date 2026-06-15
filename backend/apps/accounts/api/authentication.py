"""
Session authentication that answers 401 (not 403) for unauthenticated requests.

DRF's default `SessionAuthentication` exposes no `WWW-Authenticate` header, so DRF
returns 403 for an anonymous request — indistinguishable from a genuine
permission or CSRF denial. Providing the header makes anonymous requests resolve
to 401, giving the frontend a clean "session expired, show the login screen"
signal while real CSRF failures stay 403. Cookie-based CSRF enforcement is
inherited unchanged.
"""
from rest_framework.authentication import SessionAuthentication as BaseSessionAuthentication


class SessionAuthentication(BaseSessionAuthentication):
    def authenticate_header(self, request):
        return "Session"
