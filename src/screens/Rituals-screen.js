import React, { useState } from 'react';
import styled from 'styled-components/native';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDashboardData } from '../hooks/useDashboardData';

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

const RitualCard = styled(LinearGradient)`
  margin: 10px 20px;
  border-radius: 15px;
  overflow: hidden;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const RitualContent = styled.View`
  padding: 20px;
`;

const RitualTitle = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: white;
  margin-bottom: 8px;
`;

const RitualDescription = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 15px;
`;

const RitualDuration = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const StepContainer = styled.View`
  background-color: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 10px;
  margin-top: 10px;
`;

const StepText = styled.Text`
  color: white;
  margin-bottom: 8px;
  font-size: 14px;
`;

const rituals = [
  {
    id: 1,
    title: 'Morning Reset',
    description: 'Start your day with intention and clarity',
    duration: '10-15 min',
    gradient: ['#FF8C42', '#FDB147'],
    steps: [
      'Deep breathing exercise (2 min)',
      'Gentle stretching (3 min)',
      'Mindful meditation (5 min)',
      'Setting daily intention (2 min)'
    ]
  },
  {
    id: 2,
    title: 'Afternoon Refresh',
    description: 'Recharge and refocus during your day',
    duration: '5-7 min',
    gradient: ['#00A896', '#02C39A'],
    steps: [
      'Quick body scan (1 min)',
      'Desk stretches (2 min)',
      'Calming breath work (2 min)',
      'Mental reset visualization (2 min)'
    ]
  },
  {
    id: 3,
    title: 'Evening Unwind',
    description: 'Transition from work to rest mode',
    duration: '15-20 min',
    gradient: ['#5C6B9C', '#404B69'],
    steps: [
      'Gentle movement (5 min)',
      'Relaxation breathing (5 min)',
      'Gratitude practice (3 min)',
      'Calming soundscape (5 min)'
    ]
  },
  {
    id: 4,
    title: 'Night Wind Down',
    description: 'Prepare mind and body for restful sleep',
    duration: '10-12 min',
    gradient: ['#2D3A87', '#1A1B4B'],
    steps: [
      'Digital sunset ritual (2 min)',
      'Gentle stretching (3 min)',
      'Sleep-ready breathing (3 min)',
      'Bedtime meditation (4 min)'
    ]
  }
];

export const RitualsScreen = ({ navigation }) => {
  const [activeRitual, setActiveRitual] = useState(null);
  const { addSession } = useDashboardData();

  const startRitual = (ritual) => {
    setActiveRitual(ritual);
    // Start tracking the ritual session
    addSession({
      type: 'Ritual',
      duration: parseInt(ritual.duration.split('-')[0]), // Use minimum duration
      name: ritual.title
    });
    
    // Navigate to guided ritual experience
    navigation.navigate('RitualSession', { ritual });
  };

  return (
    <Container>
      <Header>
        <Title>Rest Rituals</Title>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#00A896" />
        </TouchableOpacity>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        {rituals.map((ritual) => (
          <RitualCard
            key={ritual.id}
            colors={ritual.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity onPress={() => startRitual(ritual)}>
              <RitualContent>
                <RitualTitle>{ritual.title}</RitualTitle>
                <RitualDescription>{ritual.description}</RitualDescription>
                <RitualDuration>{ritual.duration}</RitualDuration>
                <StepContainer>
                  {ritual.steps.map((step, index) => (
                    <StepText key={index}>• {step}</StepText>
                  ))}
                </StepContainer>
              </RitualContent>
            </TouchableOpacity>
          </RitualCard>
        ))}
      </ScrollView>
    </Container>
  );
};
