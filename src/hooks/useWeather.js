import { useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import {
  fetchCitySuggestions,
  fetchWeatherByCity,
  fetchWeatherByCoords,
} from '../api/openWeather';
import { getThemeFromIcon } from '../constants/theme';

export function useWeather({ apiKey }) {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [recentCities, setRecentCities] = useState(['Abidjan', 'Paris', 'Dakar']);

  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const [locating, setLocating] = useState(false);

  const weatherIcon = data?.weather?.[0]?.icon;
  const description = data?.weather?.[0]?.description;
  const temp = data?.main?.temp;
  const feels = data?.main?.feels_like;
  const tmin = data?.main?.temp_min;
  const tmax = data?.main?.temp_max;
  const humidity = data?.main?.humidity;
  const wind = data?.wind?.speed;
  const country = data?.sys?.country;
  const isNight = weatherIcon?.includes('n');

  const theme = useMemo(() => {
    return getThemeFromIcon(weatherIcon);
  }, [weatherIcon]);

  // Auto-complétion avec petit debounce
  useEffect(() => {
    const q = city.trim();
    if (!q || q.length < 2) {
      setSuggestions([]);
      return;
    }
    if (!apiKey) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const next = await fetchCitySuggestions({ apiKey, query: q, limit: 5 });
        if (!cancelled) setSuggestions(next);
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoadingSuggestions(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [city, apiKey]);

  const refreshRecents = (name) => {
    if (!name) return;
    setRecentCities((prev) => {
      const next = [name, ...prev.filter((c) => c.toLowerCase() !== name.toLowerCase())];
      return next.slice(0, 6);
    });
  };

  const searchCity = async (cityOverride) => {
    const query = (cityOverride ?? city).trim();
    setLoading(true);
    setError(null);
    try {
      const json = await fetchWeatherByCity({ apiKey, city: query });
      setData(json);
      setLastUpdated(new Date());
      refreshRecents(json?.name || query);
    } catch (e) {
      setData(null);
      setError(e?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const searchCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const json = await fetchWeatherByCoords({ apiKey, lat, lon });
      setData(json);
      setCity(json?.name || '');
      setLastUpdated(new Date());
      refreshRecents(json?.name || '');
    } catch (e) {
      setData(null);
      setError(e?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const useLocation = async () => {
    if (!apiKey) {
      setError('Ajoutez votre clé OpenWeatherMap dans EXPO_PUBLIC_OWM_KEY.');
      return;
    }
    setError(null);
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Autorise la géolocalisation pour utiliser cette fonction.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      await searchCoords(position.coords.latitude, position.coords.longitude);
      setSuggestions([]);
    } catch {
      setError('Impossible de récupérer ta position.');
    } finally {
      setLocating(false);
    }
  };

  const clearAll = () => {
    setCity('');
    setError(null);
    setData(null);
    setSuggestions([]);
  };

  const selectSuggestion = async (s) => {
    setCity(s?.name || '');
    setSuggestions([]);
    await searchCity(s?.name || '');
  };

  const selectRecent = async (name) => {
    setCity(name);
    await searchCity(name);
  };

  return {
    // state
    city,
    loading,
    error,
    data,
    lastUpdated,
    recentCities,
    suggestions,
    loadingSuggestions,
    locating,

    // computed
    weatherIcon,
    description,
    temp,
    feels,
    tmin,
    tmax,
    humidity,
    wind,
    country,
    theme,

    // actions
    setCity: (t) => {
      setCity(t);
      if (error) setError(null);
    },
    searchCity,
    useLocation,
    clearAll,
    selectSuggestion,
    selectRecent,
  };
}

