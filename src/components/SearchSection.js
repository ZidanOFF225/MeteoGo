import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SearchSection({
  city,
  onCityChange,
  onClearCity,
  loading,
  locating,
  onSearch,
  onUseLocation,
  suggestions,
  loadingSuggestions,
  onSelectSuggestion,
  recentCities,
  onSelectRecent,
  error,
}) {
  const hasCity = !!city.trim();

  return (
    <View>
      <Text style={styles.title}>Météo</Text>
      <Text style={styles.subtitle}>
        Cherche une ville pour voir la température, l’humidité et le vent.
      </Text>

      <View style={styles.searchRow}>
        <TextInput
          value={city}
          onChangeText={(t) => {
            onCityChange(t);
          }}
          placeholder="Ex: Abidjan"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
          onSubmitEditing={onSearch}
        />
        <TouchableOpacity
          style={[styles.button, (!hasCity || loading) && styles.buttonDisabled]}
          onPress={onSearch}
          disabled={!hasCity || loading}
        >
          <Text style={styles.buttonText}>{loading ? '...' : 'Go'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.locBtn, (loading || locating) && styles.buttonDisabled]}
        onPress={onUseLocation}
        disabled={loading || locating}
      >
        <Text style={styles.locText}>
          {locating ? 'Localisation…' : 'Utiliser ma position'}
        </Text>
      </TouchableOpacity>

      {!!hasCity && suggestions.length > 0 && (
        <View style={styles.suggestionsBox}>
          <ScrollView
            style={styles.suggestionsScroll}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {suggestions.map((s, idx) => (
              <TouchableOpacity
                key={`${s.label}-${idx}`}
                style={styles.suggestionItem}
                onPress={() => onSelectSuggestion(s)}
                disabled={loading}
              >
                <Text style={styles.suggestionText}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {loadingSuggestions && (
            <View style={styles.suggestionFooter}>
              <ActivityIndicator size="small" color="#60a5fa" />
            </View>
          )}
        </View>
      )}

      {!!city && (
        <TouchableOpacity style={styles.linkBtn} onPress={onClearCity}>
          <Text style={styles.linkText}>Effacer</Text>
        </TouchableOpacity>
      )}

      <View style={styles.chipsRow}>
        {recentCities.map((c) => (
          <TouchableOpacity
            key={c}
            style={styles.chip}
            onPress={() => onSelectRecent(c)}
            disabled={loading}
          >
            <Text style={styles.chipText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  locBtn: {
    backgroundColor: '#0ea5e9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: -4,
    marginBottom: 12,
  },
  locText: {
    color: '#0b1220',
    fontWeight: '800',
  },
  suggestionsBox: {
    backgroundColor: '#020617',
    borderRadius: 10,
    borderColor: '#1f2937',
    borderWidth: 1,
    marginTop: -8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  suggestionsScroll: {
    maxHeight: 220,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomColor: '#1f2937',
    borderBottomWidth: 1,
  },
  suggestionText: {
    color: '#e5e7eb',
  },
  suggestionFooter: {
    paddingVertical: 6,
    alignItems: 'center',
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
});

