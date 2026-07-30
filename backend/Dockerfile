# syntax=docker/dockerfile:1

FROM python:3.12-slim-bookworm AS builder

ENV PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    VIRTUAL_ENV=/opt/venv

RUN python -m venv "$VIRTUAL_ENV"
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

WORKDIR /app
COPY requirements ./requirements
RUN pip install --requirement requirements/production.txt


FROM python:3.12-slim-bookworm AS runtime

ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    XDG_RUNTIME_DIR=/run/ortodynamic \
    PORT=8000

RUN groupadd --system ortodynamic \
    && useradd --system --gid ortodynamic --home-dir /app ortodynamic \
    && install --directory --owner=ortodynamic --group=ortodynamic /run/ortodynamic

WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
COPY --chown=ortodynamic:ortodynamic . .

USER ortodynamic

EXPOSE 8000

CMD ["gunicorn", "config.wsgi:application", "--config", "gunicorn.conf.py"]
