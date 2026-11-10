# Build Warangal

This draft hackathon site lives at `/hackathon`. The public page and the fictional sample workspace can be reviewed while real registration is closed. The event name, tracks, judging weights, dates, venue and prize pool are editable in [shared/hackathon.js](../../shared/hackathon.js).

## What the department needs

| Area | Decide and prepare before launch |
| --- | --- |
| Event rules | Confirm dates and times in IST, eligibility, team size, tracks, capacity, prize breakdown, judging criteria, tie-breaks, IP and AI-use rules, and the deadline or outage policy. Set a support contact. |
| Registration | Decide whether the event is free or paid and how check-in will verify each participant. The current form collects name, email, college and year. Captains share one-time account invitations. Assign an organizer to verify rosters and handle account recovery before launch. |
| Infrastructure | Provide a Vercel deployment and a managed PostgreSQL database with a pooled, TLS connection, backups and a tested restore procedure. Use separate databases for preview and production. |
| Venue | Test Wi-Fi and outbound access to GitHub, video and common deployment platforms at expected attendance. Prepare a backup connection, charging and power, demo AV, and a staffed help desk. |
| Submissions and judges | Give judges a secure way to review the submitted export, check that repo/demo/video links are accessible, prepare a scoring sheet, and define how to handle missing links or late entries. |
| Data access | Assign named organizers with minimal database permissions. Decide participant notice, retention and deletion, and how private rosters and exported data will be shared. Run a mock event end to end before inviting real teams. |

The current branch does not include a fee flow, capacity management, automated emails, password reset, or a judge/admin dashboard. The launch team should settle those workflows before accepting participants. The hackathon uses its own database tables alongside the site's existing registration setup.

## Review it on Vercel

1. In the existing Vercel project, open **Deployments** and select the Preview Deployment for `codex/hackathon-portal`. Automatic previews depend on the project's Git integration and permissions. Keep the current production branch on `main`.
2. Open the Preview Deployment and add `/hackathon` to its URL. Use **Explore sample workspace** to test the form and final submission with fictional data. A preview may require Vercel sign-in depending on Deployment Protection.
3. Leave registration and submissions closed while reviewing the public content. A preview without database configuration still serves the public page and sample workspace.
4. To test real account flows on Vercel, add a **Preview** branch-scoped `HACKATHON_DATABASE_URL`, migrate that test database, and redeploy. To test registration and submissions, use test dates and set `confirmed` to `true` on a disposable test branch. Set the applicable enable flags for that deployment.

If you later need a dedicated public hostname before merging, connect the repo to a separate Vercel project and configure that project's production branch and domain. [Vercel Git deployments](https://vercel.com/docs/git) · [Vercel environment variables](https://vercel.com/docs/environment-variables)

## Run locally

After `npm ci`, run these in two terminals.

```text
npm run hackathon:dev
npm run dev
```

Open `http://localhost:5173/hackathon`. The local-only API listens on port 5051 and opens registration and submissions for test accounts. Use fictional names and emails. Local database files live in the ignored `.hackathon.local` directory. Run `npm run hackathon:test` for the integration suite, which uses a fresh in-memory database.

## Configure a real deployment

Set these as **server-side** Vercel environment variables for the intended environment. The example values keep the event closed.

```dotenv
HACKATHON_DATABASE_URL=
HACKATHON_ENABLE_REGISTRATION=false
HACKATHON_ENABLE_SUBMISSIONS=false
```

- Put the managed database URL in your shell or ignored root `.env`, run `npm run hackathon:migrate` once against the intended database, and keep the credential out of Git and client-side Vite variables.
- Fill in the confirmed event details, set `confirmed: true`, and enter ISO 8601 dates with the explicit `+05:30` offset. Registration and submission windows use their own open and close times, with an exclusive close.
- Verify registration, invitation activation, two separate accounts, shared draft editing, final submission, and access to the judge export. Set each enable flag to `true` when ready and redeploy in the relevant environment. Confirm the registration and submission settings at `/api/hackathon?action=settings`.

## Data and diagnostics

The Vite app calls the same-origin `/api/hackathon` Vercel function. PostgreSQL stores teams, members, sessions, one project per team, and team activity. Anyone on a team can save its shared draft during the submission window. Its captain finalizes it. A revision check prevents one teammate's stale draft from overwriting a newer edit.

The team workspace shows recent registrations, activations, sign-ins, invitation reissues, draft saves and final submissions. For support, search `scope: hackathon` or the request ID shown in an error in the Vercel project's runtime logs. Request logs record action, status, duration and request ID. [Vercel Runtime Logs](https://vercel.com/docs/logs/runtime)

Organizers can run these read-only queries from the database console and export the results. Limit roster access to authorized organizers.

```sql
SELECT t.code, t.name AS team, t.track, m.name, m.email, m.college, m.year, m.role
FROM hack_teams t JOIN hack_members m ON m.team_id = t.id
ORDER BY t.created_at, m.role, m.name;

SELECT t.code, t.name AS team, t.track, p.submitted_at,
       p.payload->>'title' AS title, p.payload->>'summary' AS summary,
       p.payload->>'repository' AS github, p.payload->>'demo' AS demo,
       p.payload->>'video' AS video, p.payload->>'tools' AS tools
FROM hack_teams t JOIN hack_projects p ON p.team_id = t.id
WHERE p.submitted_at IS NOT NULL
ORDER BY p.submitted_at;
```

Schedule housekeeping for expired sessions and throttle rows, and apply your approved retention policy to event records and exports.

See the [build log](BUILD-LOG.md) for the reasoning behind the workflow.
