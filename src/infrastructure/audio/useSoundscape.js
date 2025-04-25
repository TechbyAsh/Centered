import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';

export const useSoundscape = () => {
  const [sounds, setSounds] = useState(new Map());
  const [isLoading, setIsLoading] = useState(false);

  const loadSound = async (soundConfig) => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        soundConfig.source,
        {
          isLooping: true,
          volume: soundConfig.defaultVolume,
          shouldPlay: false,
        }
      );
      
      sounds.set(soundConfig.id, {
        sound,
        isPlaying: false,
        volume: soundConfig.defaultVolume,
        config: soundConfig,
      });
      
      setSounds(new Map(sounds));
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  };

  const unloadSound = async (soundId) => {
    const soundData = sounds.get(soundId);
    if (soundData) {
      await soundData.sound.unloadAsync();
      sounds.delete(soundId);
      setSounds(new Map(sounds));
    }
  };

  const playSound = async (soundId) => {
    const soundData = sounds.get(soundId);
    if (soundData) {
      try {
        await soundData.sound.playAsync();
        sounds.set(soundId, { ...soundData, isPlaying: true });
        setSounds(new Map(sounds));
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    }
  };

  const pauseSound = async (soundId) => {
    const soundData = sounds.get(soundId);
    if (soundData) {
      try {
        await soundData.sound.pauseAsync();
        sounds.set(soundId, { ...soundData, isPlaying: false });
        setSounds(new Map(sounds));
      } catch (error) {
        console.error('Error pausing sound:', error);
      }
    }
  };

  const setVolume = async (soundId, volume) => {
    const soundData = sounds.get(soundId);
    if (soundData) {
      try {
        await soundData.sound.setVolumeAsync(volume);
        sounds.set(soundId, { ...soundData, volume });
        setSounds(new Map(sounds));
      } catch (error) {
        console.error('Error setting volume:', error);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup sounds when component unmounts
      sounds.forEach(async (soundData) => {
        try {
          await soundData.sound.unloadAsync();
        } catch (error) {
          console.error('Error unloading sound:', error);
        }
      });
    };
  }, []);

  return {
    loadSound,
    unloadSound,
    playSound,
    pauseSound,
    setVolume,
    sounds,
    isLoading,
  };
};
