const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct';

function ensureApiKey(apiKey) {
  if (!apiKey) {
    const err = new Error('Ajoutez votre clé OpenWeatherMap dans EXPO_PUBLIC_OWM_KEY.');
    err.code = 'NO_API_KEY';
    throw err;
  }
}

export async function fetchWeatherByCity({ apiKey, city }) {
  ensureApiKey(apiKey);
  const query = (city || '').trim();
  if (!query) {
    const err = new Error('Entrez une ville.');
    err.code = 'NO_CITY';
    throw err;
  }

  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&units=metric&lang=fr&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) {
      const err = new Error('Ville introuvable.');
      err.code = 'CITY_NOT_FOUND';
      throw err;
    }
    throw new Error("Erreur lors de la récupération de la météo.");
  }
  return res.json();
}

export async function fetchWeatherByCoords({ apiKey, lat, lon }) {
  ensureApiKey(apiKey);
  const url = `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur lors de la récupération de la météo.");
  return res.json();
}

export async function fetchCitySuggestions({ apiKey, query, limit = 5 }) {
  ensureApiKey(apiKey);
  const q = (query || '').trim();
  if (q.length < 2) return [];

  const url = `${GEO_URL}?q=${encodeURIComponent(q)}&limit=${limit}&appid=${apiKey}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();

  // Déduplique par label complet
  const seen = new Set();
  const mapped = [];
  for (const c of json || []) {
    const label = `${c.name}${c.state ? ', ' + c.state : ''}${c.country ? ' (' + c.country + ')' : ''}`;
    if (seen.has(label)) continue;
    seen.add(label);
    mapped.push({
      label,
      name: c.name,
      country: c.country,
      state: c.state,
    });
  }
  return mapped;
}

