export default function handler(req, res) {
  res.status(200).json({ success: true, row: { ok: 1 } });
}
