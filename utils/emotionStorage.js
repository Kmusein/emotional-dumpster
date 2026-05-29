import AsyncStorage from '@react-native-async-storage/async-storage';

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function formatDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function serializeEmotion(emotion) {
  if (!emotion) return null;
  return {
    id: emotion.id,
    label: emotion.label,
    emoji: emotion.emoji,
  };
}

export async function saveEmotionRecord(date, negativeEmotion, positiveEmotion) {
  const key = formatDateKey(date);
  const value = JSON.stringify({
    negativeEmotion: serializeEmotion(negativeEmotion),
    positiveEmotion: serializeEmotion(positiveEmotion),
  });
  await AsyncStorage.setItem(key, value);
}

export async function getEmotionRecordsForMonth(year, monthIndex) {
  const monthPrefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
  const allKeys = await AsyncStorage.getAllKeys();
  const monthKeys = allKeys.filter(
    (key) => DATE_KEY_PATTERN.test(key) && key.startsWith(monthPrefix),
  );

  if (monthKeys.length === 0) {
    return {};
  }

  const entries = await AsyncStorage.multiGet(monthKeys);
  const records = {};

  entries.forEach(([key, value]) => {
    if (!value) return;
    try {
      records[key] = JSON.parse(value);
    } catch {
      // ignore invalid entries
    }
  });

  return records;
}

export function getCalendarDays(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const startPadding = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const days = [];
  for (let i = 0; i < startPadding; i += 1) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(day);
  }
  while (days.length % 7 !== 0) {
    days.push(null);
  }

  return days;
}
