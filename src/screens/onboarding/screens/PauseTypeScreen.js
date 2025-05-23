import React, { useState } from 'react';
import { View, ScrollView, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, ScreenContainer, ScreenTitle, ScreenDescription, ProgressBar } from '../../../components/shared/OnboardingComponents';
import { pauseTypeOptions } from '../screen.data';
import { theme } from '../../../theme/theme';

const PauseTypeScreen = () => {
  const { pausePreferences, updatePausePreferences, nextStep } = useOnboarding();
  const [showingPreview, setShowingPreview] = useState(null);

  // Toggle a pause type
  const togglePauseType = (type) => {
    const key = `include${type.charAt(0).toUpperCase() + type.slice(1)}`;
    updatePausePreferences({ [key]: !pausePreferences[key] });
  };

  // Show a preview of the pause type
  const showPreview = (type) => {
    setShowingPreview(type);
    // In a real app, this would show a modal or animation preview
    // For now, we'll just set a timeout to hide it after 5 seconds
    setTimeout(() => {
      setShowingPreview(null);
    }, 5000);
  };

  // Select all pause types
  const selectAll = () => {
    updatePausePreferences({
      includeBreathing: true,
      includeSoundscapes: true,
      includeMeditations: true,
      includeRituals: true,
    });
  };

  // Get the value of a pause type preference
  const getPauseTypeValue = (type) => {
    const key = `include${type.charAt(0).toUpperCase() + type.slice(1)}`;
    return pausePreferences[key];
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderContainer>
          <ScreenTitle>Pause Type Preferences</ScreenTitle>
          <ScreenDescription>
            Select the types of pause moments you'd like to experience. You can change these later in settings.
          </ScreenDescription>
          <ProgressBar currentStep={3} totalSteps={7} />
        </HeaderContainer>

        <SelectAllContainer>
          <SelectAllButton onPress={selectAll}>
            <SelectAllText>Select All</SelectAllText>
          </SelectAllButton>
        </SelectAllContainer>

        {pauseTypeOptions.map((option) => (
          <PauseTypeCard key={option.id}>
            <PauseTypeContent>
              <IconContainer>
                <Ionicons name={option.icon} size={24} color={theme.colors.primary} />
              </IconContainer>
              <TextContainer>
                <PauseTypeTitle>{option.title}</PauseTypeTitle>
                <PauseTypeDescription>{option.description}</PauseTypeDescription>
              </TextContainer>
              <Switch
                value={getPauseTypeValue(option.id)}
                onValueChange={() => togglePauseType(option.id)}
                trackColor={{ false: '#767577', true: theme.colors.primary }}
                thumbColor={getPauseTypeValue(option.id) ? theme.colors.white : '#f4f3f4'}
              />
            </PauseTypeContent>
            <PreviewButton 
              onPress={() => showPreview(option.id)}
              style={showingPreview === option.id ? styles.activePreview : {}}
            >
              <PreviewText>
                {showingPreview === option.id ? 'Previewing...' : 'Preview (5s)'}
              </PreviewText>
              {showingPreview === option.id ? (
                <Ionicons name="pause" size={16} color={theme.colors.primary} />
              ) : (
                <Ionicons name="play" size={16} color={theme.colors.primary} />
              )}
            </PreviewButton>
          </PauseTypeCard>
        ))}

        <ButtonContainer>
          <PrimaryButton title="Continue" onPress={nextStep} />
        </ButtonContainer>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  activePreview: {
    backgroundColor: `${theme.colors.primary}20`,
  },
});

// Styled Components
const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: ${theme.spacing.xl}px;
`;

const SelectAllContainer = styled.View`
  align-items: flex-end;
  margin-bottom: ${theme.spacing.md}px;
`;

const SelectAllButton = styled.TouchableOpacity`
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
`;

const SelectAllText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 14px;
  font-family: ${theme.fonts.body};
`;

const PauseTypeCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
  ${theme.shadows.small}
`;

const PauseTypeContent = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${theme.colors.secondary}40;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.md}px;
`;

const TextContainer = styled.View`
  flex: 1;
  margin-right: ${theme.spacing.md}px;
`;

const PauseTypeTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 4px;
  font-family: ${theme.fonts.heading};
`;

const PauseTypeDescription = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
  font-family: ${theme.fonts.body};
`;

const PreviewButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.small}px;
  border: 1px solid ${theme.colors.primary}40;
`;

const PreviewText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 14px;
  margin-right: ${theme.spacing.xs}px;
  font-family: ${theme.fonts.body};
`;

const ButtonContainer = styled.View`
  padding: ${theme.spacing.lg}px 0;
  margin-bottom: ${theme.spacing.xl}px;
`;

export default PauseTypeScreen;
