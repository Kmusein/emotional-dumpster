import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import { formatDateKey, getCalendarDays, getEmotionRecordsForMonth } from '../utils/emotionStorage';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const REFERENCE_WIDTH = 390; // Figma frame width

const MONTH_CHIP_WIDTH = 230;
const MONTH_CHIP_HEIGHT = 36;
const MONTH_CHIP_TOP = 104; // from Figma frame top
const HEADER_HEIGHT = 56;

const GRID_WIDTH = 350; // 390 - 20px margin each side, matches Figma
const GRID_TOP = 172; // from Figma frame top
const TABLE_MARGIN_TOP = GRID_TOP - (MONTH_CHIP_TOP + MONTH_CHIP_HEIGHT); // gap between chip and table

export default function CalendarScreen({ navigation }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [records, setRecords] = useState({});
  const [frameWidth, setFrameWidth] = useState(REFERENCE_WIDTH);
  const scale = frameWidth / REFERENCE_WIDTH;

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
    <SafeAreaView
      style={styles.safeArea}
      onLayout={(e) => setFrameWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} arrowStyle={styles.backArrow} />
      </View>

      <View style={[styles.monthNav, { marginTop: (MONTH_CHIP_TOP - HEADER_HEIGHT) * scale }]}>
        <Pressable onPress={goToPreviousMonth} hitSlop={12}>
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>
        <View
          style={[
            styles.monthChip,
            { width: MONTH_CHIP_WIDTH * scale, height: MONTH_CHIP_HEIGHT * scale },
          ]}
        >
          <Text style={styles.monthText}>
            {year}년 {monthIndex + 1}월
          </Text>
        </View>
        <Pressable onPress={goToNextMonth} hitSlop={12}>
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      </View>

      <View style={[styles.tableWrapper, { marginTop: TABLE_MARGIN_TOP * scale }]}>
        <View style={[styles.weekdayRow, { width: GRID_WIDTH * scale }]}>
          {WEEKDAYS.map((weekday) => (
            <View key={weekday} style={styles.weekdayCell}>
              <Text style={styles.weekdayText}>{weekday}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.grid, { width: GRID_WIDTH * scale }]}>
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
                  <View style={styles.emojiColumn}>
                    <Text style={styles.negativeEmoji}>{record.negativeEmotion?.emoji ?? ''}</Text>
                    <Text style={styles.positiveEmoji}>{record.positiveEmotion?.emoji ?? ''}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#021205',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  backArrow: {
    color: '#BBD2B2',
    fontSize: 20,
    fontWeight: '600',
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  arrowText: {
    color: '#48FF00',
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '300',
    paddingHorizontal: 8,
  },
  monthChip: {
    backgroundColor: '#222222',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
  tableWrapper: {
    alignSelf: 'center',
  },
  weekdayRow: {
    flexDirection: 'row',
  },
  weekdayCell: {
    flex: 1,
    borderColor: '#48FF00',
    borderLeftWidth: 0.7,
    borderRightWidth: 0.7,
    borderBottomWidth: 0.7,
    paddingVertical: 10,
    alignItems: 'center',
  },
  weekdayText: {
    color: '#48FF00',
    fontSize: 20,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    minHeight: 88,
    borderColor: '#48FF00',
    borderWidth: 0.7,
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 10,
    gap: 4,
  },
  dayNumber: {
    color: '#BBD2B2',
    fontSize: 15,
  },
  emojiColumn: {
    alignItems: 'center',
    gap: 4,
  },
  negativeEmoji: {
    fontSize: 18,
    transform: [{ rotate: '-15deg' }],
  },
  positiveEmoji: {
    fontSize: 22,
  },
});
