import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, View, Text, StyleSheet, Image, SafeAreaView, Platform } from 'react-native';
import { DashboardScreen } from '../screens/Dashboard-screen';
import { SettingsScreen } from '../screens/Settings-screen';
import UserProfileScreen from '../screens/profile/UserProfileScreen';
import { theme } from '../theme/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import CustomModalDrawer from './CustomModalDrawer';

const Stack = createStackNavigator();

// Custom header with menu and profile buttons
const CustomHeader = ({ navigation, title, showMenu = true }) => {
  const { userData } = useAuth();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        {showMenu ? (
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setIsDrawerVisible(true)}
          >
            <Ionicons name="menu-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-outline" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}

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

        <CustomModalDrawer 
          isVisible={isDrawerVisible}
          onClose={() => setIsDrawerVisible(false)}
          navigation={navigation}
        />
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
        name="DashboardHome" 
        component={DashboardScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} title="Dashboard" showMenu={true} />,
        })}
      />
      <Stack.Screen 
        name="UserProfile" 
        component={UserProfileScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} title="My Profile" showMenu={false} />,
        })}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={({ navigation }) => ({
          header: () => <CustomHeader navigation={navigation} title="Settings" showMenu={false} />,
        })}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    flex: 1,
    fontFamily: theme.fonts.heading,
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
