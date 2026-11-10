BEGIN;
CREATE TABLE IF NOT EXISTS hack_teams (
  id text PRIMARY KEY, code text UNIQUE NOT NULL, name text NOT NULL,
  track text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS hack_members (
  id text PRIMARY KEY, team_id text NOT NULL REFERENCES hack_teams(id) ON DELETE CASCADE,
  name text NOT NULL, email text UNIQUE NOT NULL, college text NOT NULL,
  year text NOT NULL, role text NOT NULL CHECK (role IN ('captain','member')),
  password_hash text, invite_hash text UNIQUE, invite_until timestamptz
);
CREATE TABLE IF NOT EXISTS hack_sessions (
  digest text PRIMARY KEY, member_id text NOT NULL REFERENCES hack_members(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS hack_sessions_expiry ON hack_sessions (expires_at);
CREATE TABLE IF NOT EXISTS hack_projects (
  team_id text PRIMARY KEY REFERENCES hack_teams(id) ON DELETE CASCADE,
  payload jsonb NOT NULL DEFAULT '{}', revision integer NOT NULL DEFAULT 0,
  updated_at timestamptz, submitted_at timestamptz
);
CREATE TABLE IF NOT EXISTS hack_activity (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  team_id text NOT NULL REFERENCES hack_teams(id) ON DELETE CASCADE,
  member_id text REFERENCES hack_members(id) ON DELETE SET NULL,
  action text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS hack_activity_team ON hack_activity (team_id, id DESC);
CREATE TABLE IF NOT EXISTS hack_throttle (
  bucket text PRIMARY KEY, attempts integer NOT NULL, expires_at timestamptz NOT NULL
);
COMMIT;
