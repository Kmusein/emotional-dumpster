import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import BackButton from '../components/BackButton';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../constants/theme';
import { formatKoreanDate } from '../utils/formatDate';

export default function WriteScreen({ navigation, route }) {
  const [text, setText] = useState('');
  const emotion = route?.params?.emotion;
  const discardedCount = route?.params?.discardedCount ?? 0;
  const insets = useSafeAreaInsets();

  const handleSubmit = () => {
    navigation.navigate('Animation', { text, emotion, discardedCount });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        <View style={styles.body}>
          <Text style={styles.date}>{formatKoreanDate()}</Text>
          <Text style={styles.title}>
            ‘{emotion?.label ?? '감정'}’였던 이유는 무엇인가요?
          </Text>

          <TextInput
            style={styles.input}
            placeholder="텍스트 작성"
            placeholderTextColor={colors.placeholder}
            multiline
            textAlignVertical="top"
            value={text}
            onChangeText={setText}
          />
        </View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <PrimaryButton
            title="일기 버리기"
            onPress={handleSubmit}
            style={styles.button}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  date: {
    color: colors.text,
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    color: colors.text,
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 42,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#3D3D3D',
    color: colors.text,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 18,
    lineHeight: 26,
    minHeight: 220,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  button: {
    width: '100%',
    minHeight: 58,
  },
});
