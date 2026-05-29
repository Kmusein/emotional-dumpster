import { StyleSheet, Text, View } from 'react-native';

export default function CrumpledPaper({ emoji, size = 'large' }) {
  const isLarge = size === 'large';

  return (
    <View style={[styles.outer, isLarge ? styles.outerLarge : styles.outerSmall]}>
      <View style={[styles.inner, isLarge ? styles.innerLarge : styles.innerSmall]}>
        {emoji ? <Text style={[styles.emoji, isLarge && styles.emojiLarge]}>{emoji}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: '#E6E6E6',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  outerLarge: {
    width: 180,
    height: 220,
    borderRadius: 28,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 18,
    padding: 10,
  },
  outerSmall: {
    width: 90,
    height: 90,
    borderRadius: 18,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 12,
    padding: 6,
  },
  inner: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerLarge: {
    borderRadius: 22,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 26,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 14,
  },
  innerSmall: {
    borderRadius: 14,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 10,
  },
  emoji: {
    fontSize: 36,
  },
  emojiLarge: {
    fontSize: 56,
  },
});
