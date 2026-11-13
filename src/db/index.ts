import * as dotenv from "dotenv";
dotenv.config();

import { drizzle } from "drizzle-orm/node-postgres";
import pg, { type Pool as PgPool } from "pg";
const { Pool } = pg;
import * as schema from "./schema.ts";
import fs from "fs";
import path from "path";

// Resolve Unix socket path across environments (Cloud Run sidecar, Cloud Run volume mount, dev container)
function resolveSqlHost(): string {
  const instance = "gen-lang-client-0131668100:us-west1:ai-studio-f7145e32";
  const envHost = process.env.SQL_HOST;

  if (envHost && fs.existsSync(envHost)) {
    return envHost;
  }

  const candidates = [
    `/cloudsql/${instance}`,
    `/app/cloudsql/${instance}`,
    `/cloudsql`,
    `/app/cloudsql`,
  ];

  for (const candidate of candidates) {
    try {
      if (fs.existsSync(candidate)) {
        const files = fs.readdirSync(candidate);
        if (files.includes(".s.PGSQL.5432")) {
          return candidate;
        }
        for (const f of files) {
          const sub = path.join(candidate, f);
          if (fs.statSync(sub).isDirectory()) {
            if (fs.readdirSync(sub).includes(".s.PGSQL.5432")) {
              return sub;
            }
          }
        }
        return candidate;
      }
    } catch {}
  }

  return envHost || `/cloudsql/${instance}`;
}

declare global {
  var _postgresPool: PgPool | undefined;
}

export const createPool = () => {
  if (!global._postgresPool) {
    const host = resolveSqlHost();
    global._postgresPool = new Pool({
      host,
      user: process.env.SQL_USER || "ai_studio_app_user",
      password: process.env.SQL_PASSWORD || "Bk%gg^VqRwu1Dm0Z",
      database: process.env.SQL_DB_NAME || "cloud_sql_development_database",
      max: 10,
      connectionTimeoutMillis: 8000,
    });

    global._postgresPool.on("error", (err) => {
      console.warn("Notice on idle SQL pool client:", err.message);
    });
  }
  return global._postgresPool;
};

const pool = createPool();

export const db = drizzle(pool, { schema });
