// Theme configuration for the Pause app based on feature spec requirements
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
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
      color: '#333333',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
      color: '#333333',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      color: '#333333',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
      color: '#333333',
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
      color: '#333333',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
      color: '#333333',
      opacity: 0.7,
    },
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
    base: 8,  // Base unit as specified in the feature spec
    scale: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64], // Spacing scale as specified
    screenHorizontal: 20, // Screen padding horizontal
    screenVertical: 24,   // Screen padding vertical
    cardPadding: 20,      // Card padding
    componentSpacing: 16, // Component spacing between major sections
  },
  borderRadius: {
    small: 8,
    medium: 12,
    large: 20,
    round: 999,
    button: 16,      // For buttons as per spec
    card: 24,        // For cards as per spec
    preferenceCard: 20, // For preference cards
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
    button: {
      shadowColor: '#3E7B8C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    success: {
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  animation: {
    timing: {
      fast: 150,       // Button press
      normal: 200,     // Card selection
      medium: 250,     // Progress indicators
      standard: 300,   // Screen transitions
      slow: 500,       // Success screen fade in
    },
    easing: 'easeInOut',
  },
};
