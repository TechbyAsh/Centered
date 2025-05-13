import React, { useState, useCallback } from 'react';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { TransitionTimer } from '../../components/transitions/TransitionTimer';
import { TransitionSuggestions } from '../../components/transitions/TransitionSuggestions';
import { TransitionStats } from '../../components/transitions/TransitionStats';
import { SafeAreaView } from 'react-native-safe-area-context';

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  padding: 20px;
  padding-bottom: 10px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${props => props.theme.fonts.heading};
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textLight};
  margin-top: 8px;
`;

const TabBar = styled.View`
  flex-direction: row;
  padding: 0 20px;
  margin-bottom: 20px;
`;

const TabButton = styled.TouchableOpacity`
  padding: 10px 20px;
  margin-right: 10px;
  border-radius: 20px;
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
`;

const TabText = styled.Text`
  color: ${props => props.active ? props.theme.colors.white : props.theme.colors.text};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  font-size: 16px;
`;

const TransitionTypeContainer = styled.View`
  padding: 20px;
  padding-top: 0;
`;

const TransitionTypeButton = styled.TouchableOpacity`
  padding: 12px 16px;
  background-color: ${({ theme, selected }) => 
    selected ? theme.colors.primary : theme.colors.background};
  border-radius: 20px;
  margin-right: 10px;
  border: 1px solid ${({ theme }) => theme.colors.primary};
`;

const TransitionTypeText = styled.Text`
  color: ${({ theme, selected }) => 
    selected ? 'white' : theme.colors.primary};
  font-weight: 500;
`;

const transitionTypes = [
  { id: 'work-to-break', label: 'Work to Break', duration: 300 },
  { id: 'break-to-work', label: 'Back to Work', duration: 180 },
  { id: 'morning-start', label: 'Morning Start', duration: 420 },
  { id: 'evening-wind-down', label: 'Evening Wind Down', duration: 600 },
];

export const TransitionsScreen = () => {
  const theme = useTheme();
  const [selectedType, setSelectedType] = useState('work-to-break');
  const [showTimer, setShowTimer] = useState(false);
  const [activeTab, setActiveTab] = useState('transitions'); // 'transitions' or 'stats'

  const handleSuggestionSelect = useCallback((type) => {
    setSelectedType(type);
    setShowTimer(true);
  }, []);

  const handleComplete = () => {
    setShowTimer(false);
  };

  const handleSkip = () => {
    setShowTimer(false);
  };

  const selectedTransition = transitionTypes.find(t => t.id === selectedType);

  return (
    <Container>
      <TabBar>
        <TabButton
          active={activeTab === 'transitions'}
          onPress={() => setActiveTab('transitions')}
        >
          <TabText active={activeTab === 'transitions'}>Transitions</TabText>
        </TabButton>
        <TabButton
          active={activeTab === 'stats'}
          onPress={() => setActiveTab('stats')}
        >
          <TabText active={activeTab === 'stats'}>Statistics</TabText>
        </TabButton>
      </TabBar>

      {showTimer ? (
        <TransitionTimer
          type={selectedType}
          duration={selectedTransition?.duration}
          onComplete={handleComplete}
          onSkip={handleSkip}
        />
      ) : activeTab === 'transitions' ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header>
            <Title>Mindful Transitions</Title>
            <Subtitle>Take a moment to pause and reset</Subtitle>
          </Header>

          <TransitionTypeContainer>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {transitionTypes.map(type => (
                <TransitionTypeButton
                  key={type.id}
                  selected={selectedType === type.id}
                  onPress={() => {
                    setSelectedType(type.id);
                    setShowTimer(true);
                  }}
                >
                  <TransitionTypeText selected={selectedType === type.id}>
                    {type.label}
                  </TransitionTypeText>
                </TransitionTypeButton>
              ))}
            </ScrollView>
          </TransitionTypeContainer>

          <TransitionSuggestions onSelectTransition={handleSuggestionSelect} />
        </ScrollView>
      ) : (
        <TransitionStats />
      )}
    </Container>
  );
};
