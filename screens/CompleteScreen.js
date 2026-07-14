import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterDisclaimer from '../components/FooterDisclaimer';
import { saveEmotionRecord } from '../utils/emotionStorage';
import { getObjectParticle } from '../utils/korean';

const AUTO_NAVIGATE_MS = 3000;

export default function CompleteScreen({ navigation, route }) {
  const positiveEmotion = route?.params?.positiveEmotion;
  const negativeEmotion = route?.params?.negativeEmotion;
  const discardedCount = route?.params?.discardedCount ?? 0;
  const emotionEmoji = positiveEmotion?.emoji ?? '🙂';
  const negativeLabel = negativeEmotion?.label ?? '감정';
  const positiveLabel = positiveEmotion?.label ?? '홀가분함';

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
      <View style={styles.titleBlock}>
        <Text style={styles.title}>
          {negativeLabel}{getObjectParticle(negativeLabel)} 버리고{'\n'}
          {positiveLabel}{getObjectParticle(positiveLabel)} 얻었어요!
        </Text>
      </View>

      <View style={styles.center}>
        <Text style={styles.emoji}>{emotionEmoji}</Text>
      </View>

      <FooterDisclaimer
        text="YEET!에 작성된 일기는 던지는 순간 사라져요."
        textStyle={styles.footerText}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#021205',
  },
  titleBlock: {
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  title: {
    color: '#48FF00',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 45,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 110,
  },
  footerText: {
    color: '#7D7D7D',
    fontWeight: '300',
  },
});
