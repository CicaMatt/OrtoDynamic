# public_html System Folder Map

Generated: 2026-05-08

This document maps the `public_html` folder as an implementation guide for the OrtoDynamic orthopedic workshop management system.

The project is an older Laravel 5.4 application with a Sximo CRUD/admin layer and several direct public PHP scripts for PDF/document generation. The main business vocabulary is Italian:

- `clienti`: patients/customers.
- `medici`: doctors/prescribers.
- `aziende`: health/medical companies.
- `preventivi`: quotes/orders/orthopedic prescriptions.
- `item_preventivi`: quote/order line items.
- `lavorazioni`: workshop jobs created from approved quotes.
- `item_lavorazioni`: production/workshop line items.
- `stato` and `stato_check`: status values and allowed status transitions.
- `non_conforme`: non-conformity records.
- `analisi_rischi`: risk analysis.
- `controlli_periodici`: periodic checks/controls.
- `nomenclatore`: product/procedure catalogue.

Sensitive values are not copied into this map. Some source files contain credentials/API keys directly in code or config; those locations are called out without reproducing the secrets.

## Coverage Notes

`public_html` contains about 10,390 files. The implementation files are mapped individually. Very large third-party folders (`vendor`, `public/sximo5`, TinyMCE/DataTables assets, FontAwesome, framework internals, generated Blade cache, uploads, fonts) are mapped by package/folder because they are not custom business logic and listing thousands of library internals would make the document harder to use.

## Top-Level Shape

| Path | Approx. size | Role |
|---|---:|---|
| `app/` | 1.2 MB | Laravel application code: controllers, models, middleware, helpers, providers. |
| `bootstrap/` | 28 KB | Laravel bootstrap and cached provider metadata. |
| `config/` | 64 KB | Laravel/Sximo configuration. Includes sensitive runtime settings. |
| `database/` | 28 KB | Default Laravel migrations/factories/seeds only. The real business schema is mostly not represented as migrations. |
| `public/` | 83 MB | Web document root, generated/static assets, uploaded files, PDF scripts, FPDF/FPDI libraries, Sximo frontend/admin assets. |
| `resources/` | 4.8 MB | Blade views, language files, and one LESS asset. |
| `routes/` | 36 KB | Web routes, generated module routes, Sximo admin routes, core admin routes. |
| `storage/` | 1.7 MB | Laravel runtime files: sessions, compiled Blade views, logs. |
| `tests/` | 8 KB | Default Laravel test skeleton. |
| `vendor/` | 63 MB | Composer packages: Laravel 5.4, Socialite, LaravelCollective, Dompdf, PHPUnit, etc. |
| `public.zip` | 44 MB | Archive of public assets/content. Likely deployment/backup artifact. |
| `.env`, `.env.example`, ` - Copia.env` | 4 KB each | Runtime environment files. `.env` and copy may contain secrets. |

## Runtime Flow

1. A web request normally enters through `public/index.php`.
2. `public/index.php` loads `bootstrap/autoload.php` and `bootstrap/app.php`.
3. `app/Providers/RouteServiceProvider.php` loads `routes/web.php` and `routes/api.php`.
4. `routes/web.php` routes:
   - `/` to `HomeController@index`.
   - login/profile/registration to `UserController`.
   - business modules through `routes/module.php`.
   - Sximo admin generator through `routes/sximo.php`.
   - core admin modules through `routes/core.php`.
5. Business module routes use `Route::resource`, so each module gets standard `index`, `create`, `store`, `show`, `edit`, `update`, `destroy` style URLs.
6. Generated module controllers extend `app/Http/Controllers/Controller.php`.
7. Generated module models extend `app/Models/Sximo.php`.
8. `Sximo.php` builds SQL from each model's `querySelect`, `queryWhere`, `queryGroup`, reads module metadata from `tb_module`, checks permissions in `tb_groups_access`, and logs changes to `tb_logs`.
9. Blade views in `resources/views/<module>/` render the module grids, forms, and detail pages.

## High-Level Business Workflows

### Login And Access

- `UserController` handles login, registration, password reset, profile updates, activation, logout.
- `IpblockedMiddleware` applies IP allow/deny logic from `config/sximo.php`, initializes session language, and stores current user metadata in session.
- `Controller::__construct()` applies `ipblocked` middleware and loads database/Sximo config.
- Business controllers check `Auth::check()` and module permissions before listing, adding, editing, viewing, or deleting.

### Quote/Order Lifecycle

Primary files:

- `app/Http/Controllers/PreventiviController.php`
- `app/Models/Preventivi.php`
- `resources/views/preventivi/index.blade.php`
- `resources/views/preventivi/form.blade.php`
- `resources/views/preventivi/view.blade.php`
- `app/Http/Controllers/PrevinvController.php`
- `app/Models/Previnv.php`

Workflow:

1. A patient/customer is created in `clienti`.
2. A `preventivi` record is created for that customer.
3. Quote line items are handled through the `prodottipreventivi` subform/model, backed by `item_preventivi`.
4. `preventivi/index.blade.php` exposes status actions such as:
   - send to ASL: `INVIATO`
   - authorize ASL quote: `AUTORIZZATO`
   - send to production: `IN LAVORAZIONE`
   - send to production without authorization: `IN LAVORAZIONE SENZA AUTORIZZAZIONE`
   - suspend, cancel, reject, deliver, invoice, collect
5. `PreventiviController::changeState()` validates status transitions against `stato_check`.
6. When a quote moves to production, `PreventiviController` creates a `lavorazioni` row and copies `item_preventivi` rows into `item_lavorazioni`.
7. `PrevinvController` is a filtered quote view for quotes whose `stato` is `INVIATO`; the dashboard redirects there.
8. Status changes and notes are audited into `tb_logs`.

### Workshop Production

Primary files:

- `app/Http/Controllers/LavorazioniController.php`
- `app/Models/Lavorazioni.php`
- `app/Http/Controllers/ProdottilavorazioniController.php`
- `app/Models/Prodottilavorazioni.php`
- `resources/views/lavorazioni/*`
- `resources/views/prodottilavorazioni/*`

Workflow:

1. Production records live in `lavorazioni`.
2. Production item rows live in `item_lavorazioni`.
3. The `inlavorazione` module filters active production jobs with `lavorazioni.stato = 'IN LAVORAZIONE'`.
4. Other production-state modules expose filtered views of `lavorazioni`: `prontoprimaprova`, `dacons`, `daconsegnare`, `asstec`, etc.

### Document/PDF Generation

Primary files:

- `public/generaPdf.php`
- `public/generacollaudi.php`
- `public/assistenzatecnica.php`
- `public/Modulorischi.php`
- `public/fpdf.php`
- `public/fpdi.php`
- `public/doc/*`

Workflow:

1. Module views link directly to public PHP scripts, for example `generaPdf.php?checkedvalue=<id>&tipologia=...`.
2. The scripts query the database and fill PDF templates using FPDF/FPDI.
3. Templates live in `public/doc/`.
4. `public/generaPdf.php` has been partly modernized to read DB settings from environment variables.
5. Many older PDF scripts still contain hardcoded database credentials.

### Non-Conformity, Risk Analysis, Controls

Primary files:

- `NonconformitaController`, `Nonconformita` model, `resources/views/nonconformita/*`
- `AnalrischiController`, `Analrischi` model, `resources/views/analrischi/*`
- `FormcController`, `RegcontrController`, `Formc`, `Regcontr`, `resources/views/formc/*`, `resources/views/regcontr/*`
- `public/inseriscianalisirischi.php`
- `public/inseriscicontrolli.php`

Workflow:

- Non-conformity can be created from a quote row through `PreventiviController::inserisciNonConformita()`.
- Risk analysis and periodic controls appear as module CRUD screens and direct public insert scripts.

## Top-Level Files

| File | Purpose |
|---|---|
| `.env` | Live runtime environment variables. Do not expose or commit. |
| `.env.example` | Example Laravel environment configuration. |
| ` - Copia.env` | Copy/backup of environment file. Treat as sensitive. |
| `.gitattributes` | Git attributes file. |
| `.gitignore` | Git ignore rules. |
| `.htaccess` | Apache rewrite/access behavior at hosting root. |
| `.well-known/acme-challenge/` | Let's Encrypt/ACME challenge directory. Empty at inspection time. |
| `404.shtml`, `500.shtml` | Static server error pages. |
| `README.md` | Default Laravel README, not project-specific. |
| `artisan` | Laravel command-line entrypoint. |
| `composer.json` | PHP dependency manifest. Requires PHP >= 5.6.4 and Laravel 5.4.*. |
| `composer.lock` | Locked dependency versions. |
| `composer.phar` | Local Composer executable. |
| `favicon.ico` | Site icon at hosting root. |
| `gulpfile.js` | Legacy asset build task file. |
| `index.html` | Minimal/static root file. |
| `index.php` | Tiny root file, likely redirects/includes public entry behavior. |
| `info.php` | PHP info/test file. Should not be public in production. |
| `logs.txt` | Small log/text artifact. |
| `main` | Empty file. |
| `moduloconsega.pdf` | PDF document/template copy at root. |
| `phpunit.xml` | PHPUnit configuration. |
| `public.zip` | Archive copy of public folder/assets. |
| `server.php` | Laravel local development server entry file. |
| `start.sh` | Shell startup/deployment script. |

## Composer Dependencies

Declared in `composer.json`:

| Package | Role |
|---|---|
| `laravel/framework` 5.4.* | Application framework. |
| `laravelcollective/html` | Form/HTML helpers used in Blade views. |
| `mews/captcha` | Captcha support. |
| `laravel/socialite` | Social login integration. |
| `vsmoraes/laravel-pdf` | PDF integration. |
| `gloudemans/shoppingcart` | Shopping cart package, present but not visibly central to orthopedic workflow. |
| `phpunit/phpunit`, `mockery/mockery`, `fzaninotto/faker` | Test/dev dependencies. |

## app/ Folder

### app/User.php

Laravel authenticatable user model:

- Uses `tb_users`.
- Hides `password` and `remember_token`.
- Used by `UserController` and Laravel auth.

### app/Console

| File | Purpose |
|---|---|
| `app/Console/Kernel.php` | Default Laravel console kernel. No business scheduled tasks found. |

### app/Exceptions

| File | Purpose |
|---|---|
| `app/Exceptions/Handler.php` | Default Laravel exception handler. |

### app/Providers

| File | Purpose |
|---|---|
| `AppServiceProvider.php` | Default application service provider. |
| `AuthServiceProvider.php` | Auth policy/provider registration. |
| `BroadcastServiceProvider.php` | Broadcast routes/provider, present but not enabled in `config/app.php`. |
| `EventServiceProvider.php` | Laravel event/listener registration. |
| `HelperServiceProvider.php` | Empty provider placeholder. |
| `RouteServiceProvider.php` | Loads `routes/web.php` and `routes/api.php`. |

### app/Http/Middleware

| File | Purpose |
|---|---|
| `EncryptCookies.php` | Laravel cookie encryption middleware. |
| `RedirectIfAuthenticated.php` | Redirects logged-in users away from guest pages. |
| `VerifyCsrfToken.php` | Laravel CSRF middleware class. It exists, but CSRF middleware is commented out in `Kernel.php`. |
| `IpblockedMiddleware.php` | Sximo-specific middleware. Restricts/permits IPs from `config/sximo.php`, initializes language/session data, stores user identity fields in session. |

### app/Http/Kernel.php

Registers middleware. Important note: `VerifyCsrfToken` is commented out in the `web` middleware group, so form POSTs are not protected by Laravel CSRF by default.

### app/Http/pageroutes.php

Additional route/page-related file. It appears to be part of Sximo page routing support.

## Base Controller And Base Model

### app/Http/Controllers/Controller.php

Shared base controller for generated modules.

Main responsibilities:

- Applies `ipblocked` middleware.
- Reads active DB connection details from Laravel config.
- Loads Sximo config into `$this->config` and `$this->data['sximoconfig']`.
- Provides combo/table AJAX helpers:
  - `getComboselect`
  - `getCombotable`
  - `getCombotablefield`
- Builds search SQL from URL query parameters:
  - `buildSearch`
  - `onSearch`
  - `searchOperation`
- Provides export/import/search/copy/detail-subform support used by generated modules.
- Provides audit helpers and hook/grab behavior used by modules.

### app/Models/Sximo.php

Shared base model for generated modules.

Main responsibilities:

- `getRows()` builds paginated SQL using child model `querySelect`, `queryWhere`, and `queryGroup`.
- `getRow()` fetches a single row by module primary key.
- `insertRow()` inserts or updates a row in the module table.
- `makeInfo()` loads module metadata/config from `tb_module`.
- `getComboselect()` reads options for dynamic select fields.
- `isAccess()` and `validAccess()` check `tb_groups_access`.
- `getColumnTable()`, `getTableList()`, `getTableField()` inspect database schema.
- `logs()` writes audit entries to `tb_logs`.

## Business Module Map

Most rows below follow this structure:

- route: declared in `routes/module.php`
- controller: `app/Http/Controllers/<Name>Controller.php`
- model: `app/Models/<Name>.php`
- views: `resources/views/<module>/index.blade.php`, `form.blade.php`, `view.blade.php`
- public views: `resources/views/<module>/public/index.blade.php`, `form.blade.php`, `view.blade.php` when present

| Module | DB table/model focus | Main functionality |
|---|---|---|
| `nomenclatore` | `nomenclatore` | Catalog of orthopedic product/procedure codes and descriptions used by quote/work items. |
| `medici` | `medici` | Doctors/prescribers. |
| `aziende` | `aziende_sanitarie` | Healthcare/medical companies or authorities. |
| `clienti` | `clienti` | Patients/customers, measurements, personal data. Can create a quote directly after saving a customer. |
| `piede` | `clienti` | Foot-specific customer measurement view. |
| `preventivi` | `preventivi` plus `item_preventivi` subform | Main quote/order module; handles status transitions, authorization, invoicing, delivery, non-conformity creation, PDF links. |
| `busto` | `clienti` | Torso/bust measurement view. |
| `misuregenerali` | `clienti` | General customer measurements. |
| `prodottipreventivi` | `item_preventivi` | Quote/order line items. |
| `statocheck` | `stato_check` | Allowed status transition matrix, used before changing quote states. |
| `stato` | `stato` | Status master list. |
| `previnv` | `preventivi` filtered to `stato='INVIATO'` | Sent quote queue. Dashboard redirects here. Supports status changes and note history. |
| `nonconformita` | `non_conforme` | Non-conformity records linked to quotes/customers. |
| `lavorazioni` | `lavorazioni` plus `item_lavorazioni` subform | Workshop production jobs created from quotes. |
| `prodottilavorazioni` | `item_lavorazioni` | Production/workshop line items with order, delivery, DDT, lot, supplier, material fields. |
| `statilavorazioni` | `stato_lavorazioni` | Production status master list. |
| `inlavorazione` | `lavorazioni` filtered to `IN LAVORAZIONE` | Active workshop jobs. |
| `prontoprimaprova` | `lavorazioni` | Jobs ready for first fitting/test. |
| `prevaut` | `preventivi` joined to `lavorazioni` | Authorized quotes/orders view. |
| `prinvp` | `preventivi` | Quote/order filtered view. Exact filtering is likely driven by `tb_module` config. |
| `provapdf` | `preventivi` | PDF test/proof module. |
| `prevlav` | `preventivi` joined to `lavorazioni` | Quotes/orders in production-related state. |
| `prevcons` | `preventivi` joined to `lavorazioni` | Delivered/consignment-related quote/order view; has invoice/draft actions. |
| `prodint` | `item_lavorazioni` joined to `lavorazioni` | Internal production items. |
| `dacons` | `lavorazioni` joined to `preventivi` | Jobs/orders to deliver. |
| `bozze` | `preventivi` | Draft quotes/orders. |
| `asstec` | `lavorazioni` joined to `preventivi` | Technical assistance jobs. |
| `analrischi` | `analisi_rischi` | Risk analysis records. |
| `formc` | `controlli_periodici` | Periodic-control form module. |
| `regcontr` | `controlli_periodici` | Periodic-control register module. |
| `daconsegnare` | `lavorazioni` | Jobs ready to be delivered. |
| `prvduemilaventi` | `preventivi` | 2020-era quote/order view, probably retained for historical reporting. |
| `pdvu` | `preventivi` | Quote/order filtered view. Exact filtering is likely in `tb_module`. |
| `prevdvd` | `preventivi` | Quote/order filtered view. Exact filtering is likely in `tb_module`. |
| `clone` | `preventivi` | Clone/copy support for quote/order records. |
| `PrvDuemvntd` | `preventivi` joined to `lavorazioni` and `clienti` | 2022-era quote/order view. Uses capitalized route/view folder. |
| `prvdcnv` | `preventivi` | Quote/order filtered view. |

## Controller File Map

### Business Controllers

| File | Functionality |
|---|---|
| `AnalrischiController.php` | CRUD for risk analysis records in `analisi_rischi`. |
| `AsstecController.php` | CRUD for technical assistance production/jobs backed by `lavorazioni`. |
| `AziendeController.php` | CRUD for healthcare company records. |
| `BozzeController.php` | CRUD/listing for draft quotes/orders. |
| `BustoController.php` | CRUD-style view over customer bust/torso measurements. |
| `ClientiController.php` | Customer CRUD. Adds custom `inserisciPreventivo()` and a save-and-create-quote branch. |
| `CloneController.php` | CRUD/clone view over `preventivi`. |
| `DaconsController.php` | Jobs to deliver, backed by `lavorazioni`. |
| `DaconsegnareController.php` | Jobs/orders ready for delivery, backed by `lavorazioni`. |
| `FormcController.php` | Periodic-control form CRUD over `controlli_periodici`. |
| `InlavorazioneController.php` | Active work-in-progress production view. |
| `LavorazioniController.php` | Production job CRUD with `Prodottilavorazioni` subform; deletes related `item_lavorazioni` rows. |
| `MediciController.php` | Doctors/prescribers CRUD. |
| `MisuregeneraliController.php` | General customer measurement CRUD view. |
| `NomenclatoreController.php` | Catalog code CRUD. |
| `NonconformitaController.php` | Non-conformity CRUD linked to quotes/customers. |
| `NotificationController.php` | Notifications CRUD/listing from `tb_notification`. |
| `PdvuController.php` | Quote/order filtered view. |
| `PiedeController.php` | Foot measurement CRUD view over `clienti`. |
| `PreventiviController.php` | Main quote/order controller. Handles subform quote items, status transitions, authorization, invoice number, delivery, draft, private notes, non-conformity creation, and production job creation. |
| `PrevautController.php` | Authorized quote/order view. |
| `PrevconsController.php` | Delivered/consignment quote/order view; includes invoice and draft actions. |
| `PrevdvdController.php` | Quote/order filtered view. |
| `PrevinvController.php` | Sent quote queue. Validates status transitions, updates notes, displays status log history. |
| `PrevlavController.php` | Production-related quote/order view. |
| `PrinvpController.php` | Quote/order filtered view. |
| `ProdintController.php` | Internal production item CRUD/listing. |
| `ProdottipreventiviController.php` | Quote item CRUD over `item_preventivi`. |
| `ProdottilavorazioniController.php` | Production item CRUD over `item_lavorazioni`. |
| `ProntoprimaprovaController.php` | Jobs ready for first fitting/test. |
| `ProvapdfController.php` | PDF/proof support over quotes. |
| `PrvDuemvntdController.php` | 2022 quote/order view. |
| `PrvdcnvController.php` | Quote/order filtered view. |
| `PrvduemilaventiController.php` | 2020 quote/order view. |
| `RegcontrController.php` | Periodic-control register CRUD. |
| `StatoController.php` | Status master CRUD. |
| `StatocheckController.php` | Allowed status transition CRUD. |
| `StatilavorazioniController.php` | Production status master CRUD. |

### Application Controllers

| File | Functionality |
|---|---|
| `Controller.php` | Base generated-module controller with search, combo, export/import, validation, audit, hook/grab utilities. |
| `DashboardController.php` | Dashboard entry; currently redirects to `previnv.index`. |
| `HomeController.php` | CMS/front page rendering, language/theme switching, form submission, notification load, blog/posts/comments. |
| `LogController.php` | Auth-protected log listing route. |
| `SximoapiController.php` | Dynamic REST API controller for Sximo API definitions. |
| `UserController.php` | Login, registration, activation, profile, password, logout, recaptcha/social login setup. |

### Legacy/Archive Controllers

These are dated copies of older business logic. They are not referenced by `routes/module.php` but are valuable for change history.

| File | Likely purpose |
|---|---|
| `NonconformitaController_03_04_2019.php` | Old non-conformity controller. |
| `PreventiviController_17_10_2019.php` | Old quote/order controller. |
| `PreventiviController_18_06_2019.php` | Old quote/order controller. |
| `PreventiviController_25_09_2019.php` | Old quote/order controller. |
| `PreventiviController_28_02_2019.php` | Old quote/order controller. |
| `ProdottipreventiviController_05_03_2019.php` | Old quote-item controller. |
| `UserController_25_03_2019.php` | Old user controller. |

### Core Admin Controllers

| File | Functionality |
|---|---|
| `Core/UsersController.php` | Admin CRUD for users, email blast support. |
| `Core/GroupsController.php` | Admin CRUD for user groups and access levels. |
| `Core/PagesController.php` | CMS page CRUD and route generation. |
| `Core/PostsController.php` | Blog/post CRUD and post config. |
| `Core/LogsController.php` | Audit log CRUD/listing. |
| `Core/FormsController.php` | Dynamic form builder, form fields, rebuild, processing. |
| `Core/ElfinderController.php` | File manager UI/controller. |
| `Core/TemplateController.php` | Template/changelog display. |

### Sximo Admin/Generator Controllers

| File | Functionality |
|---|---|
| `Sximo/ModuleController.php` | Large module generator/configurator: creates modules, SQL, fields, forms, subforms, permissions, rebuilds code, packages/installs modules, edits generated source. |
| `Sximo/CodeController.php` | Source-code editor interface. |
| `Sximo/MenuController.php` | Menu builder/order/icons. |
| `Sximo/FormController.php` | Sximo form builder and form/field storage. |
| `Sximo/ConfigController.php` | App/email/security/translation/log configuration. |
| `Sximo/TablesController.php` | Database table editor, field editor, SQL editor. |
| `Sximo/RacController.php` | REST API creator/admin (`tb_restapi`). |

### Auth Controllers

| File | Functionality |
|---|---|
| `Auth/AuthController.php` | Laravel auth scaffold controller. |
| `Auth/ForgotPasswordController.php` | Password reminder flow scaffold. |
| `Auth/LoginController.php` | Laravel login scaffold. |
| `Auth/PasswordController.php` | Older Laravel password controller scaffold. |
| `Auth/RegisterController.php` | Registration scaffold. |
| `Auth/ResetPasswordController.php` | Password reset scaffold. |

## Model File Map

| File | Table | Purpose |
|---|---|---|
| `Analrischi.php` | `analisi_rischi` | Risk analysis rows. |
| `Asstec.php` | `lavorazioni` | Technical assistance job view joined to quotes. |
| `Aziende.php` | `aziende_sanitarie` | Healthcare company rows. |
| `Bozze.php` | `preventivi` | Draft quote/order view. |
| `Busto.php` | `clienti` | Customer bust/torso measurement subset. |
| `Clienti.php` | `clienti` | Customer/patient master data. |
| `Clone.php` | `preventivi` | Clone/copy quote/order view. |
| `Dacons.php` | `lavorazioni` | Delivery-related jobs joined to quotes. |
| `Daconsegnare.php` | `lavorazioni` | Jobs ready to deliver. |
| `Formc.php` | `controlli_periodici` | Periodic-control form records. |
| `Inlavorazione.php` | `lavorazioni` | Active jobs where status is `IN LAVORAZIONE`, joined to quote details. |
| `Lavorazioni.php` | `lavorazioni` | Main production jobs joined to quotes. |
| `Medici.php` | `medici` | Doctors/prescribers. |
| `Misuregenerali.php` | `clienti` | General measurement columns from customers. |
| `Nomenclatore.php` | `nomenclatore` | Product/procedure catalog. |
| `Nonconformita.php` | `non_conforme` | Non-conformity records joined to quote/customer data. |
| `Notification.php` | `tb_notification` | User/system notification records. |
| `Pdvu.php` | `preventivi` | Quote/order filtered view. |
| `Piede.php` | `clienti` | Customer foot-measurement view. |
| `Post.php` | `tb_pages` | CMS/blog post model joined to comments/users. |
| `Preventivi.php` | `preventivi` | Main quote/order model joined to production status and customer city. |
| `Preventivi_24_05_2020.php` | `preventivi` | Legacy model copy. |
| `Prevaut.php` | `preventivi` | Authorized quote/order view joined to production status. |
| `Prevcons.php` | `preventivi` | Delivered/consignment quote/order view joined to production status. |
| `Prevdvd.php` | `preventivi` | Quote/order filtered view. |
| `Previnv.php` | `preventivi` | Sent quote queue, filtered to `stato='INVIATO'`. |
| `Previnv_07_06_2021.php` | `preventivi` | Legacy model copy. |
| `Prevlav.php` | `preventivi` | Production-related quote/order view joined to `lavorazioni`. |
| `Prinvp.php` | `preventivi` | Quote/order filtered view. |
| `Prodint.php` | `item_lavorazioni` | Internal production line items joined to `lavorazioni`. |
| `Prodottipreventivi.php` | `item_preventivi` | Quote/order line items. |
| `Prodottilavorazioni.php` | `item_lavorazioni` | Production line items with material, supplier, DDT, lot, delivery, and order fields. |
| `Prontoprimaprova.php` | `lavorazioni` | Jobs ready for first fitting/test. |
| `Provapdf.php` | `preventivi` | Quote/order PDF proof support. |
| `PrvDuemvntd.php` | `preventivi` | 2022 quote/order view joined to production status and customer city. |
| `Prvdcnv.php` | `preventivi` | Quote/order filtered view. |
| `Prvduemilaventi.php` | `preventivi` | 2020 quote/order view. |
| `Regcontr.php` | `controlli_periodici` | Periodic-control register. |
| `Stato.php` | `stato` | Status master data. |
| `Statocheck.php` | `stato_check` | Allowed status transitions. |
| `Statilavorazioni.php` | `stato_lavorazioni` | Production status master data. |
| `Sximo.php` | base class | Shared generated-module model behavior. |
| `Sximo_02_04_2019.php` | base class copy | Old copy of base Sximo model. |

### Core/Sximo Models

| File | Table | Purpose |
|---|---|---|
| `Core/Users.php` | `tb_users` | Admin user listing joined to groups. |
| `Core/Groups.php` | `tb_groups` | User groups/access levels. |
| `Core/Pages.php` | `tb_pages` | CMS pages. |
| `Core/Posts.php` | `tb_pages` | Blog posts with comment counts. |
| `Core/Logs.php` | `tb_logs` | Audit logs. |
| `Core/Forms.php` | `tb_forms` | Dynamic form builder definitions. |
| `Sximo/Module.php` | `tb_module` | Sximo generated-module registry/config. |
| `Sximo/Menu.php` | `tb_menu` | Menu definitions. |
| `Sximo/Rac.php` | `tb_restapi` | REST API definitions. |

## app/Library Map

| File | Purpose |
|---|---|
| `SiteHelpers.php` | Large shared helper library: menus, JSON encode/decode, form rendering, view rendering, grid formatting, lookup formatting, uploads, avatars, language labels, audit trail, action buttons. Used heavily by generated views. |
| `SximoHelpers.php` | Sximo module packaging/unpackaging, route writing, config/form rendering helpers. |
| `FormHelpers.php` | Dynamic form rendering helper. |
| `PostHelpers.php` | CMS/blog content helpers, latest posts, tags, shortcode parsing. |
| `Markdown.php` | Markdown-like parser/rendering helper. |
| `Slimdown.php` | Lightweight markdown parser. |
| `ZipHelpers.php` | ZIP archive creation/download helper used by module package/export operations. |

## routes/ Folder

| File | Purpose |
|---|---|
| `web.php` | Main web route file. Loads home/user/blog routes, module routes, custom routes, dashboard, Sximo admin, and core admin routes. |
| `module.php` | Generated `Route::resource` declarations for all business modules. |
| `sximo.php` | Routes for Sximo module generator, code editor, config, menu builder, table editor, REST API admin, form builder. Auth protected by `web.php` group. |
| `core.php` | Routes for core admin modules: users, groups, pages, posts, logs, forms, elFinder. Auth protected by `web.php` group. |
| `pages.php` | CMS page aliases mapped to `HomeController@index`. |
| `api.php` | Default Laravel API route for `/api/user` with `auth:api`; no business API routes found here. |
| `console.php` | Laravel console route file. |

## config/ Folder

| File | Purpose |
|---|---|
| `app.php` | Laravel app config, providers, aliases. Registers Socialite, Shoppingcart, Captcha, Collective HTML, PDF facade. |
| `auth.php` | Authentication guards/providers/password settings. |
| `broadcasting.php` | Broadcasting driver config. |
| `cache.php` | Cache driver config. |
| `compile.php` | Laravel 5 compile/class optimization config. |
| `database.php` | DB connections using env vars. |
| `filesystems.php` | Local/cloud filesystem disks. |
| `mail.php` | Mail driver/server config. |
| `queue.php` | Queue driver config. |
| `services.php` | Third-party service credentials via env/config. |
| `session.php` | Session driver/lifetime/cookie config. |
| `sximo.php` | Sximo/OrtoDynamic app config: app name, company name, theme, language, registration, IP restrictions, mail mode, maps key, recaptcha keys. Contains sensitive/static keys. |
| `view.php` | View path/cache config. |

## database/ Folder

| File | Purpose |
|---|---|
| `migrations/2014_10_12_000000_create_users_table.php` | Default Laravel users migration, not aligned with the actual `tb_users` auth table. |
| `migrations/2014_10_12_100000_create_password_resets_table.php` | Default password reset migration. |
| `migrations/.gitkeep` | Keeps migrations folder in git. |
| `factories/ModelFactory.php` | Default model factory. |
| `seeds/DatabaseSeeder.php` | Default seeder shell. |
| `seeds/.gitkeep` | Keeps seeds folder in git. |
| `.gitignore` | Database folder ignore rules. |

Important: the real business schema (`preventivi`, `clienti`, `lavorazioni`, `item_preventivi`, `item_lavorazioni`, etc.) is not represented by migrations in this folder. The schema likely exists only in the live database and Sximo metadata (`tb_module`).

## resources/ Folder

### resources/views Layouts

| File | Purpose |
|---|---|
| `layouts/app.blade.php` | Main backend application layout. |
| `layouts/header.blade.php` | Backend header/navigation fragment. |
| `layouts/sidebar.blade.php` | Backend sidebar/menu fragment. |
| `layouts/login.blade.php` | Login layout. |
| `layouts/blank.blade.php` | Blank/minimal layout. |
| `layouts/masterview.blade.php` | Master/detail view layout helper. |
| `layouts/default/index.blade.php` | Default frontend theme wrapper. |
| `layouts/default/navigation.blade.php` | Frontend navigation. |
| `layouts/default/template/page.blade.php` | Default CMS page template. |
| `layouts/default/template/fullpage.blade.php` | Full-page CMS template. |
| `layouts/default/template/homepage.blade.php` | Homepage CMS template. |
| `layouts/default/template/backend.blade.php` | Backend-facing CMS template. |
| `layouts/default/blog/index.blade.php` | Blog listing template. |
| `layouts/default/blog/view.blade.php` | Blog detail template. |
| `layouts/default/info.json` | Theme metadata. |
| `layouts/themes/minimal/index.blade.php` | Minimal backend theme wrapper. |
| `layouts/themes/minimal/right.blade.php` | Minimal theme right panel. |
| `layouts/themes/minimal/topnav.blade.php` | Minimal theme top nav. |
| `layouts/themes/minimal/leftnav.blade.php` | Minimal theme left nav. |
| `layouts/themes/minimal/info.json` | Backend theme metadata. |

### resources/views Business Modules

For most modules:

- `index.blade.php`: grid/list page with actions/search/import/export.
- `form.blade.php`: create/edit form.
- `view.blade.php`: detail page.
- `public/index.blade.php`, `public/form.blade.php`, `public/view.blade.php`: public-facing versions generated by Sximo.

| View folder | Files/functionality |
|---|---|
| `analrischi/` | Current risk-analysis list/form/detail and public variants. |
| `asstec/` | Technical-assistance list/form/detail and public variants. |
| `aziende/` | Healthcare-company list/form/detail and public variants. |
| `bozze/` | Draft quote/order list/form/detail and public variants. |
| `busto/` | Bust/torso measurement list/form/detail and public variants. |
| `clienti/` | Customer list/form/detail, public variants, many dated backup list/form copies from 2019. |
| `clone/` | Clone/copy quote/order list/form/detail and public variants. |
| `dacons/` | To-deliver production job list/form/detail and public variants. |
| `daconsegnare/` | Ready-for-delivery list/form/detail and public variants. |
| `formc/` | Periodic-control form list/form/detail and public variants. |
| `inlavorazione/` | Active-work list/form/detail and public variants. |
| `lavorazioni/` | Production job list/form/detail, public variants, several dated backup forms. |
| `medici/` | Doctor list/form/detail and public variants. |
| `misuregenerali/` | General-measurement list/form/detail and public variants. |
| `nomenclatore/` | Catalog list/form/detail and public variants. |
| `nonconformita/` | Non-conformity list/form/detail, public variants, dated 2020 backup copies. |
| `notification/` | Notification list/form/detail. |
| `pdvu/` | Quote/order filtered list/form/detail and public variants. |
| `piede/` | Foot-measurement list/form/detail and public variants. |
| `preventivi/` | Main quote/order list/form/detail, public variants, many dated backup forms/lists from 2018-2021. Current index includes status-action UI, private notes, PDF links, and non-conformity creation. |
| `prevaut/` | Authorized quote/order list/form/detail, public variants, dated backup index. |
| `prevcons/` | Consignment/delivered quote/order list/form/detail, public variants, dated backup index. |
| `prevdvd/` | Quote/order filtered list/form/detail and public variants. |
| `previnv/` | Sent quote queue list/form/detail, public variants, many dated backup list/form/detail copies. Current index includes state-change modal and note updates. |
| `prevlav/` | Production quote/order list/form/detail, public variants, dated backup index. |
| `prinvp/` | Quote/order filtered list/form/detail and public variants. |
| `prodint/` | Internal production item list/form/detail and public variants. |
| `prodottipreventivi/` | Quote-item list/form/detail, public variants, dated backup/test copies. |
| `prodottilavorazioni/` | Production-item list/form/detail, public variants, dated backup form. |
| `prontoprimaprova/` | First-fitting/test queue list/form/detail and public variants. |
| `provapdf/` | PDF/proof list/form/detail and public variants. |
| `PrvDuemvntd/` | 2022 quote/order list/form/detail and public variants. |
| `prvdcnv/` | Quote/order filtered list/form/detail and public variants. |
| `prvduemilaventi/` | 2020 quote/order list/form/detail and public variants. |
| `regcontr/` | Periodic-control register list/form/detail and public variants. |
| `stato/` | Status master list/form/detail and public variants. |
| `statocheck/` | Allowed-transition list/form/detail and public variants. |
| `statilavorazioni/` | Production status list/form/detail and public variants. |

### resources/views Core, Sximo, User, Email

| Folder/file | Purpose |
|---|---|
| `core/users/*` | Admin user management views, email blast views. |
| `core/groups/*` | Admin group management views. |
| `core/pages/*` | CMS page management views. |
| `core/posts/*` | Blog/post management views and `config.json`. |
| `core/logs/*` | Audit log management views. |
| `core/forms/*` | Dynamic form builder views, field editor, configuration, docs, generated form template. |
| `core/template/*` | UI/template demo pages. |
| `core/elfinder/*` | elFinder file manager PHP classes, SQL, connector, view. |
| `sximo/module/*` | Sximo module generator screens and code templates (`native`, `blank`, `report`). |
| `sximo/config/*` | Sximo config and translation screens. |
| `sximo/form/*` | Form builder views. |
| `sximo/menu/*` | Menu builder views. |
| `sximo/rac/*` | REST API admin views. |
| `sximo/tables/*` | Table/SQL editor views. |
| `user/*` | Login, register, reminder, profile views. |
| `user/emails/*` | User email templates. |
| `emails/contact.blade.php`, `emails/registration.blade.php` | Contact/registration email templates. |
| `ajaxfooter.blade.php`, `footer.blade.php` | Shared footer fragments. |
| `dashboard/index.blade.php`, `dashboard/index.blade_25_03_2019.php` | Dashboard view and old copy. Current controller redirects away from it. |
| `logs/index.blade.php` | Log page view for `LogController`. |
| `errors/404.blade.php`, `errors/503.blade.php`, `errors/blocked.blade.php` | Error/blocked pages. |

### resources/lang

| Path | Purpose |
|---|---|
| `resources/lang/it/*` | Italian UI, validation, pagination, reminders, RAC strings. App default language in Sximo config is Italian. |
| `resources/lang/en/*` | English UI, validation, pagination, reminders, RAC strings. |
| `resources/lang/id/*` | Indonesian language files inherited from Sximo package. |

### resources/assets

| File | Purpose |
|---|---|
| `resources/assets/less/app.less` | Legacy LESS app stylesheet entry. |

## public/ Folder

### public Entry And Server Files

| File | Purpose |
|---|---|
| `public/index.php` | Main Laravel front controller. |
| `public/.htaccess` | Apache rewrite rules for Laravel public root. |
| `public/web.config` | IIS web server config. |
| `public/robots.txt` | Search crawler rules. |
| `public/favicon.ico` | Browser icon. |
| `public/error_log`, `public/my-errors.txt` | Runtime error logs/artifacts. |
| `public/setting.php` | Standalone setting/config script. Inspect before using in production. |

### public PDF And Direct PHP Scripts

| File | Purpose |
|---|---|
| `generaPdf.php` | Current main PDF generator. Supports delivery module, DDT, project sheet, privacy, and other template outputs based on query params. Uses FPDF/FPDI and now reads DB settings from env. |
| `generaPdf.php.save`, `generaPdf.php.save.1` | Saved backup copies of PDF generator. |
| `generaPdf_original.php` | Old original PDF generator copy. Contains hardcoded legacy DB connection. |
| `generaPdf_05_06_2019.php` | Dated PDF generator copy. |
| `generaPdf_13_09_2019.php` | Dated PDF generator copy. |
| `generaPdf_14_05_2019.php` | Dated PDF generator copy. |
| `generaPdf_19_12_2019.php` | Dated PDF generator copy. |
| `generaPdf_23_05_2019.php` | Dated PDF generator copy. |
| `generaPdf_25_04_2019.php` | Dated PDF generator copy. |
| `generaPdf_27_05_2021.php` | Dated PDF generator copy. |
| `generaPdf_27_05_2021(2).php` | Duplicate dated PDF generator copy. |
| `generacollaudi.php` | PDF generator for test/collaudo documentation. |
| `assistenzatecnica.php` | PDF generator for technical assistance documentation. |
| `Modulorischi.php` | Risk-analysis PDF/module generator. |
| `inseriscicontrolli.php` | Direct script inserting periodic-control records; includes standalone DB logic and Composer autoload. |
| `inseriscianalisirischi.php` | Direct script inserting risk-analysis records; includes standalone DB logic and Composer autoload. |
| `mappe.php` | Legacy map XML/data endpoint using deprecated `mysql_*` functions and direct DB credentials. |

Security note: most older direct scripts bypass Laravel middleware/auth/CSRF and several contain hardcoded database credentials. `generaPdf.php` is the most current version and should be the baseline for refactoring.

### public PDF Libraries

| File/folder | Purpose |
|---|---|
| `fpdf.php` | Bundled FPDF 1.81 library. |
| `fpdf.css` | FPDF style/helper file. |
| `fpdf_tpl.php` | FPDI/FPDF template support. |
| `fpdi.php` | FPDI PDF import library. |
| `fpdi_bridge.php` | FPDI bridge for FPDF/TCPDF. |
| `fpdi_pdf_parser.php` | FPDI PDF parser. |
| `pdf_context.php` | PDF parser context helper. |
| `pdf_parser.php` | PDF parser implementation. |
| `public/font/*.php` | FPDF font definition files: Helvetica, Courier, Times, Symbol, ZapfDingbats. |
| `public/makefont/*` | FPDF font-generation maps and scripts. |
| `font.zip`, `makefont.zip` | Archives of PDF font resources. |

### public Document Templates And Static Documents

| File/folder | Purpose |
|---|---|
| `public/doc/scheda*.pdf`, `scheda*.docx` | Project sheet templates/versions. |
| `public/doc/moduloconsega.pdf` | Delivery module template. |
| `public/doc/moduloanalisidelrischio.pdf` | Risk analysis module template. |
| `public/doc/Assistenzatecnica.pdf` | Technical assistance template. |
| `public/doc/privacy.pdf` | Privacy form template. |
| `public/doc/schedacollaudi.pdf` | Test/collaudo template. |
| `public/doc/schedacamb.pdf`, `schedarighe.pdf` | Additional orthopedic sheet templates. |
| `public/giudizio.pdf` | Static PDF document. |
| `public/moduloconsega.pdf` at root | Additional copy of delivery PDF. |

### public Static Assets

| Path | Purpose |
|---|---|
| `public/frontend/default/` | Default frontend theme CSS, JS, images, glyphicons. |
| `public/sximo5/` | Sximo admin/backend assets: CSS, themes, images, JS plugins, DataTables, TinyMCE, AJAX helpers, toast/noty, fonts, icon sets. About 47 MB. |
| `public/js/comuni-codici-catastali.json` | Italian municipalities/cadastral-code dataset. |
| `public/uploads/` | Uploaded/imported content: nomenclatore CSV/XLS files, scan spreadsheets, uploaded images/logos, user avatars, DOCX files, thumbnails. About 17 MB. |
| `public/uploads/peppe/*.docx` | Uploaded DOCX documents under user/folder `peppe`. |
| `public/uploads/scansioni/*.xlsx` | Uploaded scan spreadsheets. |
| `public/uploads/images/*` | UI images/logos/backgrounds/no-image placeholders. |
| `public/uploads/users/*.jpg` | User avatars. |
| `public/uploads/.tmb/*` | Thumbnail cache generated by file manager. |
| `public/16227*.png`, `public/16227*.docx`, `public/16228*.docx` | Uploaded or generated root-level documents/images. |
| `public/fIrma1.png` | Signature image. |

## bootstrap/ Folder

| File | Purpose |
|---|---|
| `bootstrap/autoload.php` | Composer autoload bootstrap. |
| `bootstrap/app.php` | Laravel application/container bootstrap. |
| `bootstrap/cache/services.php` | Cached service provider manifest. Generated artifact. |
| `bootstrap/cache/.gitignore` | Keeps cache folder present. |

## storage/ Folder

| Path | Purpose |
|---|---|
| `storage/framework/sessions/*` | Active Laravel session files. Runtime data, not source. |
| `storage/framework/views/*.php` | Compiled Blade templates. Runtime cache, not source. |
| `storage/logs/laravel.log` | Laravel application log. May contain sensitive data. |

## tests/ Folder

| File | Purpose |
|---|---|
| `tests/TestCase.php` | Laravel test base class. |
| `tests/ExampleTest.php` | Default example test. No meaningful business test coverage found. |

## vendor/ Folder

Composer-installed dependencies. Do not edit directly.

Main packages/folders observed:

| Path | Purpose |
|---|---|
| `vendor/laravel/framework` | Laravel 5.4 framework. |
| `vendor/laravel/socialite` | Social login. |
| `vendor/laravelcollective/html` | HTML/Form helpers. |
| `vendor/mews/captcha` | Captcha. |
| `vendor/vsmoraes/laravel-pdf` | Laravel PDF wrapper. |
| `vendor/dompdf/dompdf` | HTML-to-PDF engine. |
| `vendor/gloudemans/shoppingcart` | Shopping cart package. |
| `vendor/guzzlehttp/*`, `vendor/psr/*` | HTTP and PSR support packages. |
| `vendor/symfony/*` | Symfony components used by Laravel. |
| `vendor/phpunit/*`, `vendor/mockery/*`, `vendor/fzaninotto/faker` | Testing/dev tools. |
| `vendor/composer` | Composer autoload metadata. |

## Generated/Legacy Artifacts To Be Aware Of

The application contains many dated backup files:

- Controllers with date suffixes, especially `PreventiviController_*`.
- Views with date suffixes, especially under `resources/views/preventivi`, `previnv`, `clienti`, `lavorazioni`, `prodottipreventivi`, `nonconformita`.
- PDF scripts with date suffixes in `public/`.
- `.save` copies of `generaPdf.php`.
- `public.zip` archive.
- `storage/framework/views` compiled templates.

These files are useful for historical context but increase confusion. Current routes generally reference the non-dated controller/model/view names.

## Important Data Relationships

| Relationship | Where seen |
|---|---|
| `preventivi.id_cliente -> clienti.id` | `Preventivi.php`, PDF scripts, `ClientiController::inserisciPreventivo()`. |
| `item_preventivi.id_preventivo -> preventivi.id` | `PreventiviController` subform and production-copy logic. |
| `lavorazioni.id_preventivo -> preventivi.id` | `PreventiviController::changeState()`, `Lavorazioni.php`. |
| `lavorazioni.id_cliente -> clienti.id` | production creation from quote. |
| `item_lavorazioni.id_lavorazione -> lavorazioni.id` | `LavorazioniController`, `Prodottilavorazioni.php`. |
| `item_lavorazioni.id_item_preventivi -> item_preventivi.id` | copied when a quote becomes work-in-progress. |
| `item_preventivi.codice_nomenclatore -> nomenclatore.id` | status-to-production item copy reads catalog code/description. |
| `non_conforme.id_preventivo -> preventivi.id` | `Nonconformita.php`, `PreventiviController::inserisciNonConformita()`. |
| `stato_check.stato_partenza/stato_arrivo` | validates legal quote status changes. |
| `tb_module.module_name/module_config` | drives generated module metadata, fields, grid, permissions. |
| `tb_groups_access.module_id/group_id` | module permission matrix. |
| `tb_logs.module/note/logdate` | audit trail and status-history display. |

## Security And Maintenance Findings

These are not fixes, just important facts for understanding the folder.

| Area | Finding |
|---|---|
| Framework age | Laravel 5.4 and PHP >= 5.6.4 are obsolete. Security support ended long ago. |
| CSRF | `VerifyCsrfToken` is commented out in `app/Http/Kernel.php`, so normal web POST routes are not CSRF-protected. |
| Secrets | `.env`, ` - Copia.env`, `config/sximo.php`, several public scripts, and `PreventiviController.php` contain or may contain credentials/API keys. |
| Direct public scripts | PDF/insert scripts in `public/` bypass Laravel middleware, auth, validation, and centralized DB config in many cases. |
| Raw SQL | Base Sximo model and several controllers/scripts build raw SQL strings. Search parameters are interpolated into SQL in older code paths. |
| Deprecated PHP APIs | `public/mappe.php` uses deprecated `mysql_*` functions. |
| Public uploads | Uploaded documents/images are directly under `public/uploads` and root `public/`, so access control is limited. |
| Incomplete git metadata | `.git` contains only objects and is not recognized as a valid repository. |
| Missing schema migrations | Business database tables are not described by migrations, so environment rebuild depends on external DB dump or manual schema. |
| Duplicate legacy files | Many old dated copies make it easy to edit the wrong file. Current routes should be checked before changing a dated file. |

## Practical Navigation Guide

To understand or modify a business module:

1. Check `routes/module.php` for the route name.
2. Open `app/Http/Controllers/<Module>Controller.php`.
3. Open `app/Models/<Module>.php` to see the backing table and SQL joins/filter.
4. Open `resources/views/<module>/index.blade.php` for grid/actions.
5. Open `resources/views/<module>/form.blade.php` for fields/subforms.
6. Check `tb_module` in the database for generated field/grid config; many labels, fields, permissions, and subforms are not hardcoded only in files.
7. For PDF links, inspect `resources/views/<module>/index.blade.php` and then the target script in `public/`.

The most important files for the orthopedic management workflow are:

- `app/Http/Controllers/PreventiviController.php`
- `app/Http/Controllers/PrevinvController.php`
- `app/Http/Controllers/LavorazioniController.php`
- `app/Http/Controllers/ClientiController.php`
- `app/Models/Preventivi.php`
- `app/Models/Previnv.php`
- `app/Models/Lavorazioni.php`
- `app/Models/Prodottipreventivi.php`
- `app/Models/Prodottilavorazioni.php`
- `resources/views/preventivi/index.blade.php`
- `resources/views/preventivi/form.blade.php`
- `resources/views/previnv/index.blade.php`
- `public/generaPdf.php`
- `public/doc/*`
