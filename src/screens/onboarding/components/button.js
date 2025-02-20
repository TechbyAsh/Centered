import { Feather } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import { theme } from '../../../infrastructure/theme/theme.index';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({ dataLength, flatListIndex, flatListRef }) {

    const navigation = useNavigation();

  const buttonAnimationStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    return {
      width: isLastScreen ? withSpring(140) : withSpring(60),
      height: 60,
    };
  });

  const arrowAnimationStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    return {
      opacity: isLastScreen ? withTiming(0) : withTiming(1),
      transform: [{ translateX: isLastScreen ? withTiming(100) : withTiming(0) }],
    };
  });

  const textAnimationStyle = useAnimatedStyle(() => {
    const isLastScreen = flatListIndex.value === dataLength - 1;
    return {
      opacity: isLastScreen ? withTiming(1) : withTiming(0),
      transform: [{ translateX: isLastScreen ? withTiming(0) : withTiming(-100) }],
    };
  });

  const handleNextScreen = () => {
    console.log("Current Index:", flatListIndex.value);
    console.log("Data Length:", dataLength);
  
    const nextIndex = flatListIndex.value + 1;
    
    if (nextIndex >= dataLength) {
      navigation.navigate("Welcome"); // Navigate if it's the last screen
    } else {
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
  
      flatListIndex.value = nextIndex; // Update index after scrolling
    }
  };

  return (
    <AnimatedPressable onPress={handleNextScreen} style={[styles.container, buttonAnimationStyle]}>
      <Animated.Text style={[styles.text, textAnimationStyle]}>
        Get Started
      </Animated.Text>
      <Animated.View style={[styles.arrow, arrowAnimationStyle]}>
        <Feather name="arrow-right" size={30} color={theme.colors.textHighlightColor} />
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.secondary,
    padding: 10,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  arrow: {
    position: 'absolute',
  },
  text: {
    position: 'absolute',
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
});