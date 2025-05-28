import React from 'react';
import { Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styled from '@emotion/native';
import { theme } from '../../../theme/theme';

const AccountActionsSection = ({ onSignOut }) => {
  const navigation = useNavigation();
  
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
            // Call the parent component's onSignOut function
            await onSignOut();
            
            // Also handle navigation directly if needed
            // This ensures navigation works even if the parent's navigation fails
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };
  
  // Handle account deletion
  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // This would be replaced with actual account deletion logic
            Alert.alert('Feature Coming Soon', 'Account deletion will be available in a future update.');
          },
        },
      ]
    );
  };
  
  return (
    <Container>
      <SectionTitle>Account Actions</SectionTitle>
      
      <SignOutButton onPress={handleSignOut}>
        <SignOutButtonText>Sign Out</SignOutButtonText>
        <Ionicons name="log-out-outline" size={24} color={theme.colors.white} />
      </SignOutButton>
      
      <ActionButton onPress={handleDeleteAccount}>
        <ActionIcon>
          <Ionicons name="trash-outline" size={24} color={theme.colors.error} />
        </ActionIcon>
        <ActionTextDanger>Delete Account</ActionTextDanger>
        <ActionArrow>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </ActionArrow>
      </ActionButton>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  margin-top: ${theme.spacing.md}px;
`;

const SectionTitle = styled.Text`
  font-family: ${theme.fonts.heading};
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md}px;
`;

const SignOutButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${theme.colors.primary};
  padding: ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.button}px;
  margin-bottom: ${theme.spacing.md}px;
`;

const SignOutButtonText = styled.Text`
  font-family: ${theme.fonts.body};
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.white};
  margin-right: ${theme.spacing.sm}px;
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.md}px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

const ActionIcon = styled.View`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
  margin-right: ${theme.spacing.md}px;
`;

const ActionText = styled.Text`
  font-family: ${theme.fonts.body};
  font-size: 16px;
  color: ${theme.colors.text};
  flex: 1;
`;

const ActionTextDanger = styled.Text`
  font-family: ${theme.fonts.body};
  font-size: 16px;
  color: ${theme.colors.error};
  flex: 1;
`;

const ActionArrow = styled.View`
  width: 20px;
  align-items: flex-end;
`;

export default AccountActionsSection;
