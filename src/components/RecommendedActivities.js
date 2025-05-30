import React, { useState, useEffect } from 'react';
import styled from '@emotion/native';
import { TouchableOpacity, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getRecommendedActivities } from '../services/time-optimization';
import { theme } from '../theme/theme';

const Container = styled.View`
  margin-bottom: 30px;
  padding-horizontal: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 15px;
`;

const Card = styled(Animated.View)`
  background-color: ${theme.colors.white};
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 2px;
      shadow-opacity: 0.1;
      shadow-radius: 4px;
    `,
    android: `
      elevation: 3;
    `
  })}
`;

const IconContainer = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${props => props.color || theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

const ContentContainer = styled.View`
  flex: 1;
`;

const ActivityName = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;

const ActivityDescription = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text}80;
  margin-bottom: 8px;
`;

const Duration = styled.Text`
  font-size: 12px;
  color: ${theme.colors.primary};
  font-weight: 500;
`;

const TimeBlock = styled.Text`
  font-size: 14px;
  color: ${theme.colors.text}80;
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
  const [fadeAnim] = useState(new Animated.Value(0));  // Initialize as state

  useEffect(() => {
    loadRecommendations();
    
    // Refresh recommendations every 30 minutes
    const interval = setInterval(loadRecommendations, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadRecommendations = async () => {
    try {
      console.log('Loading recommendations...');
      const newRecommendations = await getRecommendedActivities();
      console.log('Received recommendations:', newRecommendations);
      if (newRecommendations) {
        setRecommendations(newRecommendations);
        // Reset and start animation
        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      } else {
        console.log('No recommendations received');
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
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
        <Card as={Animated.View} style={{ opacity: fadeAnim }}>
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
        <Card as={Animated.View} style={{ opacity: fadeAnim }}>
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
