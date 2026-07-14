import { supabase } from '../lib/supabase';

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

async function getCurrentUserId() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

export async function saveEmotionRecord(date, negativeEmotion, positiveEmotion) {
  const userId = await getCurrentUserId();
  if (!userId) return;

  await supabase.from('emotion_records').upsert(
    {
      user_id: userId,
      record_date: formatDateKey(date),
      negative_emotion: serializeEmotion(negativeEmotion),
      positive_emotion: serializeEmotion(positiveEmotion),
    },
    { onConflict: 'user_id,record_date' },
  );
}

export async function getEmotionRecordsForMonth(year, monthIndex) {
  const userId = await getCurrentUserId();
  if (!userId) return {};

  const startDate = formatDateKey(new Date(year, monthIndex, 1));
  const endDate = formatDateKey(new Date(year, monthIndex + 1, 1));

  const { data, error } = await supabase
    .from('emotion_records')
    .select('record_date, negative_emotion, positive_emotion')
    .gte('record_date', startDate)
    .lt('record_date', endDate);

  if (error || !data) return {};

  const records = {};
  data.forEach((row) => {
    records[row.record_date] = {
      negativeEmotion: row.negative_emotion,
      positiveEmotion: row.positive_emotion,
    };
  });

  return records;
}

export async function getEmotionRecordCount() {
  const userId = await getCurrentUserId();
  if (!userId) return 0;

  const { count, error } = await supabase
    .from('emotion_records')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) return 0;
  return count ?? 0;
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
