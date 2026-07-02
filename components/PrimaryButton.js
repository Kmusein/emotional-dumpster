import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/theme';

export default function PrimaryButton({ title, onPress, style, textStyle }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
      onPress={onPress}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.button,
    borderRadius: 8,
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
  },
});
