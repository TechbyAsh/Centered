import React, { useEffect } from 'react';
import styled from '@emotion/native';
import { View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useSoundscape } from '../infrastructure/audio/useSoundscape';

const Container = styled.View`
  width: 100%;
  max-height: 200px;
`;

const CategoryTitle = styled.Text`
  font-family: ${props => props.theme.fonts.heading};
  font-size: 18px;
  color: #00A896;
  margin: 10px 0;
  padding-left: 10px;
`;

const SoundButton = styled.TouchableOpacity`
  flex-direction: column;
  align-items: center;
  margin: 0 10px;
  opacity: ${props => props.isPlaying ? 1 : 0.6};
`;

const SoundName = styled.Text`
  color: #00A896;
  font-size: 12px;
  margin-top: 5px;
  text-align: center;
`;

const VolumeContainer = styled.View`
  width: 100px;
  height: 40px;
  margin-top: 5px;
`;

export const SoundMixer = ({ category, onError }) => {
  const { loadSound, unloadSound, playSound, pauseSound, setVolume, sounds } = useSoundscape();

  useEffect(() => {
    // Load sounds when component mounts
    const loadSounds = async () => {
      try {
        await Promise.all(category.sounds.map(sound => loadSound(sound)));
      } catch (error) {
        onError?.(error);
      }
    };
    loadSounds();

    // Cleanup sounds when component unmounts
    return () => {
      category.sounds.forEach(sound => unloadSound(sound.id));
    };
  }, [category]);

  const handleSoundPress = async (soundId) => {
    const soundData = sounds.get(soundId);
    if (soundData?.isPlaying) {
      await pauseSound(soundId);
    } else {
      await playSound(soundId);
    }
  };

  const handleVolumeChange = async (soundId, value) => {
    await setVolume(soundId, value);
  };

  return (
    <Container>
      <CategoryTitle>{category.name}</CategoryTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {category.sounds.map((sound) => {
          const soundData = sounds.get(sound.id);
          const isPlaying = soundData?.isPlaying || false;
          const volume = soundData?.volume || sound.defaultVolume;

          return (
            <SoundButton
              key={sound.id}
              isPlaying={isPlaying}
              onPress={() => handleSoundPress(sound.id)}
            >
              <Ionicons
                name={sound.icon}
                size={24}
                color={isPlaying ? '#00A896' : '#666'}
              />
              <SoundName>{sound.name}</SoundName>
              <VolumeContainer>
                <Slider
                  value={volume}
                  onValueChange={(value) => handleVolumeChange(sound.id, value)}
                  minimumValue={0}
                  maximumValue={1}
                  step={0.1}
                  minimumTrackTintColor="#00A896"
                  maximumTrackTintColor="#E6F7F5"
                  thumbTintColor="#00A896"
                />
              </VolumeContainer>
            </SoundButton>
          );
        })}
      </ScrollView>
    </Container>
  );
};
