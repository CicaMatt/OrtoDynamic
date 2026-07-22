"""Small read-side helpers shared by domain selectors."""


def attach_related(rows, *, id_attr, attr, model):
    """
    Bulk-load referenced model instances and attach them to already-materialized rows.

    A missing or unset legacy integer reference is attached as ``None``. The lookup
    uses at most one ``IN`` query regardless of the number of rows.
    """
    rows = list(rows)
    ids = {getattr(row, id_attr) for row in rows if getattr(row, id_attr)}
    related = model.objects.in_bulk(ids)
    for row in rows:
        setattr(row, attr, related.get(getattr(row, id_attr)))
    return rows


def attach_many(rows, *relations):
    """Attach several batched legacy relationships to the same rows."""
    rows = list(rows)
    for relation in relations:
        attach_related(rows, **relation)
    return rows
