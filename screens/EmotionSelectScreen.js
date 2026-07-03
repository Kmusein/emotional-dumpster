import EmotionGridScreen from '../components/EmotionGridScreen';
import { negativeEmotions } from '../constants/emotions';

export default function EmotionSelectScreen({ navigation, route }) {
  const discardedCount = route?.params?.discardedCount ?? 0;

  return (
    <EmotionGridScreen
      title="오늘의 던지고 싶은 감정은?"
      emotions={negativeEmotions}
      onBack={() => navigation.goBack()}
      onNext={(emotion) => navigation.navigate('Write', { emotion, discardedCount })}
    />
  );
}
