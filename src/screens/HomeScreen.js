import React from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import SearchSection from '../components/SearchSection';
import WeatherSection from '../components/WeatherSection';
import { useWeather } from '../hooks/useWeather';

export default function HomeScreen({ apiKey }) {
  const {
    city,
    setCity,
    loading,
    error,
    data,
    lastUpdated,
    recentCities,
    suggestions,
    loadingSuggestions,
    locating,
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
    searchCity,
    useLocation,
    clearAll,
    selectSuggestion,
    selectRecent,
  } = useWeather({ apiKey });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar style="light" />
      <Pressable style={styles.flex} onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <SearchSection
            city={city}
            onCityChange={setCity}
            onClearCity={clearAll}
            loading={loading}
            locating={locating}
            onSearch={() => searchCity()}
            onUseLocation={useLocation}
            suggestions={suggestions}
            loadingSuggestions={loadingSuggestions}
            onSelectSuggestion={selectSuggestion}
            recentCities={recentCities}
            onSelectRecent={selectRecent}
            error={error}
          />

          <WeatherSection
            loading={loading}
            error={error}
            data={data}
            lastUpdated={lastUpdated}
            temp={temp}
            feels={feels}
            tmin={tmin}
            tmax={tmax}
            humidity={humidity}
            wind={wind}
            country={country}
            description={description}
            weatherIcon={weatherIcon}
            cardBg={theme.cardBg}
            city={city}
            onRefresh={() => searchCity(data?.name || city)}
          />
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
});

