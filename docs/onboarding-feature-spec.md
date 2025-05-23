# Pause App - Onboarding & Setup Feature Specification

## Overview

The Onboarding & Setup feature is the user's first experience with Pause, introducing them to the app's core concept of "Pause Moments" and collecting necessary preferences to deliver a personalized experience. This specification outlines the requirements, flows, components, and acceptance criteria for implementation.

## Feature Purpose

To create a welcoming, informative, and efficient onboarding experience that:

1. Explains the app's value proposition clearly
2. Collects essential user preferences
3. Sets the tone for the app's mindful, calming aesthetic
4. Ensures users can quickly begin using the app's core functionality

## User Story

As a new user (Sarah), I want to be guided through a simple, calming setup process so I can understand what Pause Moments are and customize the app to fit my daily routine and preferences.

## Components & Screens

### 1. Welcome Animation & Introduction

- **Screen**: Initial Launch Screen
- **Description**: Soft, calming animation that transitions into the app's introduction
- **Components**:
  - Loading animation (branded, mindfulness-themed)
  - App logo reveal
  - Tagline display
  - "Get Started" button

### 2. Value Proposition Walkthrough (3-4 screens)

- **Screen**: Walkthrough Carousel
- **Description**: Brief, visual explanation of key concepts
- **Components**:
  - Horizontally swipeable carousel with pagination indicators
  - Screen 1: "What is a Pause Moment?" with illustration
  - Screen 2: "Benefits of small mindful breaks" with visual data points
  - Screen 3: "How Pause structures your transitions" with timeline visualization
  - "Next" and "Back" navigation options
  - "Skip" option (top corner)

### 3. Schedule Block Setup

- **Screen**: Daily Schedule Configuration
- **Description**: Collection of typical daily schedule information
- **Components**:
  - Time picker for work start/end times
  - Time picker for lunch break
  - Optional additional break time slots (+ button to add more)
  - Time zone detection (with manual override option)
  - Progress indicator showing onboarding completion stage
  - "Continue" button

### 4. Pause Type Preferences

- **Screen**: Pause Moment Preferences
- **Description**: Selection of preferred pause activities
- **Components**:
  - Visual selection cards for each pause type:
    - Breathing exercises (toggleable)
    - Soundscapes (toggleable)
    - Mini-meditations (toggleable)
    - Rest rituals (toggleable)
  - Preview button for each type that shows a 5-second demo
  - "Select All" option
  - Progress indicator
  - "Continue" button

### 5. Notification Preferences

- **Screen**: Notification Setup
- **Description**: Configuration of how and when the app will prompt for Pause Moments
- **Components**:
  - Toggle switches for notification types:
    - Haptic feedback
    - Sound alerts
    - Visual notifications
  - Slider for notification frequency (1-10 scale)
  - Time-based blackout periods selector (when not to send notifications)
  - Permission request preparation message
  - Progress indicator
  - "Continue" button

### 6. Permissions Request

- **Screen**: System Permissions
- **Description**: Native permission requests with contextual explanation
- **Components**:
  - Notifications permission request with explanation
  - Optional: Calendar access for schedule awareness (if applicable)
  - Optional: Health app integration for stress tracking (if applicable)
  - Progress indicator
  - "Continue" button

### 7. Completion & First Pause Moment

- **Screen**: Onboarding Completion
- **Description**: Celebration of setup completion with immediate value delivery
- **Components**:
  - Success animation
  - "You're all set!" message
  - Summary of selected preferences
  - "Try your first Pause Moment" button
  - Skip option to go directly to home screen

## Technical Specifications

### State Management

- User preferences to be stored in Context API and persisted with AsyncStorage
- Onboarding completion flag to prevent repeated onboarding
- Step tracking for multi-screen progression

### Data Models

```typescript
// User Preferences Model
interface UserSchedule {
  workStartTime: string; // ISO time format
  workEndTime: string; // ISO time format
  lunchTime: string; // ISO time format
  additionalBreaks: Array<{
    startTime: string;
    endTime: string;
    label?: string;
  }>;
  timezone: string;
}

interface PausePreferences {
  includeBreathing: boolean;
  includeSoundscapes: boolean;
  includeMeditations: boolean;
  includeRituals: boolean;
  favoriteTypes?: string[]; // IDs of favorite activities
}

interface NotificationPreferences {
  enableHaptic: boolean;
  enableSound: boolean;
  enableVisual: boolean;
  frequency: number; // 1-10 scale
  blackoutPeriods: Array<{
    startTime: string;
    endTime: string;
    daysOfWeek: number[]; // 0-6, Sunday-Saturday
  }>;
}

interface OnboardingState {
  completed: boolean;
  currentStep: number;
  schedule: UserSchedule;
  pausePreferences: PausePreferences;
  notificationPreferences: NotificationPreferences;
  permissionsGranted: {
    notifications: boolean;
    calendar?: boolean;
    healthKit?: boolean;
  };
}
```

### Navigation Flow

- Linear progression through screens 1-7
- Option to skip to completion from any screen after the value proposition
- Return to any previous step allowed
- On completion, navigate to home screen with first pause moment suggestion

### Animation Requirements

- Smooth transitions between screens (slide or fade animations)
- Micro-interactions on selection components
- Breathing animation example on Pause Type screen
- Success animation on completion screen
- All animations should maintain the calm, mindful aesthetic

### API Endpoints (if applicable)

- `POST /api/users/preferences` - Save initial user preferences to backend
- `GET /api/recommendations/initial` - Fetch initial pause moment recommendations

## Accessibility Requirements

- Support for VoiceOver/TalkBack
- Sufficient color contrast (WCAG AA compliance)
- Touch targets minimum size of 44×44 points
- Support for larger text sizes
- Alternative text for all images and animations

## Implementation Guidelines

### Design System & Styling

#### Color Palette

```javascript
export const theme = {
  colors: {
    primary: "#3E7B8C", // calming blue
    secondary: "#F0E6D9", // soft cream
    accent: "#F9A875", // warm orange
    background: "#F8F5F2", // off-white
    text: "#333333", // dark gray
    white: "#FFFFFF",
    card: "#FFFFFF",
    border: "#E0E0E0",
    success: "#4CAF50",
    error: "#F44336",
    notification: "#F9A875",
  },
};
```

#### Typography System

```javascript
const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700",
    lineHeight: 40,
    color: theme.colors.text,
  },
  h2: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 32,
    color: theme.colors.text,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 28,
    color: theme.colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    color: theme.colors.text,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    color: theme.colors.text,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 16,
    color: theme.colors.text,
    opacity: 0.7,
  },
};
```

#### Layout & Spacing System

- Base unit: 8px
- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px
- Screen padding: 20px horizontal, 24px vertical
- Card padding: 20px
- Component spacing: 16px between major sections

#### Component Styling Specifications

##### Welcome Animation Screen

```styled-components
const WelcomeContainer = styled.View`
  flex: 1;
  background: linear-gradient(135deg, ${theme.colors.primary}15 0%, ${theme.colors.accent}10 100%);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LogoContainer = styled.View`
  width: 120px;
  height: 120px;
  background: ${theme.colors.white};
  border-radius: 60px;
  justify-content: center;
  align-items: center;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 16px;
  elevation: 8;
  margin-bottom: 40px;
`;

const WelcomeTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 12px;
`;

const WelcomeSubtitle = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.colors.text};
  opacity: 0.7;
  text-align: center;
  line-height: 24px;
  margin-bottom: 48px;
`;
```

##### Walkthrough Carousel Screens

```styled-components
const CarouselContainer = styled.View`
  flex: 1;
  background: ${theme.colors.background};
`;

const CarouselCard = styled.View`
  flex: 1;
  background: ${theme.colors.white};
  margin: 20px;
  border-radius: 24px;
  padding: 32px 24px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.08;
  shadow-radius: 16px;
  elevation: 4;
  justify-content: space-between;
`;

const IllustrationContainer = styled.View`
  height: 240px;
  background: linear-gradient(135deg, ${theme.colors.secondary} 0%, ${theme.colors.accent}20 100%);
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`;

const CarouselTitle = styled.Text`
  font-size: 24px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
`;

const CarouselDescription = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.colors.text};
  opacity: 0.8;
  text-align: center;
  line-height: 24px;
  margin-bottom: 32px;
`;

const ProgressIndicator = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const ProgressDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: ${props => props.active ? theme.colors.primary : theme.colors.border};
  margin: 0 4px;
`;
```

##### Primary Button Component

```styled-components
const PrimaryButton = styled.TouchableOpacity`
  background: ${theme.colors.primary};
  padding: 16px 32px;
  border-radius: 16px;
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 8px;
  elevation: 4;
  align-items: center;
  justify-content: center;
  min-height: 56px;
`;

const PrimaryButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.white};
`;

const SecondaryButton = styled.TouchableOpacity`
  background: transparent;
  padding: 16px 32px;
  border-radius: 16px;
  border: 2px solid ${theme.colors.border};
  align-items: center;
  justify-content: center;
  min-height: 56px;
`;

const SecondaryButtonText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.text};
`;
```

##### Preference Selection Cards

```styled-components
const PreferenceCard = styled.TouchableOpacity`
  background: ${props => props.selected ? theme.colors.primary + '10' : theme.colors.white};
  border: 2px solid ${props => props.selected ? theme.colors.primary : theme.colors.border};
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 2;
`;

const PreferenceIcon = styled.View`
  width: 48px;
  height: 48px;
  background: ${props => props.selected ? theme.colors.primary : theme.colors.secondary};
  border-radius: 24px;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const PreferenceTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${theme.colors.text};
  margin-bottom: 4px;
`;

const PreferenceDescription = styled.Text`
  font-size: 14px;
  font-weight: 400;
  color: ${theme.colors.text};
  opacity: 0.7;
  line-height: 20px;
`;
```

##### Time Picker Styling

```styled-components
const TimePickerContainer = styled.View`
  background: ${theme.colors.white};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid ${theme.colors.border};
`;

const TimePickerLabel = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.text};
  margin-bottom: 12px;
`;

const TimePickerButton = styled.TouchableOpacity`
  background: ${theme.colors.secondary};
  padding: 16px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.border};
  align-items: center;
`;

const TimePickerText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.text};
`;
```

##### Toggle Switch Styling

```styled-components
const ToggleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid ${theme.colors.border};
`;

const ToggleLabel = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.text};
  flex: 1;
`;

const CustomToggle = styled.TouchableOpacity`
  width: 48px;
  height: 28px;
  background: ${props => props.active ? theme.colors.primary : theme.colors.border};
  border-radius: 14px;
  justify-content: center;
  padding: 2px;
`;

const ToggleThumb = styled.View`
  width: 24px;
  height: 24px;
  background: ${theme.colors.white};
  border-radius: 12px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
  align-self: ${props => props.active ? 'flex-end' : 'flex-start'};
`;
```

##### Success Animation Screen

```styled-components
const SuccessContainer = styled.View`
  flex: 1;
  background: ${theme.colors.background};
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SuccessIcon = styled.View`
  width: 120px;
  height: 120px;
  background: ${theme.colors.success};
  border-radius: 60px;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
  shadow-color: ${theme.colors.success};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.2;
  shadow-radius: 16px;
  elevation: 8;
`;

const SuccessTitle = styled.Text`
  font-size: 28px;
  font-weight: 700;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
`;

const SuccessDescription = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.colors.text};
  opacity: 0.8;
  text-align: center;
  line-height: 24px;
  margin-bottom: 48px;
`;
```

#### Animation Specifications

- Screen transitions: Slide animation with 300ms duration and easeInOut timing
- Button press: Scale down to 0.95 with 150ms duration
- Card selection: Scale to 1.02 with 200ms duration
- Success screen: Fade in with 500ms duration + scale from 0.8 to 1.0
- Progress indicators: Smooth width/color transitions with 250ms duration

#### Additional UI Components & Patterns

##### Header Component

```styled-components
const OnboardingHeader = styled.View`
  padding: 24px 20px 16px;
  background: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.border};
`;

const SkipButton = styled.TouchableOpacity`
  position: absolute;
  top: 24px;
  right: 20px;
  padding: 8px 16px;
  background: ${theme.colors.white};
  border-radius: 20px;
  border: 1px solid ${theme.colors.border};
`;

const SkipText = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text};
  opacity: 0.7;
`;
```

##### Input Field Styling

```styled-components
const InputContainer = styled.View`
  margin-bottom: 20px;
`;

const InputLabel = styled.Text`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text};
  margin-bottom: 8px;
`;

const InputField = styled.TextInput`
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.border};
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: ${theme.colors.text};
  min-height: 48px;
`;

const InputFieldFocused = styled(InputField)`
  border-color: ${theme.colors.primary};
  shadow-color: ${theme.colors.primary};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.15;
  shadow-radius: 4px;
  elevation: 2;
`;
```

##### Slider Component

```styled-components
const SliderContainer = styled.View`
  margin: 16px 0;
`;

const SliderTrack = styled.View`
  height: 4px;
  background: ${theme.colors.border};
  border-radius: 2px;
  position: relative;
`;

const SliderProgress = styled.View`
  height: 4px;
  background: ${theme.colors.primary};
  border-radius: 2px;
  width: ${props => props.progress}%;
`;

const SliderThumb = styled.View`
  width: 20px;
  height: 20px;
  background: ${theme.colors.white};
  border: 2px solid ${theme.colors.primary};
  border-radius: 10px;
  position: absolute;
  top: -8px;
  left: ${props => props.position}%;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;
```

##### Modal/Overlay Styling

```styled-components
const ModalOverlay = styled.View`
  flex: 1;
  background: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContent = styled.View`
  background: ${theme.colors.white};
  border-radius: 20px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 16px;
  elevation: 8;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: 16px;
`;
```

##### Loading States

```styled-components
const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: ${theme.colors.background};
`;

const LoadingSpinner = styled.ActivityIndicator`
  margin-bottom: 16px;
`;

const LoadingText = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: ${theme.colors.text};
  opacity: 0.7;
`;
```

#### Design Tokens & Constants

```javascript
export const designTokens = {
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xlarge: 20,
    round: 50,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  shadows: {
    light: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    heavy: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  animations: {
    fast: 150,
    medium: 250,
    slow: 350,
  },
};
```

### Performance Considerations

- Optimize animations for lower-end devices
- Lazy load assets for faster initial rendering
- Minimize network requests during onboarding
- Cache user preferences immediately after each step

## Testing Criteria

### Unit Tests

- Validation of time inputs
- State management for multi-screen flow
- Persistence of preferences

### Integration Tests

- End-to-end onboarding flow completion
- Permissions handling and fallbacks
- Navigation between screens

### Acceptance Criteria

1. User can complete full onboarding in under 2 minutes
2. All user preferences are correctly saved and applied
3. Notifications are properly configured based on user selection
4. Users understand the concept of "Pause Moments" after onboarding
5. First pause moment suggestion appears immediately after completion
6. Onboarding flow works on both iOS and Android
7. Flow gracefully handles permission denials with explanatory messaging
8. Users who skip portions of onboarding receive reasonable defaults

## Future Enhancements (v2)

- Account creation option
- Cloud sync of preferences
- Personalization based on stress levels or goals
- Integration with calendar for smart scheduling
- Personality-based customization of pause recommendations

## Dependencies

- React Native (with Expo)
- React Navigation for screen transitions
- AsyncStorage for preference persistence
- Expo Permissions API
- Reanimated for advanced animations
- Styled Components for UI
- Expo AV for sound demos

This specification provides a comprehensive blueprint for implementing the Onboarding & Setup feature for the Pause app, with clear guidance on UI components, data structures, and user flow.
