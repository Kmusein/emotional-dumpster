import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import PrimaryButton from '../components/PrimaryButton';
import { negativeEmotions } from '../constants/emotions';
import { formatKoreanDate } from '../utils/formatDate';

const REFERENCE_WIDTH = 390; // Figma frame width

const DATE_CHIP_WIDTH = 230;
const DATE_CHIP_HEIGHT = 36;
const DATE_CHIP_TOP = 122;

const GRID_TOP = 225;
const GRID_LEFT = 29;
const CARD_SIZE = 100;
const CARD_GAP = 16;

const CTA_WIDTH = 312;
const CTA_HEIGHT = 56;
const CTA_BOTTOM_OFFSET = 73; // from Figma frame bottom

export default function EmotionSelectScreen({ navigation, route }) {
  const discardedCount = route?.params?.discardedCount ?? 0;
  const [selectedId, setSelectedId] = useState(null);
  const [frameWidth, setFrameWidth] = useState(REFERENCE_WIDTH);
  const scale = frameWidth / REFERENCE_WIDTH;

  const selectedEmotion = negativeEmotions.find((item) => item.id === selectedId) ?? null;

  const handleNext = () => {
    if (!selectedEmotion) return;
    navigation.navigate('Write', { emotion: selectedEmotion, discardedCount });
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      onLayout={(e) => setFrameWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} arrowStyle={styles.backArrow} />
      </View>

      <View
        style={[
          styles.dateChip,
          {
            top: DATE_CHIP_TOP * scale,
            width: DATE_CHIP_WIDTH * scale,
            height: DATE_CHIP_HEIGHT * scale,
          },
        ]}
      >
        <Text style={styles.dateText}>{formatKoreanDate()}</Text>
      </View>

      <Text style={[styles.title, { top: 156 * scale }]}>오늘의 던지고 싶은 감정은?</Text>

      <View style={[styles.grid, { top: GRID_TOP * scale, left: GRID_LEFT * scale }]}>
        {negativeEmotions.map((item, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          const isSelected = item.id === selectedId;
          return (
            <Pressable
              key={item.id}
              onPress={() => setSelectedId(item.id)}
              style={{
                position: 'absolute',
                left: col * (CARD_SIZE + CARD_GAP) * scale,
                top: row * (CARD_SIZE + CARD_GAP) * scale,
              }}
            >
              <View
                style={[
                  styles.card,
                  isSelected && styles.cardSelected,
                  { width: CARD_SIZE * scale, height: CARD_SIZE * scale, borderRadius: (CARD_SIZE * scale) / 2 },
                ]}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.label}>{item.label}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <PrimaryButton
        title="다음"
        onPress={handleNext}
        style={[
          styles.ctaButton,
          !selectedEmotion && styles.ctaButtonDisabled,
          {
            bottom: CTA_BOTTOM_OFFSET * scale,
            width: CTA_WIDTH * scale,
            height: CTA_HEIGHT * scale,
          },
        ]}
        textStyle={styles.ctaText}
      />
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
  dateChip: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignSelf: 'center',
    backgroundColor: '#222222',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
  title: {
    position: 'absolute',
    left: 0,
    right: 0,
    color: '#CCFFB7',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  grid: {
    position: 'absolute',
  },
  card: {
    backgroundColor: '#313131',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#48FF00',
  },
  emoji: {
    fontSize: 32,
    textAlign: 'center',
    transform: [{ rotate: '-15deg' }],
  },
  label: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 2,
  },
  ctaButton: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#48FF00',
    borderRadius: 8,
  },
  ctaButtonDisabled: {
    opacity: 0.5,
  },
  ctaText: {
    color: '#021205',
    fontSize: 20,
    fontWeight: '800',
  },
});
