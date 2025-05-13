import React, { useCallback } from 'react';
import styled from '@emotion/native';
import { Alert } from 'react-native';
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
  background-color: ${props => props.hasConflict ? '#FFF3F3' : '#FFFFFF'};
  border-color: ${props => props.hasConflict ? '#FFD6D6' : '#E5E5E5'};
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
  color: ${props => props.hasConflict ? '#FF4D4D' : '#333333'};
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

const ConflictBadge = styled.View`
  background-color: #FFE5E5;
  padding: 4px 8px;
  border-radius: 4px;
  margin-top: 4px;
`;

const ConflictText = styled.Text`
  color: #FF4D4D;
  font-size: 12px;
`;

const AlternativeTimesContainer = styled.View`
  margin-top: 8px;
  flex-direction: row;
  flex-wrap: wrap;
`;

const AlternativeTimeButton = styled.TouchableOpacity`
  background-color: #F5F5F5;
  padding: 4px 8px;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 4px;
`;

const AlternativeTimeText = styled.Text`
  color: #666666;
  font-size: 12px;
`;

const formatAlternativeTime = (offset) => {
  if (offset < 0) {
    return `${Math.abs(offset)}m earlier`;
  }
  return `${offset}m later`;
};

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

  const handleSuggestionPress = (suggestion) => {
    if (suggestion.conflict) {
      Alert.alert(
        'Schedule Conflict',
        `${suggestion.conflict.message}. Would you like to choose an alternative time?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Show Alternatives',
            onPress: () => {}, // Alternatives are already visible
          },
        ]
      );
    } else {
      onSelectTransition(suggestion.type);
    }
  };

  const handleAlternativePress = (suggestion, alternativeTime) => {
    onSelectTransition(suggestion.type, alternativeTime);
  };

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Container>
      <Title>Suggested Transitions</Title>
      {suggestions.map((suggestion) => (
        <SuggestionCard
          key={`${suggestion.type}-${suggestion.time.getTime()}`}
          onPress={() => handleSuggestionPress(suggestion)}
          hasConflict={!!suggestion.conflict}
        >
          <SuggestionInfo>
            <SuggestionTime>{formatTime(suggestion.time)}</SuggestionTime>
            <SuggestionMessage hasConflict={!!suggestion.conflict}>
              {suggestion.message}
            </SuggestionMessage>

            {suggestion.conflict && (
              <>
                <ConflictBadge>
                  <ConflictText>{suggestion.conflict.message}</ConflictText>
                </ConflictBadge>

                {suggestion.alternatives && suggestion.alternatives.length > 0 && (
                  <AlternativeTimesContainer>
                    {suggestion.alternatives.map((alt, index) => (
                      <AlternativeTimeButton
                        key={index}
                        onPress={() => handleAlternativePress(suggestion, alt.time)}
                      >
                        <AlternativeTimeText>
                          {formatAlternativeTime(alt.offset)}
                        </AlternativeTimeText>
                      </AlternativeTimeButton>
                    ))}
                  </AlternativeTimesContainer>
                )}
              </>
            )}
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
