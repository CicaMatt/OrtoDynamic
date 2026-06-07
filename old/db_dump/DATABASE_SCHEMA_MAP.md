# OrtoDynamic Database Schema Map

Generated: 2026-05-09

Source dump: `db_dump/wqortody_sximo.sql`

This document maps the MySQL database dump added for the OrtoDynamic orthopedic management system. It complements `public_html/SYSTEM_FOLDER_MAP.md`.

The dump contains sensitive production-like data, including patient/customer records and audit history. This map intentionally documents schema, counts, configuration, triggers, status flows, and inferred relationships without copying personal row data.

## Dump Summary

| Item | Value |
|---|---|
| Dump tool | phpMyAdmin 5.2.2 |
| Dump created | 2026-05-09 10:48 |
| MySQL server version in dump | 8.0.46 |
| Dump size | about 17 MB |
| Character setup at dump start | `SET NAMES utf8mb4` |
| Physical/custom tables | 43 physical tables plus one phpMyAdmin placeholder `CREATE TABLE` for a view |
| SQL view | `item_lavorazioni_view` |
| Triggers | 4 |
| Stored procedures/functions/events | none found |
| Foreign keys | none found |
| Explicit non-primary indexes | minimal: `stati.PRIMARY_KEY`, `test.riferimento` |

Important: the database does not enforce most business relationships through foreign keys. Relationships are enforced by application code, Sximo metadata, naming conventions, and triggers.

## Completeness Assessment

For database understanding, this dump is sufficient: it includes schema, row data, Sximo metadata, menu metadata, access metadata, lookup tables, triggers, and one view.

For a full Python migration, it is nearly enough on the database side, but not by itself enough to guarantee 100% behavioral parity. Remaining non-DB needs are listed near the end.

## Table Inventory

Row counts below are parsed from `INSERT` statements in the dump. They are useful for migration sizing, not for exposing data.

| Table/view | Rows | Primary key | Engine/charset | Purpose |
|---|---:|---|---|---|
| `analisi_rischi` | 3 | `id` | InnoDB / latin1 | Risk analysis form data. Very wide regulatory/compliance table. |
| `aziende_sanitarie` | 8001 | `id` | MyISAM / utf8mb3 | Healthcare authority/company district data. |
| `clienti` | 2735 | `id` | MyISAM / utf8mb3 | Patients/customers and orthopedic measurements. |
| `comuni` | 8093 | none | InnoDB / latin1 | Italian municipality lookup. |
| `controlli_periodici` | 9 | `id` | InnoDB / latin1 | Periodic controls/maintenance checks. |
| `dati_piede` | 1 | `id` | MyISAM / utf8mb3 | Foot-specific customer measurements. |
| `esiti_analisi_rischi` | 5 | `id` | InnoDB / latin1 | Risk analysis outcome lookup. |
| `firme_tecnici` | 4 | `id` | InnoDB / latin1 | Technician signature/name lookup. |
| `garanzia_presidio` | 2 | `id` | InnoDB / latin1 | Warranty status lookup. |
| `item_lavorazioni` | 14498 | `id` | MyISAM / utf8mb3 | Production/workshop line items. |
| `item_lavorazioni_view` | 0 in placeholder | none | final object is SQL view | View joining production items, quote items, and catalogue. |
| `item_preventivi` | 18021 | `id` | MyISAM / utf8mb3 | Quote/order line items. |
| `lavorazioni` | 3682 | `id` | MyISAM / utf8mb3 | Workshop jobs generated from quotes. |
| `medici` | 52 | `id` | MyISAM / utf8mb3 | Doctors/prescribers. |
| `m_assistenza_tecnica` | 4 | `id` | InnoDB / latin1 | Technical assistance type lookup. |
| `nomenclatore` | 2935 | `id` | MyISAM / utf8mb3 | Product/procedure catalogue and prices. |
| `non_conforme` | 7 | `id` | MyISAM / latin1 | Non-conformity/reclamation records. |
| `positivo_o_rilavorazione` | 2 | `id_pos_ril` | InnoDB / latin1 | Positive/rework outcome lookup. |
| `presidio_non_conformita` | 2 | `id` | InnoDB / latin1 | Internal/external device/presidio lookup. |
| `preventivi` | 4635 | `id` | MyISAM / utf8mb3 | Quotes/orders/prescriptions. |
| `prova_cliente` | 3 | `id_prova` | InnoDB / latin1 | Customer fitting/test type lookup. |
| `provincia` | 111 | none | InnoDB / latin1 | Province lookup. |
| `si_no` | 2 | `id` | InnoDB / latin1 | Yes/no lookup. |
| `stati` | 249 | `id_stati` | MyISAM / utf8mb3 | Country/state lookup. |
| `stato` | 18 | `id` | MyISAM / utf8mb3 | Quote/order and item status lookup. |
| `stato_assistenza_tecnica` | 2 | `id` | InnoDB / latin1 | Technical assistance yes/no-like lookup. |
| `stato_check` | 33 | `id` | MyISAM / utf8mb3 | Allowed quote/order state transitions. |
| `stato_item` | 3 | `id` | MyISAM / utf8mb3 | Quote-item status lookup. |
| `stato_lavorazioni` | 5 | `id` | MyISAM / latin1 | Production-item status lookup. |
| `stato_per_assistenza` | 0 | `id` | InnoDB / latin1 | Empty assistance status lookup. |
| `stato_produzioni` | 2 | `id` | InnoDB / latin1 | Internal/external production lookup. |
| `tabella_esiti` | 2 | `id` | InnoDB / latin1 | Positive/negative result lookup. |
| `tb_comments` | 5 | `commentID` | InnoDB / latin1 | CMS/blog comments. |
| `tb_forms` | 0 | `formID` | InnoDB / latin1 | Sximo dynamic form definitions. |
| `tb_groups` | 3 | `group_id` | InnoDB / utf8mb3 | Sximo user groups. |
| `tb_groups_access` | 141 | `id` | InnoDB / utf8mb3 | Sximo module permission matrix. |
| `tb_logs` | 65002 | `auditID` | InnoDB / latin1 | Audit trail and status history. |
| `tb_menu` | 33 | `menu_id` | InnoDB / utf8mb3 | Sximo/menu navigation. |
| `tb_module` | 48 | `module_id` | InnoDB / utf8mb3 | Sximo module definitions and grid/form config. |
| `tb_notification` | 0 | `id` | InnoDB / latin1 | User notifications. |
| `tb_pages` | 16 | `pageID` | InnoDB / utf8mb3 | CMS pages/posts. |
| `tb_restapi` | 0 | `id` | InnoDB / latin1 | Sximo REST API client definitions. |
| `tb_users` | 9 | `id` | InnoDB / utf8mb3 | Application users. Password hashes present in dump. |
| `test` | 4 | `test` | MyISAM / utf8mb3 | Test table with one extra index on `riferimento`. |

Note: phpMyAdmin emits a temporary `CREATE TABLE item_lavorazioni_view` placeholder before dropping it and creating the actual view. A migration should not create it as both a physical table and view.

## Constraint Model

### What Is Enforced

- Primary keys exist on most application tables.
- Auto-increment is configured on most primary keys.
- The `item_lavorazioni_view` SQL view is recreated at the end of the dump.
- Four triggers enforce derived fields.

### What Is Not Enforced

No `FOREIGN KEY` definitions were found. This means these relationships are logical/application-level rather than database-enforced:

- `preventivi.id_cliente -> clienti.id`
- `preventivi.id_medico -> medici.id`
- `item_preventivi.id_preventivo -> preventivi.id`
- `item_preventivi.codice_nomenclatore -> nomenclatore.id`
- `lavorazioni.id_preventivo -> preventivi.id`
- `lavorazioni.id_cliente -> clienti.id`
- `item_lavorazioni.id_lavorazione -> lavorazioni.id`
- `item_lavorazioni.id_item_preventivi -> item_preventivi.id`
- `item_lavorazioni.codice_nomenclatore -> nomenclatore.id`
- `non_conforme.id_preventivo -> preventivi.id`
- `controlli_periodici.id_lavorazione -> lavorazioni.id`
- `controlli_periodici.id_cliente -> clienti.id`
- Sximo relationships: `tb_groups_access.group_id -> tb_groups.group_id`, `tb_groups_access.module_id -> tb_module.module_id`, `tb_menu.module -> tb_module.module_name` where applicable.

For a modern rewrite, these should become explicit ORM relationships and, where data quality allows, actual database foreign keys.

## Triggers

### `clienti` district assignment

Two triggers maintain `clienti.distretto_appartenenza`:

- `inserisci_distretto`: before insert on `clienti`.
- `aggiorna_distretto`: before update on `clienti`.

Behavior:

- Looks up `aziende_sanitarie.distretto`.
- Match condition: `aziende_sanitarie.comune = UPPER(NEW.citta)`.
- Writes the resulting district into `NEW.distretto_appartenenza`.

Migration implication: this can become a model/service hook in Python, or remain a database trigger. It should be reviewed because matching city names by uppercased text can fail on spelling/encoding variants.

### `item_preventivi` amount and price calculation

Two triggers maintain quote item price/amount:

- `inserisci_importo_item`: before insert on `item_preventivi`.
- `aggiorna_importo_item`: before update on `item_preventivi`.

Insert behavior:

- Looks up `nomenclatore.prezzo` by `NEW.codice_nomenclatore`.
- Sets `NEW.prezzo`.
- If `NEW.sconto` is null: `importo = quantita * prezzo`.
- Otherwise: `importo = quantita * (prezzo * (1 - sconto / 100))`.

Update behavior:

- Sets `NEW.importo = NEW.quantita * NEW.prezzo`.

Migration implication: insert and update calculations are not identical. The update trigger ignores `sconto`; this may be intentional legacy behavior or a bug users have learned to work around. Preserve first, then decide whether to fix after business approval.

## SQL View

### `item_lavorazioni_view`

The final view joins:

- `item_lavorazioni`
- `nomenclatore`
- `item_preventivi`

Selected fields include:

- production item id
- `id_lavorazione`
- catalogue code and description
- quote item quantity and price
- production item state
- production dates: creation, cancellation, order, partial delivery, delivery

Migration implication: this can become either:

- a real SQL view in the new database, or
- an ORM query/view model in Python.

## Core Business Tables

### `clienti`

Purpose: patients/customers and orthopedic measurements.

Important fields:

- Identity/contact: `id`, `cognome`, `nome`, `codice_fiscale`, `data_nascita`, `comune_nascita`, `sesso`
- Address/contact: `indirizzo`, `citta`, `provincia`, `cap`, `nazione`, `telefono`, `email`, `cellulare`
- Clinical/workflow links: `id_medico`, `distretto_appartenenza`
- Foot data: `collo`, `pianta`, `misura_scarpa`, `speronatura`, `rialzo`, `piano_incl_tot`, `tipo_plantare`
- Bust/general measurements: `misura_vita`, `misura_bacino`, `misura_2_4`, `fino_ascella`, `spallacci`, `alt_stoffa_ant`, `alt_tot_armatura`, `dist_ascellare`, `mis_collo`, `mis_omero`, `mis_braccio`, `mis_polso`, `mis_coscia`, `mis_gamba`
- Notes: `note`, `note_cliente`, `altro`
- Additional orthotic fields: `tipo_tutore`, `modello_scarpa`, `caviglia`, `passaggio_collo`, `passaggio_caviglie`

Current application modules over this table:

- `clienti`
- `piede`
- `busto`
- `misuregenerali`

### `preventivi`

Purpose: quotes/orders/prescriptions. This is the central commercial/clinical workflow table.

Important fields:

- Identity: `id`
- Links: `id_cliente`, `id_medico`, `entry_by`
- Clinical text: `diagnosi_circostanziata`, `programma_terapeutico`, `prescizione_dettagliata_protesi`
- Quote dates/numbers: `data_creazione`, `data_preventivo`, `numero_preventivo`, `tipologia_preventivo`
- State: `stato` defaulting to `INSERITO`
- Authorization: `data_accettazione`, `numero_autorizzazione`, `data_ricezione_autorizzazione`
- Internal notes: `note`, `note_private`, `note_finali`
- Financial/order fields: `totale`, `numero_ordine`, `numero_fattura`, `provvigioni_pagate`
- Product/measurement summary: `Preventivo`, `modello`, `misure`, `misure_ok`
- Expiry/deadline: `giorni_scadenza`, `massima_scadenza`

Current application modules over this table:

- `preventivi`
- `previnv`
- `prevaut`
- `prevlav`
- `prevcons`
- `bozze`
- `clone`
- dated views such as `prvduemilaventi`, `prevdvd`, `PrvDuemvntd`, `prvdcnv`

### `item_preventivi`

Purpose: quote/order line items.

Fields:

- `id`
- `codice_nomenclatore`
- `quantita`
- `prezzo`
- `importo`
- `id_preventivo`
- `sconto`
- `stato_item`
- `data_ricezione_autorizzazione`
- `entry_by`
- `produzione`

Important behavior:

- Insert trigger derives `prezzo` from `nomenclatore`.
- Insert trigger derives `importo` from quantity, price, and discount.
- Update trigger recalculates `importo` from quantity and price only.

### `lavorazioni`

Purpose: workshop/production job records, usually created from a quote when it moves into production.

Important fields:

- Identity/linking: `id`, `id_preventivo`, `id_cliente`
- Production state/dates: `stato`, `data_creazione_lavorazione`, `data_annullamento`, `data_fine_lavorazione`, `data_consegna`
- Fitting/check workflow: `prova_cliente`, `pos_ril`, `firma_medico`, `Verifica_cliente`, `verifica_pos_ril`, `data_prova_cliente`, `data_verifica_cliente`
- Technical assistance: `stato_lavorazione_assistenza`, `assistenza_tecnica`, `ragione_reclamo`, `presidio`, `garanzia`, `descrizione_intervento`, `data_consegna_assistenza`, `annotazioni_tecniche_assistenza`, `esito_collaudo_assistenza_tecnica`, `data_esito_collaudo_assistenza`, `firma_medico_assistenza`
- Other: `firma_tecnico`, `massima_scadenza`

Current application modules over this table:

- `lavorazioni`
- `inlavorazione`
- `prontoprimaprova`
- `dacons`
- `daconsegnare`
- `asstec`

### `item_lavorazioni`

Purpose: production/workshop line items, copied or derived from quote items.

Fields:

- `id`
- `codice_nomenclatore`
- `id_item_preventivi`
- `quantita`
- `stato`
- `data_creazione_lavorazione`
- `data_annullamento`
- `data_ordine`
- `data_consegna_parziale`
- `data_consegna`
- `id_lavorazione`
- `descrizione_nomenclatore`
- `importo`
- `produzione`
- `materiale`
- `fornitore`
- `DDT`
- `lotto`

Current application modules over this table:

- `prodottilavorazioni`
- `prodint`

### `nomenclatore`

Purpose: catalogue of products/procedures used in quotes and production.

Fields:

- `id`
- `codice`
- `descrizione`
- `prezzo`
- `anno` default `2025`

Migration implication: this is both a lookup and price source for quote-item triggers. Price history should be considered carefully if future prices differ by year.

## Compliance And Quality Tables

### `analisi_rischi`

Purpose: risk-analysis documentation for orthopedic devices.

Shape:

- 105 columns.
- Links: `id_lavorazione`, `id_preventivo`, `id_cliente`.
- Large groups of text fields about intended use, contact, materials, foreseeable influences, hazards, biological risk, operating instructions, risk estimates, acceptance, warnings, mechanical integrity, and biological/material evaluation.
- Includes `data`, `firma_direzione`, `riutilizzo_dispositivo`, `composizione_chimica_materiali`.

Migration implication: this is a form/document table, not a normalized risk model. In Python, it can be migrated directly first, then later normalized if needed.

### `controlli_periodici`

Purpose: periodic control/maintenance records.

Fields:

- `id`
- `id_lavorazione`
- `data_intervento`
- `intervento`
- `firma_medico`
- `id_cliente`
- `firma_tecnico`

### `non_conforme`

Purpose: non-conformity/reclamation records.

Fields:

- `id`
- `id_preventivo`
- `data_creazione`
- `difformita_rilevata`
- `tecnico`
- `note`
- `data_apertura_reclamo`
- `data_chiusura_reclamo`
- `stato_reclamo`
- `nome_tecnico`
- `ragione_reclamo`
- `presidio`
- `garanzia`

Associated lookups:

- `positivo_o_rilavorazione`
- `presidio_non_conformita`
- `garanzia_presidio`
- `tabella_esiti`

## Reference And Lookup Tables

| Table | Meaning |
|---|---|
| `medici` | Doctors/prescribers. |
| `aziende_sanitarie` | Health authority/company and district mapping. Used by `clienti` triggers. |
| `comuni` | Italian municipality data. |
| `provincia` | Province list. |
| `stati` | Country/state list. |
| `si_no` | Yes/no lookup. |
| `firme_tecnici` | Technician signature/name lookup. |
| `stato_assistenza_tecnica` | Assistance yes/no-like lookup. |
| `m_assistenza_tecnica` | Technical assistance reason/type. |
| `stato_produzioni` | Internal/external production type. |
| `prova_cliente` | Customer fitting/test category. |
| `esiti_analisi_rischi` | Risk analysis outcome options. |
| `tabella_esiti` | Positive/negative result lookup. |
| `stato_item` | Quote-item states: OK, KO, private. |
| `stato_lavorazioni` | Production-item states. |
| `stato` | Main quote/order statuses. |
| `stato_check` | Allowed quote/order status transitions. |

## Quote Statuses

`stato` defines 18 rows. Main quote/order statuses include:

- `INSERITO`
- `INVIATO`
- `ACCETTATO`
- `ANNULLATO`
- `RIFIUTATO`
- `IN LAVORAZIONE`
- `COMPLETATO`
- `CONSEGNATO`
- `FATTURATO`
- `RISCOSSO`
- `IN LAVORAZIONE SENZA AUTORIZZAZIONE`
- `AUTORIZZATO`
- `CONSEGNA PARZIALE`
- `SOSPESO`
- `IN BOZZA`

The same table also contains item statuses (`OK`, `KO`, `OK_PAGAMENTO`) with `tabella = ITEM_PREVENTIVI`.

## Allowed Quote Status Transitions

`stato_check` defines the allowed state machine for `PREVENTIVI`.

Observed transitions:

| From | To |
|---|---|
| `INSERITO` | `INVIATO`, `ANNULLATO`, `SOSPESO` |
| `INVIATO` | `ACCETTATO`, `ANNULLATO`, `RIFIUTATO`, `IN LAVORAZIONE SENZA AUTORIZZAZIONE`, `AUTORIZZATO`, `SOSPESO` |
| `ACCETTATO` | `IN LAVORAZIONE`, `ANNULLATO`, `SOSPESO` |
| `AUTORIZZATO` | `IN LAVORAZIONE`, `ANNULLATO` |
| `IN LAVORAZIONE` | `CONSEGNATO`, `ANNULLATO`, `CONSEGNA PARZIALE`, `SOSPESO` |
| `IN LAVORAZIONE SENZA AUTORIZZAZIONE` | `ANNULLATO`, `CONSEGNATO`, `SOSPESO` |
| `CONSEGNA PARZIALE` | `CONSEGNATO` |
| `CONSEGNATO` | `FATTURATO` |
| `FATTURATO` | `RISCOSSO` |
| `ANNULLATO` | `INSERITO` |
| `SOSPESO` | `INSERITO`, `INVIATO`, `ACCETTATO`, `ANNULLATO`, `RIFIUTATO`, `IN LAVORAZIONE`, `IN LAVORAZIONE SENZA AUTORIZZAZIONE` |

There is a duplicate `INVIATO -> ANNULLATO` row in the dump.

Migration implication: this should become a first-class state machine in Python, with transition validation and audit logging. Preserve duplicate-tolerant behavior initially.

## Production Statuses

`stato_lavorazioni` contains production-item statuses:

- `ORDINATO`
- `PRONTO`
- `IN LAVORAZIONE`
- `CONSEGNATO`
- `ANNULLATO`

Application code also uses `lavorazioni.stato` values such as `IN LAVORAZIONE` and `LAVORATO`; those are not fully normalized as enforced lookup constraints.

## Sximo Metadata

### Groups

`tb_groups` defines:

- `Superadmin` level 1
- `Administrator` level 2
- `Users` level 3

### Module Registry

`tb_module` has 48 module definitions. Important native/business modules:

| Module | Title | DB table | Key |
|---|---|---|---|
| `nomenclatore` | Nomenclatore | `nomenclatore` | `id` |
| `medici` | Medici | `medici` | `id` |
| `aziende` | AziendeSanitarie | `aziende_sanitarie` | `id` |
| `clienti` | Clienti | `clienti` | `id` |
| `piede` | Piede | `clienti` | `id` |
| `preventivi` | Preventivi | `preventivi` | `id` |
| `busto` | Busto | `clienti` | `id` |
| `misuregenerali` | Misure Generali | `clienti` | `id` |
| `prodottipreventivi` | Prodotti Preventivi | `item_preventivi` | `id` |
| `statocheck` | StatoCheck | `stato_check` | `id` |
| `stato` | Stato | `stato` | `id` |
| `previnv` | Preventivi Inviati | `preventivi` | `id` |
| `nonconformita` | Non Conformita | `non_conforme` | `id` |
| `lavorazioni` | Lavorazioni | `lavorazioni` | `id` |
| `prodottilavorazioni` | Prodotti Lavorazioni | `item_lavorazioni` | `id` |
| `statilavorazioni` | Stati Lavorazioni | `stato_lavorazioni` | `id` |
| `inlavorazione` | In Lavorazione | `lavorazioni` | `id` |
| `prontoprimaprova` | Pronto prima prova | `lavorazioni` | `id` |
| `prevaut` | Preventivi Autorizzati | `preventivi` | `id` |
| `prevlav` | Preventivi in lavorazione | `preventivi` | `id` |
| `prevcons` | Preventivi consegnati | `preventivi` | `id` |
| `prodint` | Produzioni | `item_lavorazioni` | `id` |
| `dacons` | Da consegnare | `lavorazioni` | `id` |
| `bozze` | Bozze Preventivi | `preventivi` | `id` |
| `asstec` | Assistenza tecnica | `lavorazioni` | `id` |
| `analrischi` | Analisi Rischi | `analisi_rischi` | `id` |
| `formc` | Controlli | `controlli_periodici` | `id` |
| `regcontr` | Registro Controlli | `controlli_periodici` | `id` |
| `daconsegnare` | Lavorazioni da consegnare | `lavorazioni` | `id` |
| `clone` and dated quote views | Various quote views | `preventivi` | `id` |

Core Sximo modules include users, groups, module management, menu management, pages, logs, notifications, posts, forms, and REST API client definitions.

### Permissions

`tb_groups_access` has 141 rows. Each row links:

- `group_id`
- `module_id`
- serialized/JSON-like `access_data`

Migration implication: permissions must be decoded and mapped into a Python RBAC model. Do not rely only on Django's default permissions unless the Sximo flags are mapped explicitly.

### Menus

`tb_menu` has 33 rows. The backend sidebar groups the app into:

- home/sent quotes
- anagraphic/master data
- customers
- quotes
- production/workshop
- assistance
- risk analysis
- register controls
- configuration

Migration implication: this is enough to rebuild the navigation structure.

## Sximo/CMS Tables

| Table | Purpose |
|---|---|
| `tb_users` | Users for Laravel/Sximo auth. Contains password hashes and account status. |
| `tb_groups` | User groups. |
| `tb_groups_access` | Module permission matrix. |
| `tb_module` | Generated module definition and field/grid config. |
| `tb_menu` | Navigation. |
| `tb_logs` | Audit events. |
| `tb_pages` | CMS pages/posts. |
| `tb_comments` | CMS comments. |
| `tb_forms` | Dynamic form definitions, currently empty. |
| `tb_notification` | Notifications, currently empty. |
| `tb_restapi` | REST API client definitions, currently empty. |

## Inferred Domain Relationships

These are inferred from code, column names, triggers, and SQL view definitions.

```text
medici.id
  -> clienti.id_medico
  -> preventivi.id_medico

clienti.id
  -> preventivi.id_cliente
  -> lavorazioni.id_cliente
  -> analisi_rischi.id_cliente
  -> controlli_periodici.id_cliente

preventivi.id
  -> item_preventivi.id_preventivo
  -> lavorazioni.id_preventivo
  -> non_conforme.id_preventivo
  -> analisi_rischi.id_preventivo

nomenclatore.id
  -> item_preventivi.codice_nomenclatore
  -> item_lavorazioni.codice_nomenclatore

item_preventivi.id
  -> item_lavorazioni.id_item_preventivi

lavorazioni.id
  -> item_lavorazioni.id_lavorazione
  -> controlli_periodici.id_lavorazione
  -> analisi_rischi.id_lavorazione
```

## Main Workflow From Database Perspective

1. A customer/patient is stored in `clienti`.
2. A quote/order is stored in `preventivi`, linked by `id_cliente`.
3. Quote line items are stored in `item_preventivi`, linked by `id_preventivo` and `codice_nomenclatore`.
4. `item_preventivi` insert trigger copies price from `nomenclatore` and calculates `importo`.
5. Quote state changes are validated by application code against `stato_check`.
6. When a quote becomes production-ready, application code creates `lavorazioni`.
7. Application code copies quote items into `item_lavorazioni`.
8. Production status/detail is tracked in `lavorazioni` and `item_lavorazioni`.
9. Compliance/quality records attach to quote, job, or customer:
   - `analisi_rischi`
   - `controlli_periodici`
   - `non_conforme`
10. Sximo logs module operations and state changes in `tb_logs`.

## Data Migration Implications

### Things To Preserve Initially

- MySQL text encodings and collations: the dump mixes `latin1`, `utf8mb3`, and initial `utf8mb4`.
- All status names exactly as strings, including spacing/capitalization.
- Sximo module names and route names, at least during the transition.
- Trigger behavior for district and item amount calculations.
- Existing IDs, because application data links are integer IDs without FK enforcement.
- Audit log history in `tb_logs`.
- Uploaded files referenced by the application; this dump does not include binary upload contents.

### Things To Improve In A Python Rewrite

- Add explicit foreign keys after cleaning orphaned data.
- Add indexes on high-traffic link columns:
  - `preventivi.id_cliente`
  - `item_preventivi.id_preventivo`
  - `item_preventivi.codice_nomenclatore`
  - `lavorazioni.id_preventivo`
  - `lavorazioni.id_cliente`
  - `item_lavorazioni.id_lavorazione`
  - `item_lavorazioni.id_item_preventivi`
  - `non_conforme.id_preventivo`
  - `tb_logs.module`, `tb_logs.logdate`
- Normalize repeated status strings into constrained enums/lookups.
- Move trigger behavior into tested domain services or keep equivalent DB triggers.
- Replace MyISAM tables with InnoDB if staying on MySQL/MariaDB.
- Decide how to migrate the Sximo dynamic metadata into explicit Python code/config.

## Remaining Inputs Needed For Full System Migration

The DB dump fills the major schema/configuration gap, but a full migration still needs:

- A decision on target architecture: Django, Django + HTMX, FastAPI + frontend, etc.
- A data privacy strategy for migration/testing, because this dump contains patient-identifiable data.
- A copy/verification of all file uploads and generated document templates under `public/uploads`, `public/doc`, and root-level PDF/image/DOCX files.
- Expected PDF output samples for each `generaPdf.php` mode and other PDF scripts.
- A list of active users/roles to keep, disable, or remap.
- Business confirmation for ambiguous legacy behavior, especially:
  - item discount behavior on update
  - duplicate state-transition rows
  - status labels such as `CONSEGNA PARZIALE` vs app UI text `CONSEGNATO PARZIALE`
  - direct public PHP scripts that bypass Laravel auth
- Production deployment requirements:
  - hosting target
  - mail/SMS requirements
  - backup policy
  - retention/audit requirements
  - legal/privacy requirements for medical data
- A staging database restore test to verify the dump imports cleanly on the intended target DB version.

## Practical Migration Order

1. Restore dump into an isolated local/staging database.
2. Run integrity checks for inferred relationships and orphaned rows.
3. Decode `tb_module.module_config` and `tb_groups_access.access_data` into structured migration artifacts.
4. Build Python ORM models matching existing table names and IDs.
5. Implement core workflows in this order:
   - auth/users/groups/access
   - customers
   - quotes and quote items
   - status transitions
   - production jobs and production items
   - PDFs/documents
   - compliance modules
6. Add tests for status transitions and trigger-equivalent calculations.
7. Compare old and new output for representative records.
8. Only after parity, consider schema cleanup and normalization.
