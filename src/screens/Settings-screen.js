import React, { useState, useEffect } from 'react';
import styled from '@emotion/native';
import { ScrollView, TouchableOpacity, Platform, Switch, View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@emotion/react';
import { storage } from '../infrastructure/storage/storage';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  padding-top: 60px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.heading};
`;

const Section = styled.View`
  margin: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 15px;
`;

const TimePickerButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3.84px;
`;

const TimeText = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  margin-left: 10px;
`;

const Label = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 5px;
`;

const Description = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-top: 10px;
  font-style: italic;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.primary};
  padding: 15px;
  border-radius: 10px;
  margin: 20px;
  align-items: center;
`;

const SettingRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.colors.border};
`;

const SettingLabel = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
  flex: 1;
`;

const DurationInput = styled.TextInput`
  background-color: ${props => props.theme.colors.card};
  padding: 8px 12px;
  border-radius: 8px;
  width: 60px;
  text-align: center;
  margin-right: 8px;
  color: ${props => props.theme.colors.text};
`;

const MinutesText = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  width: 30px;
`;

import { Picker } from '@react-native-picker/picker';

const PickerContainer = styled.View`
  flex: 1;
  border-radius: 8px;
  background-color: ${props => props.theme.colors.card};
  overflow: hidden;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

export const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();
  const [wakeTime, setWakeTime] = useState(new Date().setHours(7, 0));
  const [workStartTime, setWorkStartTime] = useState(new Date().setHours(9, 0));
  const [lunchTime, setLunchTime] = useState(new Date().setHours(12, 30));
  const [workEndTime, setWorkEndTime] = useState(new Date().setHours(17, 0));
  const [bedTime, setBedTime] = useState(new Date().setHours(22, 0));
  const [showPicker, setShowPicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState(null);

  // Transition Timer Settings
  const [transitionSettings, setTransitionSettings] = useState({
    durations: {
      'work-to-break': 300, // 5 minutes
      'break-to-work': 180, // 3 minutes
      'morning-start': 600, // 10 minutes
      'evening-wind-down': 900, // 15 minutes
    },
    audio: {
      enabled: true,
      volume: 0.7,
      soundType: 'bells', // bells, nature, ocean
    },
    haptics: true,
    theme: 'calm', // calm, focus, energize
  });

  useEffect(() => {
    Promise.all([
      loadSchedule(),
      loadTransitionSettings()
    ]);
  }, []);

  const loadSchedule = async () => {
    try {
      const schedule = await AsyncStorage.getItem('userSchedule');
      if (schedule) {
        const parsed = JSON.parse(schedule);
        setWakeTime(new Date(parsed.wakeTime).getTime());
        setWorkStartTime(new Date(parsed.workStartTime).getTime());
        setLunchTime(new Date(parsed.lunchTime).getTime());
        setWorkEndTime(new Date(parsed.workEndTime).getTime());
        setBedTime(new Date(parsed.bedTime).getTime());
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
    }
  };

  const loadTransitionSettings = async () => {
    try {
      const settings = await storage.getPreferences();
      if (settings?.transitionSettings) {
        setTransitionSettings(settings.transitionSettings);
      }
    } catch (error) {
      console.error('Error loading transition settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const schedule = {
        wakeTime: new Date(wakeTime).toISOString(),
        workStartTime: new Date(workStartTime).toISOString(),
        lunchTime: new Date(lunchTime).toISOString(),
        workEndTime: new Date(workEndTime).toISOString(),
        bedTime: new Date(bedTime).toISOString(),
      };

      await Promise.all([
        AsyncStorage.setItem('userSchedule', JSON.stringify(schedule)),
        storage.savePreferences({ transitionSettings })
      ]);

      navigation.goBack();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const showTimePicker = (type) => {
    setCurrentPicker(type);
    setShowPicker(true);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const onTimeChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      switch (currentPicker) {
        case 'wake':
          setWakeTime(selectedDate.getTime());
          break;
        case 'workStart':
          setWorkStartTime(selectedDate.getTime());
          break;
        case 'lunch':
          setLunchTime(selectedDate.getTime());
          break;
        case 'workEnd':
          setWorkEndTime(selectedDate.getTime());
          break;
        case 'bed':
          setBedTime(selectedDate.getTime());
          break;
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Daily Schedule</Title>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#00A896" />
        </TouchableOpacity>
      </Header>

      <ScrollView>
        <Section>
          <SectionTitle>Your Daily Routine</SectionTitle>
          <Description>
            Help us optimize your mindfulness activities by setting your daily schedule.
            We'll suggest the best times for different practices.
          </Description>

          <Label>Wake Up Time</Label>
          <TimePickerButton onPress={() => showTimePicker('wake')}>
            <Ionicons name="sunny-outline" size={24} color="#FF8C42" />
            <TimeText>{formatTime(wakeTime)}</TimeText>
          </TimePickerButton>

          <Label>Work Start Time</Label>
          <TimePickerButton onPress={() => showTimePicker('workStart')}>
            <Ionicons name="briefcase-outline" size={24} color="#00A896" />
            <TimeText>{formatTime(workStartTime)}</TimeText>
          </TimePickerButton>

          <Label>Lunch Break</Label>
          <TimePickerButton onPress={() => showTimePicker('lunch')}>
            <Ionicons name="restaurant-outline" size={24} color="#2D3A87" />
            <TimeText>{formatTime(lunchTime)}</TimeText>
          </TimePickerButton>

          <Label>Work End Time</Label>
          <TimePickerButton onPress={() => showTimePicker('workEnd')}>
            <Ionicons name="home-outline" size={24} color="#5C6B9C" />
            <TimeText>{formatTime(workEndTime)}</TimeText>
          </TimePickerButton>

          <Label>Bedtime</Label>
          <TimePickerButton onPress={() => showTimePicker('bed')}>
            <Ionicons name="moon-outline" size={24} color="#1A1B4B" />
            <TimeText>{formatTime(bedTime)}</TimeText>
          </TimePickerButton>
        </Section>

        <Section>
          <SectionTitle>Transition Timer</SectionTitle>
          
          {/* Duration Settings */}
          {Object.entries(transitionSettings.durations).map(([type, duration]) => (
            <SettingRow key={type}>
              <SettingLabel>{type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</SettingLabel>
              <DurationInput
                value={String(Math.round(duration / 60))}
                onChangeText={(text) => {
                  const minutes = parseInt(text) || 0;
                  setTransitionSettings(prev => ({
                    ...prev,
                    durations: {
                      ...prev.durations,
                      [type]: minutes * 60
                    }
                  }));
                }}
                keyboardType="number-pad"
              />
              <MinutesText>min</MinutesText>
            </SettingRow>
          ))}

          {/* Audio Settings */}
          <SettingRow>
            <SettingLabel>Sound Effects</SettingLabel>
            <Switch
              value={transitionSettings.audio.enabled}
              onValueChange={(value) => {
                setTransitionSettings(prev => ({
                  ...prev,
                  audio: { ...prev.audio, enabled: value }
                }));
              }}
            />
          </SettingRow>

          {transitionSettings.audio.enabled && (
            <>
              <SettingRow>
                <SettingLabel>Sound Type</SettingLabel>
                <PickerContainer>
                  <Picker
                    selectedValue={transitionSettings.audio.soundType}
                    onValueChange={(value) => {
                      setTransitionSettings(prev => ({
                        ...prev,
                        audio: { ...prev.audio, soundType: value }
                      }));
                    }}
                    style={{
                      color: theme.colors.text,
                      height: 40
                    }}
                  >
                    <Picker.Item value="bells" label="Bells" />
                    <Picker.Item value="nature" label="Nature" />
                    <Picker.Item value="ocean" label="Ocean" />
                  </Picker>
                </PickerContainer>
              </SettingRow>

              <SettingRow>
                <SettingLabel>Volume</SettingLabel>
                <Slider
                  style={{ flex: 1 }}
                  value={transitionSettings.audio.volume}
                  onValueChange={(value) => {
                    setTransitionSettings(prev => ({
                      ...prev,
                      audio: { ...prev.audio, volume: value }
                    }));
                  }}
                  minimumValue={0}
                  maximumValue={1}
                  step={0.1}
                />
              </SettingRow>
            </>
          )}

          {/* Haptic Feedback */}
          <SettingRow>
            <SettingLabel>Haptic Feedback</SettingLabel>
            <Switch
              value={transitionSettings.haptics}
              onValueChange={(value) => {
                setTransitionSettings(prev => ({
                  ...prev,
                  haptics: value
                }));
              }}
            />
          </SettingRow>

          {/* Theme Selection */}
          <SettingRow>
            <SettingLabel>Theme</SettingLabel>
            <PickerContainer>
              <Picker
                selectedValue={transitionSettings.theme}
                onValueChange={(value) => {
                  setTransitionSettings(prev => ({
                    ...prev,
                    theme: value
                  }));
                }}
                style={{
                  color: theme.colors.text,
                  height: 40
                }}
              >
                <Picker.Item value="calm" label="Calm" />
                <Picker.Item value="focus" label="Focus" />
                <Picker.Item value="energize" label="Energize" />
              </Picker>
            </PickerContainer>
          </SettingRow>
        </Section>

        <SaveButton onPress={saveSettings}>
          <SaveButtonText>Save Settings</SaveButtonText>
        </SaveButton>
      </ScrollView>

      {showPicker && (
        <DateTimePicker
          value={new Date(
            currentPicker === 'wake' ? wakeTime :
            currentPicker === 'workStart' ? workStartTime :
            currentPicker === 'lunch' ? lunchTime :
            currentPicker === 'workEnd' ? workEndTime :
            bedTime
          )}
          mode="time"
          is24Hour={false}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onTimeChange}
        />
      )}
    </Container>
  );
};
