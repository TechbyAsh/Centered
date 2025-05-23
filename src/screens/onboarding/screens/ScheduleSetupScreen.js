import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, ScreenContainer, ScreenTitle, ScreenDescription, ProgressBar } from '../../../components/shared/OnboardingComponents';
import { timeOptions } from '../screen.data';
import { theme } from '../../../theme/theme';

const ScheduleSetupScreen = () => {
  const { schedule, updateSchedule, nextStep } = useOnboarding();
  const [additionalBreaks, setAdditionalBreaks] = useState(schedule.additionalBreaks || []);

  // Handle time selection
  const handleTimeSelection = (type, time) => {
    updateSchedule({ [type]: time });
  };

  // Add an additional break
  const addBreak = () => {
    const newBreak = {
      id: Date.now().toString(),
      startTime: '14:00',
      endTime: '14:15',
      label: `Break ${additionalBreaks.length + 1}`,
    };
    
    const updatedBreaks = [...additionalBreaks, newBreak];
    setAdditionalBreaks(updatedBreaks);
    updateSchedule({ additionalBreaks: updatedBreaks });
  };

  // Remove a break
  const removeBreak = (breakId) => {
    const updatedBreaks = additionalBreaks.filter(b => b.id !== breakId);
    setAdditionalBreaks(updatedBreaks);
    updateSchedule({ additionalBreaks: updatedBreaks });
  };

  // Update a break
  const updateBreak = (breakId, field, value) => {
    const updatedBreaks = additionalBreaks.map(b => {
      if (b.id === breakId) {
        return { ...b, [field]: value };
      }
      return b;
    });
    
    setAdditionalBreaks(updatedBreaks);
    updateSchedule({ additionalBreaks: updatedBreaks });
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderContainer>
          <ScreenTitle>Your Daily Schedule</ScreenTitle>
          <ScreenDescription>
            Help us suggest the perfect moments for your mindful breaks by setting up your typical daily schedule.
          </ScreenDescription>
          <ProgressBar currentStep={2} totalSteps={7} />
        </HeaderContainer>

        <SectionContainer>
          <SectionTitle>Work Hours</SectionTitle>
          
          <TimeSelectionContainer>
            <TimeLabel>Start Time</TimeLabel>
            <TimeOptionsContainer>
              {timeOptions.workStart.map((time) => (
                <TimeOption
                  key={time}
                  selected={schedule.workStartTime === time}
                  onPress={() => handleTimeSelection('workStartTime', time)}
                >
                  <TimeOptionText selected={schedule.workStartTime === time}>
                    {time}
                  </TimeOptionText>
                </TimeOption>
              ))}
            </TimeOptionsContainer>
          </TimeSelectionContainer>

          <TimeSelectionContainer>
            <TimeLabel>End Time</TimeLabel>
            <TimeOptionsContainer>
              {timeOptions.workEnd.map((time) => (
                <TimeOption
                  key={time}
                  selected={schedule.workEndTime === time}
                  onPress={() => handleTimeSelection('workEndTime', time)}
                >
                  <TimeOptionText selected={schedule.workEndTime === time}>
                    {time}
                  </TimeOptionText>
                </TimeOption>
              ))}
            </TimeOptionsContainer>
          </TimeSelectionContainer>
        </SectionContainer>

        <SectionContainer>
          <SectionTitle>Lunch Break</SectionTitle>
          
          <TimeSelectionContainer>
            <TimeLabel>Lunch Time</TimeLabel>
            <TimeOptionsContainer>
              {timeOptions.lunchTime.map((time) => (
                <TimeOption
                  key={time}
                  selected={schedule.lunchTime === time}
                  onPress={() => handleTimeSelection('lunchTime', time)}
                >
                  <TimeOptionText selected={schedule.lunchTime === time}>
                    {time}
                  </TimeOptionText>
                </TimeOption>
              ))}
            </TimeOptionsContainer>
          </TimeSelectionContainer>
        </SectionContainer>

        <SectionContainer>
          <SectionTitleContainer>
            <SectionTitle>Additional Breaks</SectionTitle>
            <AddButton onPress={addBreak}>
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />
            </AddButton>
          </SectionTitleContainer>

          {additionalBreaks.map((breakItem) => (
            <BreakContainer key={breakItem.id}>
              <BreakHeader>
                <BreakLabel>{breakItem.label}</BreakLabel>
                <RemoveButton onPress={() => removeBreak(breakItem.id)}>
                  <Ionicons name="close-circle-outline" size={24} color={theme.colors.text} />
                </RemoveButton>
              </BreakHeader>
              
              <BreakTimeContainer>
                <TimeSelectionContainer style={{ flex: 1, marginRight: 8 }}>
                  <TimeLabel>Start</TimeLabel>
                  <TimeOptionsContainer>
                    {['14:00', '14:30', '15:00', '15:30'].map((time) => (
                      <TimeOption
                        key={`${breakItem.id}-start-${time}`}
                        selected={breakItem.startTime === time}
                        onPress={() => updateBreak(breakItem.id, 'startTime', time)}
                        small
                      >
                        <TimeOptionText selected={breakItem.startTime === time} small>
                          {time}
                        </TimeOptionText>
                      </TimeOption>
                    ))}
                  </TimeOptionsContainer>
                </TimeSelectionContainer>
                
                <TimeSelectionContainer style={{ flex: 1, marginLeft: 8 }}>
                  <TimeLabel>End</TimeLabel>
                  <TimeOptionsContainer>
                    {['14:15', '14:45', '15:15', '15:45'].map((time) => (
                      <TimeOption
                        key={`${breakItem.id}-end-${time}`}
                        selected={breakItem.endTime === time}
                        onPress={() => updateBreak(breakItem.id, 'endTime', time)}
                        small
                      >
                        <TimeOptionText selected={breakItem.endTime === time} small>
                          {time}
                        </TimeOptionText>
                      </TimeOption>
                    ))}
                  </TimeOptionsContainer>
                </TimeSelectionContainer>
              </BreakTimeContainer>
            </BreakContainer>
          ))}
        </SectionContainer>

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

const SectionTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md}px;
`;

const TimeSelectionContainer = styled.View`
  margin-bottom: ${theme.spacing.md}px;
`;

const TimeLabel = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm}px;
  font-family: ${theme.fonts.body};
`;

const TimeOptionsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: -4px;
`;

const TimeOption = styled.TouchableOpacity`
  background-color: ${props => props.selected ? theme.colors.primary : theme.colors.secondary};
  padding: ${props => props.small ? '6px 12px' : '8px 16px'};
  border-radius: ${theme.borderRadius.medium}px;
  margin: 4px;
`;

const TimeOptionText = styled.Text`
  color: ${props => props.selected ? theme.colors.white : theme.colors.text};
  font-size: ${props => props.small ? '12px' : '14px'};
  font-family: ${theme.fonts.body};
`;

const AddButton = styled.TouchableOpacity`
  padding: ${theme.spacing.xs}px;
`;

const BreakContainer = styled.View`
  background-color: ${theme.colors.secondary}20;
  border-radius: ${theme.borderRadius.medium}px;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.md}px;
`;

const BreakHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const BreakLabel = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.heading};
`;

const RemoveButton = styled.TouchableOpacity`
  padding: ${theme.spacing.xs}px;
`;

const BreakTimeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const ButtonContainer = styled.View`
  padding: ${theme.spacing.lg}px 0;
  margin-bottom: ${theme.spacing.xl}px;
`;

export default ScheduleSetupScreen;
