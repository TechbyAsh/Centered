import React, { useState } from 'react';
import { View, ScrollView, Switch, SafeAreaView } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';

const TimeSelector = ({ label, value, onChange, options }) => {
  const theme = useTheme();
  
  return (
    <TimeSelectorContainer>
      <TimeSelectorLabel>{label}</TimeSelectorLabel>
      <TimeOptionsContainer>
        {options.map((time) => (
          <TimeOption 
            key={time} 
            isSelected={time === value}
            onPress={() => onChange(time)}
          >
            <TimeOptionText isSelected={time === value}>
              {time}
            </TimeOptionText>
          </TimeOption>
        ))}
      </TimeOptionsContainer>
    </TimeSelectorContainer>
  );
};

const PreferenceOption = ({ icon, title, description, value, onToggle }) => {
  const theme = useTheme();
  
  return (
    <PreferenceOptionContainer onPress={onToggle}>
      <IconContainer>
        <Ionicons name={icon} size={24} color={theme.colors.primary} />
      </IconContainer>
      <PreferenceContent>
        <PreferenceTitle>{title}</PreferenceTitle>
        <PreferenceDescription>{description}</PreferenceDescription>
      </PreferenceContent>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#767577', true: theme.colors.primary }}
      />
    </PreferenceOptionContainer>
  );
};

const PreferenceSetup = ({ onComplete }) => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    schedule: {
      workStart: '09:00',
      workEnd: '17:00',
      lunchTime: '12:30',
    },
    pauseTypes: {
      breathing: true,
      sounds: true,
      meditation: false,
      rituals: false,
    },
    notifications: {
      haptics: true,
      sound: true,
      reminders: true,
    }
  });

  const updateSchedule = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      schedule: { ...prev.schedule, [key]: value }
    }));
  };

  const togglePauseType = (type) => {
    setPreferences(prev => ({
      ...prev,
      pauseTypes: { ...prev.pauseTypes, [type]: !prev.pauseTypes[type] }
    }));
  };

  const toggleNotification = (type) => {
    setPreferences(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [type]: !prev.notifications[type] }
    }));
  };

  const ScheduleStep = () => (
    <StepContainer>
      <StepTitle>Your Daily Schedule</StepTitle>
      <StepDescription>Help us suggest the perfect moments for your mindful breaks</StepDescription>
      
      <TimeSelector
        label="Work Start Time"
        value={preferences.schedule.workStart}
        onChange={(time) => updateSchedule('workStart', time)}
        options={['08:00', '08:30', '09:00', '09:30', '10:00']}
      />
      
      <TimeSelector
        label="Work End Time"
        value={preferences.schedule.workEnd}
        onChange={(time) => updateSchedule('workEnd', time)}
        options={['16:00', '16:30', '17:00', '17:30', '18:00']}
      />
      
      <TimeSelector
        label="Lunch Break"
        value={preferences.schedule.lunchTime}
        onChange={(time) => updateSchedule('lunchTime', time)}
        options={['12:00', '12:30', '13:00', '13:30']}
      />
      
      <NextButton onPress={() => setCurrentStep(1)}>
        <ButtonText>Next</ButtonText>
      </NextButton>
    </StepContainer>
  );

  const PauseTypesStep = () => (
    <StepContainer>
      <StepTitle>Your Pause Preferences</StepTitle>
      <StepDescription>Choose how you'd like to spend your mindful breaks</StepDescription>
      
      <PreferenceOption
        icon="leaf-outline"
        title="Breathing Exercises"
        description="Guided breathing with visual cues"
        value={preferences.pauseTypes.breathing}
        onToggle={() => togglePauseType('breathing')}
      />
      
      <PreferenceOption
        icon="musical-notes-outline"
        title="Soundscapes"
        description="Nature sounds and ambient music"
        value={preferences.pauseTypes.sounds}
        onToggle={() => togglePauseType('sounds')}
      />
      
      <PreferenceOption
        icon="moon-outline"
        title="Mini Meditations"
        description="Short guided meditation sessions"
        value={preferences.pauseTypes.meditation}
        onToggle={() => togglePauseType('meditation')}
      />
      
      <PreferenceOption
        icon="repeat-outline"
        title="Rest Rituals"
        description="Customized relaxation sequences"
        value={preferences.pauseTypes.rituals}
        onToggle={() => togglePauseType('rituals')}
      />
      
      <NextButton onPress={() => setCurrentStep(2)}>
        <ButtonText>Next</ButtonText>
      </NextButton>
    </StepContainer>
  );

  const NotificationsStep = () => (
    <StepContainer>
      <StepTitle>Gentle Reminders</StepTitle>
      <StepDescription>Customize how you'd like to be reminded to take breaks</StepDescription>
      
      <PreferenceOption
        icon="notifications-outline"
        title="Sound Notifications"
        description="Soft audio reminders"
        value={preferences.notifications.sound}
        onToggle={() => toggleNotification('sound')}
      />
      
      <PreferenceOption
        icon="phone-portrait-outline"
        title="Haptic Feedback"
        description="Gentle vibration reminders"
        value={preferences.notifications.haptics}
        onToggle={() => toggleNotification('haptics')}
      />
      
      <PreferenceOption
        icon="time-outline"
        title="Smart Reminders"
        description="AI-powered break suggestions"
        value={preferences.notifications.reminders}
        onToggle={() => toggleNotification('reminders')}
      />
      
      <NextButton onPress={() => onComplete(preferences)}>
        <ButtonText>Get Started</ButtonText>
      </NextButton>
    </StepContainer>
  );

  return (
    <Container>
      <ProgressBar>
        <ProgressDot active={currentStep >= 0} />
        <ProgressLine active={currentStep >= 1} />
        <ProgressDot active={currentStep >= 1} />
        <ProgressLine active={currentStep >= 2} />
        <ProgressDot active={currentStep >= 2} />
      </ProgressBar>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {currentStep === 0 && <ScheduleStep />}
        {currentStep === 1 && <PauseTypesStep />}
        {currentStep === 2 && <NotificationsStep />}
      </ScrollView>
    </Container>
  );
};

// Styled Components
const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: 20px;
`;

const StepContainer = styled.View`
  flex: 1;
  padding: 20px 0;
`;

const StepTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
  font-family: ${props => props.theme.fonts.heading};
`;

const StepDescription = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  opacity: 0.8;
  margin-bottom: 24px;
  font-family: ${props => props.theme.fonts.body};
`;

const TimeSelectorContainer = styled.View`
  margin-bottom: 24px;
`;

const TimeSelectorLabel = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
  font-family: ${props => props.theme.fonts.body};
`;

const TimeOptionsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: -4px;
`;

const TimeOption = styled.TouchableOpacity`
  padding: 8px 16px;
  margin: 4px;
  border-radius: 20px;
  background-color: ${props => props.isSelected ? props.theme.colors.primary : props.theme.colors.card};
`;

const TimeOptionText = styled.Text`
  color: ${props => props.isSelected ? props.theme.colors.white : props.theme.colors.text};
  font-size: 14px;
  font-family: ${props => props.theme.fonts.body};
`;

const PreferenceOptionContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${props => props.theme.colors.card};
  border-radius: 12px;
  margin-bottom: 12px;
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.primary}20;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

const PreferenceContent = styled.View`
  flex: 1;
  margin-right: 12px;
`;

const PreferenceTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  font-family: ${props => props.theme.fonts.heading};
`;

const PreferenceDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.text};
  opacity: 0.8;
  font-family: ${props => props.theme.fonts.body};
`;

const NextButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 24px;
`;

const ButtonText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-size: 18px;
  font-weight: bold;
  font-family: ${props => props.theme.fonts.heading};
`;

const ProgressBar = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`;

const ProgressDot = styled.View`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
`;

const ProgressLine = styled.View`
  width: 40px;
  height: 2px;
  background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  margin: 0 4px;
`;

export default PreferenceSetup;