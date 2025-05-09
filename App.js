import React from 'react';
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

import { theme } from './src/infrastructure/theme/theme.index';
import { AppProvider } from './src/infrastructure/context/AppContext';
import { AppNavigator } from './src/infrastructure/navigation/app.navigator';

import { WelcomeScreen } from './src/screens/welcome';
import { RelaxScreen } from './src/screens/Relax-screen';
import { SleepScreen } from "./src/screens/Sleep-screen"
import { BreatheScreen } from './src/screens/Breathe-screen';
import { OnboardingScreen } from './src/screens/onboarding/onboarding-screen';

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

  React.useEffect(() => {
    if (fontsLoaded) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="dark" />
        <NavigationContainer>
          <HomeStack.Navigator  
            screenOptions={{
              headerShown: false,
              ...TransitionPresets.ModalSlideFromBottomIOS, 
              gestureEnabled: true,
            }}
          >
            <HomeStack.Screen name="Onboarding" component={OnboardingScreen}/>
            <HomeStack.Screen name="Welcome" component={WelcomeScreen}/>
            <HomeStack.Screen 
              name="App" 
              component={AppNavigator}
              options={{
                ...TransitionPresets.SlideFromRightIOS,
              }}
            />
            <HomeStack.Screen name="Breathe" component={BreatheScreen}/>
            <HomeStack.Screen name="Relax" component={RelaxScreen}/>
            <HomeStack.Screen name="Sleep" component={SleepScreen}/>
          </HomeStack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </AppProvider>
  );
}
