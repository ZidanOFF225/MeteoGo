import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useState } from 'react';

const API_KEY = process.env.EXPO_PUBLIC_OWM_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export default function App() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [recentCities, setRecentCities] = useState(['Abidjan', 'Paris', 'Dakar']);

  const fetchWeather = async (cityOverride) => {
    Keyboard.dismiss();
    const query = (cityOverride ?? city).trim();
    if (!query) {
      setError('Entrez une ville.');
      setData(null);
      return;
    }
    if (!API_KEY) {
      setError('Ajoutez votre clé OpenWeatherMap dans EXPO_PUBLIC_OWM_KEY.');
      setData(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const url = `${BASE_URL}?q=${encodeURIComponent(
        query
      )}&units=metric&lang=fr&appid=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Ville introuvable.');
        throw new Error("Erreur lors de la récupération de la météo.");
      }
      const json = await res.json();
      setData(json);
      setLastUpdated(new Date());
      setRecentCities((prev) => {
        const next = [json?.name || query, ...prev.filter((c) => c.toLowerCase() !== (json?.name || query).toLowerCase())];
        return next.slice(0, 6);
      });
    } catch (e) {
      setData(null);
      setError(e.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

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

  const bg = isNight ? '#0b1220' : '#0f172a';
  const cardBg = isNight ? '#111827' : '#1f2937';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar style="light" />
      <Pressable style={styles.flex} onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Météo</Text>
          <Text style={styles.subtitle}>
            Cherche une ville pour voir la température, l’humidité et le vent.
          </Text>

          <View style={styles.searchRow}>
            <TextInput
              value={city}
              onChangeText={(t) => {
                setCity(t);
                if (error) setError(null);
              }}
              placeholder="Ex: Abidjan"
              placeholderTextColor="#9ca3af"
              style={styles.input}
              returnKeyType="search"
              autoCapitalize="words"
              autoCorrect={false}
              onSubmitEditing={() => fetchWeather()}
            />
            <TouchableOpacity
              style={[styles.button, (!city.trim() || loading) && styles.buttonDisabled]}
              onPress={() => fetchWeather()}
              disabled={!city.trim() || loading}
            >
              <Text style={styles.buttonText}>{loading ? '...' : 'Go'}</Text>
            </TouchableOpacity>
          </View>

          {!!city && (
            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => {
                setCity('');
                setError(null);
                setData(null);
              }}
            >
              <Text style={styles.linkText}>Effacer</Text>
            </TouchableOpacity>
          )}

          <View style={styles.chipsRow}>
            {recentCities.map((c) => (
              <TouchableOpacity
                key={c}
                style={styles.chip}
                onPress={() => {
                  setCity(c);
                  fetchWeather(c);
                }}
                disabled={loading}
              >
                <Text style={styles.chipText}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#38bdf8" />
              <Text style={styles.loadingText}>Chargement…</Text>
            </View>
          )}

          {error && !loading && (
            <View style={styles.errorBox}>
              <Text style={styles.errorTitle}>Oups</Text>
              <Text style={styles.error}>{error}</Text>
            </View>
          )}

          {!loading && !error && !data && (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Aucune donnée</Text>
              <Text style={styles.emptyText}>Tape une ville puis appuie sur Go.</Text>
            </View>
          )}

          {!loading && !error && data && (
            <View style={[styles.card, { backgroundColor: cardBg }]}>
              <View style={styles.cardTop}>
                <View style={styles.cardLeft}>
                  <Text style={styles.city}>
                    {data.name}
                    {country ? `, ${country}` : ''}
                  </Text>
                  <Text style={styles.desc}>{description}</Text>
                  {lastUpdated && (
                    <Text style={styles.updated}>
                      Mis à jour : {lastUpdated.toLocaleTimeString()}
                    </Text>
                  )}
                </View>
                {weatherIcon && (
                  <Image
                    source={{ uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png` }}
                    style={styles.icon}
                    accessibilityLabel="Icône météo"
                  />
                )}
              </View>

              <Text style={styles.temp}>
                {Number.isFinite(temp) ? `${Math.round(temp)}°C` : '--'}
              </Text>
              <Text style={styles.feels}>
                Ressenti {Number.isFinite(feels) ? `${Math.round(feels)}°C` : '--'}
                {Number.isFinite(tmin) && Number.isFinite(tmax)
                  ? `  •  min ${Math.round(tmin)}°  max ${Math.round(tmax)}°`
                  : ''}
              </Text>

              <View style={styles.metrics}>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Humidité</Text>
                  <Text style={styles.metricValue}>
                    {Number.isFinite(humidity) ? `${humidity}%` : '--'}
                  </Text>
                </View>
                <View style={styles.metric}>
                  <Text style={styles.metricLabel}>Vent</Text>
                  <Text style={styles.metricValue}>
                    {Number.isFinite(wind) ? `${Math.round(wind)} m/s` : '--'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.refreshBtn}
                onPress={() => fetchWeather(data?.name || city)}
                disabled={loading}
              >
                <Text style={styles.refreshText}>Actualiser</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  flex: { flex: 1 },
  scroll: { paddingBottom: 24 },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
  },
  subtitle: {
    color: '#cbd5e1',
    marginTop: -10,
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#1f2937',
    color: 'white',
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 48,
  },
  button: {
    backgroundColor: '#38bdf8',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: 48,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
  linkBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    marginTop: -10,
    marginBottom: 10,
  },
  linkText: {
    color: '#93c5fd',
    fontWeight: '600',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: '#0b2542',
    borderColor: '#1d4ed8',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
  },
  chipText: {
    color: '#bfdbfe',
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  loadingText: {
    color: '#cbd5e1',
    fontWeight: '600',
  },
  errorBox: {
    backgroundColor: '#3b0a0a',
    borderColor: '#ef4444',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  errorTitle: {
    color: '#fecaca',
    fontWeight: '800',
    marginBottom: 4,
  },
  error: {
    color: '#fca5a5',
    fontSize: 16,
  },
  emptyBox: {
    backgroundColor: '#111827',
    borderColor: '#334155',
    borderWidth: 1,
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
  },
  emptyTitle: {
    color: 'white',
    fontWeight: '800',
    marginBottom: 4,
  },
  emptyText: {
    color: '#cbd5e1',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: { flex: 1, paddingRight: 8 },
  city: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  temp: {
    color: 'white',
    fontSize: 48,
    fontWeight: '800',
  },
  desc: {
    color: '#cbd5e1',
    fontSize: 18,
    textTransform: 'capitalize',
  },
  updated: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  feels: {
    color: '#e5e7eb',
    marginTop: -6,
    marginBottom: 4,
  },
  metrics: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  metric: {
    flex: 1,
    backgroundColor: '#0b1220',
    borderRadius: 12,
    padding: 12,
    borderColor: '#334155',
    borderWidth: 1,
  },
  metricLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '700',
  },
  metricValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  refreshBtn: {
    marginTop: 12,
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  refreshText: {
    color: '#0b1220',
    fontWeight: '900',
  },
  icon: {
    width: 120,
    height: 120,
    alignSelf: 'flex-end',
  },
});
