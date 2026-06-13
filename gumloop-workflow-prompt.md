# Gumloop Workflow: Client Lifecycle Manager

Paste this entire prompt into Gumloop's "Build with AI" to generate the workflow.

---

## Overview

Two-webhook workflow. Trigger A receives new contact form submissions. Trigger B receives approval/rejection decisions from Discord button clicks. They share data via Supabase — independent runs, no pause/resume complexity.

## Triggers

### Trigger A: New Contact Form
- **Type:** Webhook
- **Payload:**
```json
{
  "name": "string",
  "email": "string",
  "company": "string | null",
  "budget": "string | null",
  "project": "string",
  "contact_id": "string",
  "source": "website_form"
}
```

### Trigger B: Approval Decision
- **Type:** Webhook
- **Payload:**
```json
{
  "project_id": "string",
  "decision": "approved" | "rejected",
  "action": "approve" | "reject"
}
```

## Supabase Configuration

- **Project URL:** `https://cxvskcqlpicgrfawdmii.supabase.co`
- **Service Role Key:** [get from Supabase Dashboard > Settings > API > service_role key]

### Tables

**`contacts`** (existing):
- `id` (uuid, PK)
- `name`, `email`, `company`, `budget`, `project`, `created_at`

**`projects`** (existing):
- `id` (uuid, PK)
- `name` (text) — project name
- `description` (text, nullable)
- `client_name` (text)
- `client_email` (text)
- `contact_id` (uuid, FK → contacts)
- `status` (text) — 'pending_review', 'approved', 'rejected', 'in_progress', 'completed'
- `discord_channel_id` (text, nullable)
- `created_at`, `updated_at` (timestamptz)

**`project_updates`** (existing):
- `id` (uuid, PK)
- `project_id` (uuid, FK → projects)
- `content` (text)
- `update_type` (text) — 'status_change', 'email_sent', 'email_received', 'note', 'discord_message'
- `created_at` (timestamptz)

## Secrets Needed

| Secret | Where to get it |
|---|---|
| `SUPABASE_SERVICE_KEY` | Supabase Dashboard → Settings → API |
| `DISCORD_BOT_TOKEN` | Discord Developer Portal → Bot → Token |
| `DISCORD_GUILD_ID` | Right-click your server → Copy ID (Developer Mode on) |
| `DISCORD_STAFF_CHANNEL_ID` | The channel ID where approval buttons appear |
| `RESEND_API_KEY` | Resend dashboard → API Keys |

## Workflow A: New Contact Form

**Trigger:** Webhook receives payload from Edge Function

### Step 1 — Insert Project (Pending Review)
- **Node:** Supabase → Insert Row
- **Table:** `projects`
- **Values:**
  - `name`: `{trigger.project}`
  - `description`: `{trigger.project}`
  - `client_name`: `{trigger.name}`
  - `client_email`: `{trigger.email}`
  - `contact_id`: `{trigger.contact_id}`
  - `status`: `'pending_review'`
- **Save:** Store returned `id` as `{{project_id}}`

### Step 2 — Log Status
- **Node:** Supabase → Insert Row
- **Table:** `project_updates`
- **Values:**
  - `project_id`: `{{project_id}}`
  - `content`: `'New inquiry received — pending review'`
  - `update_type`: `'status_change'`

### Step 3 — Send Approval Message to Staff Channel
- **Node:** HTTP Request (Custom API Call)
- **Method:** POST
- **URL:** `https://discord.com/api/v10/channels/{{DISCORD_STAFF_CHANNEL_ID}}/messages`
- **Headers:**
  - `Authorization`: `Bot {{DISCORD_BOT_TOKEN}}`
  - `Content-Type`: `application/json`
- **Body:**
```json
{
  "content": "",
  "embeds": [{
    "title": "📩 New Client Inquiry",
    "color": 15527139,
    "fields": [
      { "name": "Client", "value": "{{trigger.name}}", "inline": true },
      { "name": "Email", "value": "{{trigger.email}}", "inline": true },
      { "name": "Company", "value": "{{trigger.company || '—'}}", "inline": true },
      { "name": "Budget", "value": "{{trigger.budget || '—'}}", "inline": true },
      { "name": "Project", "value": "{{trigger.project}}", "inline": false }
    ],
    "timestamp": "{{current_timestamp}}"
  }],
  "components": [{
    "type": 1,
    "components": [
      {
        "type": 2,
        "style": 3,
        "label": "✅ Approve",
        "custom_id": "approve:{{project_id}}"
      },
      {
        "type": 2,
        "style": 4,
        "label": "❌ Reject",
        "custom_id": "reject:{{project_id}}"
      }
    ]
  }]
}
```
- **Note:** `custom_id` MUST be exactly `"approve:{{project_id}}"` and `"reject:{{project_id}}"`. The `{{project_id}}` must resolve to the UUID from Step 1.

### Step 4 — End
Workflow completes. Discord button click triggers Workflow B.

---

## Workflow B: Approval Decision

**Trigger:** Webhook receives payload from `discord-interactions` Edge Function

### Step 1 — Fetch Project
- **Node:** Supabase → Select Row
- **Table:** `projects`
- **Filter:** `id` = `{trigger.project_id}`
- **Limit:** 1
- **Save:** Store all fields as `{{project.*}}`

### B1 — APPROVED Branch

If `{trigger.decision}` = `'approved'`:

#### Step B1-1 — Create Discord Channel
- **Node:** HTTP Request (Custom API Call)
- **Method:** POST
- **URL:** `https://discord.com/api/v10/guilds/{{DISCORD_GUILD_ID}}/channels`
- **Headers:**
  - `Authorization`: `Bot {{DISCORD_BOT_TOKEN}}`
  - `Content-Type`: `application/json`
- **Body:**
```json
{
  "name": "{{slugify(project.name)}}",
  "type": 0,
  "topic": "Project: {{project.name}} — {{project.client_name}}",
  "parent_id": "{{OPTIONAL_CATEGORY_ID}}"
}
```
- **Slugify rule:** lowercase, spaces→hyphens, remove special chars, max 100 chars.
- **Save:** Store returned `id` as `{{channel_id}}`

#### Step B1-2 — Update Project with Channel
- **Node:** Supabase → Update Row
- **Table:** `projects`
- **Filter:** `id` = `{trigger.project_id}`
- **Values:**
  - `discord_channel_id`: `{{channel_id}}`
  - `status`: `'approved'`
  - `updated_at`: `now()`

#### Step B1-3 — Send Welcome Message to New Channel
- **Node:** HTTP Request (Custom API Call)
- **Method:** POST
- **URL:** `https://discord.com/api/v10/channels/{{channel_id}}/messages`
- **Headers:**
  - `Authorization`: `Bot {{DISCORD_BOT_TOKEN}}`
  - `Content-Type`: `application/json`
- **Body:**
```json
{
  "content": "## 🚀 New Project: {{project.name}}\n\n**Client:** {{project.client_name}}\n**Email:** {{project.client_email}}\n\n✅ Approved. All project communication will be logged here."
}
```

#### Step B1-4 — AI Draft Welcome Email
- **Node:** AI (use built-in Claude or GPT)
- **System prompt:**
  You are SYNDRIX's client onboarding specialist. Draft a warm, professional email reply to a new client. Tone: confident, technically precise, not salesy. Sign as "Team SYNDRIX".
- **User message:**
  ```
  Client name: {{project.client_name}}
  Client email: {{project.client_email}}
  Project: {{project.name}}
  
  Draft a reply that:
  1. Thanks them for reaching out
  2. Acknowledges their specific project
  3. Explains SYNDRIX's approach (custom engineering solutions)
  4. Proposes next steps (discovery call, scoping)
  5. Keep it 3-4 short paragraphs
  ```
- **Save:** Store output as `{{draft_email}}`

#### Step B1-5 — Send Email via Resend
- **Node:** HTTP Request (Custom API Call)
- **Method:** POST
- **URL:** `https://api.resend.com/emails`
- **Headers:**
  - `Authorization`: `Bearer {{RESEND_API_KEY}}`
  - `Content-Type`: `application/json`
- **Body:**
```json
{
  "from": "SYNDRIX <hello@syndrixoff.com>",
  "to": "{{project.client_email}}",
  "subject": "Re: {{project.name}} — Next Steps",
  "text": "{{draft_email}}"
}
```

#### Step B1-6 — Log Email Sent
- **Node:** Supabase → Insert Row
- **Table:** `project_updates`
- **Values:**
  - `project_id`: `{trigger.project_id}`
  - `content`: `'Welcome email sent to client'`
  - `update_type`: `'email_sent'`

#### Step B1-7 — Notify Staff Channel
- **Node:** HTTP Request (Custom API Call)
- **Method:** POST
- **URL:** `https://discord.com/api/v10/channels/{{DISCORD_STAFF_CHANNEL_ID}}/messages`
- **Headers:**
  - `Authorization`: `Bot {{DISCORD_BOT_TOKEN}}`
  - `Content-Type`: `application/json`
- **Body:**
```json
{
  "content": "✅ **{{project.name}}** approved. Channel <#{{channel_id}}> created. Welcome email sent to {{project.client_email}}."
}
```

### B2 — REJECTED Branch

If `{trigger.decision}` = `'rejected'`:

#### Step B2-1 — Update Project Status
- **Node:** Supabase → Update Row
- **Table:** `projects`
- **Filter:** `id` = `{trigger.project_id}`
- **Values:**
  - `status`: `'rejected'`
  - `updated_at`: `now()`

#### Step B2-2 — AI Draft Rejection Email
- **Node:** AI (use built-in Claude or GPT)
- **System prompt:**
  You are SYNDRIX's client communication specialist. Draft a polite, professional rejection email. Be gracious and leave the door open for future collaboration. Sign as "Team SYNDRIX".
- **User message:**
  ```
  Client name: {{project.client_name}}
  Client email: {{project.client_email}}
  Project: {{project.name}}
  
  Draft a reply that:
  1. Thanks them for their interest
  2. Politely declines (generic reason — capacity/alignment)
  3. Leaves the door open for future opportunities
  4. Keep it 2-3 short paragraphs
  ```
- **Save:** Store output as `{{draft_rejection}}`

#### Step B2-3 — Send Rejection Email via Resend
- **Node:** HTTP Request (Custom API Call)
- **Method:** POST
- **URL:** `https://api.resend.com/emails`
- **Headers:**
  - `Authorization`: `Bearer {{RESEND_API_KEY}}`
  - `Content-Type`: `application/json`
- **Body:**
```json
{
  "from": "SYNDRIX <hello@syndrixoff.com>",
  "to": "{{project.client_email}}",
  "subject": "Re: {{project.name}}",
  "text": "{{draft_rejection}}"
}
```

#### Step B2-4 — Log Rejection
- **Node:** Supabase → Insert Row
- **Table:** `project_updates`
- **Values:**
  - `project_id`: `{trigger.project_id}`
  - `content`: `'Inquiry declined — rejection email sent to client'`
  - `update_type`: `'status_change'`

#### Step B2-5 — Notify Staff Channel
- **Node:** HTTP Request (Custom API Call)
- **Method:** POST
- **URL:** `https://discord.com/api/v10/channels/{{DISCORD_STAFF_CHANNEL_ID}}/messages`
- **Headers:**
  - `Authorization`: `Bot {{DISCORD_BOT_TOKEN}}`
  - `Content-Type`: `application/json`
- **Body:**
```json
{
  "content": "❌ **{{project.name}}** rejected. Rejection email sent to {{project.client_email}}."
}
```

## Error Handling Rules

- **Discord rate limit (429):** Retry after the `Retry-After` header duration
- **Supabase failure:** Retry once, then log and abort
- **Resend failure:** Log to `project_updates` with type `'note'`, do NOT block the rest
- **AI generation failure:** Use a fallback plain-text template instead of failing
- **All errors:** Log descriptive error content to `project_updates`

## Verification Checklist

After building, verify:

- [ ] Trigger A webhook creates a project with `status = 'pending_review'`
- [ ] Trigger A sends Discord message with exactly 2 buttons (Approve/Reject)
- [ ] Button `custom_id` format: `approve:{uuid}` / `reject:{uuid}`
- [ ] Trigger B receives payload and fetches the correct project
- [ ] Approved branch creates Discord channel and sends email
- [ ] Rejected branch sends rejection email
- [ ] All branches log to `project_updates`
- [ ] Staff channel gets notification on every decision
