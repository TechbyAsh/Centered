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

### Styling
- Use the app's color palette:
  - Primary: #3E7B8C (calming blue)
  - Secondary: #F0E6D9 (soft cream)
  - Accent: #F9A875 (warm orange)
  - Background: #F8F5F2 (off-white)
  - Text: #333333 (dark gray)
- Font family: "Avenir Next" or system font with fallbacks
- Rounded corners on all containers (12px radius)
- Subtle shadows for depth (low opacity, soft spread)

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