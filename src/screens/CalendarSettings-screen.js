import React, { useEffect, useState, useCallback } from 'react';
import { useCalendarAuth } from '../components/CalendarAuthProvider';
import styled from '@emotion/native';
import { Alert, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CalendarManager from '../services/calendar/CalendarManager';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding: 20px;
`;

const ErrorContainer = styled.View`
  align-items: center;
  justify-content: center;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #FFEBEE;
  border-radius: 8px;
`;

const ErrorText = styled.Text`
  color: #B00020;
  font-size: 16px;
  text-align: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
`;

const ProviderCard = styled.TouchableOpacity`
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const ProviderInfo = styled.View`
  flex: 1;
  margin-left: 15px;
`;

const ProviderName = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const ProviderStatus = styled.Text`
  font-size: 14px;
  color: ${props => props.connected ? '#00A896' : '#666'};
`;

const ConnectButton = styled.TouchableOpacity`
  padding: 8px 16px;
  border-radius: 8px;
  background-color: ${props => props.connected ? '#F44336' : '#00A896'};
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const ConnectButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: 500;
`;

const providers = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: 'logo-google',
  },
  {
    id: 'apple',
    name: 'Apple Calendar',
    icon: 'logo-apple',
  },
  {
    id: 'outlook',
    name: 'Outlook Calendar',
    icon: 'mail',
  },
];

export const CalendarSettingsScreen = () => {
  const [activeProviders, setActiveProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingProvider, setProcessingProvider] = useState(null);
  const {
    authenticateGoogle,
    authenticateOutlook,
    authenticateApple,
    loading: authLoading,
    error: authError,
    calendarPermissionStatus,
    requestCalendarPermissions
  } = useCalendarAuth();

  useEffect(() => {
    const init = async () => {
      // Request calendar permissions early
      if (calendarPermissionStatus === null) {
        await requestCalendarPermissions();
      }
      await loadProviders();
    };
    init();
  }, [calendarPermissionStatus, requestCalendarPermissions]);

  const loadProviders = async () => {
    try {
      await CalendarManager.initialize();
      setActiveProviders(CalendarManager.getActiveProviders());
    } catch (error) {
      console.error('Failed to load providers:', error);
      Alert.alert('Error', 'Failed to load calendar providers');
    } finally {
      setLoading(false);
    }
  };

  const handleProviderPress = useCallback(async (providerId) => {
    setProcessingProvider(providerId);

    try {
      if (activeProviders.includes(providerId)) {
        // Disconnect provider
        const success = await CalendarManager.deactivateProvider(providerId);
        if (success) {
          setActiveProviders(prev => prev.filter(id => id !== providerId));
        } else {
          throw new Error('Failed to disconnect provider');
        }
      } else {
        // Connect provider
        let success = false;
        switch (providerId) {
          case 'google':
            success = await authenticateGoogle();
            break;
          case 'outlook':
            success = await authenticateOutlook();
            break;
          case 'apple':
            success = await authenticateApple();
            break;
          default:
            throw new Error(`Unknown provider: ${providerId}`);
        }

        if (success) {
          setActiveProviders(prev => [...prev, providerId]);
        }
      }
    } catch (error) {
      console.error('Provider operation failed:', error);
      Alert.alert('Error', `Failed to ${activeProviders.includes(providerId) ? 'disconnect' : 'connect'} calendar`);
    } finally {
      setProcessingProvider(null);
    }
  }, [activeProviders, authenticateGoogle, authenticateOutlook, authenticateApple]);

  if (loading) {
    return (
      <Container style={{ justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00A896" />
      </Container>
    );
  }

  return (
    <Container>
      <Title>Calendar Settings</Title>
      
      {authError && (
        <ErrorContainer>
          <ErrorText>{authError}</ErrorText>
        </ErrorContainer>
      )}
      <ScrollView showsVerticalScrollIndicator={false}>
        {providers.map(provider => {
          const isActive = activeProviders.includes(provider.id);
          const isProcessing = processingProvider === provider.id;

          return (
            <ProviderCard key={provider.id} onPress={() => handleProviderPress(provider.id)}>
              <Ionicons name={provider.icon} size={32} color="#333" />
              <ProviderInfo>
                <ProviderName>{provider.name}</ProviderName>
                <ProviderStatus connected={isActive}>
                  {isActive ? 'Connected' : 
                   (provider.id === 'apple' && calendarPermissionStatus === 'denied') ? 
                   'Permission denied' : 'Not connected'}
                </ProviderStatus>
              </ProviderInfo>
              {isProcessing || (authLoading && processingProvider === provider.id) ? (
                <ActivityIndicator size="small" color="#00A896" />
              ) : (
                <ConnectButton
                  onPress={() => handleProviderPress(provider.id)}
                  disabled={
                    provider.id === 'apple' && calendarPermissionStatus === 'denied' ||
                    authLoading
                  }
                >
                  <ConnectButtonText>
                    {isActive ? 'Disconnect' : 'Connect'}
                  </ConnectButtonText>
                </ConnectButton>
              )}
            </ProviderCard>
          );
        })}
      </ScrollView>
    </Container>
  );
};
