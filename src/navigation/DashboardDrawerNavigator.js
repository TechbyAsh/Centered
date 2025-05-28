import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { DashboardScreen } from '../screens/Dashboard-screen';
import { SettingsScreen } from '../screens/Settings-screen';
import UserProfileScreen from '../screens/profile/UserProfileScreen';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const Stack = createStackNavigator();

// Custom header with profile button
const CustomHeader = ({ navigation, title }) => {
  const { userData } = useAuth();
  
  return (
    <SafeAreaView>
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>{title}</Text>
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={() => navigation.navigate('UserProfile')}
      >
        {userData?.avatarUrl ? (
          <Image source={{ uri: userData.avatarUrl }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person-circle" size={30} color={theme.colors.primary} />
        )}
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

export const DashboardDrawerNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontFamily: theme.fonts.heading,
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} title="Dashboard" />,
        })}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={{
          title: 'Profile',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontFamily: theme.fonts.heading,
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});
