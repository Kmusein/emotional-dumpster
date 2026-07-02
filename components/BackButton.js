import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../constants/theme';

export default function BackButton({ onPress, style, arrowStyle }) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress} hitSlop={12}>
      <Text style={[styles.arrow, arrowStyle]}>←</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    minWidth: 40,
  },
  arrow: {
    color: colors.text,
    fontSize: 24,
    lineHeight: 28,
  },
});
