import React, { useCallback, useEffect, useState } from 'react';
import { View, LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Animated: `useNativeDriver`',
]);

const originalWarn = console.warn;
console.warn = (...args) => {
  const msg = args[0];
  if (typeof msg === 'string' && msg.includes('checkout-static-next.razorpay.com')) return;
  if (typeof msg === 'string' && msg.includes('useNativeDriver')) return;
  originalWarn(...args);
};
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { 
  Poppins_300Light, 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_600SemiBold, 
  Poppins_700Bold, 
  Poppins_800ExtraBold, 
  Poppins_900Black 
} from '@expo-google-fonts/poppins';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

import StartupLoader from './src/components/StartupLoader';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          Poppins_300Light,
          Poppins_400Regular,
          Poppins_500Medium,
          Poppins_600SemiBold,
          Poppins_700Bold,
          Poppins_800ExtraBold,
          Poppins_900Black,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <AuthProvider>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <AppNavigator />
      </View>
    </AuthProvider>
  );
}
