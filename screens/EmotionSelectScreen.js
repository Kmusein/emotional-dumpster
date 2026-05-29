import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import { negativeEmotions } from '../constants/emotions';
import { colors } from '../constants/theme';
import { formatKoreanDate } from '../utils/formatDate';

export default function EmotionSelectScreen({ navigation, route }) {
  const discardedCount = route?.params?.discardedCount ?? 0;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <BackButton onPress={() => navigation.goBack()} />
      </View>

      <View style={styles.content}>
        <Text style={styles.date}>{formatKoreanDate()}</Text>
        <Text style={styles.title}>오늘 어떤 기분이었나요?</Text>
      </View>

      <FlatList
        data={negativeEmotions}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => navigation.navigate('Write', { emotion: item, discardedCount })}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingTop: 8 },
  content: { alignItems: 'center', marginTop: 10, marginBottom: 16, paddingHorizontal: 20 },
  date: { color: colors.text, fontSize: 44, fontWeight: '700', marginBottom: 10, textAlign: 'center' },
  title: { color: colors.text, fontSize: 40, fontWeight: '700', textAlign: 'center' },
  grid: { paddingHorizontal: 12, paddingBottom: 26 },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: '48.4%',
    backgroundColor: '#3D3D3D',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginBottom: 10,
    minHeight: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPressed: { opacity: 0.85 },
  emoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 3,
  },
  description: {
    color: colors.text,
    fontSize: 12,
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 16,
  },
});
