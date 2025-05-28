import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { theme } from '../theme/theme';

const CustomDrawerContent = (props) => {
    const { userData, signOut } = useAuth();
    
    // Handle sign out
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
                        await signOut();
                        // Navigate to the Auth screen after signing out
                        props.navigation.reset({
                            index: 0,
                            routes: [{ name: 'Auth' }],
                        });
                    },
                },
            ]
        );
    };
    
    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.userSection}>
                <View style={styles.avatarContainer}>
                    {userData?.avatarUrl ? (
                        <Image source={{ uri: userData.avatarUrl }} style={styles.avatarImage} />
                    ) : (
                        <Ionicons name="person-circle" size={80} color={theme.colors.primary} />
                    )}
                </View>
                <Text style={styles.userName}>{userData?.displayName || userData?.name || 'User'}</Text>
                <Text style={styles.userEmail}>{userData?.email || ''}</Text>
                <TouchableOpacity 
                    style={styles.viewProfileButton}
                    onPress={() => props.navigation.navigate('UserProfile')}
                >
                    <Text style={styles.viewProfileText}>View Profile</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.drawerItemsContainer}>
                <DrawerItemList {...props} />
            </View>
            
            <View style={styles.bottomSection}>
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    userSection: {
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
        shadowColor: theme.colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    avatarImage: {
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
        padding: 8,
        paddingHorizontal: 16,
        borderRadius: theme.borderRadius.button,
    },
    viewProfileText: {
        color: theme.colors.white,
        fontFamily: theme.fonts.body,
        fontSize: 14,
        fontWeight: '600',
    },
    drawerItemsContainer: {
        flex: 1,
        paddingTop: theme.spacing.md,
    },
    bottomSection: {
        padding: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.sm,
    },
    signOutText: {
        fontFamily: theme.fonts.body,
        fontSize: 16,
        color: theme.colors.error,
        marginLeft: theme.spacing.sm,
    },
});

export default CustomDrawerContent;
