import React from 'react';
import { View } from 'react-native';
import styled from '@emotion/native';
import { useTheme } from '@emotion/react';

const Dot = styled.View`
  height: 10px;
  width: ${props => props.active ? '20px' : '10px'};
  border-radius: 5px;
  background-color: ${props => props.theme.colors.primary};
  margin: 0 8px;
  opacity: ${props => props.active ? 1 : 0.5};
`;

const Container = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
`;

export const Pagination = ({ data, currentIndex = 0 }) => {
  const theme = useTheme();

  return (
    <Container>
      {data.map((_, i) => (
        <Dot key={i} active={i === currentIndex} />
      ))}
    </Container>
  );
};