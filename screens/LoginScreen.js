import { useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import FooterDisclaimer from '../components/FooterDisclaimer';
import YeetLogo from '../components/YeetLogo';
import { supabase } from '../lib/supabase';

const REFERENCE_WIDTH = 390; // Figma frame width

const LOGO_VIEWBOX_WIDTH = 169.898;
const LOGO_VIEWBOX_HEIGHT = 60.6503;
const LOGO_CENTER_Y = 287 + 102.556 / 2; // rotated bounding-box center, from Figma frame top
const LOGO_ROTATION = '-15deg';

const BUTTON_WIDTH = 283;
const BUTTON_HEIGHT = 60;
const BUTTON_BOTTOM_OFFSET = 71; // from Figma frame bottom

const FOOTER_BOTTOM_OFFSET = 14; // tuned so FooterDisclaimer's own padding lands text at the Figma y

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

export default function LoginScreen() {
  const [frameWidth, setFrameWidth] = useState(REFERENCE_WIDTH);
  const [loading, setLoading] = useState(false);
  const scale = frameWidth / REFERENCE_WIDTH;

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        ...(Platform.OS === 'web' ? { redirectTo: window.location.origin } : null),
        queryParams: { prompt: 'select_account' },
      },
    });
    if (error) {
      console.error('Google 로그인 실패:', error.message);
      setLoading(false);
    }
    // On success (web), the browser redirects to Google, so loading stays true
    // until the page unloads. App.js picks up the resulting session afterwards.
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
            loading && styles.googleButtonDisabled,
            {
              width: BUTTON_WIDTH * scale,
              height: buttonHeight,
              borderRadius: buttonHeight / 2,
            },
          ]}
          onPress={handleGoogleLogin}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#1F1F1F" />
              <Text style={styles.googleLabel}>로그인 중...</Text>
            </>
          ) : (
            <>
              <GoogleLogo size={buttonHeight * 0.4} />
              <Text style={styles.googleLabel}>구글로 계속하기</Text>
            </>
          )}
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
  googleButtonDisabled: {
    opacity: 0.7,
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
