export const BREATHING_PATTERNS = {
  default: {
    name: 'Basic Breath',
    description: 'Simple breathing for relaxation',
    sequence: {
      inhale: 4000,
      hold1: 0,
      exhale: 4000,
      hold2: 0,
    },
    color: ['#00A896', '#028090'],
  },
  boxBreathing: {
    name: 'Box Breathing',
    description: 'Equal parts inhale, hold, exhale, and hold for mental clarity',
    sequence: {
      inhale: 4000,
      hold1: 4000,
      exhale: 4000,
      hold2: 4000,
    },
    color: ['#05668D', '#028090'],
  },
  relaxing478: {
    name: '4-7-8 Breathing',
    description: 'Calming breath pattern for stress relief',
    sequence: {
      inhale: 4000,
      hold1: 7000,
      exhale: 8000,
      hold2: 0,
    },
    color: ['#00A896', '#02C39A'],
  },
  deepCalming: {
    name: 'Deep Belly Breath',
    description: 'Deep diaphragmatic breathing for relaxation',
    sequence: {
      inhale: 6000,
      hold1: 2000,
      exhale: 6000,
      hold2: 2000,
    },
    color: ['#028090', '#05668D'],
  },
};
