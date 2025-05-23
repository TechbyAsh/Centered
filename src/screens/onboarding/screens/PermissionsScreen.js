import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Alert, Platform, Animated, Easing } from 'react-native';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Notifications from 'expo-notifications';
import * as Calendar from 'expo-calendar';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, TextButton } from '../../../components/shared/OnboardingComponents';
import { theme } from '../../../theme/theme';

const PermissionsScreen = () => {
  const { permissionsGranted, updatePermissions, nextStep, prevStep } = useOnboarding();
  const [loading, setLoading] = useState(false);
  
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
            <ProgressDot active={false} />
            <ProgressDot active={true} />
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
            <ScreenTitle>App Permissions</ScreenTitle>
            <ScreenDescription>
              To provide you with the best experience, Pause needs a few permissions. You can adjust these later in your device settings.
            </ScreenDescription>
          </TitleContainer>
        </Animated.View>
      </HeaderContainer>

      <ContentScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

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

      </ContentScrollView>

      <ButtonContainer>
        <PrimaryButton 
          title="Continue" 
          onPress={handleContinue} 
          loading={loading}
        />
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

const PermissionsContainer = styled.View`
  margin: 0 ${theme.spacing.screenHorizontal}px ${theme.spacing.lg}px;
`;

const PermissionCard = styled.View`
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

const PermissionHeader = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
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
  border-radius: ${theme.borderRadius.button}px;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.disabled ? 0.6 : 1};
  border-width: ${props => props.optional && !props.disabled ? 1 : 0}px;
  border-color: ${theme.colors.primary};
  shadow-color: ${props => props.disabled ? 'transparent' : theme.colors.primary};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: ${props => props.disabled ? 0 : 2};
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
  margin: 0 ${theme.spacing.screenHorizontal}px ${theme.spacing.lg}px;
  opacity: ${props => props.disabled ? 0.6 : 1};
  background-color: ${theme.colors.secondary}20;
  border-radius: ${theme.borderRadius.button}px;
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

export default PermissionsScreen;
