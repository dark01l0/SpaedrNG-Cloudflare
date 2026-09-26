export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    if (url.pathname === "/") {
      return json({
        ok: true,
        name: "SpaedrNG",
        version: "1.0.0",
        message: "Panel is online"
      });
    }

    if (url.pathname === "/api/users" && request.method === "GET") {
      const { results = [] } = await env.DB.prepare(
        "SELECT id, name, volume, days, created_at FROM users ORDER BY id DESC"
      ).all();
      return json({ ok: true, users: results });
    }

    if (url.pathname === "/api/users" && request.method === "POST") {
      const body = await request.json();
      const name = String(body.name || "").trim();
      const volume = String(body.volume || "").trim();
      const days = Number(body.days || 0);

      if (!name || !volume || !Number.isFinite(days) || days < 1) {
        return json({ ok:false, error:"name, volume and days are required" }, 400);
      }

      await env.DB.prepare(
        "INSERT INTO users (name, volume, days, created_at) VALUES (?, ?, ?, ?)"
      ).bind(name, volume, days, new Date().toISOString()).run();

      return json({ ok:true });
    }

    if (url.pathname === "/api/config") {
      // Placeholder for the actual config-generation logic.
      return json({
        ok: true,
        message: "Config generator endpoint is ready for the next version."
      });
    }

    return json({ ok:false, error:"Not found" }, 404);
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

/*
D1 schema for the next setup step:

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  volume TEXT NOT NULL,
  days INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

Cloudflare bindings that this Worker expects:
DB -> D1 database

The KV namespace created by the setup page is intentionally not bound yet.
In the next version we will upload Worker metadata with DB/KV bindings so
the deployed Worker can use both automatically.
*/
