import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
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

  const fetchWeather = async () => {
    const query = city.trim();
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
    } catch (e) {
      setData(null);
      setError(e.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const weatherIcon = data?.weather?.[0]?.icon;
  const description = data?.weather?.[0]?.description;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>Météo</Text>
      <View style={styles.searchRow}>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="Rechercher une ville"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={fetchWeather}
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>OK</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color="#38bdf8" size="large" />
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      {!loading && !error && data && (
        <View style={styles.card}>
          <Text style={styles.city}>{data.name}</Text>
          <Text style={styles.temp}>{Math.round(data.main?.temp)}°C</Text>
          <Text style={styles.desc}>{description}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.info}>Humidité {data.main?.humidity}%</Text>
            <Text style={styles.info}>Vent {Math.round(data.wind?.speed)} m/s</Text>
          </View>
          {weatherIcon && (
            <Image
              source={{ uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png` }}
              style={styles.icon}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 16,
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
  buttonText: {
    color: '#0f172a',
    fontWeight: '700',
    fontSize: 16,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  error: {
    color: '#fca5a5',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    color: '#e5e7eb',
    fontSize: 14,
  },
  icon: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
});
