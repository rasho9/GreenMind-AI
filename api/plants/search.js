import {
  cleanText,
  enforceRateLimit,
  fetchWithTimeout,
  methodNotAllowed,
  sendJson,
} from '../_lib/http.js';

function normalizePlant(item) {
  return {
    id: String(item.id),
    commonName: item.common_name ?? 'Unnamed plant',
    scientificName: item.scientific_name?.[0] ?? 'Scientific name unavailable',
    imageUrl: item.default_image?.regular_url ?? item.default_image?.thumbnail,
    idealClimate:
      item.hardiness?.min && item.hardiness?.max
        ? `Hardiness zones ${item.hardiness.min}-${item.hardiness.max}`
        : undefined,
    waterRequirement: item.watering,
    sunlight: Array.isArray(item.sunlight)
      ? item.sunlight.join(', ')
      : undefined,
    growthDifficulty: item.care_level,
    diseases: [],
    medicines: [],
    companionPlants: [],
  };
}

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
  const query = cleanText(req.query.q, 100);
  if (!query)
    return sendJson(res, 400, {
      error: { message: 'Enter a plant name to search.' },
    });
  const params = new URLSearchParams({
    key: process.env.PERENUAL_API_KEY,
    q: query,
    page: '1',
  });
  if (req.query.sunlight)
    params.set('sunlight', cleanText(req.query.sunlight, 40));
  if (req.query.watering)
    params.set('watering', cleanText(req.query.watering, 40));
  if (req.query.indoor === 'true' || req.query.indoor === 'false')
    params.set('indoor', req.query.indoor);
  try {
    const upstream = await fetchWithTimeout(
      `https://perenual.com/api/v2/species-list?${params}`,
      {},
      12_000,
    );
    if (!upstream.ok) {
      return sendJson(res, upstream.status === 401 ? 502 : upstream.status, {
        error: {
          message:
            'Plant data could not be retrieved. Check the server key and provider status.',
        },
      });
    }
    const payload = await upstream.json();
    return sendJson(
      res,
      200,
      Array.isArray(payload.data)
        ? payload.data.slice(0, 12).map(normalizePlant)
        : [],
    );
  } catch {
    return sendJson(res, 502, {
      error: {
        message: 'Plant data service is unavailable. Please try again.',
      },
    });
  }
}
