import React, { useState, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components/native';
import { ScrollView, Dimensions, TouchableOpacity, Animated, View, Platform, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useDashboardData } from '../hooks/useDashboardData';

const { width, height } = Dimensions.get('window');

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  padding-top: ${Platform.OS === 'ios' ? 50 : 20}px;
`;

const Header = styled.View`
  padding: 20px;
  margin-bottom: 20px;
`;

const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
`;

const WelcomeText = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 8px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.heading};
  letter-spacing: -0.5px;
`;

const CardContainer = styled.View`
  position: relative;
  height: ${height * 0.65}px;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
`;

const CategoryCard = styled(TouchableOpacity)`
  position: absolute;
  width: ${width - 40}px;
  height: 130px;
  border-radius: 28px;
  overflow: hidden;
  background-color: ${props => props.theme.colors.background};
`;

const MeditationTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 8px;
`;

const MeditationDescription = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 12px;
`;

const MeditationDuration = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.primary};
`;

const PlayerContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
`;

const ProgressBar = styled.View`
  height: 4px;
  background-color: #eee;
  border-radius: 2px;
  margin: 10px 0;
`;

const Progress = styled(Animated.View)`
  height: 100%;
  background-color: ${props => props.theme.colors.primary};
  border-radius: 2px;
`;

const MetricsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 12px;
  margin: 10px 20px;
`;

const MetricItem = styled.View`
  align-items: center;
`;

const MetricLabel = styled.Text`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const MetricValue = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${props => props.theme.colors.textPrimary};
`;

const MeditationCard = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 16px;
  padding: 20px;
  margin: 10px 20px;
  elevation: 2;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3.84px;
`;

const PlayerControls = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: 10px;
`;

const BottomBar = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background-color: ${props => props.theme.colors.background};
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.colors.border};
  padding-bottom: 20px;
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
    audioFile: require('../assets/meditations/placeholder.mp3'),
  },
  {
    id: 2,
    title: 'Mindful Break',
    description: 'Take a mindful pause to reset and refocus',
    duration: 5,
    audioFile: require('../assets/meditations/placeholder.mp3'),
  },
  {
    id: 3,
    title: 'Stress Relief',
    description: 'Release tension and find your center',
    duration: 7,
    audioFile: require('../assets/meditations/placeholder.mp3'),
  },
];

export const MeditationScreen = ({ navigation }) => {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedMeditation, setSelectedMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const modalAnimation = useRef(new Animated.Value(0)).current;
  const sound = useRef(null);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const { addSession } = useDashboardData();

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

  useEffect(() => {
    return () => {
      if (sound.current) {
        sound.current.unloadAsync();
      }
    };
  }, []);

  const startMeditation = async (meditation) => {
    try {
      if (sound.current) {
        await sound.current.unloadAsync();
      }

      setSelectedMeditation(meditation);
      const { sound: newSound } = await Audio.Sound.createAsync(meditation.audioFile);
      sound.current = newSound;

      sound.current.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setProgress(status.positionMillis / status.durationMillis);
          Animated.timing(progressAnim, {
            toValue: status.positionMillis / status.durationMillis,
            duration: 100,
            useNativeDriver: false,
          }).start();

          if (status.didJustFinish) {
            setIsPlaying(false);
            setProgress(0);
            progressAnim.setValue(0);
            addSession({
              type: 'Meditation',
              duration: meditation.duration,
              name: meditation.title
            });
          }
        }
      });

      await sound.current.playAsync();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing meditation:', error);
    }
  };

  const togglePlayPause = async () => {
    if (sound.current) {
      if (isPlaying) {
        await sound.current.pauseAsync();
      } else {
        await sound.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const stopMeditation = async () => {
    if (sound.current) {
      await sound.current.stopAsync();
      await sound.current.unloadAsync();
      setSelectedMeditation(null);
      setIsPlaying(false);
      setProgress(0);
      progressAnim.setValue(0);
    }
  };

  return (
    <Container>
      <Header>
        <WelcomeText>Welcome back</WelcomeText>
        <HeaderContent>
          <View style={{ flex: 1 }}>
            <Title>Find Your Peace</Title>
          </View>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.colors.card,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="settings-outline" size={22} color={theme.colors.text} />
          </TouchableOpacity>
        </HeaderContent>
      </Header>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          flexGrow: 1,
          justifyContent: 'center',
          paddingBottom: 100
        }}
      >
        <CardContainer>
          {categories.map((category, index) => {
            const reversedIndex = categories.length - 1 - index;
            const bottomPosition = reversedIndex * 70;
            const scale = 1 - (reversedIndex * 0.03);
            const opacity = 1 - (reversedIndex * 0.1);
            
            return (
              <CategoryCard 
                key={category.id} 
                onPress={() => handleCategoryPress(category)}
                style={{
                  transform: [{ translateY: -bottomPosition }, { scale }],
                  opacity,
                  zIndex: index,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 10 - (reversedIndex * 2),
                  },
                  shadowOpacity: 0.3 - (reversedIndex * 0.05),
                  shadowRadius: 15,
                  elevation: 10 - (reversedIndex * 2),
                }}
              >
                <LinearGradient
                  colors={category.gradient}
                  start={{ x: 0.1, y: 0.1 }}
                  end={{ x: 0.9, y: 0.9 }}
                  style={{
                    flex: 1,
                    padding: 25,
                    justifyContent: 'space-between',
                  }}
                >
                  <View>
                    <MeditationTitle 
                      style={{ 
                        color: 'white',
                        fontSize: 24,
                        fontWeight: '700',
                        textShadowColor: 'rgba(0, 0, 0, 0.2)',
                        textShadowOffset: { width: 1, height: 1 },
                        textShadowRadius: 3,
                        marginBottom: 8
                      }}
                    >
                      {category.title}
                    </MeditationTitle>
                    <MeditationDescription 
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: 15,
                        textShadowColor: 'rgba(0, 0, 0, 0.1)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 2
                      }}
                    >
                      {category.meditations.length} meditations
                    </MeditationDescription>
                  </View>
                </LinearGradient>
              </CategoryCard>
            );
          })}
        </CardContainer>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={handleModalClose}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            opacity: modalAnimation
          }}
        >
          <Animated.View
            style={{
              width: width - 40,
              backgroundColor: theme.colors.background,
              borderRadius: 25,
              padding: 20,
              transform: [
                {
                  scale: modalAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }
              ]
            }}
          >
            {selectedCategory && (
              <>
                <LinearGradient
                  colors={selectedCategory.gradient}
                  style={{
                    height: 120,
                    margin: -20,
                    marginBottom: 20,
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    padding: 20,
                    justifyContent: 'center'
                  }}
                >
                  <Title style={{ color: 'white', fontSize: 28 }}>{selectedCategory.title}</Title>
                  <MeditationDescription style={{ color: 'white' }}>
                    {selectedCategory.description}
                  </MeditationDescription>
                </LinearGradient>

                <ScrollView style={{ maxHeight: height * 0.4 }}>
                  {selectedCategory.meditations?.map(meditation => (
                    <TouchableOpacity
                      key={meditation.id}
                      style={{
                        padding: 15,
                        backgroundColor: theme.colors.card,
                        borderRadius: 15,
                        marginBottom: 10
                      }}
                      onPress={() => handleStartMeditation(meditation)}
                    >
                      <MeditationTitle>{meditation.title}</MeditationTitle>
                      <MeditationDescription>{meditation.description}</MeditationDescription>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                        <Ionicons name="time-outline" size={16} color={theme.colors.primary} />
                        <MeditationDuration> {meditation.duration} minutes</MeditationDuration>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  onPress={handleModalClose}
                  style={{ position: 'absolute', right: 20, top: 20 }}
                >
                  <Ionicons name="close" size={24} color="white" />
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </Animated.View>
      </Modal>

      {selectedMeditation && (
        <PlayerContainer>
          <MeditationTitle>{selectedMeditation.title}</MeditationTitle>
          <ProgressBar>
            <Progress style={{ width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            })}} />
          </ProgressBar>
          <PlayerControls>
            <TouchableOpacity onPress={togglePlayPause}>
              <Ionicons
                name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={50}
                color="#00A896"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={stopMeditation}>
              <Ionicons name="stop-circle" size={50} color="#00A896" />
            </TouchableOpacity>
          </PlayerControls>
        </PlayerContainer>
      )}
    </Container>
  );
};

export default MeditationScreen;
