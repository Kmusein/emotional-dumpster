import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterDisclaimer from '../components/FooterDisclaimer';
import PrimaryButton from '../components/PrimaryButton';
import TrashCan from '../components/TrashCan';
import { colors } from '../constants/theme';
import { formatKoreanDate } from '../utils/formatDate';

export default function HomeScreen({ navigation, route }) {
  const discardedCount = route?.params?.discardedCount ?? 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.logoText}>로고</Text>
        <Pressable
          style={styles.calendarButton}
          onPress={() => navigation.navigate('Calendar')}
          hitSlop={10}
        >
          <Text style={styles.calendarIcon}>📅</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.date}>{formatKoreanDate()}</Text>
        <TrashCan paperCount={discardedCount} />
        <Text style={styles.status}>
          {discardedCount}개의 일기를 버렸어요
        </Text>
        <PrimaryButton
          title="오늘의 일기 버리기"
          onPress={() => navigation.navigate('EmotionSelect', { discardedCount })}
          style={styles.mainButton}
        />
      </View>

      <FooterDisclaimer />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  logoText: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
  },
  calendarButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5A5A5A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    fontSize: 22,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  date: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '600',
    marginBottom: 28,
  },
  status: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 34,
  },
  mainButton: {
    width: '100%',
    maxWidth: 350,
    minHeight: 60,
    justifyContent: 'center',
  },
});
