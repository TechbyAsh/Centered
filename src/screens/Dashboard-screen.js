import React from 'react';
import styled from 'styled-components/native';
import { ScrollView, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { LineChart } from 'react-native-chart-kit';
import { useDashboardData } from '../hooks/useDashboardData';

const Container = styled.View`
  flex: 1;
  background-color: #F7FFFE;
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-top: 20px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #00A896;
`;

const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const StatCard = styled.View`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  width: 48%;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const StatTitle = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
`;

const StatValue = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #00A896;
`;

const SectionTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  margin-top: 10px;
`;

const StreakContainer = styled.View`
  background-color: white;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const StreakValue = styled.Text`
  font-size: 36px;
  font-weight: bold;
  color: #00A896;
  text-align: center;
`;

const StreakLabel = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-top: 5px;
`;

const RecentSessionsContainer = styled.View`
  margin-top: 20px;
`;

const SessionCard = styled.View`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const SessionInfo = styled.View`
  flex: 1;
  margin-left: 15px;
`;

const SessionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const SessionDetails = styled.Text`
  font-size: 14px;
  color: #666;
  margin-top: 3px;
`;



export const DashboardScreen = ({ navigation }) => {
  const screenWidth = Dimensions.get('window').width;
  const { 
    weeklyMinutes,
    sessionsCompleted,
    currentStreak,
    chartData,
    recentSessions,
    refreshData
  } = useDashboardData();

  return (
    <Container>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header>
          <Title>Dashboard</Title>
          <Ionicons name="settings-outline" size={24} color="#00A896" />
        </Header>

        <StatsContainer>
          <StatCard>
            <StatTitle>Weekly Minutes</StatTitle>
            <StatValue>{weeklyMinutes}</StatValue>
          </StatCard>
          <StatCard>
            <StatTitle>Sessions</StatTitle>
            <StatValue>{sessionsCompleted}</StatValue>
          </StatCard>
        </StatsContainer>

        <StreakContainer>
          <StreakValue>{currentStreak}</StreakValue>
          <StreakLabel>Day Streak</StreakLabel>
        </StreakContainer>

        <SectionTitle>Weekly Progress</SectionTitle>
        <LineChart
          data={chartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 168, 150, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />

        <RecentSessionsContainer>
          <SectionTitle>Recent Sessions</SectionTitle>
          {recentSessions.map(session => (
            <SessionCard key={session.id}>
              <Ionicons name={session.icon} size={24} color="#00A896" />
              <SessionInfo>
                <SessionTitle>{session.type}</SessionTitle>
                <SessionDetails>{session.duration} • {session.time}</SessionDetails>
              </SessionInfo>
            </SessionCard>
          ))}
        </RecentSessionsContainer>
      </ScrollView>
    </Container>
  );
};
