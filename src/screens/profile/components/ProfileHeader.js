import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styled from '@emotion/native';
import { theme } from '../../../theme/theme';

const ProfileHeader = ({ userData, onEditPress, isEditing }) => {
  return (
    <Container>
      <UserAvatar>
        {userData?.avatarUrl ? (
          <AvatarImage source={{ uri: userData.avatarUrl }} />
        ) : (
          <Ionicons name="person-circle" size={80} color={theme.colors.primary} />
        )}
      </UserAvatar>
      <UserNameDisplay>{userData?.displayName || userData?.name || 'User'}</UserNameDisplay>
      <UserEmailDisplay>{userData?.email || ''}</UserEmailDisplay>
      <EditButton onPress={onEditPress}>
        <EditButtonText>{isEditing ? 'Cancel' : 'Edit Profile'}</EditButtonText>
      </EditButton>
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  align-items: center;
  padding: ${theme.spacing.xl}px;
  background-color: ${theme.colors.white};
`;

const UserAvatar = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${theme.colors.secondary};
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const AvatarImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
`;

const UserNameDisplay = styled.Text`
  font-family: ${theme.fonts.heading};
  font-size: 24px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;

const UserEmailDisplay = styled.Text`
  font-family: ${theme.fonts.body};
  font-size: 16px;
  color: ${theme.colors.text};
  opacity: 0.7;
  margin-bottom: 16px;
`;

const EditButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.button}px;
`;

const EditButtonText = styled.Text`
  color: ${theme.colors.white};
  font-family: ${theme.fonts.body};
  font-size: 14px;
  font-weight: 600;
`;

export default ProfileHeader;
