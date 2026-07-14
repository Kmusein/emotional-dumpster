import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrashIllustration from '../components/TrashIllustration';

const paperCrumpledTexture = require('../assets/images/paper-crumpled.png');
const paperBall = require('../assets/images/paper-ball.png');

const CRUMPLE_DURATION = 1500;
const THROW_DURATION = 480;

const REFERENCE_WIDTH = 390; // Figma frame width

const TRASH_VIEWBOX_WIDTH = 290.195;
const TRASH_VIEWBOX_HEIGHT = 325.713;
const TRASH_LEFT = 45.76;
const TRASH_TOP = 207;

// Center of the top-rim ellipse in TrashIllustration's viewBox, as a fraction
// of the illustration's box — used to aim the throw at the can's opening.
const OPENING_X_FRACTION = 129.18 / TRASH_VIEWBOX_WIDTH;
const OPENING_Y_FRACTION = 83.9254 / TRASH_VIEWBOX_HEIGHT;

const PAPER_SIZE = 220;
const PAPER_ROTATION = '-15deg';

export default function AnimationScreen({ navigation, route }) {
  const emotion = route?.params?.emotion;
  const discardedCount = route?.params?.discardedCount ?? 0;
  const [frameWidth, setFrameWidth] = useState(REFERENCE_WIDTH);
  const [frameHeight, setFrameHeight] = useState(0);
  const scale = frameWidth / REFERENCE_WIDTH;
  const [phase, setPhase] = useState('crumple');

  const paperScale = useRef(new Animated.Value(1)).current;
  const paperRotate = useRef(new Animated.Value(0)).current;
  const paperTranslateX = useRef(new Animated.Value(0)).current;
  const paperTranslateY = useRef(new Animated.Value(0)).current;
  const trashCanOpacity = useRef(new Animated.Value(0)).current;

  const paperRotation = paperRotate.interpolate({
    inputRange: [0, 0.5, 1, 1.7],
    outputRange: ['0deg', '-12deg', '-28deg', '-75deg'],
  });

  useEffect(() => {
    // Wait for real layout so the throw target below is measured against the
    // actual screen, not the fallback reference size.
    if (!frameHeight) return undefined;

    // Aim the throw at the trash can's opening (the top-rim ellipse in
    // TrashIllustration), not just straight down from the paper's start point.
    const openingX = (TRASH_LEFT + OPENING_X_FRACTION * TRASH_VIEWBOX_WIDTH) * scale;
    const openingY = (TRASH_TOP + OPENING_Y_FRACTION * TRASH_VIEWBOX_HEIGHT) * scale;
    const throwTargetX = openingX - frameWidth / 2;
    const throwTargetY = openingY - frameHeight / 2;

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
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(paperTranslateX, {
          toValue: throwTargetX,
          duration: THROW_DURATION,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(paperTranslateY, {
          toValue: throwTargetY,
          duration: THROW_DURATION,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(paperRotate, {
          toValue: 1.7,
          duration: THROW_DURATION,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(paperScale, {
          toValue: 0.15,
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
  }, [
    navigation,
    discardedCount,
    emotion,
    frameWidth,
    frameHeight,
    scale,
    paperRotate,
    paperScale,
    paperTranslateX,
    paperTranslateY,
    trashCanOpacity,
  ]);

  return (
    <SafeAreaView
      style={styles.safeArea}
      onLayout={(e) => {
        setFrameWidth(e.nativeEvent.layout.width);
        setFrameHeight(e.nativeEvent.layout.height);
      }}
    >
      <View
        style={[styles.trashLayer, { left: TRASH_LEFT * scale, top: TRASH_TOP * scale }]}
      >
        <Animated.View style={{ opacity: trashCanOpacity }}>
          <TrashIllustration width={TRASH_VIEWBOX_WIDTH * scale} />
        </Animated.View>
      </View>

      <View style={styles.stage}>
        <Animated.View
          style={[
            styles.paperWrapper,
            {
              width: PAPER_SIZE * scale,
              height: PAPER_SIZE * scale,
              transform: [
                { translateX: paperTranslateX },
                { translateY: paperTranslateY },
                { scale: paperScale },
                { rotate: paperRotation },
              ],
            },
          ]}
        >
          {phase === 'crumple' ? (
            <View style={[styles.paper, { transform: [{ rotate: PAPER_ROTATION }] }]}>
              <Image source={paperCrumpledTexture} style={styles.paperImage} resizeMode="cover" />
            </View>
          ) : (
            <Image source={paperBall} style={styles.paperBallImage} resizeMode="contain" />
          )}
          {emotion?.emoji ? <Text style={styles.emoji}>{emotion.emoji}</Text> : null}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#021205',
  },
  trashLayer: {
    position: 'absolute',
  },
  stage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paperWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 4,
    overflow: 'hidden',
  },
  paperImage: {
    ...StyleSheet.absoluteFillObject,
  },
  paperBallImage: {
    ...StyleSheet.absoluteFillObject,
  },
  emoji: {
    fontSize: 64,
    position: 'absolute',
  },
});
