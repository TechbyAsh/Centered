# Centered

A mindful transitions app designed to help you create intentional moments of rest and reflection throughout your day.

## Features

### Breathing Patterns Library

- Multiple breathing techniques including Basic Breath, Box Breathing, 4-7-8, and Deep Belly Breathing
- Beautiful, calming animations to guide your breath
- Customizable session durations
- Progress tracking for each session

### Soundscapes

- Rich library of ambient sounds across multiple categories (Nature, Ambient, Music)
- Advanced sound mixing capabilities
- Individual volume controls for each sound
- Create your perfect relaxation atmosphere

### Mindful Transitions Timer

- Gentle transition reminders between activities
- Customizable durations for different transition types:
  - Work to Break
  - Break to Work
  - Morning Start
  - Evening Wind Down
  - Custom transitions
- Smart schedule integration
- Progress tracking and statistics

### Progress Tracking

- Visual countdown displays
- Session history
- Weekly statistics
- Streak tracking for consistency
- Impact measurement on rest goals

## Technical Stack

### Frontend

- React Native
- @emotion/native and @emotion/react for styling
- Reanimated for smooth animations
- AsyncStorage for local data persistence

### State Management

- Context API via AppContext
- Custom hooks for various features:
  - useBreathingAnimation
  - useSoundscape
  - useTimer

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- React Native development environment
- Expo CLI

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd Centered
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
expo start
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── infrastructure/
│   ├── audio/          # Sound system components
│   ├── breathing/      # Breathing patterns and animations
│   ├── context/        # Global state management
│   └── hooks/          # Custom hooks
├── screens/            # Main app screens
└── assets/            # Images, sounds, and other static files
```

## Contributing

We welcome contributions! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
