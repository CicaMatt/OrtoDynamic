# Business Rules To Clarify Before Migration

Generated: 2026-05-09

Purpose: this file lists old-system behaviours that are not fully knowable from the PHP code and database dump alone. It is intended as a checklist for the committent before rewriting the system in Python.

This document intentionally excludes PDF template redesign and final target architecture, because those will be decided later.

## Decisions Already Taken

These are current migration assumptions based on the latest discussion:

- Legacy/dead-code distinction: it is not possible to reliably distinguish old active scripts from dead scripts. The migration should preserve all reachable/menu-backed behaviour and use old standalone scripts as behavioural references, not as code to expose directly.
- Database constraints: the new system should preserve the current DB shape without adding database foreign keys. Relationships can be represented in Python ORM/services, but the physical DB should remain FK-free unless this decision changes.
- Users/passwords/rules: reuse the same user list, password hashes, groups, and Sximo permission rules if technically possible. If password hash compatibility fails, use a controlled password-reset migration.
- Uploaded files: the committent must decide which uploaded files must be kept/imported. This includes CSV/XLS/XLSX/DOCX/images/avatars/scans under `public/uploads` and any root/public document files that are not just templates.
- Bypassing scripts: assume some direct public PHP scripts were quick fixes or quick feature additions. In the Python system, their useful behaviour should be implemented as proper authenticated application features unless the committent confirms a script must remain externally/publicly callable.
- Backups: host-managed backups are out of scope for the application migration.
- Audit logs: preserve `tb_logs` as-is and try to keep using the same table for new-system audit entries.
- PDF templates: can be redone later from scratch and are not part of this checklist.

## Answer To Workflow-State Question

The database gives us enough to map the allowed quote/order state machine from `stato` and `stato_check`.

What it does not fully give us is the intended side effect of each transition. The PHP code shows actual side effects in several places, but some are inconsistent, duplicated, or possibly broken. For migration parity, the state strings and allowed transitions can be copied from the DB, but the committent should confirm what each transition must do operationally.

Known from DB:

- Status values exist in `stato`.
- Allowed quote transitions exist in `stato_check`.
- The state machine can be reproduced from those rows.

Known from code:

- Generic `changeState` updates `preventivi.stato`, optionally updates `note_private`, audits to `tb_logs`, and for `IN LAVORAZIONE` / `IN LAVORAZIONE SENZA AUTORIZZAZIONE` creates a `lavorazioni` row plus copied `item_lavorazioni`.
- `AutorizzaOrdine` sets `numero_autorizzazione`, `data_ricezione_autorizzazione`, and optionally `data_accettazione`.
- `FatturaOrdine` sets `numero_fattura`.
- `ConsegnaOrdine` updates `preventivi.stato` and sets linked `lavorazioni.stato = LAVORATO`; its item-update block appears unreliable and needs confirmation.
- `Bozza` has special handling and may update the state before fully validating the transition.

Therefore: yes, the state map exists; no, we should not assume the complete business workflow is fully specified without confirming transition side effects.

## Core Business Rules To Ask The Committent

### 1. Quote/order lifecycle

Current evidence:

- Main table: `preventivi`.
- Current status source: `stato`.
- Allowed transitions source: `stato_check`.
- Main controller: `PreventiviController`.

Questions:

- Is `stato_check` the authoritative list of allowed state transitions?
- Should users ever be allowed to force a transition outside `stato_check`?
- Are the status names to preserve exactly as stored, including capitalization and spacing?
- Which statuses are terminal states?
- Can cancelled records return to `INSERITO`, as currently allowed by `stato_check`?
- Can suspended records return to every historical source state, as currently allowed?
- Is `IN BOZZA` a real workflow state or only a draft marker?
- Should the UI label `CONSEGNATO PARZIALE` map to the DB status `CONSEGNA PARZIALE`, or are both intended statuses?

Default migration assumption:

- Preserve the DB state names and `stato_check` transitions exactly.
- Add explicit Python tests around the state machine.
- Do not invent new transitions.

### 2. Side effects when changing quote status

Current evidence:

- Status changes write to `preventivi.stato`.
- Some paths also write dates, authorization numbers, invoice numbers, private notes, production rows, and logs.

Questions:

- For each quote transition, which fields must be updated?
- Which transitions require a user-entered note?
- Which transitions require a date, and should the date be user-entered or system date?
- Are multi-select bulk state changes still required?
- If multiple selected records are changed together, should each receive identical dates/notes/numbers?
- Should failed or invalid transitions be audited?

Default migration assumption:

- Preserve current side effects where clearly implemented.
- Make side effects explicit in service code rather than scattered across controllers/views.

### 3. Authorization workflow

Current evidence:

- `AutorizzaOrdine` sets `numero_autorizzazione`.
- It sets `data_ricezione_autorizzazione`.
- It optionally sets `data_accettazione` only when `cambiadata == si`.

Questions:

- What is the business difference between `ACCETTATO` and `AUTORIZZATO`?
- Is `numero_autorizzazione` mandatory for `AUTORIZZATO`?
- Which date is the ASL authorization date?
- What does `data_accettazione` mean exactly?
- Should quote items also receive `data_ricezione_autorizzazione`?
- Can an order go to production without authorization, and how should it be reported?

Default migration assumption:

- Preserve `AUTORIZZATO` as a distinct state.
- Preserve the "production without authorization" path.

### 4. Production job creation

Current evidence:

- Moving a quote to `IN LAVORAZIONE` or `IN LAVORAZIONE SENZA AUTORIZZAZIONE` creates one `lavorazioni` row.
- It copies every `item_preventivi` row into `item_lavorazioni`.
- Copied line items store catalogue code/description snapshots from `nomenclatore`.

Questions:

- Should a production job always be created when a quote enters either production state?
- Should duplicate `lavorazioni` rows be prevented if the user triggers the transition twice?
- Should only authorized/OK quote items be copied, or all quote items?
- Should copied production items keep catalogue snapshots forever, even if `nomenclatore` later changes?
- What should happen if a quote has no line items?
- Should moving a quote out of production cancel/delete/update the linked `lavorazioni` record?
- Should production job creation work for bulk-selected quotes?

Default migration assumption:

- Preserve the current copy-on-production behaviour.
- Add duplicate protection in application logic only if the committent confirms it is expected.

### 5. Production and workshop states

Current evidence:

- `lavorazioni.stato` is not fully governed by `stato_lavorazioni`.
- Forms expose states such as `IN LAVORAZIONE`, `IN FINITURA`, `LAVORATO`, `LAVORATO PARZIALE`, `ANNULLATO`, `DA CONSEGNARE`, `PRONTO PRIMA PROVA`, `PRONTO SECONDA PROVA`, `PRONTO TERZA PROVA`, `IN REVISIONE DOPO CONSEGNA`, `INVIATE A LACO PER MODIFICA`.
- Filtered modules use values like `IN LAVORAZIONE`, `PRONTO PRIMA PROVA`, `DA CONSEGNARE`, and `assistenzatecnica`.

Questions:

- What is the complete authoritative list of production states?
- Which states should be selectable by users?
- Which states are only system-generated?
- Are fitting states first/second/third prova still used?
- What is the difference between `LAVORATO`, `DA CONSEGNARE`, and quote-level `CONSEGNATO`?
- Should production item status and production job status always move together?

Default migration assumption:

- Preserve all status strings found in code/data.
- Do not collapse production statuses until the committent validates the workflow.

### 6. Delivery and partial delivery

Current evidence:

- Quote UI offers `CONSEGNATO` and `CONSEGNATO PARZIALE`.
- DB transition table contains `CONSEGNA PARZIALE`.
- `ConsegnaOrdine` updates quote status and sets linked `lavorazioni.stato = LAVORATO`.
- The code appears to intend to set `item_lavorazioni.stato = CONSEGNATO`, but the current block is likely not functioning correctly.

Questions:

- Is partial delivery still used?
- Which exact DB status should partial delivery use?
- Should delivery update quote, production job, and production items together?
- Which delivery dates should be set automatically?
- Can individual production items be delivered separately?
- Should delivery generate DDT or other documents automatically?

Default migration assumption:

- Preserve quote-level delivery states.
- Treat item-level delivery side effects as requiring confirmation before implementing.

### 7. Invoicing and collection

Current evidence:

- `FatturaOrdine` sets `numero_fattura` when moving to `FATTURATO`.
- `RISCOSSO` is an allowed later state.
- `provvigioni_pagate`, `numero_fattura`, and financial fields exist in `preventivi`.

Questions:

- Is invoice number mandatory to mark an order as `FATTURATO`?
- Can multiple orders share one invoice number?
- What field marks payment/collection beyond status `RISCOSSO`?
- Are commissions/provvigioni still used?
- Are totals recalculated by the app or manually entered?
- Does the app need accounting export/import?

Default migration assumption:

- Preserve invoice number and status exactly.
- Do not add accounting integration unless confirmed.

### 8. Quote item pricing, discounts, and totals

Current evidence:

- Insert trigger on `item_preventivi` copies `nomenclatore.prezzo` and calculates `importo`.
- Insert trigger applies `sconto` if present.
- Update trigger recalculates `importo = quantita * prezzo` and ignores `sconto`.
- Quote total is stored on `preventivi.totale`, but the exact recalculation rule needs confirmation.

Questions:

- Is discount meant to apply only on insert, or should it also apply after edits?
- Can users manually override price?
- Can users manually override line total/importo?
- Should quote totals be recalculated from line items automatically?
- Should prices be historical snapshots or always tied to current `nomenclatore`?
- What does `stato_item` mean operationally: `OK`, `KO`, `OK_PAGAMENTO`?
- Should KO/private items affect totals and production creation?

Default migration assumption:

- Preserve trigger-equivalent behaviour first, including the update inconsistency.
- Mark discount-update behaviour as a candidate bug only after business approval.

### 9. Catalogue and uploaded import files

Current evidence:

- `nomenclatore` stores catalogue codes, descriptions, prices, and year.
- `public/uploads` contains CSV/XLS/XLSX files that look like catalogue/import material.

Questions:

- Which uploaded CSV/XLS/XLSX files are authoritative or historical?
- Is there a recurring catalogue import process?
- Should old uploaded import files be preserved in the new system?
- Is `nomenclatore.anno` used to select price by year?
- Can catalogue codes repeat across years?
- Should users still import/export catalogue data from the UI?

Default migration assumption:

- Migrate the DB catalogue as the source of truth.
- Preserve uploaded import files only after committent confirms they are needed.

### 10. Customer and district assignment

Current evidence:

- `clienti.distretto_appartenenza` is set by DB triggers.
- Trigger lookup matches `aziende_sanitarie.comune = UPPER(clienti.citta)`.

Questions:

- Is automatic district assignment still required?
- What should happen when no district match is found?
- What should happen when multiple districts match the same city name?
- Can users manually override `distretto_appartenenza`?
- Should matching be improved using normalized municipality/province data, or preserve text matching exactly?

Default migration assumption:

- Preserve current text-match behaviour unless the committent requests cleanup.

### 11. Doctors, ASL/health companies, and master data

Current evidence:

- `medici`, `aziende_sanitarie`, `comuni`, `provincia`, and `stati` are lookup/master tables.

Questions:

- Which master data tables are user-maintained?
- Which are imported from external datasets?
- Are inactive/old doctors and companies kept visible?
- Are duplicate doctors/companies acceptable?
- Should master data deletion be allowed, or only deactivation?

Default migration assumption:

- Preserve master tables and current edit permissions.

### 12. Non-conformity lifecycle

Current evidence:

- `non_conforme` can be created from a quote with only `id_preventivo`.
- Later fields include opening/closing dates, technician, complaint reason, device/presidio, warranty, notes, and state.

Questions:

- What are the allowed non-conformity states?
- Which fields are mandatory at opening?
- Which fields are mandatory at closing?
- Can a non-conformity reopen after closure?
- Does creating a non-conformity change quote or production status?
- Should non-conformities be visible from the quote detail page?

Default migration assumption:

- Preserve table and CRUD behaviour.
- Do not infer a formal state machine unless confirmed.

### 13. Technical assistance workflow

Current evidence:

- Technical assistance fields are embedded in `lavorazioni`.
- `asstec` filters production jobs where `assistenza_tecnica = SI`.

Questions:

- Is assistance a subtype of production job or should it be its own workflow?
- What starts an assistance request?
- What closes an assistance request?
- Which documents are required?
- Which assistance statuses are real, given `stato_per_assistenza` is empty?
- Is warranty required for assistance?

Default migration assumption:

- Preserve assistance as fields on `lavorazioni` and filtered view `asstec`.

### 14. Risk analysis and periodic controls

Current evidence:

- `analisi_rischi` is a very wide form table.
- `controlli_periodici` stores periodic interventions linked to `lavorazioni` and `clienti`.
- Direct public insert scripts exist for risk analysis and controls.

Questions:

- When is risk analysis mandatory?
- Is one risk-analysis record expected per quote, production job, customer, or device?
- Are signatures mandatory?
- Are periodic controls scheduled automatically or inserted manually?
- Can controls exist without a linked production job?
- Should direct insert URLs remain available, or become authenticated forms?

Default migration assumption:

- Preserve current tables and authenticated CRUD.
- Reimplement direct-script behaviour only as authenticated app workflows unless public access is explicitly required.

### 15. Public/direct scripts and quick-fix features

Current evidence:

- Several scripts under `public/` query the DB directly and bypass Laravel middleware/auth/CSRF.
- Some scripts contain hardcoded DB access in old copies.

Questions:

- Which direct script behaviours are still used by staff?
- Are any direct URLs shared externally?
- Are any scripts used by printers/scanners/shortcuts/bookmarks?
- Should public unauthenticated access be removed by default in the new system?
- Are there quick-fix scripts whose behaviour exists nowhere else in Laravel controllers?

Default migration assumption:

- Do not expose bypass scripts in the new system.
- Port necessary behaviour into authenticated routes/services.

### 16. Users, passwords, groups, and permissions

Current evidence:

- Users are in `tb_users`.
- Groups are in `tb_groups`.
- Permissions are in `tb_groups_access`.
- Sximo metadata defines modules and access flags.

Questions:

- Which user accounts are active and should remain enabled?
- Should any old users be disabled during migration?
- Are all three current groups still needed?
- Should old Sximo permissions be authoritative?
- Are module permissions enough, or are there hidden per-action business restrictions?
- Should password reset be forced after migration for security?
- Are registration and password recovery currently used?

Default migration assumption:

- Preserve `tb_users`, groups, and access rules.
- Keep password hashes if compatible.
- If incompatible, preserve accounts and force password reset.

### 17. Email, notifications, and messaging

Current evidence:

- Laravel/Sximo has email configuration screens.
- Code contains contact-form email, registration/password email scaffolding, blast email, and dynamic form email handling.
- `tb_notification` is empty in the dump.
- `NotificationController` exists, but no business notification data is present.

Questions:

- Is email sending currently used in production?
- Are password reset emails used?
- Are account activation emails used?
- Is blast/bulk email used?
- Are contact-form emails used?
- Are dynamic form emails used?
- Should the new system send emails for quote/status changes?
- Should notifications be in-app only, email only, or both?
- Which SMTP settings and sender identities should be used?
- Should failed emails be logged/audited?

Default migration assumption:

- Implement only authentication emails needed for user access unless committent confirms broader email workflows.
- Keep `tb_notification` available but do not build complex notification logic unless required.
- Host backups are not in scope.

### 18. Uploaded files and file visibility

Current evidence:

- `public/uploads` contains import files, images/logos, user avatars, DOCX files, scans, and thumbnails.
- Public placement means some files may be directly accessible by URL.

Questions:

- Which upload folders must be migrated?
- Which files are business/legal records?
- Which files are temporary import artifacts?
- Which files can be discarded?
- Should migrated files remain public, or require authenticated access?
- Are uploaded DOCX/XLSX files referenced from any workflow?
- Are thumbnails/cache files disposable?

Default migration assumption:

- Do not discard upload content without committent approval.
- In the new system, prefer authenticated file access for medical/business documents.

### 19. Audit log usage

Current evidence:

- `tb_logs` stores audit events and some state-change history.
- The user wants to preserve and leverage this same table.

Questions:

- Should every create/update/delete be logged as in Sximo?
- Should every state change be logged with the same note format?
- Should old `module` names be preserved in new logs for continuity?
- Should logs be editable/deletable by admins?
- How long must logs be retained?
- Should failed authorization or validation attempts be logged?

Default migration assumption:

- Preserve old rows unchanged.
- New Python audit entries should write to `tb_logs` with compatible fields and recognizable module names.

### 20. Imports, exports, and reporting

Current evidence:

- Sximo generated modules support CSV import/export.
- The UI has year filters and several dated quote modules/views.
- Uploaded files include CSV/XLS/XLSX data.

Questions:

- Which imports are actively used?
- Which exports are required for operations/accounting/compliance?
- Are year-specific filtered views still required, or can they become filters?
- Are CSV formats expected by external parties?
- Are there recurring reports not visible from the code?

Default migration assumption:

- Preserve generic CSV export/import for core tables only where used.
- Replace dated modules with filters if the committent accepts it.

### 21. Data integrity while keeping no foreign keys

Current evidence:

- There are no DB foreign keys.
- Relationships are inferred from column names, Sximo metadata, views, and controller logic.

Questions:

- If orphaned rows exist, should they be preserved exactly, hidden, repaired, or reported?
- Should the Python app prevent new orphaned relationships even though the DB has no FK constraints?
- Should deletes cascade in application code as currently done in some controllers?
- Should hard deletes remain allowed, or should the new system use soft deletes for business records?

Default migration assumption:

- Keep the DB FK-free.
- Add application-level validation to reduce new inconsistencies only when it does not break legacy operations.

## Suggested Committent Review Format

For each section above, ask the committent to answer with one of:

- Preserve exactly as legacy.
- Preserve data, but simplify UI/workflow.
- Keep only for historical read-only access.
- Remove/ignore in the new system.
- Needs live demo from current users.

The most important items to resolve first are:

1. Quote/order state side effects.
2. Production job creation and delivery behaviour.
3. Pricing/discount/total rules.
4. User/password/permission compatibility.
5. Which uploaded files are real business records.
6. Which direct public script behaviours must survive.
7. Whether email/notifications are actually used.
