import { getStore } from "@netlify/blobs";

const store = getStore("brickell-hearts");

export default async (req) => {
  let ids = (await store.get("ids", { type: "json", consistency: "strong" })) || [];
  if (!Array.isArray(ids)) ids = [];
  if (req.method === "POST") {
    const body = await req.json().catch(() => ({}));
    const id = String(body.id || "");
    if (id) {
      const next = new Set(ids);
      if (body.on) next.add(id);
      else next.delete(id);
      ids = [...next];
      await store.setJSON("ids", ids);
    }
  }
  return new Response(JSON.stringify({ ids }), {
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
    },
  });
};

export const config = { path: "/api/hearts" };
