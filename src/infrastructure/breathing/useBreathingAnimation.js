import { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';

export const useBreathingAnimation = (pattern, isActive) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.5)).current;
  const animationRef = useRef(null);

  const createBreathSequence = () => {
    const { inhale, hold1, exhale, hold2 } = pattern.sequence;
    
    return Animated.sequence([
      // Inhale
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 3.0,
          duration: inhale,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: inhale,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Hold after inhale
      Animated.delay(hold1),
      // Exhale
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: exhale,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.5,
          duration: exhale,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Hold after exhale
      Animated.delay(hold2),
    ]);
  };

  useEffect(() => {
    if (isActive) {
      animationRef.current = Animated.loop(createBreathSequence());
      animationRef.current.start();
    } else {
      animationRef.current?.stop();
    }

    return () => {
      animationRef.current?.stop();
    };
  }, [isActive, pattern]);

  return {
    scaleAnim,
    glowAnim,
  };
};
