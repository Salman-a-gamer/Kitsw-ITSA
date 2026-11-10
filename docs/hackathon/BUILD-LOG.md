# Hackathon build log

| Stage | Notes |
| --- | --- |
| Research | Centle's public Tri-City page informed the tracks, prizes and schedule. Its SummerSaaS page informed team registration. Devpost's guide informed the project-entry fields. The signed-in flow was designed from the department's brief. |
| Public site | Added a standalone hackathon route. Used the association site's burgundy and cream as the base palette, with a custom circuit illustration. Event placeholders are maintained centrally. |
| Accounts | Registration creates a team ID, captain account and one-time invitations. Each member chooses a password. A team ID identifies the team at login. Individual credentials establish access. |
| Submission | Members share one versioned project. The captain confirms the final entry, and the database protects it against concurrent edits and deadline races. |
| Storage | Added separate PostgreSQL tables for the roster, sessions, project and audit events. Local testing uses PGlite and the fictional workspace stores data in the current browser tab. |
| Diagnostics | Added per-team activity history and request IDs correlated with Vercel runtime logs. Passwords, invitation secrets, session tokens and submission data are excluded from application request logs. |
| Verification | The production build, lint for changed source files, and local API integration tests passed. The browser sample saved a draft, locked a final entry, and showed it in the activity log. Hosted account flows require a provisioned preview database. |
| Release | Draft configuration keeps real registrations and submissions closed. Review on the feature branch and complete the launch checklist before opening it. |

References [Centle Tri-City](https://centle.in/tricity/) · [Centle SummerSaaS](https://centle.in/summersaas/module2/public) · [Devpost submission guide](https://help.devpost.com/article/126-know-your-submission-steps)
