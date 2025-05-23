import React, { useState } from 'react';
import { View, ScrollView, Alert, Platform } from 'react-native';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, ScreenContainer, ScreenTitle, ScreenDescription, ProgressBar } from '../../../components/shared/OnboardingComponents';
import { theme } from '../../../theme/theme';

const PermissionsScreen = () => {
  const { permissionsGranted, updatePermissions, nextStep } = useOnboarding();
  const [loading, setLoading] = useState(false);

  // Request notification permissions
  const requestNotificationPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const granted = status === 'granted';
      updatePermissions({ notifications: granted });
      
      if (!granted) {
        Alert.alert(
          'Notifications',
          'Without notification permissions, we won\'t be able to remind you to take pause moments. You can enable this later in your device settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('Error requesting notification permission:', error);
    } finally {
      setLoading(false);
    }
  };

  // Request calendar permissions
  const requestCalendarPermission = async () => {
    setLoading(true);
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      const granted = status === 'granted';
      updatePermissions({ calendar: granted });
      
      if (!granted) {
        Alert.alert(
          'Calendar Access',
          'Without calendar access, we won\'t be able to suggest pause moments based on your schedule. You can enable this later in your device settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.log('Error requesting calendar permission:', error);
    } finally {
      setLoading(false);
    }
  };

  // Request all permissions
  const requestAllPermissions = async () => {
    await requestNotificationPermission();
    await requestCalendarPermission();
  };

  // Continue to next step
  const handleContinue = () => {
    nextStep();
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderContainer>
          <ScreenTitle>App Permissions</ScreenTitle>
          <ScreenDescription>
            To provide you with the best experience, Pause needs a few permissions. You can adjust these later in your device settings.
          </ScreenDescription>
          <ProgressBar currentStep={5} totalSteps={7} />
        </HeaderContainer>

        <PermissionsContainer>
          <PermissionCard>
            <PermissionHeader>
              <IconContainer>
                <Ionicons name="notifications-outline" size={24} color={theme.colors.primary} />
              </IconContainer>
              <PermissionTitle>Notifications</PermissionTitle>
              <StatusBadge granted={permissionsGranted.notifications}>
                <StatusText>{permissionsGranted.notifications ? 'Granted' : 'Required'}</StatusText>
              </StatusBadge>
            </PermissionHeader>
            
            <PermissionDescription>
              Allows Pause to send you gentle reminders for your mindful breaks throughout the day.
            </PermissionDescription>
            
            <PermissionButton 
              onPress={requestNotificationPermission}
              disabled={permissionsGranted.notifications || loading}
            >
              <PermissionButtonText>
                {permissionsGranted.notifications ? 'Granted' : 'Grant Permission'}
              </PermissionButtonText>
            </PermissionButton>
          </PermissionCard>

          <PermissionCard>
            <PermissionHeader>
              <IconContainer>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              </IconContainer>
              <PermissionTitle>Calendar</PermissionTitle>
              <StatusBadge granted={permissionsGranted.calendar} optional>
                <StatusText>{permissionsGranted.calendar ? 'Granted' : 'Optional'}</StatusText>
              </StatusBadge>
            </PermissionHeader>
            
            <PermissionDescription>
              Allows Pause to suggest mindful breaks based on your calendar events and schedule.
            </PermissionDescription>
            
            <PermissionButton 
              onPress={requestCalendarPermission}
              disabled={permissionsGranted.calendar || loading}
              optional
            >
              <PermissionButtonText optional={!permissionsGranted.calendar}>
                {permissionsGranted.calendar ? 'Granted' : 'Grant Permission'}
              </PermissionButtonText>
            </PermissionButton>
          </PermissionCard>

          {Platform.OS === 'ios' && (
            <PermissionCard>
              <PermissionHeader>
                <IconContainer>
                  <Ionicons name="fitness-outline" size={24} color={theme.colors.primary} />
                </IconContainer>
                <PermissionTitle>Health Data</PermissionTitle>
                <StatusBadge granted={permissionsGranted.healthKit} optional>
                  <StatusText>{permissionsGranted.healthKit ? 'Granted' : 'Optional'}</StatusText>
                </StatusBadge>
              </PermissionHeader>
              
              <PermissionDescription>
                Allows Pause to suggest mindful breaks based on your stress levels and activity.
              </PermissionDescription>
              
              <PermissionButton 
                onPress={() => {
                  // In a real app, we would request HealthKit permissions here
                  Alert.alert(
                    'Health Data',
                    'This would request HealthKit permissions in a real app.',
                    [{ text: 'OK' }]
                  );
                }}
                disabled={permissionsGranted.healthKit || loading}
                optional
              >
                <PermissionButtonText optional={!permissionsGranted.healthKit}>
                  {permissionsGranted.healthKit ? 'Granted' : 'Grant Permission'}
                </PermissionButtonText>
              </PermissionButton>
            </PermissionCard>
          )}
        </PermissionsContainer>

        <AllPermissionsButton onPress={requestAllPermissions} disabled={loading}>
          <AllPermissionsText>Grant All Permissions</AllPermissionsText>
        </AllPermissionsButton>

        <InfoContainer>
          <InfoIcon>
            <Ionicons name="information-circle-outline" size={24} color={theme.colors.primary} />
          </InfoIcon>
          <InfoText>
            You can still use Pause without granting all permissions, but some features may be limited.
          </InfoText>
        </InfoContainer>

        <ButtonContainer>
          <PrimaryButton 
            title="Continue" 
            onPress={handleContinue} 
            loading={loading}
          />
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

const PermissionsContainer = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`;

const PermissionCard = styled.View`
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.medium}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
  ${theme.shadows.small}
`;

const PermissionHeader = styled.View`
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

const PermissionTitle = styled.Text`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.heading};
`;

const StatusBadge = styled.View`
  background-color: ${props => 
    props.granted 
      ? `${theme.colors.success}40` 
      : props.optional 
        ? `${theme.colors.accent}40` 
        : `${theme.colors.primary}40`
  };
  padding: 4px 8px;
  border-radius: ${theme.borderRadius.small}px;
`;

const StatusText = styled.Text`
  font-size: 12px;
  color: ${props => 
    props.granted 
      ? theme.colors.success 
      : props.optional 
        ? theme.colors.accent 
        : theme.colors.primary
  };
  font-weight: 600;
  font-family: ${theme.fonts.body};
`;

const PermissionDescription = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md}px;
  font-family: ${theme.fonts.body};
`;

const PermissionButton = styled.TouchableOpacity`
  background-color: ${props => 
    props.disabled 
      ? theme.colors.border 
      : props.optional 
        ? theme.colors.white 
        : theme.colors.primary
  };
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.medium}px;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.disabled ? 0.6 : 1};
  border-width: ${props => props.optional && !props.disabled ? 1 : 0}px;
  border-color: ${theme.colors.primary};
`;

const PermissionButtonText = styled.Text`
  color: ${props => 
    props.optional 
      ? theme.colors.primary 
      : theme.colors.white
  };
  font-size: 14px;
  font-weight: 600;
  font-family: ${theme.fonts.body};
`;

const AllPermissionsButton = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.lg}px;
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

const AllPermissionsText = styled.Text`
  color: ${theme.colors.primary};
  font-size: 16px;
  font-weight: 600;
  font-family: ${theme.fonts.heading};
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

export default PermissionsScreen;
