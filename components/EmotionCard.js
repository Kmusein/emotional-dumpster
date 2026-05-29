import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

export default function EmotionCard({ emoji, label, description, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    margin: 6,
    minHeight: 100,
  },
  pressed: {
    opacity: 0.9,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    color: colors.cardText,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  description: {
    color: colors.cardText,
    fontSize: 11,
    lineHeight: 15,
    opacity: 0.8,
  },
});
