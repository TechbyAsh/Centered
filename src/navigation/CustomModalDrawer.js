import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  SafeAreaView,
  TouchableWithoutFeedback,
  Image,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

const APP_VERSION = '1.0.0'; // TODO: Get this from app config

const CustomModalDrawer = ({ isVisible, onClose, navigation }) => {
  const { userData, signOut } = useAuth();
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    if (isVisible) {
      // Animate drawer in
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 90,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate drawer out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleNavigate = (screenName) => {
    onClose();
    // Add a small delay to ensure smooth animation
    setTimeout(() => {
      navigation.navigate(screenName);
    }, 300);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            onClose();
            await signOut();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]} />
        </TouchableWithoutFeedback>

        {/* Drawer Content */}
        <Animated.View
          style={[
            styles.drawer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.drawerContent}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                {userData?.avatarUrl ? (
                  <Image 
                    source={{ uri: userData.avatarUrl }} 
                    style={styles.avatar}
                  />
                ) : (
                  <Ionicons 
                    name="person-circle" 
                    size={80} 
                    color={theme.colors.primary} 
                  />
                )}
              </View>
              <Text style={styles.userName}>
                {userData?.displayName || userData?.name || 'User'}
              </Text>
              <Text style={styles.userEmail}>{userData?.email || ''}</Text>
              <TouchableOpacity
                style={styles.viewProfileButton}
                onPress={() => handleNavigate('UserProfile')}
              >
                <Text style={styles.viewProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <View style={styles.menuItems}>
              <TouchableOpacity
                style={[styles.menuItem, activeItem === 'Dashboard' && styles.menuItemActive]}
                onPress={() => handleNavigate('Dashboard')}
                onPressIn={() => setActiveItem('Dashboard')}
                onPressOut={() => setActiveItem(null)}
              >
                <Ionicons 
                  name="home-outline" 
                  size={24} 
                  color={activeItem === 'Dashboard' ? theme.colors.primary : theme.colors.text} 
                />
                <Text style={[styles.menuItemText, activeItem === 'Dashboard' && styles.menuItemTextActive]}>Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, activeItem === 'Breathe' && styles.menuItemActive]}
                onPress={() => handleNavigate('Breathe')}
                onPressIn={() => setActiveItem('Breathe')}
                onPressOut={() => setActiveItem(null)}
              >
                <Ionicons 
                  name="leaf-outline" 
                  size={24} 
                  color={activeItem === 'Breathe' ? theme.colors.primary : theme.colors.text} 
                />
                <Text style={[styles.menuItemText, activeItem === 'Breathe' && styles.menuItemTextActive]}>Breathing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, activeItem === 'Relax' && styles.menuItemActive]}
                onPress={() => handleNavigate('Relax')}
                onPressIn={() => setActiveItem('Relax')}
                onPressOut={() => setActiveItem(null)}
              >
                <Ionicons 
                  name="water-outline" 
                  size={24} 
                  color={activeItem === 'Relax' ? theme.colors.primary : theme.colors.text} 
                />
                <Text style={[styles.menuItemText, activeItem === 'Relax' && styles.menuItemTextActive]}>Relaxation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, activeItem === 'Meditate' && styles.menuItemActive]}
                onPress={() => handleNavigate('Meditate')}
                onPressIn={() => setActiveItem('Meditate')}
                onPressOut={() => setActiveItem(null)}
              >
                <Ionicons 
                  name="flower-outline" 
                  size={24} 
                  color={activeItem === 'Meditate' ? theme.colors.primary : theme.colors.text} 
                />
                <Text style={[styles.menuItemText, activeItem === 'Meditate' && styles.menuItemTextActive]}>Meditation</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, activeItem === 'Rituals' && styles.menuItemActive]}
                onPress={() => handleNavigate('Rituals')}
                onPressIn={() => setActiveItem('Rituals')}
                onPressOut={() => setActiveItem(null)}
              >
                <Ionicons 
                  name="sunny-outline" 
                  size={24} 
                  color={activeItem === 'Rituals' ? theme.colors.primary : theme.colors.text} 
                />
                <Text style={[styles.menuItemText, activeItem === 'Rituals' && styles.menuItemTextActive]}>Rest Rituals</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, activeItem === 'Settings' && styles.menuItemActive]}
                onPress={() => handleNavigate('Settings')}
                onPressIn={() => setActiveItem('Settings')}
                onPressOut={() => setActiveItem(null)}
              >
                <Ionicons 
                  name="settings-outline" 
                  size={24} 
                  color={activeItem === 'Settings' ? theme.colors.primary : theme.colors.text} 
                />
                <Text style={[styles.menuItemText, activeItem === 'Settings' && styles.menuItemTextActive]}>Settings</Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Section with Sign Out */}
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={[styles.signOutButton, activeItem === 'SignOut' && styles.signOutButtonActive]}
                onPress={handleSignOut}
                onPressIn={() => setActiveItem('SignOut')}
                onPressOut={() => setActiveItem(null)}
              >
                <Ionicons 
                  name="log-out-outline" 
                  size={24} 
                  color={activeItem === 'SignOut' ? theme.colors.errorDark : theme.colors.error} 
                />
                <Text style={[styles.signOutText, activeItem === 'SignOut' && styles.signOutTextActive]}>Sign Out</Text>
              </TouchableOpacity>
              <Text style={styles.versionText}>Version {APP_VERSION}</Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: theme.colors.background,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  drawerContent: {
    flex: 1,
  },
  profileSection: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userName: {
    fontFamily: theme.fonts.heading,
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: theme.fonts.body,
    fontSize: 14,
    color: theme.colors.text,
    opacity: 0.7,
    marginBottom: 12,
  },
  viewProfileButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.button,
  },
  viewProfileText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.body,
    fontSize: 14,
    fontWeight: '600',
  },
  menuItems: {
    paddingTop: theme.spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    paddingLeft: theme.spacing.lg,
    borderRadius: theme.borderRadius.sm,
    marginHorizontal: theme.spacing.sm,
  },
  menuItemActive: {
    backgroundColor: theme.colors.primaryLight,
  },
  menuItemText: {
    fontFamily: theme.fonts.body,
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  menuItemTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  bottomSection: {
    marginTop: 'auto',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  signOutButtonActive: {
    backgroundColor: theme.colors.errorLight,
  },
  signOutText: {
    fontFamily: theme.fonts.body,
    fontSize: 16,
    color: theme.colors.error,
    marginLeft: theme.spacing.sm,
  },
  signOutTextActive: {
    color: theme.colors.errorDark,
    fontWeight: '600',
  },
  versionText: {
    fontFamily: theme.fonts.body,
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});

export default CustomModalDrawer;
