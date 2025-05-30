import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { BreatheScreen } from '../../screens/Breathe-screen';
import { RelaxScreen } from '../../screens/Relax-screen';
import { MeditationScreen } from '../../screens/Meditation-screen';
import { RitualsScreen } from '../../screens/Rituals-screen';
import { RitualSessionScreen } from '../../screens/RitualSession-screen';
import { SettingsScreen } from '../../screens/Settings-screen';
import { TransitionsScreen } from '../../screens/transitions/Transitions-screen';
import { DashboardDrawerNavigator } from '../../navigation/DashboardDrawerNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BreatheStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="BreatheMain" component={BreatheScreen} />
  </Stack.Navigator>
);

const RelaxStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RelaxMain" component={RelaxScreen} />
  </Stack.Navigator>
);

const MeditationStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MeditationMain" component={MeditationScreen} />
  </Stack.Navigator>
);

const RitualsStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RitualsMain" component={RitualsScreen} />
    <Stack.Screen name="RitualSession" component={RitualSessionScreen} />
  </Stack.Navigator>
);

const DashboardStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardMain" component={DashboardDrawerNavigator} />
  </Stack.Navigator>
);

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Breathe') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Relax') {
            iconName = focused ? 'moon' : 'moon-outline';
          } else if (route.name === 'Meditate') {
            iconName = focused ? 'flower' : 'flower-outline';
          } else if (route.name === 'Rituals') {
            iconName = focused ? 'water' : 'water-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#00A896',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Breathe" component={BreatheStack} />
      <Tab.Screen name="Relax" component={RelaxStack} />
      <Tab.Screen name="Meditate" component={MeditationStack} />
      <Tab.Screen name="Rituals" component={RitualsStack} />
      <Tab.Screen 
        name="Transitions" 
        component={TransitionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};
