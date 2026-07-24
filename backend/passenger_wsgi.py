"""Phusion Passenger entry point for cPanel-hosted deployments."""

import os
import sys
from importlib import import_module

# Application Manager can select the virtualenv interpreter itself. Hosts that
# cannot do so may set this variable to the absolute virtualenv Python path.
interpreter = os.environ.get("DJANGO_PYTHON_EXECUTABLE")
if interpreter and sys.executable != interpreter:
    if not os.path.isfile(interpreter):
        raise RuntimeError("DJANGO_PYTHON_EXECUTABLE does not point to a file")
    os.execl(interpreter, interpreter, *sys.argv)

application = import_module("config.wsgi").application

__all__ = ["application"]
