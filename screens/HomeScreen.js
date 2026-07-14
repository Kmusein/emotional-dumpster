import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import FooterDisclaimer from '../components/FooterDisclaimer';
import PrimaryButton from '../components/PrimaryButton';
import TrashIllustration from '../components/TrashIllustration';
import YeetLogo from '../components/YeetLogo';
import { getEmotionRecordCount } from '../utils/emotionStorage';

const REFERENCE_WIDTH = 390; // Figma frame width

const MINI_LOGO_WIDTH = 50.0526;
const MINI_LOGO_HEIGHT = 17.8679;
const MINI_LOGO_ROTATION = '-11.72deg';

const TRASH_VIEWBOX_WIDTH = 290.195;
const TRASH_LEFT = 45.76;
const TRASH_TOP = 207;

const CHIP_WIDTH = 230;
const CHIP_HEIGHT = 36;
const CHIP_TOP = 546;
const CHIP_LEFT = (REFERENCE_WIDTH - CHIP_WIDTH) / 2; // 80, matches Figma x

const CTA_WIDTH = 312;
const CTA_HEIGHT = 56;
const CTA_BOTTOM_OFFSET = 73; // from Figma frame bottom

const FOOTER_BOTTOM_OFFSET = 14; // tuned so FooterDisclaimer's own padding lands text at the Figma y

function CalendarIcon({ size, color = '#BBD2B2' }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        fill={color}
        d="M5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V20C21 20.55 20.8042 21.0208 20.4125 21.4125C20.0208 21.8042 19.55 22 19 22H5ZM5 20H19V10H5V20ZM5 8H19V6H5V8ZM12 14C11.7167 14 11.4792 13.9042 11.2875 13.7125C11.0958 13.5208 11 13.2833 11 13C11 12.7167 11.0958 12.4792 11.2875 12.2875C11.4792 12.0958 11.7167 12 12 12C12.2833 12 12.5208 12.0958 12.7125 12.2875C12.9042 12.4792 13 12.7167 13 13C13 13.2833 12.9042 13.5208 12.7125 13.7125C12.5208 13.9042 12.2833 14 12 14ZM7.2875 13.7125C7.09583 13.5208 7 13.2833 7 13C7 12.7167 7.09583 12.4792 7.2875 12.2875C7.47917 12.0958 7.71667 12 8 12C8.28333 12 8.52083 12.0958 8.7125 12.2875C8.90417 12.4792 9 12.7167 9 13C9 13.2833 8.90417 13.5208 8.7125 13.7125C8.52083 13.9042 8.28333 14 8 14C7.71667 14 7.47917 13.9042 7.2875 13.7125ZM16 14C15.7167 14 15.4792 13.9042 15.2875 13.7125C15.0958 13.5208 15 13.2833 15 13C15 12.7167 15.0958 12.4792 15.2875 12.2875C15.4792 12.0958 15.7167 12 16 12C16.2833 12 16.5208 12.0958 16.7125 12.2875C16.9042 12.4792 17 12.7167 17 13C17 13.2833 16.9042 13.5208 16.7125 13.7125C16.5208 13.9042 16.2833 14 16 14ZM12 18C11.7167 18 11.4792 17.9042 11.2875 17.7125C11.0958 17.5208 11 17.2833 11 17C11 16.7167 11.0958 16.4792 11.2875 16.2875C11.4792 16.0958 11.7167 16 12 16C12.2833 16 12.5208 16.0958 12.7125 16.2875C12.9042 16.4792 13 16.7167 13 17C13 17.2833 12.9042 17.5208 12.7125 17.7125C12.5208 17.9042 12.2833 18 12 18ZM7.2875 17.7125C7.09583 17.5208 7 17.2833 7 17C7 16.7167 7.09583 16.4792 7.2875 16.2875C7.47917 16.0958 7.71667 16 8 16C8.28333 16 8.52083 16.0958 8.7125 16.2875C8.90417 16.4792 9 16.7167 9 17C9 17.2833 8.90417 17.5208 8.7125 17.7125C8.52083 17.9042 8.28333 18 8 18C7.71667 18 7.47917 17.9042 7.2875 17.7125ZM16 18C15.7167 18 15.4792 17.9042 15.2875 17.7125C15.0958 17.5208 15 17.2833 15 17C15 16.7167 15.0958 16.4792 15.2875 16.2875C15.4792 16.0958 15.7167 16 16 16C16.2833 16 16.5208 16.0958 16.7125 16.2875C16.9042 16.4792 17 16.7167 17 17C17 17.2833 16.9042 17.5208 16.7125 17.7125C16.5208 17.9042 16.2833 18 16 18Z"
      />
    </Svg>
  );
}

export default function HomeScreen({ navigation, route }) {
  // Route param gives an instant optimistic count right after a throw;
  // the focus effect below then corrects it to the real Supabase total
  // (needed on fresh loads/logins, where no param is passed at all).
  const [discardedCount, setDiscardedCount] = useState(route?.params?.discardedCount ?? 0);
  const [frameWidth, setFrameWidth] = useState(REFERENCE_WIDTH);
  const scale = frameWidth / REFERENCE_WIDTH;

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getEmotionRecordCount().then((count) => {
        if (isActive) setDiscardedCount(count);
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      onLayout={(e) => setFrameWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.header}>
        <View style={{ transform: [{ rotate: MINI_LOGO_ROTATION }] }}>
          <YeetLogo width={MINI_LOGO_WIDTH * scale} />
        </View>
        <Pressable
          style={styles.calendarButton}
          onPress={() => navigation.navigate('Calendar')}
          hitSlop={8}
        >
          <CalendarIcon size={24 * scale} />
        </Pressable>
      </View>

      <View style={[styles.trashLayer, { left: TRASH_LEFT * scale, top: TRASH_TOP * scale }]}>
        <TrashIllustration width={TRASH_VIEWBOX_WIDTH * scale} />
      </View>

      <View
        style={[
          styles.chip,
          {
            top: CHIP_TOP * scale,
            left: CHIP_LEFT * scale,
            width: CHIP_WIDTH * scale,
            height: CHIP_HEIGHT * scale,
          },
        ]}
      >
        <Text style={styles.chipText}>{discardedCount}번의 YEET</Text>
      </View>

      <PrimaryButton
        title="오늘의 감정 던지기"
        onPress={() => navigation.navigate('EmotionSelect', { discardedCount })}
        style={[
          styles.ctaButton,
          {
            bottom: CTA_BOTTOM_OFFSET * scale,
            width: CTA_WIDTH * scale,
            height: CTA_HEIGHT * scale,
          },
        ]}
        textStyle={styles.ctaText}
      />

      <View style={[styles.footerLayer, { bottom: FOOTER_BOTTOM_OFFSET * scale }]}>
        <FooterDisclaimer
          text="YEET!에 작성된 일기는 던지는 순간 사라져요."
          textStyle={styles.footerText}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#021205',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 56,
  },
  calendarButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trashLayer: {
    position: 'absolute',
  },
  chip: {
    position: 'absolute',
    backgroundColor: '#222222',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
  },
  ctaButton: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#48FF00',
    borderRadius: 8,
  },
  ctaText: {
    color: '#021205',
    fontSize: 20,
    fontWeight: '800',
  },
  footerLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  footerText: {
    color: '#7D7D7D',
    fontWeight: '300',
  },
});
