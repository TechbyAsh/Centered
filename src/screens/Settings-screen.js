import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 500;
`;

export const SettingsScreen = ({ navigation }) => {
  const [wakeTime, setWakeTime] = useState(new Date().setHours(7, 0));
  const [workStartTime, setWorkStartTime] = useState(new Date().setHours(9, 0));
  const [lunchTime, setLunchTime] = useState(new Date().setHours(12, 30));
  const [workEndTime, setWorkEndTime] = useState(new Date().setHours(17, 0));
  const [bedTime, setBedTime] = useState(new Date().setHours(22, 0));
  const [showPicker, setShowPicker] = useState(false);
  const [currentPicker, setCurrentPicker] = useState(null);

  useEffect(() => {
    loadSchedule();
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

  const saveSchedule = async () => {
    try {
      const schedule = {
        wakeTime: new Date(wakeTime).toISOString(),
        workStartTime: new Date(workStartTime).toISOString(),
        lunchTime: new Date(lunchTime).toISOString(),
        workEndTime: new Date(workEndTime).toISOString(),
        bedTime: new Date(bedTime).toISOString(),
      };
      await AsyncStorage.setItem('userSchedule', JSON.stringify(schedule));
      navigation.goBack();
    } catch (error) {
      console.error('Error saving schedule:', error);
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

        <SaveButton onPress={saveSchedule}>
          <SaveButtonText>Save Schedule</SaveButtonText>
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
