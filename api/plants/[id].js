import {
  enforceRateLimit,
  fetchWithTimeout,
  methodNotAllowed,
  sendJson,
} from '../_lib/http.js';
import { normalizePlant } from '../_lib/plants.js';

/** Retrieves one provider record for a Plant Library detail route. */
export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  if (!enforceRateLimit(req, res, 'plants', 60, 60_000)) return;
  if (!process.env.PERENUAL_API_KEY) {
    return sendJson(res, 503, {
      error: {
        message:
          'Plant data is not connected. Add PERENUAL_API_KEY to your server environment.',
      },
    });
  }

  const id = String(req.query.id ?? '');
  if (!/^\d{1,12}$/.test(id)) {
    return sendJson(res, 400, {
      error: { message: 'The requested plant record is invalid.' },
    });
  }

  try {
    const upstream = await fetchWithTimeout(
      `https://perenual.com/api/species/details/${id}?${new URLSearchParams({ key: process.env.PERENUAL_API_KEY })}`,
      {},
      12_000,
    );
    if (!upstream.ok) {
      return sendJson(res, upstream.status === 404 ? 404 : 502, {
        error: {
          message:
            upstream.status === 404
              ? 'This plant record is no longer available from the provider.'
              : 'Plant details could not be retrieved. Check the server key and provider status.',
        },
      });
    }
    return sendJson(res, 200, normalizePlant(await upstream.json()));
  } catch {
    return sendJson(res, 502, {
      error: {
        message: 'Plant data service is unavailable. Please try again.',
      },
    });
  }
}
