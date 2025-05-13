import React, { useCallback } from 'react';
import styled from '@emotion/native';
import { useTransitionSuggestions } from '../../hooks/useTransitionSuggestions';
import { useTheme } from '@emotion/react';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.View`
  margin: 16px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
`;

const SuggestionCard = styled.TouchableOpacity`
  background-color: ${props => props.theme.colors.card};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SuggestionInfo = styled.View`
  flex: 1;
`;

const SuggestionTime = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 4px;
`;

const SuggestionMessage = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.text};
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${props => props.theme.colors.primary}20;
  align-items: center;
  justify-content: center;
  margin-left: 12px;
`;

export const TransitionSuggestions = ({ onSelectTransition }) => {
  const theme = useTheme();
  const { suggestions } = useTransitionSuggestions();

  const formatTime = useCallback((date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }, []);

  const getIconName = useCallback((type) => {
    switch (type) {
      case 'morning-start':
        return 'sunny-outline';
      case 'break-to-work':
        return 'briefcase-outline';
      case 'work-to-break':
        return 'cafe-outline';
      case 'evening-wind-down':
        return 'moon-outline';
      default:
        return 'time-outline';
    }
  }, []);

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Container>
      <Title>Suggested Transitions</Title>
      {suggestions.map((suggestion, index) => (
        <SuggestionCard
          key={index}
          onPress={() => onSelectTransition(suggestion.type)}
          activeOpacity={0.7}
        >
          <SuggestionInfo>
            <SuggestionTime>{formatTime(suggestion.time)}</SuggestionTime>
            <SuggestionMessage>{suggestion.message}</SuggestionMessage>
          </SuggestionInfo>
          <IconContainer>
            <Ionicons
              name={getIconName(suggestion.type)}
              size={24}
              color={theme.colors.primary}
            />
          </IconContainer>
        </SuggestionCard>
      ))}
    </Container>
  );
};
