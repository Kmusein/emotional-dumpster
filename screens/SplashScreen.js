import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import YeetLogo from '../components/YeetLogo';

const LOGO_VIEWBOX_WIDTH = 386.997;
const LOGO_FRAME_WIDTH = 390; // Figma reference frame width

export default function SplashScreen({ navigation }) {
  const [frameWidth, setFrameWidth] = useState(LOGO_FRAME_WIDTH);
  const logoWidth = frameWidth * (LOGO_VIEWBOX_WIDTH / LOGO_FRAME_WIDTH);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View
      style={styles.container}
      onLayout={(e) => setFrameWidth(e.nativeEvent.layout.width)}
    >
      <View style={styles.logoWrapper}>
        <YeetLogo width={logoWidth} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021205',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    transform: [{ rotate: '-11.72deg' }],
  },
});
