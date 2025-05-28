import React from 'react';
import styled from '@emotion/native';
import { ScrollView, Dimensions, TouchableOpacity, View, Text, SafeAreaView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useDashboardData } from '../hooks/useDashboardData';
import { RecommendedActivities } from '../components/RecommendedActivities';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
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

const SessionType = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ChartContainer = styled.View`
  height: 220px;
  margin-vertical: 8px;
  padding: 20px;
  background-color: white;
  border-radius: 16px;
`;

const ChartRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
  height: 140px;
  justify-content: space-between;
`;

const Bar = styled.View`
  width: 30px;
  background-color: #00A896;
  border-radius: 4px;
  height: ${props => props.height}px;
`;

const DayLabel = styled.Text`
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  text-align: center;
`;

export const DashboardScreen = ({ navigation }) => {
  const { 
    weeklyMinutes,
    sessionsCompleted,
    currentStreak,
    chartData,
    recentSessions,
    refreshData
  } = useDashboardData();
  const screenWidth = Dimensions.get('window').width;
  const maxValue = Math.max(...chartData.datasets[0].data, 1);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <Container>
      {/* Header is now handled by CustomHeader in DashboardDrawerNavigator */}
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
        <RecommendedActivities navigation={navigation} />
        <SectionTitle>Your Progress</SectionTitle>

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
        <ChartContainer>
          <ChartRow>
            {chartData.datasets[0].data.map((value, index) => (
              <View key={index} style={{ alignItems: 'center' }}>
                <Bar style={{ height: Math.max((value / maxValue) * 140, 4) }} />
                <DayLabel>{days[index]}</DayLabel>
              </View>
            ))}
          </ChartRow>
        </ChartContainer>

        <RecentSessionsContainer>
          <SectionTitle>Recent Sessions</SectionTitle>
          {recentSessions.map(session => (
            <SessionCard key={session.id}>
              <Ionicons name={session.icon} size={24} color="#00A896" />
              <SessionInfo>
                <SessionType>{session.type}</SessionType>
                <SessionDetails>{session.duration} • {session.time}</SessionDetails>
              </SessionInfo>
            </SessionCard>
          ))}
        </RecentSessionsContainer>
      </ScrollView>
      </Container>
    </SafeAreaView>
  );
};
