"""Read-only endpoint for the Municipality lookup resource."""

from apps.common.api.views import UnpaginatedListAPIView
from apps.municipalities.models import Municipality
from .serializers import MunicipalitySerializer


class MunicipalityListView(UnpaginatedListAPIView):
    serializer_class = MunicipalitySerializer
    queryset = (
        Municipality.objects.exclude(name__isnull=True)
        .exclude(name__exact="")
        .order_by("name")
    )
