import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

export default function WeatherSection({
  loading,
  error,
  data,
  lastUpdated,
  temp,
  feels,
  tmin,
  tmax,
  humidity,
  wind,
  country,
  description,
  weatherIcon,
  cardBg,
  city,
  onRefresh,
}) {
  if (loading) {
    return (
      <View style={styles.loadingRow}>
        <Text style={styles.loadingText}>Chargement…</Text>
      </View>
    );
  }

  if (error && !loading) {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.errorTitle}>Oups</Text>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!data && !loading && !error) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyTitle}>Aucune donnée</Text>
        <Text style={styles.emptyText}>Tape une ville puis appuie sur Go.</Text>
      </View>
    );
  }

  if (!data) return null;

  return (
    <View style={[styles.card, { backgroundColor: cardBg }]}>
      <View style={styles.cardTop}>
        <View style={styles.cardLeft}>
          <Text style={styles.city}>
            {data.name || city}
            {country ? `, ${country}` : ''}
          </Text>
          <Text style={styles.desc}>{description}</Text>
          {lastUpdated && (
            <Text style={styles.updated}>Mis à jour : {lastUpdated.toLocaleTimeString()}</Text>
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

      <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh} disabled={loading}>
        <Text style={styles.refreshText}>Actualiser</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingRow: {
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
    marginTop: 8,
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

