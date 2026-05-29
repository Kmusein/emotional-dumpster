import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/theme';

export default function FooterDisclaimer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>감쓰는 작성한 일기를 데이터로 저장하지 않아요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  text: {
    color: colors.text,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.85,
  },
});
