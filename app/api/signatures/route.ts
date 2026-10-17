import { neon } from "@neondatabase/serverless";

export const dynamic = "force-dynamic";

const FALLBACK_DB_URL =
  "postgresql://neondb_owner:npg_VXsrb5qC1xtF@ep-nameless-art-b40ztt4a-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

function getSql() {
  return neon(process.env.DATABASE_URL || FALLBACK_DB_URL);
}

export interface SavedStroke {
  id: string;
  d: string;
  color: string;
  width: number;
  pen: "fine" | "marker" | "pencil";
  createdAt: number;
}

let tableInitialized = false;

async function ensureTable() {
  if (tableInitialized) return;
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS wall_signatures (
      id TEXT PRIMARY KEY,
      d TEXT NOT NULL,
      color TEXT NOT NULL,
      width REAL NOT NULL,
      pen TEXT NOT NULL,
      created_at BIGINT NOT NULL
    )
  `;
  tableInitialized = true;
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  Pragma: "no-cache",
};

async function queryAllStrokes(): Promise<SavedStroke[]> {
  const sql = getSql();
  const rows = await sql`
    SELECT
      id,
      d,
      color,
      width,
      pen,
      created_at AS "createdAt"
    FROM wall_signatures
    ORDER BY created_at ASC
    LIMIT 3000
  `;

  return rows.map((r) => ({
    id: String(r.id),
    d: String(r.d),
    color: String(r.color),
    width: Number(r.width),
    pen:
      r.pen === "marker" || r.pen === "pencil" ? r.pen : ("fine" as const),
    createdAt: Number(r.createdAt),
  }));
}

export async function GET() {
  try {
    await ensureTable();
    const strokes = await queryAllStrokes();
    return Response.json({ strokes }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("GET /api/signatures error:", err);
    return Response.json(
      { strokes: [] },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function POST(request: Request) {
  try {
    await ensureTable();
    const body = (await request.json()) as { stroke?: SavedStroke };
    if (!body?.stroke || typeof body.stroke.d !== "string") {
      return Response.json(
        { error: "Invalid stroke" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const id = String(body.stroke.id || `${Date.now()}`);
    const d = body.stroke.d;
    const color = String(body.stroke.color || "#171717");
    const width = Number(body.stroke.width) || 2.2;
    const pen =
      body.stroke.pen === "marker" || body.stroke.pen === "pencil"
        ? body.stroke.pen
        : "fine";
    const createdAt = Number(body.stroke.createdAt) || Date.now();

    const sql = getSql();
    await sql`
      INSERT INTO wall_signatures (id, d, color, width, pen, created_at)
      VALUES (${id}, ${d}, ${color}, ${width}, ${pen}, ${createdAt})
      ON CONFLICT (id) DO NOTHING
    `;

    const strokes = await queryAllStrokes();

    return Response.json(
      {
        ok: true,
        stroke: { id, d, color, width, pen, createdAt },
        strokes,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (err) {
    console.error("POST /api/signatures error:", err);
    return Response.json(
      { error: "Failed to save stroke" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return Response.json(
        { error: "Missing id" },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const sql = getSql();
    await sql`DELETE FROM wall_signatures WHERE id = ${id}`;

    return Response.json({ ok: true }, { headers: NO_CACHE_HEADERS });
  } catch (err) {
    console.error("DELETE /api/signatures error:", err);
    return Response.json(
      { error: "Failed to delete stroke" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
