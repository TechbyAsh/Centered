import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Animated, Easing, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled from '@emotion/native';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '../../../context/OnboardingContext';
import { PrimaryButton, TextButton } from '../../../components/shared/OnboardingComponents';
import { timeOptions } from '../screen.data';
import { theme } from '../../../theme/theme';

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

const SectionContainer = styled.View`
  margin: 0 ${theme.spacing.screenHorizontal}px 24px;
  background-color: ${theme.colors.white};
  border-radius: ${theme.borderRadius.card}px;
  padding: 20px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 10px;
  elevation: 2;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.heading};
`;

const TimeSelectionContainer = styled.View`
  margin-bottom: 20px;
`;

const TimeLabel = styled.Text`
  font-size: 16px;
  color: ${theme.colors.text};
  margin-bottom: 12px;
  font-family: ${theme.fonts.body};
`;

const TimeOptionsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -4px;
`;

const TimeOption = styled.TouchableOpacity`
  background-color: ${props => props.selected ? theme.colors.primary : theme.colors.secondary + '40'};
  padding: ${props => props.small ? '8px 12px' : '10px 16px'};
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
  font-size: ${props => props.small ? '14px' : '16px'};
  font-weight: ${props => props.selected ? '600' : '400'};
  font-family: ${theme.fonts.body};
`;

const AddButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const BreakContainer = styled.View`
  background-color: ${theme.colors.secondary + '30'};
  border-radius: ${theme.borderRadius.medium}px;
  padding: 16px;
  margin-bottom: 16px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 1;
`;

const BreakHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const BreakLabel = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.heading};
`;

const RemoveButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;

const BreakTimeContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
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

const ScheduleSetupScreen = () => {
  const { schedule, updateSchedule, nextStep, prevStep } = useOnboarding();
  const [additionalBreaks, setAdditionalBreaks] = useState(schedule.additionalBreaks || []);

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
    const updatedBreaks = additionalBreaks.filter((b) => b.id !== breakId);
    setAdditionalBreaks(updatedBreaks);
    updateSchedule({ additionalBreaks: updatedBreaks });
  };

  // Update a break
  const updateBreak = (breakId, field, value) => {
    const updatedBreaks = additionalBreaks.map((b) => {
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
            <ProgressDot active={true} />
            <ProgressDot active={false} />
            <ProgressDot active={false} />
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
            <ScreenTitle>Your Daily Schedule</ScreenTitle>
            <ScreenDescription>
              Help us suggest the perfect moments for your mindful breaks by setting up your typical daily schedule.
            </ScreenDescription>
          </TitleContainer>
        </Animated.View>
      </HeaderContainer>

      <ContentScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <SectionContainer>
            <SectionHeader>
              <SectionTitle>Work Hours</SectionTitle>
              <Ionicons name="time-outline" size={22} color={theme.colors.primary} />
            </SectionHeader>

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
            <SectionHeader>
              <SectionTitle>Lunch Break</SectionTitle>
              <Ionicons name="restaurant-outline" size={22} color={theme.colors.primary} />
            </SectionHeader>

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
            <SectionHeader>
              <SectionTitle>Additional Breaks</SectionTitle>
              <AddButton onPress={addBreak}>
                <Ionicons name="add-circle" size={24} color={theme.colors.primary} />
              </AddButton>
            </SectionHeader>

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
        </Animated.View>
      </ContentScrollView>

      <ButtonContainer>
        <PrimaryButton title="Continue" onPress={nextStep} />
      </ButtonContainer>
    </ScreenContainer>
  );
};

export default ScheduleSetupScreen;
