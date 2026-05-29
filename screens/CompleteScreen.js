import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterDisclaimer from '../components/FooterDisclaimer';
import { colors } from '../constants/theme';
import { saveEmotionRecord } from '../utils/emotionStorage';

const AUTO_NAVIGATE_MS = 3000;

export default function CompleteScreen({ navigation, route }) {
  const positiveEmotion = route?.params?.positiveEmotion;
  const negativeEmotion = route?.params?.negativeEmotion;
  const discardedCount = route?.params?.discardedCount ?? 0;
  const emotionEmoji = positiveEmotion?.emoji ?? '🕊️';
  const encouragementMessage = positiveEmotion?.message ?? '홀가분한 하루 보내세요';

  useEffect(() => {
    if (negativeEmotion && positiveEmotion) {
      saveEmotionRecord(new Date(), negativeEmotion, positiveEmotion);
    }
  }, [negativeEmotion, positiveEmotion]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home', params: { discardedCount: discardedCount + 1 } }],
      });
    }, AUTO_NAVIGATE_MS);

    return () => clearTimeout(timer);
  }, [discardedCount, navigation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.topTitle}>오늘의 감정을 버렸어요</Text>

      <View style={styles.center}>
        <Text style={styles.emoji}>{emotionEmoji}</Text>
        <Text style={styles.subtitle}>{encouragementMessage}</Text>
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
  topTitle: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emoji: {
    fontSize: 88,
    marginBottom: 24,
  },
  subtitle: {
    color: colors.text,
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 48,
  },
});
