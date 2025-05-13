import React, { useState, useEffect } from 'react';
import styled from '@emotion/native';
import { View } from 'react-native';
import { statistics } from '../../services/statistics';
import { useTheme } from '@emotion/react';

const Container = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

const Card = styled.View`
  background-color: ${props => props.theme.colors.card};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 12px;
`;

const StatRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StatLabel = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.colors.textLight};
`;

const StatValue = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
`;

const ProgressBar = styled.View`
  height: 8px;
  background-color: ${props => props.theme.colors.backgroundLight};
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
`;

const ProgressFill = styled.View`
  height: 100%;
  background-color: ${props => props.theme.colors.primary};
  width: ${props => props.progress}%;
`;

const TimeRangeSelector = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-bottom: 16px;
`;

const TimeRangeButton = styled.TouchableOpacity`
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${props => 
    props.selected ? props.theme.colors.primary : props.theme.colors.backgroundLight};
`;

const TimeRangeText = styled.Text`
  color: ${props => 
    props.selected ? props.theme.colors.white : props.theme.colors.text};
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
`;

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

export const TransitionStats = () => {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, [timeRange]);

  const loadStats = async () => {
    const data = await statistics.getStats(timeRange);
    setStats(data);
  };

  if (!stats) return null;

  const weeklyProgress = (stats.weeklyGoals.progress / stats.weeklyGoals.target) * 100;

  return (
    <Container showsVerticalScrollIndicator={false}>
      <TimeRangeSelector>
        {[
          { label: '24h', value: '24h' },
          { label: '7d', value: '7d' },
          { label: '30d', value: '30d' },
          { label: 'All', value: 'all' },
        ].map(range => (
          <TimeRangeButton
            key={range.value}
            selected={timeRange === range.value}
            onPress={() => setTimeRange(range.value)}
          >
            <TimeRangeText selected={timeRange === range.value}>
              {range.label}
            </TimeRangeText>
          </TimeRangeButton>
        ))}
      </TimeRangeSelector>

      {/* Weekly Goals */}
      <Card>
        <Title>Weekly Progress</Title>
        <StatRow>
          <StatLabel>Transitions Completed</StatLabel>
          <StatValue>{stats.weeklyGoals.progress} / {stats.weeklyGoals.target}</StatValue>
        </StatRow>
        <ProgressBar>
          <ProgressFill progress={Math.min(weeklyProgress, 100)} />
        </ProgressBar>
      </Card>

      {/* Streaks */}
      <Card>
        <Title>Streaks</Title>
        <StatRow>
          <StatLabel>Current Streak</StatLabel>
          <StatValue>{stats.streaks.current} days</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Longest Streak</StatLabel>
          <StatValue>{stats.streaks.longest} days</StatValue>
        </StatRow>
      </Card>

      {/* Summary */}
      <Card>
        <Title>Summary</Title>
        <StatRow>
          <StatLabel>Total Transitions</StatLabel>
          <StatValue>{stats.summary.total}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Completed</StatLabel>
          <StatValue>{stats.summary.completed}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Skipped</StatLabel>
          <StatValue>{stats.summary.skipped}</StatValue>
        </StatRow>
        <StatRow>
          <StatLabel>Total Time</StatLabel>
          <StatValue>{formatDuration(stats.summary.totalDuration)}</StatValue>
        </StatRow>
      </Card>

      {/* Type Breakdown */}
      <Card>
        <Title>Transition Types</Title>
        {Object.entries(stats.typeBreakdown).map(([type, count]) => (
          <StatRow key={type}>
            <StatLabel>{type}</StatLabel>
            <StatValue>{count}</StatValue>
          </StatRow>
        ))}
      </Card>

      {/* Time of Day */}
      <Card>
        <Title>Time of Day</Title>
        {Object.entries(stats.timeOfDayBreakdown).map(([time, count]) => (
          <StatRow key={time}>
            <StatLabel>{time.charAt(0).toUpperCase() + time.slice(1)}</StatLabel>
            <StatValue>{count}</StatValue>
          </StatRow>
        ))}
      </Card>
    </Container>
  );
};
