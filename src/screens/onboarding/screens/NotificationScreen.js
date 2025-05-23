import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Switch, Animated, Easing } from 'react-native';
import Slider from '@react-native-community/slider';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, TextButton } from '../../../components/shared/OnboardingComponents';
import { notificationOptions } from '../screen.data';
import { theme } from '../../../theme/theme';

const NotificationScreen = () => {
  const { notificationPreferences, updateNotificationPreferences, nextStep, prevStep } = useOnboarding();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Run animations on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animation.timing.standard,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: theme.animation.timing.standard,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
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
      <BackgroundGradient
        colors={[theme.colors.secondary + '30', theme.colors.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.6 }}
      />

      <HeaderContainer>
        <NavigationRow>
          <BackButton onPress={prevStep}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
          </BackButton>
          <ProgressContainer>
            <ProgressDot active={false} />
            <ProgressDot active={false} />
            <ProgressDot active={false} />
            <ProgressDot active={false} />
            <ProgressDot active={true} />
            <ProgressDot active={false} />
            <ProgressDot active={false} />
          </ProgressContainer>
          <SkipButton>
            <TextButton title="Skip" onPress={nextStep} />
          </SkipButton>
        </NavigationRow>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            width: '100%',
          }}
        >
          <TitleContainer>
            <ScreenTitle>Notification Preferences</ScreenTitle>
            <ScreenDescription>
              Customize how and when you'd like to receive reminders for your pause moments.
            </ScreenDescription>
          </TitleContainer>
        </Animated.View>
      </HeaderContainer>

      <ContentScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

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

      </ContentScrollView>

      <ButtonContainer>
        <PrimaryButton title="Continue" onPress={nextStep} />
      </ButtonContainer>
    </ScreenContainer>
  );
};

// Styled Components
const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${theme.colors.background};
  position: relative;
`;

const BackgroundGradient = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const HeaderContainer = styled.View`
  padding: 50px ${theme.spacing.screenHorizontal}px 20px;
  width: 100%;
`;

const NavigationRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const SkipButton = styled.View`
  width: 40px;
`;

const ProgressContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ProgressDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.active ? theme.colors.primary : theme.colors.border};
  margin: 0 4px;
  opacity: ${props => props.active ? 1 : 0.5};
`;

const TitleContainer = styled.View`
  align-items: center;
  margin-bottom: 32px;
`;

const ContentScrollView = styled.ScrollView`
  flex: 1;
`;

const ScreenTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 12px;
  font-family: ${theme.fonts.heading};
`;

const ScreenDescription = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.colors.text};
  opacity: 0.7;
  text-align: center;
  line-height: 24px;
  font-family: ${theme.fonts.body};
`;

const SectionContainer = styled.View`
  margin: 0 ${theme.spacing.screenHorizontal}px ${theme.spacing.xl}px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md}px;
  font-family: ${theme.fonts.heading};
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const NotificationOption = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 10px;
  elevation: 2;
`;

const OptionContent = styled.View`
  flex-direction: row;
  align-items: center;
`;

const IconContainer = styled.View`
  width: 44px;
  height: 44px;
  border-radius: 22px;
  background-color: ${theme.colors.secondary}40;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.md}px;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 1;
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
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 10px;
  elevation: 2;
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
  background-color: ${props => props.selected ? theme.colors.primary : theme.colors.secondary + '40'};
  padding: 8px 16px;
  border-radius: ${theme.borderRadius.button}px;
  margin: 4px;
  shadow-color: ${props => props.selected ? theme.colors.primary : 'transparent'};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: ${props => props.selected ? 2 : 0};
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
  background-color: ${props => props.selected ? theme.colors.primary : theme.colors.secondary + '40'};
  align-items: center;
  justify-content: center;
  margin: 0 2px;
  shadow-color: ${props => props.selected ? theme.colors.primary : 'transparent'};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: ${props => props.selected ? 2 : 0};
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
  margin: 0 ${theme.spacing.screenHorizontal}px ${theme.spacing.xl}px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 1px;
  shadow-opacity: 0.05;
  shadow-radius: 5px;
  elevation: 1;
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
  padding: 20px ${theme.spacing.screenHorizontal}px;
  background-color: ${theme.colors.background};
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export default NotificationScreen;
