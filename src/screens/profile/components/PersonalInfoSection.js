import React from 'react';
import { View } from 'react-native';
import styled from '@emotion/native';
import { theme } from '../../../theme/theme';

const PersonalInfoSection = ({ userData, onUpdateProfile, isEditing }) => {
  return (
    <Container>
      <SectionTitle>Personal Information</SectionTitle>
      
      <InputContainer>
        <InputLabel>Full Name</InputLabel>
        <StyledInput
          value={userData.fullName}
          onChangeText={(text) => onUpdateProfile({ fullName: text })}
          editable={isEditing}
          placeholder="Enter your full name"
        />
      </InputContainer>
      
      <InputContainer>
        <InputLabel>Display Name</InputLabel>
        <StyledInput
          value={userData.displayName}
          onChangeText={(text) => onUpdateProfile({ displayName: text })}
          editable={isEditing}
          placeholder="Enter your display name"
        />
      </InputContainer>
      
      <InputContainer>
        <InputLabel>Email</InputLabel>
        <StyledInput
          value={userData.email}
          editable={false}
          style={{ opacity: 0.7 }}
        />
      </InputContainer>
      
      <InputContainer>
        <InputLabel>Phone Number (Optional)</InputLabel>
        <StyledInput
          value={userData.phone}
          onChangeText={(text) => onUpdateProfile({ phone: text })}
          editable={isEditing}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </InputContainer>
      
      {isEditing && (
        <SaveButton onPress={() => onUpdateProfile({ saveChanges: true })}>
          <SaveButtonText>Save Changes</SaveButtonText>
        </SaveButton>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`;

const SectionTitle = styled.Text`
  font-family: ${theme.fonts.heading};
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md}px;
`;

const InputContainer = styled.View`
  margin-bottom: ${theme.spacing.md}px;
`;

const InputLabel = styled.Text`
  font-family: ${theme.fonts.body};
  font-size: 14px;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;

const StyledInput = styled.TextInput`
  background-color: ${theme.colors.background};
  padding: 12px;
  border-radius: ${theme.borderRadius.small}px;
  font-family: ${theme.fonts.body};
  font-size: 16px;
  color: ${theme.colors.text};
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${theme.colors.primary};
  padding: 16px;
  border-radius: ${theme.borderRadius.button}px;
  align-items: center;
  margin-top: ${theme.spacing.md}px;
`;

const SaveButtonText = styled.Text`
  color: ${theme.colors.white};
  font-family: ${theme.fonts.body};
  font-size: 16px;
  font-weight: 600;
`;

export default PersonalInfoSection;
