"""Pure formatting helpers shared by generated domain documents."""

from __future__ import annotations

from datetime import date
from decimal import ROUND_HALF_UP, Decimal


def date_short_slash(value: date | None) -> str:
    return value.strftime("%d/%m/%y") if value else ""


def date_long_slash(value: date | None) -> str:
    return value.strftime("%d/%m/%Y") if value else ""


def date_short_dash(value: date | None) -> str:
    return value.strftime("%d-%m-%y") if value else ""


def date_long_dash(value: date | None) -> str:
    return value.strftime("%d-%m-%Y") if value else ""


def upper_or_empty(value) -> str:
    return (value or "").upper()


def person_name(person, *, order: str = "first_last", uppercase: bool = False) -> str:
    if person is None:
        return ""
    first = person.nome or ""
    last = person.cognome or ""
    parts = (last, first) if order == "last_first" else (first, last)
    name = " ".join(part for part in parts if part).strip()
    return name.upper() if uppercase else name


def client_address_line(client) -> str:
    indirizzo = client.indirizzo or ""
    cap = client.cap or ""
    citta = client.citta or ""
    provincia = client.provincia or ""
    return f"{indirizzo} - {cap} {citta} ({provincia})".strip()


def italian_decimals(value: float) -> str:
    integer_part, decimal_part = f"{value:,.2f}".split(".")
    return f"{integer_part.replace(',', '.')},{decimal_part}"


def whole_or_italian_decimal(value) -> str:
    number = float(value) if value not in (None, "") else 0.0
    if number == int(number):
        return str(int(number))
    return italian_decimals(number)


def italian_money(value) -> str:
    amount = float(value) if value not in (None, "") else 0.0
    return f"{italian_decimals(amount)} €"


def plain_number(value) -> str:
    """A DOUBLE column value as the DB would render it: whole -> integer, else as-is."""
    if value is None or value == "":
        return ""
    number = float(value)
    return str(int(number)) if number == int(number) else str(number)


def rounded_amount(value) -> str:
    """Round to two decimals (half-up, like PHP `round`), then drop trailing zeros."""
    number = float(value) if value not in (None, "") else 0.0
    rounded = Decimal(str(number)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    text = format(rounded, "f")
    return text.rstrip("0").rstrip(".") if "." in text else text
