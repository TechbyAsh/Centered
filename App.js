import 'react-native-gesture-handler';
import './polyfills';
import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Reanimated 2',
  '[react-native-gesture-handler]',
  'Non-serializable values were found in the navigation state',
]);
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/native';
import { useFonts, PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import { Poppins_400Regular } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Theme
import { theme as appTheme } from './src/infrastructure/theme/theme.index';
import { theme as pauseTheme } from './src/theme/theme';

// Context
import { AppProvider } from './src/infrastructure/context/AppContext';
import { OnboardingProvider } from './src/context/OnboardingContext';
import { AuthProvider, BYPASS_AUTH } from './src/context/AuthContext';
import { CalendarAuthProvider } from './src/components/CalendarAuthProvider';
import { CalendarManagerProvider } from './src/services/calendar/CalendarManager';
import { AppNavigator } from './src/infrastructure/navigation/app.navigator';

// Screens
import { WelcomeScreen } from './src/screens/welcome';
import { RelaxScreen } from './src/screens/Relax-screen';
import { SleepScreen } from "./src/screens/Sleep-screen"
import { BreatheScreen } from './src/screens/Breathe-screen';
import OnboardingContainer from './src/screens/onboarding/OnboardingContainer';
import AuthContainer from './src/screens/auth/AuthContainer';

const HomeStack = createStackNavigator();

const WelcomeText = styled.Text`
  font-family: ${props => props.theme.fonts.heading};
  font-weight: ${props => props.theme.fontWeights.bold}; 
  color: ${props => props.theme.colors.secondary};
`;

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    Poppins_400Regular,
  });
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(BYPASS_AUTH);
  const [loading, setLoading] = useState(true);

  // Check if onboarding has been completed and if user is authenticated
  useEffect(() => {
    const checkAppStatus = async () => {
      try {
        // Check onboarding status
        const onboardingStatus = await AsyncStorage.getItem('@PauseApp:onboarding');
        if (onboardingStatus) {
          const { completed } = JSON.parse(onboardingStatus);
          setOnboardingCompleted(completed);
        }
        
        // Only check authentication if not bypassing
        if (!BYPASS_AUTH) {
          const authToken = await AsyncStorage.getItem('@PauseApp:authToken');
          setIsAuthenticated(!!authToken);
        }
        
        // TEMPORARY: For testing, uncomment these lines to reset app state
        /*
        await AsyncStorage.removeItem('@PauseApp:onboarding');
        await AsyncStorage.removeItem('@PauseApp:authToken');
        await AsyncStorage.removeItem('@PauseApp:userData');
        setOnboardingCompleted(false);
        setIsAuthenticated(false);
        */
        
      } catch (error) {
        console.error('Failed to check app status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAppStatus();
  }, []);

  // Hide splash screen once fonts are loaded and onboarding status is checked
  useEffect(() => {
    if (fontsLoaded && !loading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loading]);

  if (!fontsLoaded || loading) {
    return null;
  }

  // Combine the themes
  const combinedTheme = { ...appTheme, ...pauseTheme };

  // Determine initial route based on onboarding and authentication status
  const getInitialRouteName = () => {
    if (!onboardingCompleted) {
      return 'Onboarding';
    } else if (!BYPASS_AUTH && !isAuthenticated) {
      return 'Auth';
    } else {
      return 'App';
    }
  };

  return (
    <NavigationContainer>
      <ThemeProvider theme={appTheme}>
        <AppProvider>
          <OnboardingProvider>
            <AuthProvider>
              <CalendarManagerProvider>
                <CalendarAuthProvider>
                  <HomeStack.Navigator
                    screenOptions={{
                      ...TransitionPresets.SlideFromRightIOS,
                      headerShown: false
                    }}
                    initialRouteName={getInitialRouteName()}
                  >
                    <HomeStack.Screen name="Onboarding" component={OnboardingContainer} />
                    <HomeStack.Screen name="Auth" component={AuthContainer} />
                    <HomeStack.Screen name="App" component={AppNavigator} />
                    <HomeStack.Screen name="Breathe" component={BreatheScreen} />
                    <HomeStack.Screen name="Relax" component={RelaxScreen} />
                    <HomeStack.Screen name="Sleep" component={SleepScreen} />
                  </HomeStack.Navigator>
                </CalendarAuthProvider>
              </CalendarManagerProvider>
            </AuthProvider>
          </OnboardingProvider>
        </AppProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}
