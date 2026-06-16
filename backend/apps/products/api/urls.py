from django.urls import path

from .views import ProductDetailView, ProductListView, ProductSearchView

app_name = "products"

urlpatterns = [
    path("", ProductListView.as_view(), name="list"),
    path("search/", ProductSearchView.as_view(), name="search"),
    path("<int:pk>/", ProductDetailView.as_view(), name="detail"),
]
