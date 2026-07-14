import { useState } from 'react';
import {
  Image,
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
import { formatKoreanDate } from '../utils/formatDate';

const paperTexture = require('../assets/images/paper-texture.png');

const REFERENCE_WIDTH = 390; // Figma frame width

const DATE_CHIP_WIDTH = 230;
const DATE_CHIP_HEIGHT = 36;
const DATE_CHIP_TOP = 104;
const DATE_CHIP_LEFT = (REFERENCE_WIDTH - DATE_CHIP_WIDTH) / 2; // 80, matches Figma x

const PAPER_WRAPPER_SIZE = 350.806;
const PAPER_WRAPPER_TOP = 189;
const PAPER_WRAPPER_LEFT = (REFERENCE_WIDTH - PAPER_WRAPPER_SIZE) / 2; // matches DATE_CHIP_LEFT's pattern
const PAPER_SIZE = 286.432;
const PAPER_ROTATION = '-15deg';

const CTA_WIDTH = 312;
const CTA_HEIGHT = 56;
const CTA_BOTTOM_OFFSET = 73; // from Figma frame bottom

export default function WriteScreen({ navigation, route }) {
  const [text, setText] = useState('');
  const emotion = route?.params?.emotion;
  const discardedCount = route?.params?.discardedCount ?? 0;
  const insets = useSafeAreaInsets();
  const [frameWidth, setFrameWidth] = useState(REFERENCE_WIDTH);
  const scale = frameWidth / REFERENCE_WIDTH;

  const handleSubmit = () => {
    navigation.navigate('Animation', { text, emotion, discardedCount });
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right']}
      onLayout={(e) => setFrameWidth(e.nativeEvent.layout.width)}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
        <View style={styles.header}>
          <BackButton onPress={() => navigation.goBack()} arrowStyle={styles.backArrow} />
        </View>

        <View
          style={[
            styles.dateChip,
            {
              top: DATE_CHIP_TOP * scale,
              left: DATE_CHIP_LEFT * scale,
              width: DATE_CHIP_WIDTH * scale,
              height: DATE_CHIP_HEIGHT * scale,
            },
          ]}
        >
          <Text style={styles.dateText}>{formatKoreanDate()}</Text>
        </View>

        <Text style={[styles.title, { top: 156 * scale }]}>
          ‘{emotion?.label ?? '감정'}’의 이유는?
        </Text>

        <View
          style={[
            styles.paperWrapper,
            {
              top: PAPER_WRAPPER_TOP * scale,
              left: PAPER_WRAPPER_LEFT * scale,
              width: PAPER_WRAPPER_SIZE * scale,
              height: PAPER_WRAPPER_SIZE * scale,
            },
          ]}
        >
          <View
            style={[
              styles.paper,
              {
                width: PAPER_SIZE * scale,
                height: PAPER_SIZE * scale,
                transform: [{ rotate: PAPER_ROTATION }],
              },
            ]}
          >
            <Image source={paperTexture} style={styles.paperImage} resizeMode="cover" />
            <TextInput
              style={styles.input}
              placeholder="텍스트 작성"
              placeholderTextColor="#9E9E9E"
              multiline
              textAlignVertical="top"
              value={text}
              onChangeText={setText}
            />
          </View>
        </View>

        <View style={[styles.footer, { bottom: CTA_BOTTOM_OFFSET * scale }]}>
          <PrimaryButton
            title="다음"
            onPress={handleSubmit}
            style={{
              width: CTA_WIDTH * scale,
              height: CTA_HEIGHT * scale,
              backgroundColor: '#48FF00',
              borderRadius: 8,
            }}
            textStyle={styles.buttonText}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#021205',
  },
  keyboardView: {
    flex: 1,
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
  paperWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  paperImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  input: {
    flex: 1,
    zIndex: 1,
    color: '#2A2A2A',
    fontSize: 16,
    lineHeight: 22,
    padding: 20,
    outlineStyle: 'none',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  buttonText: {
    color: '#021205',
    fontSize: 20,
    fontWeight: '800',
  },
});
