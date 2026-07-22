"""Creation response contracts shared by the four simple CRUD resources."""

from unittest.mock import patch

import pytest

from apps.clients.api.serializers import ClientCreateSerializer
from apps.clients.models import Client
from apps.doctors.api.serializers import DoctorCreateSerializer
from apps.doctors.models import Doctor
from apps.health_companies.api.serializers import HealthCompanyCreateSerializer
from apps.health_companies.models import HealthCompany
from apps.products.api.serializers import ProductCreateSerializer
from apps.products.models import Product


CREATE_CASES = [
    (
        ClientCreateSerializer,
        Client,
        {"name": " Ada ", "surname": "Rossi", "birthDate": "1980-01-02", "doctorId": 7},
        Client(id=101, nome=" Ada ", cognome="Rossi", data_nascita="1980-01-02", id_medico=7),
        {
            "idClient": "101",
            "name": "Ada",
            "surname": "Rossi",
            "fiscalCode": "",
            "phone": "",
            "mobile": "",
            "email": "",
            "birthDate": "1980-01-02",
            "gender": "",
            "birthMunicipality": "",
            "address": "",
            "city": "",
            "province": "",
            "postalCode": "",
            "country": "",
            "district": "",
            "doctorId": "7",
            "note": "",
        },
        {},
    ),
    (
        DoctorCreateSerializer,
        Doctor,
        {"name": "Luca", "surname": "Bianchi", "email": "luca@example.test"},
        Doctor(id=102, nome="Luca", cognome="Bianchi", mail="luca@example.test"),
        {
            "idDoctor": "102",
            "surname": "Bianchi",
            "name": "Luca",
            "address": "",
            "phone": "",
            "email": "luca@example.test",
            "note": "",
        },
        {"nome": "Luca", "cognome": "Bianchi", "mail": "luca@example.test"},
    ),
    (
        HealthCompanyCreateSerializer,
        HealthCompany,
        {"companyName": "ASL Centro", "municipality": "Roma", "year": 2026},
        HealthCompany(id=103, denominazione_azienda="ASL Centro", comune="Roma", anno=2026),
        {
            "idHealthCompany": "103",
            "municipalityCode": "",
            "municipality": "Roma",
            "regionCode": "",
            "regionName": "",
            "companyCode": "",
            "companyName": "ASL Centro",
            "year": "2026",
            "males": "",
            "females": "",
            "total": "",
            "district": "",
        },
        {"denominazione_azienda": "ASL Centro", "comune": "Roma", "anno": 2026},
    ),
    (
        ProductCreateSerializer,
        Product,
        {"code": "T-1", "description": "Tutore", "price": 12.5, "year": "2026"},
        Product(id=104, codice="T-1", descrizione="Tutore", prezzo=12.5, anno="2026"),
        {
            "idProduct": "104",
            "code": "T-1",
            "description": "Tutore",
            "price": "12.5",
            "year": "2026",
        },
        {"codice": "T-1", "descrizione": "Tutore", "prezzo": 12.5, "anno": "2026"},
    ),
]


@pytest.mark.parametrize(
    ("serializer_class", "model", "request_data", "created", "expected_response", "expected_create"),
    CREATE_CASES,
)
def test_simple_create_response_contracts(
    serializer_class, model, request_data, created, expected_response, expected_create
):
    serializer = serializer_class(data=request_data)
    assert serializer.is_valid(), serializer.errors

    with patch.object(model.objects, "create", return_value=created) as create:
        assert serializer.save() is created

    # The client case contains a parsed date object, so assert its translated
    # fields separately while keeping the external response fully explicit.
    actual_create = create.call_args.kwargs
    if model is Client:
        assert actual_create["nome"] == "Ada"
        assert actual_create["cognome"] == "Rossi"
        assert actual_create["data_nascita"].isoformat() == "1980-01-02"
        assert actual_create["id_medico"] == 7
    else:
        assert actual_create == expected_create
    assert serializer.data == expected_response


@pytest.mark.parametrize(
    ("serializer_class", "payload", "required_fields"),
    [
        (DoctorCreateSerializer, {}, {"name", "surname"}),
        (DoctorCreateSerializer, {"name": " ", "surname": " "}, {"name", "surname"}),
        (ProductCreateSerializer, {}, {"code", "description", "price"}),
        (
            ProductCreateSerializer,
            {"code": " ", "description": " ", "price": None},
            {"code", "description", "price"},
        ),
    ],
)
def test_create_only_persistence_invariants_are_rejected_before_database_write(
    serializer_class, payload, required_fields
):
    serializer = serializer_class(data=payload)

    assert not serializer.is_valid()
    assert set(serializer.errors) == required_fields


@pytest.mark.parametrize(
    "serializer_class",
    [ClientCreateSerializer, HealthCompanyCreateSerializer],
)
def test_permissive_legacy_create_fields_remain_ux_policy(serializer_class):
    serializer = serializer_class(data={})

    assert serializer.is_valid(), serializer.errors
