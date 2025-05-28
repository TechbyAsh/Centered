import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator, Alert } from 'react-native';
import styled from '@emotion/native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme/theme';

// Import components
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoSection from './components/PersonalInfoSection';
import AccountActionsSection from './components/AccountActionsSection';

const UserProfileScreen = ({ navigation }) => {
  const { userData, updateUserProfile, signOut, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: '',
    displayName: '',
    email: '',
    phone: '',
    preferences: {
      notifications: true,
      reminderFrequency: 'daily',
      theme: 'light',
      language: 'en',
    }
  });
  
  // Load user data when component mounts
  useEffect(() => {
    if (userData) {
      setProfileData({
        fullName: userData.name || '',
        displayName: userData.displayName || userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        preferences: userData.preferences || {
          notifications: true,
          reminderFrequency: 'daily',
          theme: 'light',
          language: 'en',
        }
      });
    }
  }, [userData]);
  
  // Handle profile updates
  const handleUpdateProfile = async (updates) => {
    if (updates.saveChanges) {
      try {
        setIsEditing(false);
        await updateUserProfile({
          name: profileData.fullName,
          displayName: profileData.displayName,
          phone: profileData.phone,
          preferences: profileData.preferences
        });
        Alert.alert('Success', 'Profile updated successfully');
      } catch (error) {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    } else {
      // Just update the local state
      setProfileData(prev => ({
        ...prev,
        ...updates
      }));
    }
  };
  
  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigate to the Auth screen after signing out
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };
  
  if (isLoading && !userData) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <LoadingText>Loading profile...</LoadingText>
      </LoadingContainer>
    );
  }
  
  return (
    <ScreenContainer>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeader 
          userData={profileData}
          onEditPress={() => setIsEditing(!isEditing)}
          isEditing={isEditing}
        />
        
        {/* Profile Information */}
        <SectionContainer>
          <PersonalInfoSection 
            userData={profileData}
            onUpdateProfile={handleUpdateProfile}
            isEditing={isEditing}
          />
          
          <SectionDivider />
          
          <AccountActionsSection onSignOut={handleSignOut} />
        </SectionContainer>
      </ScrollView>
    </ScreenContainer>
  );
};

// Styled Components
const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.background};
`;

const LoadingText = styled.Text`
  font-family: ${theme.fonts.body};
  font-size: 16px;
  color: ${theme.colors.text};
  margin-top: 16px;
`;

const SectionContainer = styled.View`
  margin: ${theme.spacing.lg}px;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.card}px;
  padding: ${theme.spacing.lg}px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 2;
`;

const SectionDivider = styled.View`
  height: 1px;
  background-color: ${theme.colors.border};
  margin: ${theme.spacing.lg}px 0;
`;

export default UserProfileScreen;
