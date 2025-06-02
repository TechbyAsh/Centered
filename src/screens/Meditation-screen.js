import React, { useState, useEffect, useRef } from 'react';
import styled from '@emotion/native';
import { ScrollView, Dimensions, TouchableOpacity, Animated, View, Platform, Modal, StatusBar, SafeAreaView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useDashboardData } from '../hooks/useDashboardData';
import { useTheme } from '@emotion/react';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const StyledSafeAreaView = styled(SafeAreaView)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.View`
  padding: 20px;
  margin-bottom: 10px;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TitleContainer = styled.View`
  flex: 1;
`;

const WelcomeText = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 4px;
  font-family: ${props => props.theme.fonts.body};
`;

const Title = styled.Text`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.heading};
  letter-spacing: -0.5px;
`;

const CategorySection = styled.View`
  margin-top: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 20px 15px;
  font-family: ${props => props.theme.fonts.heading};
`;

const CategoryCard = styled(TouchableOpacity)`
  width: ${width - 40}px;
  height: 160px;
  border-radius: 24px;
  margin: 10px 20px;
  overflow: hidden;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
`;

const CardContent = styled.View`
  flex: 1;
  padding: 25px;
  justify-content: space-between;
`;

const CategoryTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: white;
  text-shadow-color: rgba(0, 0, 0, 0.2);
  text-shadow-offset: 1px 1px;
  text-shadow-radius: 3px;
  margin-bottom: 8px;
  font-family: ${props => props.theme.fonts.heading};
`;

const CategoryDescription = styled.Text`
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow-color: rgba(0, 0, 0, 0.1);
  text-shadow-offset: 0px 1px;
  text-shadow-radius: 2px;
  font-family: ${props => props.theme.fonts.body};
`;

const MeditationModal = styled(Modal)`
  margin: 0;
  justify-content: flex-end;
`;

const ModalContent = styled(Animated.View)`
  background-color: ${props => props.theme.colors.background};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px;
  padding-bottom: ${Platform.OS === 'ios' ? 40 : 20}px;
  elevation: 20;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.25;
  shadow-radius: 10px;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.heading};
`;

const MeditationItem = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

const MeditationInfo = styled.View`
  flex: 1;
  margin-right: 15px;
`;

const MeditationTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-bottom: 4px;
  font-family: ${props => props.theme.fonts.heading};
`;

const MeditationDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 8px;
  font-family: ${props => props.theme.fonts.body};
`;

const MeditationDuration = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.fonts.body};
`;

const categories = [
  {
    id: 'breathing',
    title: 'Breathing & Harmony',
    gradient: ['#4FC3F7', '#2196F3'],
    description: 'Discover peaceful breathing exercises for harmony and balance',
    meditations: [
      { id: 'morning-breath', title: 'Morning Awakening', duration: 9, description: 'Start your day with mindful breathing' },
      { id: 'calm-breath', title: 'Calming Breath', duration: 5, description: 'Find serenity through breath' },
    ],
  },
  {
    id: 'selfcare',
    title: 'Self-Care',
    gradient: ['#FFD54F', '#FFA726'],
    description: 'Nurture your mind and body with gentle self-care practices',
    meditations: [
      { id: 'self-love', title: 'Self-Love Practice', duration: 10, description: 'Cultivate compassion and acceptance' },
      { id: 'stress-relief', title: 'Stress Relief', duration: 7, description: 'Release tension and find peace' },
    ],
  },
  {
    id: 'sleep',
    title: 'Sleep Meditation',
    gradient: ['#CE93D8', '#9C27B0'],
    description: 'Find deep rest and peaceful sleep with calming meditations',
    meditations: [
      { id: 'bedtime', title: 'Bedtime Relaxation', duration: 15, description: 'Gentle guidance into restful sleep' },
      { id: 'night-peace', title: 'Peaceful Night', duration: 20, description: 'Deep relaxation for better sleep' },
    ],
  },
  {
    id: 'mindful',
    title: 'Mindful Awareness',
    gradient: ['#81C784', '#4CAF50'],
    description: 'Develop present-moment awareness and clarity',
    meditations: [
      { id: 'present-moment', title: 'Present Moment', duration: 8, description: 'Connect with the now' },
      { id: 'mindful-scan', title: 'Body Scan', duration: 12, description: 'Mindful awareness of your body' },
    ],
  },
  {
    id: 'growth',
    title: 'Personal Growth',
    gradient: ['#F48FB1', '#E91E63'],
    description: 'Transform and evolve with growth-focused meditations',
    meditations: [
      { id: 'inner-wisdom', title: 'Inner Wisdom', duration: 10, description: 'Connect with your inner guidance' },
      { id: 'confidence', title: 'Confidence Builder', duration: 8, description: 'Strengthen self-belief and purpose' },
    ],
  },
];

const meditations = [
  {
    id: 1,
    title: 'Quick Calm',
    description: 'A brief meditation to find peace in a busy day',
    duration: 3,
    audioFile: require('../../assets/meditations/placeholder.mp3'),
  },
  {
    id: 2,
    title: 'Mindful Break',
    description: 'Take a mindful pause to reset and refocus',
    duration: 5,
    audioFile: require('../../assets/meditations/placeholder.mp3'),
  },
  {
    id: 3,
    title: 'Stress Relief',
    description: 'Release tension and find your center',
    duration: 7,
    audioFile: require('../../assets/meditations/placeholder.mp3'),
  },
];

export const MeditationScreen = ({ navigation }) => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const modalAnimation = useRef(new Animated.Value(0)).current;

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
    Animated.spring(modalAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7
    }).start();
  };

  const handleModalClose = () => {
    Animated.spring(modalAnimation, {
      toValue: 0,
      useNativeDriver: true
    }).start(() => {
      setModalVisible(false);
      setSelectedCategory(null);
    });
  };

  const handleStartMeditation = (meditation) => {
    navigation.navigate('MeditationDetails', {
      meditation,
      category: selectedCategory
    });
    handleModalClose();
  };

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <StyledSafeAreaView>
        <Header>
          <HeaderContent>
            <TitleContainer>
              <WelcomeText>Welcome back</WelcomeText>
              <Title>Find Your Peace</Title>
            </TitleContainer>
            <TouchableOpacity
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: theme.colors.cardBackground,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="settings-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </HeaderContent>
        </Header>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 30
          }}
        >
          <CategorySection>
            <SectionTitle>Featured Meditations</SectionTitle>
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                onPress={() => handleCategoryPress(category)}
                style={{
                  transform: [{ scale: 1 }],
                }}
              >
                <LinearGradient
                  colors={category.gradient}
                  start={{ x: 0.1, y: 0.1 }}
                  end={{ x: 0.9, y: 0.9 }}
                  style={{ flex: 1 }}
                >
                  <CardContent>
                    <CategoryTitle>{category.title}</CategoryTitle>
                    <CategoryDescription>{category.description}</CategoryDescription>
                  </CardContent>
                </LinearGradient>
              </CategoryCard>
            ))}
          </CategorySection>
        </ScrollView>

        <MeditationModal
          visible={modalVisible}
          transparent
          animationType="none"
          onRequestClose={handleModalClose}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            activeOpacity={1}
            onPress={handleModalClose}
          >
            <ModalContent
              style={{
                transform: [{
                  translateY: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0]
                  })
                }]
              }}
            >
              <ModalHeader>
                <ModalTitle>{selectedCategory?.title}</ModalTitle>
                <TouchableOpacity onPress={handleModalClose}>
                  <Ionicons name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
              </ModalHeader>

              {selectedCategory?.meditations.map((meditation) => (
                <MeditationItem
                  key={meditation.id}
                  onPress={() => handleStartMeditation(meditation)}
                >
                  <MeditationInfo>
                    <MeditationTitle>{meditation.title}</MeditationTitle>
                    <MeditationDescription>{meditation.description}</MeditationDescription>
                    <MeditationDuration>{meditation.duration} minutes</MeditationDuration>
                  </MeditationInfo>
                  <Ionicons name="play-circle" size={32} color={theme.colors.primary} />
                </MeditationItem>
              ))}
            </ModalContent>
          </TouchableOpacity>
        </MeditationModal>
      </StyledSafeAreaView>
    </Container>
  );
};

export default MeditationScreen;
