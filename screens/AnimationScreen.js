import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, PanResponder, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrashIllustration from '../components/TrashIllustration';

const paperCrumpledTexture = require('../assets/images/paper-crumpled.png');
const paperBall = require('../assets/images/paper-ball.png');

const CRUMPLE_DURATION = 1500;
const MIN_THROW_DURATION = 420; // full pull — fast, forceful
const MAX_THROW_DURATION = 780; // no pull / tap — still clearly visible
const FALLBACK_DELAY = 4000; // auto-throw if the user never drags

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
const READY_SCALE = 0.52;
const PULL_SCALE_SHRINK = 0.12; // extra squeeze as the player pulls back

// Pull range, in the 390-wide reference frame. Downward pull gets much more
// room than sideways/up — dragging the paper further down reads more like a
// slingshot windup and keeps the trajectory into the can readable.
const MAX_PULL_X = 90;
const MAX_PULL_UP = 90;
const MAX_PULL_DOWN = 240;

function clampPull(dx, dy, scaleFactor) {
  const maxX = MAX_PULL_X * scaleFactor;
  const maxUp = MAX_PULL_UP * scaleFactor;
  const maxDown = MAX_PULL_DOWN * scaleFactor;
  const x = Math.max(-maxX, Math.min(maxX, dx));
  const y = dy >= 0 ? Math.min(dy, maxDown) : Math.max(dy, -maxUp);
  const normX = x / maxX;
  const normY = y >= 0 ? y / maxDown : y / maxUp;
  const ratio = Math.min(1, Math.hypot(normX, normY));
  return { x, y, ratio };
}

export default function AnimationScreen({ navigation, route }) {
  const emotion = route?.params?.emotion;
  const discardedCount = route?.params?.discardedCount ?? 0;
  const [frameWidth, setFrameWidth] = useState(REFERENCE_WIDTH);
  const [frameHeight, setFrameHeight] = useState(0);
  const scale = frameWidth / REFERENCE_WIDTH;
  const [phase, setPhase] = useState('crumple');
  const [showHint, setShowHint] = useState(false);

  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const dragOffset = useRef({ x: 0, y: 0 });
  const fallbackTimer = useRef(null);
  const hasLaunched = useRef(false);
  const hintLoop = useRef(null);

  const paperScale = useRef(new Animated.Value(1)).current;
  const paperRotate = useRef(new Animated.Value(0)).current;
  const paperTranslateX = useRef(new Animated.Value(0)).current;
  const paperTranslateY = useRef(new Animated.Value(0)).current;
  const trashCanOpacity = useRef(new Animated.Value(0)).current;
  const hintBounce = useRef(new Animated.Value(0)).current;

  const paperRotation = paperRotate.interpolate({
    inputRange: [0, 0.5, 1, 1.7],
    outputRange: ['0deg', '-12deg', '-28deg', '-75deg'],
  });
  const hintArrowTranslateY = hintBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  const stopHint = () => {
    setShowHint(false);
    hintLoop.current?.stop();
  };

  const launchThrow = (dx, dy) => {
    if (hasLaunched.current || !frameHeight) return;
    hasLaunched.current = true;
    clearTimeout(fallbackTimer.current);
    stopHint();
    setPhase('throw');

    const { x: pullX, y: pullY, ratio: pullRatio } = clampPull(dx, dy, scale);
    const duration = MAX_THROW_DURATION - pullRatio * (MAX_THROW_DURATION - MIN_THROW_DURATION);

    const openingX = (TRASH_LEFT + OPENING_X_FRACTION * TRASH_VIEWBOX_WIDTH) * scale;
    const openingY = (TRASH_TOP + OPENING_Y_FRACTION * TRASH_VIEWBOX_HEIGHT) * scale;
    const throwTargetX = openingX - frameWidth / 2;
    const throwTargetY = openingY - frameHeight / 2;

    // Fly from wherever the player pulled it back to, toward the can's
    // opening — the pull only controls how forceful the release feels.
    paperTranslateX.setValue(pullX);
    paperTranslateY.setValue(pullY);
    paperScale.setValue(READY_SCALE - pullRatio * PULL_SCALE_SHRINK);

    Animated.parallel([
      Animated.timing(trashCanOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(paperTranslateX, {
        toValue: throwTargetX,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(paperTranslateY, {
        toValue: throwTargetY,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(paperRotate, {
        toValue: 1 + pullRatio * 0.7,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(paperScale, {
        toValue: 0.25 - pullRatio * 0.1,
        duration,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        navigation.replace('PositiveEmotion', { discardedCount, negativeEmotion: emotion });
      }
    });
  };

  // The PanResponder instance is created once, so its handlers must read
  // scale/launchThrow through this ref rather than closing over them —
  // otherwise they'd stay stuck on the values from the very first render
  // (frameHeight still 0), and every release would silently no-op.
  const latest = useRef({ scale, launchThrow });
  latest.current = { scale, launchThrow };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => phaseRef.current === 'ready',
      onMoveShouldSetPanResponder: () => phaseRef.current === 'ready',
      onPanResponderGrant: () => {
        clearTimeout(fallbackTimer.current);
        stopHint();
      },
      onPanResponderMove: (_evt, gestureState) => {
        const { x, y, ratio: pullRatio } = clampPull(
          gestureState.dx,
          gestureState.dy,
          latest.current.scale
        );
        dragOffset.current = { x, y };
        paperTranslateX.setValue(x);
        paperTranslateY.setValue(y);
        paperScale.setValue(READY_SCALE - pullRatio * PULL_SCALE_SHRINK);
      },
      onPanResponderRelease: () => {
        latest.current.launchThrow(dragOffset.current.x, dragOffset.current.y);
      },
      onPanResponderTerminate: () => {
        latest.current.launchThrow(dragOffset.current.x, dragOffset.current.y);
      },
    })
  ).current;

  useEffect(() => {
    const crumpleAnimation = Animated.parallel([
      Animated.timing(paperScale, {
        toValue: READY_SCALE,
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
    ]);

    crumpleAnimation.start(({ finished }) => {
      if (!finished) return;
      setPhase('ready');
      setShowHint(true);
      Animated.timing(trashCanOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
      hintLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(hintBounce, {
            toValue: 1,
            duration: 550,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(hintBounce, {
            toValue: 0,
            duration: 550,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
      hintLoop.current.start();
      fallbackTimer.current = setTimeout(() => latest.current.launchThrow(0, 0), FALLBACK_DELAY);
    });

    return () => {
      crumpleAnimation.stop();
      hintLoop.current?.stop();
      clearTimeout(fallbackTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          {...panResponder.panHandlers}
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

        {showHint ? (
          <View style={styles.hintContainer} pointerEvents="none">
            <Text style={styles.hintText}>드래그해서 던져주세요</Text>
            <Animated.Text
              style={[styles.hintArrow, { transform: [{ translateY: hintArrowTranslateY }] }]}
            >
              ↓
            </Animated.Text>
          </View>
        ) : null}
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
  hintContainer: {
    position: 'absolute',
    bottom: 90,
    alignItems: 'center',
  },
  hintText: {
    color: '#BBD2B2',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  hintArrow: {
    color: '#BBD2B2',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
});
