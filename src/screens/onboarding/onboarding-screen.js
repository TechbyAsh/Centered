import React from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

import { Pagination } from './components/pagination';
import { data } from './screen.data';

const RenderItem = ({ item, index }) => {
  const theme = useTheme();
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  return (
    <ItemContainer screenWidth={SCREEN_WIDTH}>
      <ContentContainer>
        <ImageWrapper screenWidth={SCREEN_WIDTH}>
          <StyledImage 
            source={item.image} 
            resizeMode="contain"
          />
        </ImageWrapper>
        <TextContainer>
          <ItemTitle>{item.title}</ItemTitle>
          <ItemText>{item.text}</ItemText>
        </TextContainer>
      </ContentContainer>
    </ItemContainer>
  );
};

export function OnboardingScreen({ navigation }) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const handleGetStarted = () => {
    navigation.replace('Welcome');
  };

  const handleScroll = (event) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setCurrentIndex(newIndex);
  };

  return (
    <Container>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => <RenderItem index={index} item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
      <FooterContainer>
        <ButtonContainer>
          <SkipButton onPress={handleGetStarted}>
            <SkipText>Skip</SkipText>
          </SkipButton>
        </ButtonContainer>
        <Pagination data={data} currentIndex={currentIndex} />
      </FooterContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const ItemContainer = styled.View`
  width: ${props => props.screenWidth}px;
  height: 100%;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ContentContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ImageWrapper = styled.View`
  width: ${props => props.screenWidth * 0.8}px;
  height: ${props => props.screenWidth * 0.6}px;
  margin-bottom: 40px;
`;

const StyledImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const TextContainer = styled.View`
  width: 100%;
  padding: 0 20px;
  margin-bottom: 80px;
`;

const FooterContainer = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background-color: ${props => props.theme.colors.background};
`;

const ButtonContainer = styled.View`
  align-items: center;
  margin-bottom: 20px;
`;

const SkipButton = styled.TouchableOpacity`
  padding: 16px 32px;
`;

const SkipText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  opacity: 0.8;
  font-family: ${props => props.theme.fonts.body};
`;

const ItemTitle = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 16px;
  font-family: ${props => props.theme.fonts.heading};
`;

const ItemText = styled.Text`
  color: ${props => props.theme.colors.text};
  font-size: 16px;
  text-align: center;
  line-height: 24px;
  font-family: ${props => props.theme.fonts.body};
`;