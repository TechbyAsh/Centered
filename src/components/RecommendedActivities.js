import React, { useState, useEffect } from 'react';
import styled from '@emotion/native';
import { TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRecommendedActivities } from '../services/time-optimization';

const Container = styled.View`
  margin-bottom: 30px;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 15px;
`;

const Card = styled(Animated.View)`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  elevation: 3;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const IconContainer = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => props.color};
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const ActivityName = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
`;

const ActivityDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 4px;
`;

const Duration = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.primary};
`;

const TimeBlock = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.textLight};
  font-style: italic;
  margin-bottom: 15px;
`;

const activityColors = {
  Breathe: '#00A896',
  Meditate: '#FF8C42',
  Relax: '#5C6B9C',
  Ritual: '#2D3A87'
};

const activityIcons = {
  Breathe: 'leaf-outline',
  Meditate: 'flower-outline',
  Relax: 'moon-outline',
  Ritual: 'water-outline'
};

const timeBlockMessages = {
  EARLY_MORNING: 'Perfect for your morning routine',
  MORNING: 'Great way to start your work day',
  LUNCH: 'Ideal during your lunch break',
  AFTERNOON: 'Perfect for an afternoon reset',
  EVENING: 'Help you transition from work',
  NIGHT: 'Prepare for restful sleep'
};

export const RecommendedActivities = ({ navigation }) => {
  const [recommendations, setRecommendations] = useState(null);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    loadRecommendations();
    
    // Refresh recommendations every 30 minutes
    const interval = setInterval(loadRecommendations, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadRecommendations = async () => {
    const newRecommendations = await getRecommendedActivities();
    if (newRecommendations) {
      setRecommendations(newRecommendations);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const navigateToActivity = (activity) => {
    switch (activity.type) {
      case 'Breathe':
        navigation.navigate('Breathe');
        break;
      case 'Meditate':
        navigation.navigate('Meditate');
        break;
      case 'Relax':
        navigation.navigate('Relax');
        break;
      case 'Ritual':
        navigation.navigate('Rituals');
        break;
    }
  };

  if (!recommendations) return null;

  return (
    <Container>
      <Title>Recommended for Now</Title>
      <TimeBlock>{timeBlockMessages[recommendations.timeBlock]}</TimeBlock>

      <TouchableOpacity onPress={() => navigateToActivity(recommendations.primary)}>
        <Card style={{ opacity: fadeAnim }}>
          <IconContainer color={activityColors[recommendations.primary.type]}>
            <Ionicons
              name={activityIcons[recommendations.primary.type]}
              size={24}
              color="white"
            />
          </IconContainer>
          <ContentContainer>
            <ActivityName>{recommendations.primary.name}</ActivityName>
            <ActivityDescription>
              {recommendations.primary.description}
            </ActivityDescription>
            <Duration>{recommendations.primary.duration}</Duration>
          </ContentContainer>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigateToActivity(recommendations.secondary)}>
        <Card style={{ opacity: fadeAnim }}>
          <IconContainer color={activityColors[recommendations.secondary.type]}>
            <Ionicons
              name={activityIcons[recommendations.secondary.type]}
              size={24}
              color="white"
            />
          </IconContainer>
          <ContentContainer>
            <ActivityName>{recommendations.secondary.name}</ActivityName>
            <ActivityDescription>
              {recommendations.secondary.description}
            </ActivityDescription>
            <Duration>{recommendations.secondary.duration}</Duration>
          </ContentContainer>
        </Card>
      </TouchableOpacity>
    </Container>
  );
};
