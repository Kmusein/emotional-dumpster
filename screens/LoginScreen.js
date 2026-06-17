import { Pressable, StyleSheet, Text, View } from 'react-native';
import FooterDisclaimer from '../components/FooterDisclaimer';
import { colors } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const handleGoogleLogin = () => {
    navigation.replace('Home');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.logoLayer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>로고</Text>
        </View>
      </View>

      <View style={styles.buttonLayer}>
        <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleLabel}>구글로 계속하기</Text>
        </Pressable>
      </View>

      <View style={styles.footerLayer}>
        <FooterDisclaimer />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#2F2F2F',
  },
  logoLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  logoPlaceholder: {
    width: 140,
    height: 140,
    backgroundColor: colors.headerPlaceholder,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: '#2F2F2F',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonLayer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  footerLayer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    zIndex: 2,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.text,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
  },
  googleLabel: {
    color: colors.cardText,
    fontSize: 16,
    fontWeight: '600',
  },
});
