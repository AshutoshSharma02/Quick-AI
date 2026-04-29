export async function GET(request) {
  return new Response(JSON.stringify({ success: true, row: { ok: 1 } }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
