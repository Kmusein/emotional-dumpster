import EmotionGridScreen from '../components/EmotionGridScreen';
import { positiveEmotions } from '../constants/emotions';

export default function PositiveEmotionScreen({ navigation, route }) {
  const discardedCount = route?.params?.discardedCount ?? 0;
  const negativeEmotion = route?.params?.negativeEmotion;

  return (
    <EmotionGridScreen
      title="오늘의 얻고싶은 감정은?"
      emotions={positiveEmotions}
      onBack={() => navigation.goBack()}
      onNext={(positiveEmotion) =>
        navigation.replace('Complete', { positiveEmotion, negativeEmotion, discardedCount })
      }
    />
  );
}
