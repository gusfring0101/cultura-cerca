// Base del webhook: Vercel -> Settings -> Environment Variables
// KEY: VITE_N8N_WEBHOOK_BASE  VALUE: https://cultura-cerca.duckdns.org/webhook
const BASE = import.meta.env.VITE_N8N_WEBHOOK_BASE;

export async function ccSearch(payload) {
  if (!BASE) throw new Error('Falta VITE_N8N_WEBHOOK_BASE');
  const url = `${BASE.replace(/\/+$/, '')}/cc-search`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`n8n error ${res.status}: ${text}`);
  }
  return res.json().catch(() => ({}));
}
