import React, { useState } from 'react';
import { View, ScrollView, Switch } from 'react-native';
import Slider from '@react-native-community/slider';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, ScreenContainer, ScreenTitle, ScreenDescription, ProgressBar } from '../../../components/shared/OnboardingComponents';
import { notificationOptions } from '../screen.data';
import { theme } from '../../../theme/theme';

const NotificationScreen = () => {
  const { notificationPreferences, updateNotificationPreferences, nextStep } = useOnboarding();
  const [blackoutPeriod, setBlackoutPeriod] = useState({
    startTime: '22:00',
    endTime: '07:00',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6], // All days selected by default
  });

  // Toggle a notification type
  const toggleNotificationType = (type) => {
    const key = `enable${type.charAt(0).toUpperCase() + type.slice(1)}`;
    updateNotificationPreferences({ [key]: !notificationPreferences[key] });
  };

  // Update frequency
  const updateFrequency = (value) => {
    updateNotificationPreferences({ frequency: value });
  };

  // Get the value of a notification type preference
  const getNotificationTypeValue = (type) => {
    const key = `enable${type.charAt(0).toUpperCase() + type.slice(1)}`;
    return notificationPreferences[key];
  };

  // Update blackout period
  const updateBlackoutPeriod = (field, value) => {
    const updatedBlackout = { ...blackoutPeriod, [field]: value };
    setBlackoutPeriod(updatedBlackout);
    
    // Update in context
    const updatedBlackoutPeriods = notificationPreferences.blackoutPeriods.map((period, index) => {
      if (index === 0) {
        return updatedBlackout;
      }
      return period;
    });
    
    if (updatedBlackoutPeriods.length === 0) {
      updateNotificationPreferences({ blackoutPeriods: [updatedBlackout] });
    } else {
      updateNotificationPreferences({ blackoutPeriods: updatedBlackoutPeriods });
    }
  };

  // Toggle a day in the blackout period
  const toggleBlackoutDay = (dayIndex) => {
    const currentDays = [...blackoutPeriod.daysOfWeek];
    const dayPosition = currentDays.indexOf(dayIndex);
    
    if (dayPosition > -1) {
      currentDays.splice(dayPosition, 1);
    } else {
      currentDays.push(dayIndex);
    }
    
    updateBlackoutPeriod('daysOfWeek', currentDays);
  };

  // Check if a day is selected in the blackout period
  const isDaySelected = (dayIndex) => {
    return blackoutPeriod.daysOfWeek.includes(dayIndex);
  };

  // Get day abbreviation
  const getDayAbbreviation = (dayIndex) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days[dayIndex];
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderContainer>
          <ScreenTitle>Notification Preferences</ScreenTitle>
          <ScreenDescription>
            Customize how and when you'd like to receive reminders for your pause moments.
          </ScreenDescription>
          <ProgressBar currentStep={4} totalSteps={7} />
        </HeaderContainer>

        <SectionContainer>
          <SectionTitle>Notification Types</SectionTitle>
          
          {notificationOptions.map((option) => (
            <NotificationOption key={option.id}>
              <OptionContent>
                <IconContainer>
                  <Ionicons name={option.icon} size={24} color={theme.colors.primary} />
                </IconContainer>
                <TextContainer>
                  <OptionTitle>{option.title}</OptionTitle>
                  <OptionDescription>{option.description}</OptionDescription>
                </TextContainer>
                <Switch
                  value={getNotificationTypeValue(option.id)}
                  onValueChange={() => toggleNotificationType(option.id)}
                  trackColor={{ false: '#767577', true: theme.colors.primary }}
                  thumbColor={getNotificationTypeValue(option.id) ? theme.colors.white : '#f4f3f4'}
                />
              </OptionContent>
            </NotificationOption>
          ))}
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>Frequency</SectionTitle>
          <FrequencyContainer>
            <FrequencyLabel>Less Frequent</FrequencyLabel>
            <Slider
              style={{ flex: 1, height: 40 }}
              minimumValue={1}
              maximumValue={10}
              step={1}
              value={notificationPreferences.frequency}
              onValueChange={updateFrequency}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.border}
              thumbTintColor={theme.colors.primary}
            />
            <FrequencyLabel>More Frequent</FrequencyLabel>
          </FrequencyContainer>
          <FrequencyValue>
            {notificationPreferences.frequency}/10
          </FrequencyValue>
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>Do Not Disturb</SectionTitle>
          <BlackoutContainer>
            <BlackoutRow>
              <BlackoutLabel>Start Time</BlackoutLabel>
              <TimeSelector>
                {['20:00', '21:00', '22:00', '23:00'].map((time) => (
                  <TimeOption
                    key={`blackout-start-${time}`}
                    selected={blackoutPeriod.startTime === time}
                    onPress={() => updateBlackoutPeriod('startTime', time)}
                  >
                    <TimeOptionText selected={blackoutPeriod.startTime === time}>
                      {time}
                    </TimeOptionText>
                  </TimeOption>
                ))}
              </TimeSelector>
            </BlackoutRow>
            
            <BlackoutRow>
              <BlackoutLabel>End Time</BlackoutLabel>
              <TimeSelector>
                {['06:00', '07:00', '08:00', '09:00'].map((time) => (
                  <TimeOption
                    key={`blackout-end-${time}`}
                    selected={blackoutPeriod.endTime === time}
                    onPress={() => updateBlackoutPeriod('endTime', time)}
                  >
                    <TimeOptionText selected={blackoutPeriod.endTime === time}>
                      {time}
                    </TimeOptionText>
                  </TimeOption>
                ))}
              </TimeSelector>
            </BlackoutRow>
            
            <BlackoutRow>
              <BlackoutLabel>Days</BlackoutLabel>
              <DaysContainer>
                {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                  <DayOption
                    key={`day-${dayIndex}`}
                    selected={isDaySelected(dayIndex)}
                    onPress={() => toggleBlackoutDay(dayIndex)}
                  >
                    <DayText selected={isDaySelected(dayIndex)}>
                      {getDayAbbreviation(dayIndex)}
                    </DayText>
                  </DayOption>
                ))}
              </DaysContainer>
            </BlackoutRow>
          </BlackoutContainer>
        </SectionContainer>

        <InfoContainer>
          <InfoIcon>
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
          </InfoIcon>
          <InfoText>
            You'll be asked to grant notification permissions in the next step. You can always adjust these settings later.
          </InfoText>
        </InfoContainer>

        <ButtonContainer>
          <PrimaryButton title="Continue" onPress={nextStep} />
        </ButtonContainer>
      </ScrollView>
    </ScreenContainer>
  );
};

// Styled Components
const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: ${theme.spacing.xl}px;
`;

const SectionContainer = styled.View`
  margin-bottom: ${theme.spacing.xl}px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md}px;
  font-family: ${theme.fonts.heading};
`;

const NotificationOption = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
  ${theme.shadows.small}
`;

const OptionContent = styled.View`
  flex-direction: row;
  align-items: center;
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

const OptionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 4px;
  font-family: ${theme.fonts.heading};
`;

const OptionDescription = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  opacity: 0.7;
  font-family: ${theme.fonts.body};
`;

const FrequencyContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.sm}px;
`;

const FrequencyLabel = styled.Text`
  font-size: 12px;
  color: ${theme.colors.text};
  opacity: 0.7;
  width: 80px;
  font-family: ${theme.fonts.body};
`;

const FrequencyValue = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.primary};
  text-align: center;
  font-family: ${theme.fonts.heading};
`;

const BlackoutContainer = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium}px;
  padding: ${theme.spacing.md}px;
  ${theme.shadows.small}
`;

const BlackoutRow = styled.View`
  margin-bottom: ${theme.spacing.md}px;
`;

const BlackoutLabel = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm}px;
  font-family: ${theme.fonts.body};
`;

const TimeSelector = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: -4px;
`;

const TimeOption = styled.TouchableOpacity`
  background-color: ${props => props.selected ? theme.colors.primary : theme.colors.secondary};
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.medium}px;
  margin: 4px;
`;

const TimeOptionText = styled.Text`
  color: ${props => props.selected ? theme.colors.white : theme.colors.text};
  font-size: 14px;
  font-family: ${theme.fonts.body};
`;

const DaysContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const DayOption = styled.TouchableOpacity`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${props => props.selected ? theme.colors.primary : theme.colors.secondary};
  align-items: center;
  justify-content: center;
  margin: 0 2px;
`;

const DayText = styled.Text`
  color: ${props => props.selected ? theme.colors.white : theme.colors.text};
  font-size: 14px;
  font-weight: 600;
  font-family: ${theme.fonts.body};
`;

const InfoContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.secondary}40;
  border-radius: ${theme.borderRadius.medium}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.xl}px;
`;

const InfoIcon = styled.View`
  margin-right: ${theme.spacing.sm}px;
`;

const InfoText = styled.Text`
  flex: 1;
  font-size: 14px;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.body};
`;

const ButtonContainer = styled.View`
  padding: ${theme.spacing.lg}px 0;
  margin-bottom: ${theme.spacing.xl}px;
`;

export default NotificationScreen;
