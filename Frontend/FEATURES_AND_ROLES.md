# PMS — Features, Roles & Permissions

What the system does, feature by feature, and exactly which role can do what. This is the functional companion to [PMS_WALKTHROUGH.md](PMS_WALKTHROUGH.md) (which traces each endpoint through the code layers) — this file stays at the "what can a user actually do" level.

## 1. What this system is

PMS (Public Assets Management System) is the digital asset register for a rural municipality (seeded for **Gaurishankar Rural Municipality**, Dolakha). It tracks every public asset — land, buildings, roads, vehicles, infrastructure, office equipment — from acquisition through depreciation, maintenance, transfer, and eventual disposal, with a multi-level approval trail and full audit history at every step.

## 2. Features, module by module

### Asset Registry (`/api/v1/assets`)
- **Register a new asset** — title, category, municipality/ward, acquisition cost, depreciation method. Gets an auto-generated `AssetCode` and a QR code.
- **List/search assets** — paginated, filterable.
- **View asset details**, including full lifecycle history and attached documents.
- **Look up an asset by code** — matches `AssetCode`, `QrCode`, or `Barcode` (for a phone/scanner workflow in the field).
- **Edit an asset**, **soft-delete an asset** (kept for audit, hidden from normal lists).
- **Upload supporting documents** (deed, invoice, photo) against an asset, with size/extension validation.
- **Approve or reject** a newly-registered asset entry (moves it out of "Awaiting Review").
- **Request a transfer** (asset moving between wards/custodians) and **approve/reject** that transfer.
- **Request disposal** and carry it through the multi-level approval engine to a terminal "Retired" state.
- View the map of all registered assets (GIS pins).

### Asset Categories (`/api/v1/categories`)
Reference data: Land, Road, Building, Vehicle, Infrastructure, Office Equipment — each with a default depreciation method and useful life. Full CRUD (create/update/delete, with delete falling back to "deactivate" if assets already use that category).

### Organization / Reference Data (`/api/v1/organization`)
Municipality, Ward, and Vendor lists — the org hierarchy assets and users are pinned to, plus the vendor list used for maintenance/procurement.

### Maintenance (`/api/v1/maintenance`)
- **Schedule** recurring maintenance for an asset (frequency in days, next due date).
- **Log** a completed maintenance activity against a schedule (cost, vendor, description) — automatically pushes the schedule's next-due-date forward.
- **View what's due** in the next N days, across all assets.

### Valuation & Depreciation (`/api/v1/valuation`)
- **Run depreciation** for a fiscal year across all eligible assets (straight-line or declining-balance, per category default — land is always skipped, since land doesn't depreciate).
- Revaluation of an individual asset's current worth.

### Approvals (`/api/v1/approvals`)
The shared multi-level approval engine used by disposal (and designed to be reused by other workflows later). Each workflow type (e.g. `asset_disposal`) has a configured **approval chain** — an ordered list of roles, one per level — so a request genuinely hands off from one officer to the next rather than sitting in one shared queue:
- **View your own pending queue** — `GET /approvals/pending` returns only requests currently waiting on a level your role is assigned to. Once you act, it disappears from your queue and appears in the next level's approver's queue instead.
- **Oversight view** — `GET /approvals/pending/all` (Auditor/Admin) shows every pending request regardless of assignee.
- **Act on a level** (approve or reject) — the system checks you actually hold the role assigned to that level before allowing the action; approving the last level finalizes the request (for disposal: asset moves to "Retired", requester notified); rejecting at any level kills the whole request immediately.
- **Configure the chain** — `GET`/`PUT /approvals/chains/{entityName}` (e.g. `asset_disposal`), admin-only. The `PUT` body is an ordered list of role ids: index 0 is level 1, the last entry is the final approver. Default seeded chain for disposal: **Asset Manager (level 1) → Finance Officer (level 2, final)**.
- **Cancel a request** — `POST /approvals/{id}/cancel`, only while it's still `Pending`/`InReview`. Only the original requester or a System Admin can do this; anyone else is refused before anything changes. Cancelling is final and distinct from rejecting — the underlying record (e.g. the disposal) is marked `Cancelled`, not `Rejected`, and the asset is left untouched either way.
- **Full history for one request** — `GET /approvals/{id}/history` returns the request's overall status plus every level: which role owned it, who actually acted, what they decided (`Pending`/`Approved`/`Rejected`/`Cancelled`), when, and their remarks. This is the readable version of the trail — the raw create/update/delete audit log for the same rows is also always available via `GET /audit-trails?entityName=ApprovalStep` for anyone with `audit.view`, but that one is JSON-diff-shaped and meant for forensics, not day-to-day review.

### Notifications (`/api/v1/notifications`)
Every user has an in-app notification inbox — asset approvals/rejections, transfer outcomes, disposal outcomes all push a notification to the person who requested the action. List your own notifications (optionally unread-only), mark one read.

### Reports (`/api/v1/reports`)
Four report types: asset register, ward-wise breakdown, depreciation summary, maintenance cost — each viewable on-screen or exported to Excel.

### Audit Trails (`/api/v1/audit-trails`, `/api/v1/integration-logs`)
- **Audit trail**: every create/update/delete on tracked entities, with old/new JSON values, who did it and when — a full accountability log independent of anyone's memory.
- **Integration logs**: every outbound call to an external system (e.g. the land-records system), for troubleshooting integration issues.

### Users & Roles (`/api/v1/users`, `/api/v1/roles`)
- **Manage user accounts** — create, edit, assign roles, activate/deactivate, lock/unlock.
- **View your own profile** — `GET /api/v1/users/me`, available to any logged-in user, returns your details, roles, and exact effective permission list.
- **List/filter users by role** — `GET /api/v1/users?role=ASSET_MANAGER`.
- **Manage roles** — create a role, and edit its permission set (takes effect for all users holding that role within ~30 seconds, no redeploy or re-login required).

### Menus (`/api/v1/menus/me`)
Returns the sidebar/navigation tree filtered to only the sections the logged-in user actually has permission to open — the frontend doesn't need its own copy of the permission logic, it just renders what this endpoint returns.

### Auth (`/api/v1/auth`)
Login (with account lockout after repeated failures, optional email-OTP 2FA), refresh-token rotation, logout, forgot/reset/change password, and your own login history.

## 3. Roles — what each one is actually allowed to do

The seed data defines six roles ("the six website stakeholders"). Permissions are additive — a role can only do what's explicitly listed below.

| Role | Can do | Cannot do |
|---|---|---|
| **System Admin** (`SYS_ADMIN`) | Everything — every permission in the system, unconditionally. | — |
| **Asset Manager** (`ASSET_MANAGER`) | View/create/edit/delete assets, approve new asset entries, transfer assets, view GIS map, view+log maintenance, verify assets in the field, request disposal, **approve disposal at level 1** (chain-assigned, not a static permission), view+export reports. | Cannot give final disposal sign-off, cannot run depreciation/valuation, cannot manage users/roles/config, cannot view audit trails. |
| **Finance Officer** (`FINANCE_OFFICER`) | View assets, view+run valuation/depreciation, **give final disposal approval (level 2, chain-assigned)**, view+export reports. | Cannot create/edit/delete assets, cannot log maintenance, cannot manage users/roles. |
| **Field Officer** (`FIELD_OFFICER`) | View/create/edit assets (data entry), view GIS map, view+log maintenance, verify assets in the field. | Cannot delete assets, cannot approve anything, cannot run valuation, cannot view reports/audit trails. |
| **Auditor** (`AUDITOR`) | Read-only: view assets, GIS, maintenance, valuation, reports (view+export), **and audit trails** (only role besides System Admin with `audit.view`). | Cannot create, edit, approve, or transfer anything — pure oversight role. |
| **Public User** (`PUBLIC_USER`) | View assets and the GIS map only (citizen-facing public portal). | No write access of any kind, no reports, no admin. |

Every role, and every user, can always: log in/out, view their own profile (`/users/me`), see their own notifications, see their own login history, and see the menu tree scoped to what they're allowed to open.

## 4. Permission reference (what unlocks what)

| Permission code | Unlocks |
|---|---|
| `asset.view` | View asset list/details/history/documents, GIS map data |
| `asset.create` | Register a new asset |
| `asset.edit` | Edit an existing asset |
| `asset.delete` | Soft-delete an asset |
| `asset.approve` | Approve/reject a newly-registered asset |
| `asset.transfer` | Request an asset transfer, approve/reject a transfer request |
| `gis.view` | View the GIS map |
| `maintenance.view` | View maintenance schedules/records/due list |
| `maintenance.create` | Schedule maintenance, log a completed maintenance activity |
| `valuation.view` | View valuation/depreciation data |
| `valuation.edit` | Run depreciation, revalue an asset |
| `verification.verify` | Field-verify an asset |
| `disposal.create` | Request an asset's disposal |
| `disposal.approve` | Historical/descriptive only as of the multi-level approval chain — who can actually act on a disposal level is now decided per-level by the configured approval chain (§ Approvals above), checked against the caller's roles, not by this permission string |
| `report.view` | View any report dataset |
| `report.export` | Export a report to Excel |
| `audit.view` | View audit trails |
| `admin.users` | Manage user accounts, view any user's login history |
| `admin.roles` | Manage roles and their permission sets |
| `admin.config` | System configuration, view integration logs |

## 5. Example lifecycle, role by role

1. **Field Officer** registers a newly-discovered municipal asset (`asset.create`) → status `AWAITING_REVIEW`.
2. **Asset Manager** reviews and approves it (`asset.approve`) → status `ACTIVE`, requester notified.
3. **Field Officer** logs periodic maintenance against it (`maintenance.create`).
4. **Finance Officer** runs annual depreciation (`valuation.edit`), which recalculates its current book value.
5. Years later, **Asset Manager** requests disposal (`disposal.create`) → enters the multi-level approval engine, chain = [Asset Manager, Finance Officer].
6. **Asset Manager** approves level 1 (their own role is chain-assigned to that level) → request moves to level 2, now sitting in the **Finance Officer's** pending queue instead of the Asset Manager's.
7. **Finance Officer** approves level 2, the final level → asset auto-moves to `RETIRED`, requester notified.
8. **Auditor** can, at any point, pull the full audit trail (`audit.view`) showing every one of the above changes, who made them, and when.

## 6. Concrete result: one disposal request end-to-end

Everything below is traced directly from the code (`ServiceRes` envelope shape in [ServiceRes.cs](src/PMS.Application/Entities/Common/ServiceRes.cs), the actual `StatusCode(...)` bodies built by [BaseController.cs](src/PMS.API/Controllers/BaseController.cs) — `{ code, message, data }`, or `{ code, message, totalCount, currentPage, pageSize, data }` for paged lists). This is what you should actually see calling the API with the seeded chain (Asset Manager → Finance Officer):

**1. Asset Manager (`sita.devkota`) requests disposal** — `POST /api/v1/assets/{assetId}/dispose`
```json
{ "method": "Scrap", "disposalValue": 50000, "disposalDate": "2026-07-28", "reason": "End of useful life" }
```
→ `200`: `{ "code": 200, "message": "Disposal requested", "data": "3f2a1c9e-...-disposalId" }`

Behind the scenes: `DisposeAsync` reads the `approval_chain_step` rows for `asset_disposal` (2 rows), creates one `ApprovalRequest` with `CurrentLevel = 1, TotalLevels = 2`, and two `ApprovalStep`s — level 1 stamped with the Asset Manager role's id, level 2 with the Finance Officer role's id, both `Pending`.

**2. Asset Manager checks her queue** — `GET /api/v1/approvals/pending` → it's there, because level 1 is her role:
```json
{ "code": 200, "message": "Success", "data": [
  { "requestId": "...", "entityName": "asset_disposal", "entityId": "3f2a1c9e-...", "currentLevel": 1, "totalLevels": 2, "status": "Pending", "createdAt": "2026-07-28T..." }
]}
```
Same call as **Finance Officer** (`narayan.kafle`) at this moment → `"data": []`. It isn't his turn yet.

**3. Asset Manager acts on level 1** — `POST /api/v1/approvals/{requestId}/steps/1`
```json
{ "approve": true, "remarks": "Confirmed physically unusable" }
```
→ `200`: `{ "code": 200, "message": "Approval step recorded", "data": "3f2a1c9e-...-requestId" }`

Behind the scenes: level-1 `ApprovalStep` → `Approved`. Since `CurrentLevel (1) < TotalLevels (2)`, the request advances: `CurrentLevel = 2`, overall `Status = InReview`. Nothing is finalized yet — no notification, no asset status change.

**4. The hand-off** — Asset Manager's `GET /approvals/pending` now returns `"data": []` (the request no longer matches her role at the new current level). Finance Officer's same call now returns it:
```json
{ "data": [{ "...": "...", "currentLevel": 2, "totalLevels": 2, "status": "InReview" }] }
```

**5. If Finance Officer tries level 1 directly**, or Asset Manager tries level 2, or anyone without the right role tries level 2: `400`/`403` respectively —
`{ "code": 400, "message": "Level 1 is not the current level (2)." }` (wrong level number), or
`{ "code": 403, "message": "Level 2 requires the 'FINANCE_OFFICER' role." }` (right level, wrong role).

**6. Finance Officer gives final approval** — `POST /approvals/{requestId}/steps/2`
```json
{ "approve": true, "remarks": "Financially approved for write-off" }
```
→ `200`: `{ "code": 200, "message": "Approval step recorded", "data": "..." }`

Behind the scenes: `CurrentLevel (2) >= TotalLevels (2)` → request `Status = Approved`. `ApplyOutcomeAsync` fires: the `AssetDisposal` row goes `Approved`, the asset's status flips to `RETIRED`, an `AssetLifecycleEvent` is logged, and a notification goes to `sita.devkota` (the original requester).

**7. Asset Manager checks her inbox** — `GET /api/v1/notifications` → contains `{ "title": "Asset disposal approved", "body": "Disposal of '<asset title>' (<asset code>) was approved." }`.

**Rejecting instead, at either level**, ends the whole request immediately (not just that level) — `AssetDisposal.Status = Rejected`, asset status untouched, requester notified with `"...was rejected."`; the chain doesn't continue to further levels once rejected.

**Reconfiguring the chain** — `PUT /api/v1/approvals/chains/asset_disposal` with body `[<roleId>]` (as System Admin, `admin.roles`) replaces it, e.g. with a single System-Admin-only level. This only affects *new* disposal requests created after the change — anything already in flight keeps the levels it was stamped with at creation time.

**Checking the full trail at any point** — `GET /api/v1/approvals/{requestId}/history` (right after step 3, mid-flow):
```json
{ "code": 200, "message": "Success", "data": {
  "requestId": "3f2a1c9e-...", "entityName": "asset_disposal", "entityId": "...",
  "status": "InReview", "createdAt": "2026-07-28T...",
  "steps": [
    { "level": 1, "approverRoleCode": "ASSET_MANAGER", "actedBy": "<sita's user id>", "actedByUsername": "sita.devkota", "status": "Approved", "actedAt": "2026-07-28T...", "remarks": "Confirmed physically unusable" },
    { "level": 2, "approverRoleCode": "FINANCE_OFFICER", "actedBy": null, "actedByUsername": null, "status": "Pending", "actedAt": null, "remarks": null }
  ]
}}
```

**Cancelling instead of waiting it out** — if `sita.devkota` (the original requester) decides to withdraw it before Finance Officer acts: `POST /api/v1/approvals/{requestId}/cancel` with `{ "reason": "Asset found a new use, no longer disposing" }` → `200`, `AssetDisposal.Status = Cancelled`, the still-pending level-2 step is stamped `Cancelled` too, the asset's own status is untouched, and `narayan.kafle` (Finance Officer)'s `/approvals/pending` no longer shows it. If anyone *other* than `sita.devkota` or a System Admin tries this: `403` — `{ "code": 403, "message": "Only the original requester or a System Admin can cancel this request." }`. If the request already finished (`Approved`/`Rejected`) before the cancel call arrives: `400` — `{ "code": 400, "message": "Approval request is already 'Approved' and cannot be cancelled." }`.

## 8. Test accounts (local seed data only)

All seeded accounts share the password `ChangeMe123!` (change before this touches anything beyond a local dev database):

| Username | Role | Designation |
|---|---|---|
| `prem.thapa` | SYS_ADMIN | System Administrator |
| `sita.devkota` | ASSET_MANAGER | Asset Manager |
| `narayan.kafle` | FINANCE_OFFICER | Finance Officer |
| `ram.basnet` | FIELD_OFFICER | Field Officer |
| `saraswoti.l` | AUDITOR | Auditor |

There is no seeded `PUBLIC_USER` account — that role exists for a future citizen-facing portal login.
