import HomeScreen from './src/screens/HomeScreen';

const API_KEY = process.env.EXPO_PUBLIC_OWM_KEY || '';

export default function App() {
  return <HomeScreen apiKey={API_KEY} />;
}
