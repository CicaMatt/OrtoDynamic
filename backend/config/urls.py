"""
Root URL configuration.

All application endpoints are mounted under a versioned API prefix so the
contract can evolve without breaking existing frontend clients. Domain app
routes are included into `api/v1/` as each app is added.
"""
from django.contrib import admin
from django.urls import include, path

api_v1_patterns = [
    path("clients/", include("apps.clients.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include((api_v1_patterns, "v1"), namespace="v1")),
]
