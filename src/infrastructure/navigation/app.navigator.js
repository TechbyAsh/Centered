import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../../screens/Dashboard-screen';
import { BreatheScreen } from '../../screens/Breathe-screen';
import { RelaxScreen } from '../../screens/Relax-screen';

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
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Breathe" component={BreatheStack} />
      <Tab.Screen name="Relax" component={RelaxStack} />
    </Tab.Navigator>
  );
};
