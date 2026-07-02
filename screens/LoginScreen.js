import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import FooterDisclaimer from '../components/FooterDisclaimer';

const REFERENCE_WIDTH = 390; // Figma frame width

const LOGO_VIEWBOX_WIDTH = 169.898;
const LOGO_VIEWBOX_HEIGHT = 60.6503;
const LOGO_CENTER_Y = 287 + 102.556 / 2; // rotated bounding-box center, from Figma frame top
const LOGO_ROTATION = '-15deg';

const BUTTON_WIDTH = 283;
const BUTTON_HEIGHT = 60;
const BUTTON_BOTTOM_OFFSET = 71; // from Figma frame bottom

const FOOTER_BOTTOM_OFFSET = 14; // tuned so FooterDisclaimer's own padding lands text at the Figma y

function YeetLogo({ width }) {
  const height = (width * LOGO_VIEWBOX_HEIGHT) / LOGO_VIEWBOX_WIDTH;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${LOGO_VIEWBOX_WIDTH} ${LOGO_VIEWBOX_HEIGHT}`} fill="none">
      <Path d="M160.416 0.000319149H169.571L168.018 44.6295H161.969L160.416 0.000319149ZM160.089 55.7459C160.089 53.0485 162.296 50.8416 164.993 50.8416C167.691 50.8416 169.898 53.0485 169.898 55.7459C169.898 58.4432 167.691 60.6502 164.993 60.6502C162.296 60.6502 160.089 58.4432 160.089 55.7459Z" fill="#48FF00" />
      <Path d="M126.151 60.1595V7.51997H115.525V4.60452e-05H145.114V7.51997H134.488V60.1595H126.151Z" fill="#48FF00" />
      <Path d="M81.3125 0H103.218V7.11124H89.6498V24.685H103.218V31.7962H89.6498V53.0482H103.218V60.1594H81.3125V0Z" fill="#48FF00" />
      <Path d="M44.4025 0.000239025H66.3083V7.11148H52.7398V24.6852H66.3083V31.7965H52.7398V53.0484H66.3083V60.1597H44.4025V0.000239025Z" fill="#48FF00" />
      <Path d="M2.53576e-06 0.000440515L8.746 0.000440515L15.2851 25.0941H15.4485L21.6607 0.000440515L29.998 0.000440515L19.372 35.8836L19.372 60.1599H11.0347V35.8836L2.53576e-06 0.000440515Z" fill="#48FF00" />
    </Svg>
  );
}

function GoogleLogo({ size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      <Path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <Path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <Path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <Path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </Svg>
  );
}

export default function LoginScreen({ navigation }) {
  const [frameWidth, setFrameWidth] = useState(REFERENCE_WIDTH);
  const scale = frameWidth / REFERENCE_WIDTH;

  const handleGoogleLogin = () => {
    navigation.replace('Home');
  };

  const buttonHeight = BUTTON_HEIGHT * scale;

  return (
    <View
      style={styles.screen}
      onLayout={(e) => setFrameWidth(e.nativeEvent.layout.width)}
    >
      <View
        style={[
          styles.logoLayer,
          { top: (LOGO_CENTER_Y - LOGO_VIEWBOX_HEIGHT / 2) * scale },
        ]}
      >
        <View style={{ transform: [{ rotate: LOGO_ROTATION }] }}>
          <YeetLogo width={LOGO_VIEWBOX_WIDTH * scale} />
        </View>
      </View>

      <View style={[styles.buttonLayer, { bottom: BUTTON_BOTTOM_OFFSET * scale }]}>
        <Pressable
          style={[
            styles.googleButton,
            {
              width: BUTTON_WIDTH * scale,
              height: buttonHeight,
              borderRadius: buttonHeight / 2,
            },
          ]}
          onPress={handleGoogleLogin}
        >
          <GoogleLogo size={buttonHeight * 0.4} />
          <Text style={styles.googleLabel}>구글로 계속하기</Text>
        </Pressable>
      </View>

      <View style={[styles.footerLayer, { bottom: FOOTER_BOTTOM_OFFSET * scale }]}>
        <FooterDisclaimer textStyle={styles.footerText} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#021205',
  },
  logoLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  buttonLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  footerLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F2',
    gap: 12,
  },
  googleLabel: {
    color: '#1F1F1F',
    fontSize: 16,
    fontWeight: '600',
  },
  footerText: {
    color: '#7D7D7D',
    fontWeight: '300',
  },
});
