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
        <View style={styles.logoPlaceholder}>
          <Text style={styles.headerLabel}>로고</Text>
        </View>
        <Pressable
          style={styles.calendarPlaceholder}
          onPress={() => navigation.navigate('Calendar')}
          hitSlop={8}
        >
          <Text style={styles.headerLabel}>달력</Text>
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.mainSection}>
          <Text style={styles.date}>{formatKoreanDate()}</Text>
          <TrashCan paperCount={discardedCount} />
          <Text style={styles.status}>
            {discardedCount}개의 일기를 버렸어요
          </Text>
        </View>

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
    paddingTop: 11,
    minHeight: 47,
  },
  logoPlaceholder: {
    width: 100,
    height: 36,
    backgroundColor: colors.headerPlaceholder,
    justifyContent: 'center',
    paddingLeft: 12,
  },
  calendarPlaceholder: {
    width: 36,
    height: 36,
    backgroundColor: colors.headerPlaceholder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    color: colors.headerLabel,
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 51,
    justifyContent: 'space-between',
  },
  mainSection: {
    alignItems: 'center',
    paddingTop: 52,
  },
  date: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 44,
  },
  status: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 44,
    textAlign: 'center',
  },
  mainButton: {
    width: 288,
    minHeight: 48,
    alignSelf: 'center',
    marginBottom: 32,
  },
});
