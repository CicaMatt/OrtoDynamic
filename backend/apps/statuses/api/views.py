"""Read-only endpoints for the shared workflow `stato` / `stato_check` tables.

Both resources are generic: a caller scopes them to one domain by passing the
required `table` query param (e.g. "PREVENTIVI"), matching the table-keyed design
of the underlying models and services.
"""

from apps.common.api.views import UnpaginatedListAPIView
from apps.common.exceptions import ServiceError
from apps.statuses.services import states_for, transitions_for

from .serializers import StatusSerializer, StatusTransitionSerializer


def _required_table(request):
    """The `table` query param identifying the workflow domain, or a 400 if absent."""
    table = request.query_params.get("table", "").strip()
    if not table:
        raise ServiceError("Il parametro «table» è obbligatorio.")
    return table


class StatusListView(UnpaginatedListAPIView):
    """States defined for the workflow table named by the `table` query param."""

    serializer_class = StatusSerializer

    def get_queryset(self):
        return states_for(_required_table(self.request))


class StatusTransitionListView(UnpaginatedListAPIView):
    """Permitted transitions for the workflow table named by the `table` query param."""

    serializer_class = StatusTransitionSerializer

    def get_queryset(self):
        return transitions_for(_required_table(self.request))
