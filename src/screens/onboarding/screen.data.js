// Onboarding walkthrough data based on the feature specification
export const walkthroughData = [
  {
    id: 1,
    image: require('../../../assets/assets-1/center-img1.png'),
    title: 'Welcome to Pause',
    text: 'Your companion for mindful transitions throughout the day. Transform the moments between tasks into opportunities for calm and clarity.',
  },
  {
    id: 2,
    image: require('../../../assets/assets-1/centered-img2.png'),
    title: 'What is a Pause Moment?',
    text: 'A short, intentional break that helps you reset mentally and physically. These micro-breaks create space between activities for better focus and well-being.',
  },
  {
    id: 3,
    image: require('../../../assets/assets-1/centered-img3.png'),
    title: 'Benefits of Mindful Breaks',
    text: 'Research shows that brief pauses reduce stress by 29%, improve focus by 35%, and enhance creative thinking. Just 2 minutes can make a difference.',
  },
  {
    id: 4,
    image: require('../../../assets/assets-1/splash-icon.png'),
    title: 'How Pause Structures Transitions',
    text: 'We help you create gentle boundaries between activities with timely reminders, guided exercises, and personalized rituals tailored to your schedule.',
  },
];

// Time options for schedule setup
export const timeOptions = {
  workStart: ['07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00'],
  workEnd: ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'],
  lunchTime: ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00'],
};

// Pause type options
export const pauseTypeOptions = [
  {
    id: 'breathing',
    title: 'Breathing Exercises',
    description: 'Guided breathing with visual cues',
    icon: 'leaf-outline',
  },
  {
    id: 'soundscapes',
    title: 'Soundscapes',
    description: 'Nature sounds and ambient music',
    icon: 'musical-notes-outline',
  },
  {
    id: 'meditations',
    title: 'Mini-Meditations',
    description: 'Short guided meditation sessions',
    icon: 'moon-outline',
  },
  {
    id: 'rituals',
    title: 'Rest Rituals',
    description: 'Customized relaxation sequences',
    icon: 'repeat-outline',
  },
];

// Notification options
export const notificationOptions = [
  {
    id: 'haptic',
    title: 'Haptic Feedback',
    description: 'Gentle vibration reminders',
    icon: 'phone-portrait-outline',
  },
  {
    id: 'sound',
    title: 'Sound Alerts',
    description: 'Soft audio notifications',
    icon: 'musical-note-outline',
  },
  {
    id: 'visual',
    title: 'Visual Notifications',
    description: 'On-screen reminders',
    icon: 'notifications-outline',
  },
];

// For backward compatibility
export const data = walkthroughData;