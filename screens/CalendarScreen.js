import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import { colors } from '../constants/theme';
import { formatDateKey, getCalendarDays, getEmotionRecordsForMonth } from '../utils/emotionStorage';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function CalendarScreen({ navigation }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [records, setRecords] = useState({});

  const loadRecords = useCallback(async () => {
    const monthRecords = await getEmotionRecordsForMonth(year, monthIndex);
    setRecords(monthRecords);
  }, [monthIndex, year]);

  useFocusEffect(
    useCallback(() => {
      loadRecords();
    }, [loadRecords]),
  );

  const goToPreviousMonth = () => {
    if (monthIndex === 0) {
      setYear((prev) => prev - 1);
      setMonthIndex(11);
      return;
    }
    setMonthIndex((prev) => prev - 1);
  };

  const goToNextMonth = () => {
    if (monthIndex === 11) {
      setYear((prev) => prev + 1);
      setMonthIndex(0);
      return;
    }
    setMonthIndex((prev) => prev + 1);
  };

  const calendarDays = getCalendarDays(year, monthIndex);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>감정 캘린더</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.monthNav}>
        <Pressable style={styles.monthArrow} onPress={goToPreviousMonth} hitSlop={12}>
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>
        <Text style={styles.monthLabel}>
          {year}년 {monthIndex + 1}월
        </Text>
        <Pressable style={styles.monthArrow} onPress={goToNextMonth} hitSlop={12}>
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((weekday) => (
          <Text key={weekday} style={styles.weekday}>
            {weekday}
          </Text>
        ))}
      </View>

      <View style={styles.grid}>
        {calendarDays.map((day, index) => {
          if (!day) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const dateKey = formatDateKey(new Date(year, monthIndex, day));
          const record = records[dateKey];

          return (
            <View key={dateKey} style={styles.dayCell}>
              <Text style={styles.dayNumber}>{day}</Text>
              {record ? (
                <View style={styles.emojiRow}>
                  <Text style={styles.dayEmoji}>{record.negativeEmotion?.emoji ?? ''}</Text>
                  <Text style={styles.dayEmoji}>{record.positiveEmotion?.emoji ?? ''}</Text>
                </View>
              ) : (
                <View style={styles.emojiRow} />
              )}
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
    gap: 24,
  },
  monthArrow: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: colors.text,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '300',
  },
  monthLabel: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    minWidth: 140,
    textAlign: 'center',
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  weekday: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    opacity: 0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  dayCell: {
    width: `${100 / 7}%`,
    minHeight: 72,
    paddingVertical: 6,
    paddingHorizontal: 2,
    alignItems: 'center',
  },
  dayNumber: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  emojiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    minHeight: 22,
  },
  dayEmoji: {
    fontSize: 16,
  },
});
