import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, StyleSheet, View } from 'react-native';
import { colors } from './constants/theme';
import { supabase } from './lib/supabase';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import EmotionSelectScreen from './screens/EmotionSelectScreen';
import WriteScreen from './screens/WriteScreen';
import AnimationScreen from './screens/AnimationScreen';
import PositiveEmotionScreen from './screens/PositiveEmotionScreen';
import CompleteScreen from './screens/CompleteScreen';
import CalendarScreen from './screens/CalendarScreen';

const Stack = createNativeStackNavigator();

const appTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.background,
    primary: colors.button,
  },
};

const WEB_FRAME_MAX_WIDTH = 390;
const WEB_OUTER_BACKGROUND = '#1a1a1a';

function AppShell({ children }) {
  if (Platform.OS !== 'web') {
    return children;
  }

  return (
    <View style={styles.webOuter}>
      <View style={styles.webInner}>{children}</View>
    </View>
  );
}

export default function App() {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Only react to a session becoming available (fresh sign-in, or the
      // initial check on app load/OAuth redirect) - ignore background events
      // like TOKEN_REFRESHED so an active session doesn't yank the user back
      // to Home mid-flow.
      if (event !== 'SIGNED_IN' && event !== 'INITIAL_SESSION') return;
      if (!session) return;
      if (!navigationRef.isReady()) return;

      navigationRef.reset({ index: 0, routes: [{ name: 'Home' }] });
    });

    return () => subscription.unsubscribe();
  }, [navigationRef]);

  return (
    <AppShell>
      <NavigationContainer ref={navigationRef} theme={appTheme}>
        <StatusBar style="light" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EmotionSelect" component={EmotionSelectScreen} />
          <Stack.Screen name="Write" component={WriteScreen} />
          <Stack.Screen name="Animation" component={AnimationScreen} />
          <Stack.Screen name="PositiveEmotion" component={PositiveEmotionScreen} />
          <Stack.Screen name="Complete" component={CompleteScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  webOuter: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    backgroundColor: WEB_OUTER_BACKGROUND,
    alignItems: 'center',
  },
  webInner: {
    flex: 1,
    width: '100%',
    maxWidth: WEB_FRAME_MAX_WIDTH,
    backgroundColor: colors.background,
  },
});
