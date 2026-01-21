export const COLORS = {
  bgDay: '#0f172a',
  bgNight: '#0b1220',
  cardDay: '#1f2937',
  cardNight: '#111827',
};

export function getThemeFromIcon(icon) {
  const isNight = typeof icon === 'string' && icon.includes('n');
  return {
    bg: isNight ? COLORS.bgNight : COLORS.bgDay,
    cardBg: isNight ? COLORS.cardNight : COLORS.cardDay,
    isNight,
  };
}

