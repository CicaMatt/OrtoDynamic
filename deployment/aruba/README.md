# Aruba VPS production deployment

This is the permanent, fully hosted target for OrtoDynamic:

```text
React (Coolify domain) ──HTTPS──► Django (Coolify domain) ──private network──► MySQL
                                                                         └──► S3 backup
```

The stack is independent from the temporary GitHub Pages, Render, and ngrok
demo. Creating or deploying it does not change those services. The demo remains
available until its existing workflow, Render service, or tunnel is explicitly
disabled.

## 1. Prerequisites

- Aruba Cloud VPS O2A4 or larger, running a fresh Ubuntu 24.04 LTS image;
- SSH access using a key rather than a password;
- the domain and access to all existing DNS records;
- an Aruba Object Storage account for database backups;
- a consistent export of the existing MySQL database;
- a planned maintenance window for the final write cutover.

Before choosing the production MySQL image, record the source database values:

```sql
SELECT VERSION(), @@character_set_server, @@collation_server, @@sql_mode;
```

Set `MYSQL_IMAGE` to a compatible, tested image. Do not treat the example
`mysql:8.4` value as an automatic upgrade path for an older source database.

## 2. Prepare the VPS and Coolify

1. Apply operating-system updates and configure automatic security updates.
2. Add swap so an application build cannot exhaust a 4 GB VPS.
3. Permit inbound HTTP/HTTPS. Restrict SSH to trusted source addresses whenever
   operationally possible; do not open port 3306.
4. Install Coolify on the fresh server using its supported installation method.
5. Protect the Coolify account with a unique password and multi-factor
   authentication, then disable public registration.

Coolify and the application share the VPS, so monitor memory and disk during the
first deployments. Move from O2A4 to O4A8 if builds or PDF generation produce
sustained resource pressure.

## 3. Create the stack in Coolify

1. Create an `OrtoDynamic` project and a `production` environment.
2. Add the Git repository through a GitHub App or deploy key.
3. Choose the Docker Compose build pack and set the compose path to
   `/deployment/aruba/compose.yaml`.
4. Copy the variable names from [`.env.example`](.env.example) into Coolify,
   replacing every example coordinate and secret. Mark passwords and the Django
   secret as locked secrets. If a value contains `$`, mark it as literal.
5. Assign `https://management.example.it:8080` to the `frontend` service and
   `https://api-management.example.it:8000` to the `backend` service. The port
   suffix tells Coolify which internal container port to proxy; public clients
   still use normal HTTPS.
6. Assign no domain and no public port to `mysql`.
7. Deploy and wait for all three service health checks to pass.

The compose stack deliberately defines no custom Docker network. Coolify creates
an isolated network for the stack, on which Django reaches MySQL using the
hostname `mysql`. The database volume survives application redeployments.

Changing `VITE_API_BASE_URL` requires a frontend rebuild because Vite embeds the
value into the static bundle.

## 4. Rehearse the database migration

Create a transaction-consistent source dump using tooling compatible with the
source server. Include the legacy schema's triggers, routines, events, and binary
values:

```bash
mysqldump \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  --events \
  --hex-blob \
  --no-tablespaces \
  --host=SOURCE_HOST \
  --port=3306 \
  --user=SOURCE_USER \
  --password \
  SOURCE_DATABASE | gzip > ortodynamic-rehearsal.sql.gz
```

Import the rehearsal dump through Coolify's MySQL import/terminal tooling. Do
not expose MySQL to perform the transfer. The domain models are unmanaged
mappings of the legacy business schema; Django migrations do not create or
upgrade those tables.

With temporary staging domains, verify:

```text
GET /health/live/   -> 200 {"status":"ok"}
GET /health/ready/  -> 200 {"status":"ok"}
```

Then test authentication, representative reads and writes, status transitions,
CSV export, and every PDF document. Check database character handling and times
around the Europe/Rome daylight-saving boundaries.

## 5. Configure daily database backups

1. Create a private Aruba Object Storage bucket, preferably in a different
   Aruba region from the VPS.
2. Add its S3-compatible endpoint and restricted credentials under Coolify's
   storage settings and validate the connection.
3. On the compose MySQL service, create a daily backup schedule such as
   `0 2 * * *` and select the Aruba S3 storage.
4. Retain seven remote backups and at most one local backup so the 40 GB VPS disk
   cannot fill silently.
5. Enable backup-failure notifications.
6. Download and restore one backup into a disposable database before relying on
   the schedule.

Coolify supports S3-compatible destinations, but Aruba is not currently listed
among its explicitly tested providers. If endpoint validation fails, schedule
the same `mysqldump` through a trusted S3-compatible client instead. Backups
must travel over HTTPS and remain private. Apply client-side encryption when
required by the organisation's data-protection policy.

## 6. Transfer the domain without interrupting the demo

Domain transfer and DNS cutover are separate operations. Transfer the domain
while keeping its current nameservers or reproducing every existing record,
especially MX, SPF, DKIM, DMARC, and PEC-related records. The GitHub Pages demo
continues at its existing URL throughout this work.

Once staging is accepted:

1. Lower the production records' TTL at least one day before cutover.
2. Put the legacy PHP application into maintenance or read-only mode.
3. Create and retain a final source backup.
4. Import the final dump into the production MySQL service.
5. Point the production frontend and API records to the Aruba VPS.
6. Run the complete smoke-test set again and monitor Coolify and Django logs.

Do not let the PHP and Django applications accept writes concurrently until
their behavior is proven equivalent. For rollback, restore the old DNS records,
reopen the legacy application, and reconcile any writes accepted after the
final export.

## 7. Operations

- Apply Ubuntu, Coolify, container-image, and dependency updates deliberately.
- Monitor `/health/ready/`, memory, disk, container status, and backup outcomes.
- Test a backup restoration regularly; a successful upload is not proof that a
  backup can be restored.
- Keep the source repository as the application recovery source and separately
  back up the Coolify configuration and its encryption key.
- Do not remove Render/ngrok until production acceptance and the rollback window
  have both completed.
