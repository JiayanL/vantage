# Vantage

## Project overview

Vantage is a Next.js 16 hiring dashboard backed by Postgres. It stores interview artifacts, role families, and AI-generated hiring recommendations, then surfaces them in the app and through a remote MCP endpoint.

The MCP endpoint lives at `/api/mcp` and uses bearer-token auth backed by the `mcp_tokens` table. Tokens are stored as SHA-256 hashes only. The endpoint exposes three read-only tools:

- `list_hiring_recommendations`
- `get_recommendation`
- `list_role_families`

Every tool call is written to `mcp_call_log` with the caller token, tool name, arguments, and timestamp.

## Local dev setup

Prerequisites:

- Node.js `20.9+` or `22.x`
- `npm`
- A Postgres or Neon `DATABASE_URL`

Create `.env` from `.env.example` and set:

- `DATABASE_URL`
- `OPENAI_API_KEY`
- `CRON_SECRET`

Install dependencies, run migrations, and start the app:

```bash
npm install
npm run migrate
npm run dev
```

Build verification:

```bash
npm run build
```

Generate a bearer token manually with a one-off command and store the plaintext in your password manager immediately:

```bash
node --env-file=.env --experimental-strip-types --input-type=module <<'EOF'
import crypto from "node:crypto"

import pool from "./lib/db.ts"
import { hashSecret } from "./lib/auth.ts"

const token = crypto.randomBytes(32).toString("hex")
const tokenHash = await hashSecret(token)

await pool.query(
  "INSERT INTO mcp_tokens (token_hash, name, scopes) VALUES ($1, $2, $3)",
  [tokenHash, "Codex local", ["recommendations:read"]]
)

console.log(token)
await pool.end()
EOF
```

If you need to revoke a token later:

```sql
UPDATE mcp_tokens
SET revoked_at = now()
WHERE name = 'Codex local';
```

## Deployment

Deploy the app to Vercel the same way as the dashboard. The MCP endpoint is served by the app deployment, so the public server URL is:

```text
https://your-deployment.example.com/api/mcp
```

Before using the deployed MCP endpoint:

1. Add the same environment variables in Vercel: `DATABASE_URL`, `OPENAI_API_KEY`, and `CRON_SECRET`.
2. Run `npm run migrate` against the production database.
3. Insert at least one hashed MCP token into `mcp_tokens`.
4. Verify the deployed endpoint with a bearer-authenticated MCP client before handing it to other users.

The dashboard cookie middleware already allows `/api/mcp` through, so MCP clients can authenticate with bearer tokens instead of the browser login cookie.

## MCP client configuration

Sample `codex_desktop_config.json`:

```json
{
  "mcpServers": {
    "vantage-hiring": {
      "type": "http",
      "url": "https://your-deployment.example.com/api/mcp",
      "headers": {
        "Authorization": "Bearer YOUR_MCP_TOKEN"
      }
    }
  }
}
```

Codex config snippet for `~/.codex/config.toml`:

```toml
[mcp_servers.vantage_hiring]
enabled = true
type = "http"
url = "https://your-deployment.example.com/api/mcp"

  [mcp_servers.vantage_hiring.http_headers]
  Authorization = "Bearer YOUR_MCP_TOKEN"
```

After adding the server, a useful smoke-test prompt is:

```text
What are the highest-priority hiring issues right now?
```

The MCP server should answer that by calling `list_hiring_recommendations`, and the call should appear in `mcp_call_log`.
