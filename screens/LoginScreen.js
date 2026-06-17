import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterDisclaimer from '../components/FooterDisclaimer';
import { colors } from '../constants/theme';

export default function LoginScreen({ navigation }) {
  const handleGoogleLogin = () => {
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>로고</Text>
        </View>

        <View style={styles.buttonWrapper}>
          <Pressable style={styles.googleButton} onPress={handleGoogleLogin}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleLabel}>구글로 계속하기</Text>
          </Pressable>
        </View>

        <View style={styles.footerWrapper}>
          <FooterDisclaimer />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
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
  buttonWrapper: {
    position: 'absolute',
    bottom: 48,
    left: 32,
    right: 32,
  },
  footerWrapper: {
    position: 'absolute',
    bottom: 0,
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
