import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const LOGO_VIEWBOX_WIDTH = 386.997;
const LOGO_VIEWBOX_HEIGHT = 138.151;
const LOGO_ASPECT_RATIO = LOGO_VIEWBOX_WIDTH / LOGO_VIEWBOX_HEIGHT;
const LOGO_FRAME_WIDTH = 390; // Figma reference frame width

function YeetLogo({ width }) {
  const height = width / LOGO_ASPECT_RATIO;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${LOGO_VIEWBOX_WIDTH} ${LOGO_VIEWBOX_HEIGHT}`} fill="none">
      <Path d="M365.4 0.000885428L386.253 0.000885428L382.715 101.658H368.937L365.4 0.000885428ZM364.655 126.98C364.655 120.835 369.682 115.808 375.826 115.808C381.97 115.808 386.997 120.835 386.997 126.98C386.997 133.124 381.97 138.151 375.826 138.151C369.682 138.151 364.655 133.124 364.655 126.98Z" fill="#48FF00" />
      <Path d="M287.35 137.033V17.1292H263.146V0.000145397L330.545 0.000145397V17.1292H306.341V137.033H287.35Z" fill="#48FF00" />
      <Path d="M185.216 8.13093e-05L235.114 8.13093e-05V16.1982L204.207 16.1982V56.2282H235.114V72.4264H204.207V120.835H235.114V137.033H185.216V8.13093e-05Z" fill="#48FF00" />
      <Path d="M101.141 0.000532032L151.039 0.000532032V16.1987L120.132 16.1987V56.2287H151.039V72.4268H120.132V120.835H151.039V137.033H101.141V0.000532032Z" fill="#48FF00" />
      <Path d="M0 0.000671971L19.9219 0.000671971L34.8167 57.1597H35.1891L49.3392 0.000671971L68.3302 0.000671971L44.126 81.7362V137.033H25.1351V81.7362L0 0.000671971Z" fill="#48FF00" />
    </Svg>
  );
}

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
