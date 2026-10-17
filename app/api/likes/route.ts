import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const FALLBACK_DB_URL =
  "postgresql://neondb_owner:npg_VXsrb5qC1xtF@ep-nameless-art-b40ztt4a-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

function getSql() {
  return neon(process.env.DATABASE_URL || FALLBACK_DB_URL);
}

let tableInitialized = false;

async function ensureLikesTable() {
  if (tableInitialized) return;
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS site_likes (
      id TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    )
  `;
  await sql`
    INSERT INTO site_likes (id, count)
    VALUES ('realtime', 0)
    ON CONFLICT (id) DO NOTHING
  `;
  tableInitialized = true;
}

export async function GET() {
  try {
    await ensureLikesTable();
    const sql = getSql();
    const rows = await sql`
      SELECT count FROM site_likes WHERE id = 'realtime'
    `;
    const count = rows[0] ? Number(rows[0].count) : 0;
    return Response.json(
      { count },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("GET /api/likes error:", err);
    return Response.json({ count: 0 }, { status: 500 });
  }
}

export async function POST() {
  try {
    await ensureLikesTable();
    const sql = getSql();
    const rows = await sql`
      UPDATE site_likes
      SET count = count + 1
      WHERE id = 'realtime'
      RETURNING count
    `;
    const count = rows[0] ? Number(rows[0].count) : 1;
    return Response.json(
      { count },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("POST /api/likes error:", err);
    return Response.json(
      { error: "Failed to increment likes" },
      { status: 500 }
    );
  }
}
