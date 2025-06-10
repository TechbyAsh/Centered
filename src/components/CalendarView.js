import React, { useEffect, useState } from 'react';
import styled from '@emotion/native';
import { View, ActivityIndicator } from 'react-native';
import { useCalendarManager } from '../services/calendar/CalendarManager';
import { format } from 'date-fns';

const Container = styled.View`
  background-color: white;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
  elevation: 3;
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
`;

const EventList = styled.ScrollView`
  max-height: 300px;
`;

const EventItem = styled.View`
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  background-color: ${props => props.isCurrent ? '#E6F3F8' : '#F8F8F8'};
  border-left-width: 4px;
  border-left-color: ${props => props.isCurrent ? '#00A896' : '#DDD'};
`;

const EventTime = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
`;

const EventTitle = styled.Text`
  font-size: 16px;
  color: #333;
  font-weight: ${props => props.isCurrent ? '600' : 'normal'};
`;

const NoEventsText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  padding: 20px;
`;

const ErrorContainer = styled.View`
  padding: 20px;
  align-items: center;
`;

const ErrorText = styled.Text`
  color: #666;
  text-align: center;
  margin-bottom: 10px;
`;

const RetryButton = styled.TouchableOpacity`
  padding: 8px 16px;
  background-color: #00A896;
  border-radius: 8px;
`;

const RetryText = styled.Text`
  color: white;
  font-weight: 600;
`;

export const CalendarView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calendarManager = useCalendarManager();

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const todayEvents = await calendarManager.getEvents(startOfDay, endOfDay);
      setEvents(todayEvents);
    } catch (err) {
      setError('Failed to load calendar events');
      console.error('Calendar load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const isCurrentEvent = (event) => {
    const now = new Date().getTime();
    const start = new Date(event.startDate).getTime();
    const end = new Date(event.endDate).getTime();
    return now >= start && now <= end;
  };

  if (loading) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#00A896" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorText>{error}</ErrorText>
          <RetryButton onPress={loadEvents}>
            <RetryText>Retry</RetryText>
          </RetryButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Today's Schedule</Title>
      <EventList showsVerticalScrollIndicator={false}>
        {events.length === 0 ? (
          <NoEventsText>No events scheduled for today</NoEventsText>
        ) : (
          events.map((event) => (
            <EventItem key={event.id} isCurrent={isCurrentEvent(event)}>
              <EventTime>
                {format(new Date(event.startDate), 'h:mm a')} - {format(new Date(event.endDate), 'h:mm a')}
              </EventTime>
              <EventTitle isCurrent={isCurrentEvent(event)}>
                {event.title}
              </EventTitle>
            </EventItem>
          ))
        )}
      </EventList>
    </Container>
  );
};
