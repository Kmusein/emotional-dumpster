import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterDisclaimer from '../components/FooterDisclaimer';
import { colors } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const handleGoogleLogin = () => {
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    position: 'relative',
  },
  logoLayer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: colors.headerPlaceholder,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonLayer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  footerLayer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
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
