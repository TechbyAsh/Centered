// Theme configuration for the Pause app
export const theme = {
  colors: {
    primary: '#3E7B8C',    // calming blue
    secondary: '#F0E6D9',  // soft cream
    accent: '#F9A875',     // warm orange
    background: '#F8F5F2', // off-white
    text: '#333333',       // dark gray
    white: '#FFFFFF',
    card: '#FFFFFF',
    border: '#E0E0E0',
    success: '#4CAF50',
    error: '#F44336',
    notification: '#F9A875',
  },
  fonts: {
    heading: 'Avenir-Medium',
    body: 'Avenir-Book',
    fallback: 'System',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 20,
    round: 999,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
  },
  animation: {
    timing: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
  },
};
