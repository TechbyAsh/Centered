import React from 'react';
import styled from 'styled-components/native';
import { Modal, Animated, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { SoundMixer } from './SoundMixer';
import { SOUNDSCAPES } from '../infrastructure/audio/soundscapes';

const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled(Animated.View)`
  background-color: #fff;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  padding: 20px;
  padding-bottom: 40px;
  max-height: 80%;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #00A896;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 5px;
`;

const ScrollContent = styled.ScrollView``;

const CategoryContainer = styled.View`
  margin-bottom: 25px;
`;

const CategoryTitle = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
  margin-left: 5px;
`;

export const SoundModal = ({ visible, onClose }) => {
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0]
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <ModalContainer>
          <TouchableWithoutFeedback>
            <ModalContent style={{ transform: [{ translateY }] }}>
              <ModalHeader>
                <Title>Ambient Sounds</Title>
                <CloseButton onPress={onClose}>
                  <Ionicons name="close" size={24} color="#00A896" />
                </CloseButton>
              </ModalHeader>
              <ScrollContent showsVerticalScrollIndicator={false}>
                {Object.values(SOUNDSCAPES).map((category) => (
                  <CategoryContainer key={category.name}>
                    <CategoryTitle>{category.name}</CategoryTitle>
                    <SoundMixer
                      category={category}
                      onError={(error) => Alert.alert('Sound Error', 'Failed to load or play sound.')}
                    />
                  </CategoryContainer>
                ))}
              </ScrollContent>
            </ModalContent>
          </TouchableWithoutFeedback>
        </ModalContainer>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
