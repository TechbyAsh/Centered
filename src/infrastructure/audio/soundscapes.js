// Using existing sound files from the project for testing
// Mock data for testing UI
export const SOUNDSCAPES = {
  nature: {
    name: 'Nature',
    sounds: [
      {
        id: 'birds',
        name: 'Birds',
        source: require('../../../assets/sounds/birdSound.wav'),
        icon: 'leaf-outline',
        defaultVolume: 0.7,
      },
      {
        id: 'waves',
        name: 'Ocean Waves',
        source: require('../../../assets/sounds/waves.wav'),
        icon: 'water-outline',
        defaultVolume: 0.6,
      },
      {
        id: 'crickets',
        name: 'Night Crickets',
        source: require('../../../assets/sounds/crickets.wav'),
        icon: 'moon-outline',
        defaultVolume: 0.5,
      },
    ],
  },
  ambient: {
    name: 'Ambient',
    sounds: [
      {
        id: 'whiteNoise',
        name: 'White Noise',
        source: require('../../../assets/sounds/white-noise.wav'),
        icon: 'volume-high-outline',
        defaultVolume: 0.4,
      },
      {
        id: 'fire',
        name: 'Fireplace',
        source: require('../../../assets/sounds/fireplace.wav'),
        icon: 'flame-outline',
        defaultVolume: 0.5,
      },
    ],
  },
  weather: {
    name: 'Weather',
    sounds: [
      {
        id: 'rain',
        name: 'Rain',
        source: require('../../../assets/sounds/birdSound.wav'), // Using as placeholder
        icon: 'rainy-outline',
        defaultVolume: 0.6,
      },
      {
        id: 'thunder',
        name: 'Thunder',
        source: require('../../../assets/sounds/birdSound.wav'), // Using as placeholder
        icon: 'thunderstorm-outline',
        defaultVolume: 0.5,
      },
      {
        id: 'wind',
        name: 'Wind',
        source: require('../../../assets/sounds/birdSound.wav'), // Using as placeholder
        icon: 'cloud-outline',
        defaultVolume: 0.4,
      },
    ],
  },
};
