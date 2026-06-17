"""
Root URL configuration.

All application endpoints are mounted under a versioned API prefix so the
contract can evolve without breaking existing frontend clients. Domain app
routes are included into `api/v1/` as each app is added.
"""
from django.contrib import admin
from django.urls import include, path

api_v1_patterns = [
    path("auth/", include("apps.accounts.api.urls")),
    path("clients/", include("apps.clients.api.urls")),
    path("doctors/", include("apps.doctors.api.urls")),
    path("health-companies/", include("apps.health_companies.api.urls")),
    path("products/", include("apps.products.api.urls")),
    path("quotes/", include("apps.quotes.api.urls")),
    path("work-orders/", include("apps.work_orders.api.urls")),
    path("municipalities/", include("apps.municipalities.api.urls")),
    path("statuses/", include("apps.statuses.api.urls")),
    path("employees/", include("apps.accounts.api.employee_urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include((api_v1_patterns, "v1"), namespace="v1")),
]
