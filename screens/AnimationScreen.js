import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CrumpledPaper from '../components/CrumpledPaper';
import TrashCanShape from '../components/TrashCanShape';
import { colors } from '../constants/theme';

const CRUMPLE_DURATION = 1500;
const THROW_DURATION = 1500;

export default function AnimationScreen({ navigation, route }) {
  const emotion = route?.params?.emotion;
  const discardedCount = route?.params?.discardedCount ?? 0;
  const [phase, setPhase] = useState('crumple');

  const paperScale = useRef(new Animated.Value(1)).current;
  const paperRotate = useRef(new Animated.Value(0)).current;
  const paperTranslateY = useRef(new Animated.Value(0)).current;
  const trashCanOpacity = useRef(new Animated.Value(0)).current;

  const paperRotation = paperRotate.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '-12deg', '-28deg'],
  });

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(paperScale, {
          toValue: 0.52,
          duration: CRUMPLE_DURATION,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(paperRotate, {
          toValue: 1,
          duration: CRUMPLE_DURATION,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(trashCanOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(paperTranslateY, {
          toValue: 130,
          duration: THROW_DURATION,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(paperScale, {
          toValue: 0.32,
          duration: THROW_DURATION,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]);

    const phaseTimer = setTimeout(() => setPhase('throw'), CRUMPLE_DURATION);

    animation.start(({ finished }) => {
      if (finished) {
        navigation.replace('PositiveEmotion', { discardedCount, negativeEmotion: emotion });
      }
    });

    return () => {
      clearTimeout(phaseTimer);
      animation.stop();
    };
  }, [navigation, paperRotate, paperScale, paperTranslateY, trashCanOpacity]);

  const instructionText =
    phase === 'crumple'
      ? '종이 안에 부정 감정을 넣고 구기는 모션'
      : '구긴 종이가 쓰레기통으로 들어가는 모션';

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.instruction}>{instructionText}</Text>

      <View style={styles.stage}>
        <Animated.View style={[styles.trashCanWrapper, { opacity: trashCanOpacity }]}>
          <TrashCanShape width={240} height={190} />
        </Animated.View>

        <Animated.View
          style={[
            styles.paperWrapper,
            {
              transform: [
                { translateY: paperTranslateY },
                { scale: paperScale },
                { rotate: paperRotation },
              ],
            },
          ]}
        >
          <CrumpledPaper emoji={emotion?.emoji} size="large" />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  instruction: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    lineHeight: 38,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashCanWrapper: {
    position: 'absolute',
    bottom: '20%',
    alignItems: 'center',
  },
  paperWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
  },
});
