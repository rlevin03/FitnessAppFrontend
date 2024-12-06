import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from './Constants';

const CalendarStrip = () => {
  const [startOfWeek, setStartOfWeek] = useState(moment().startOf('week'));

  const endOfWeek = useMemo(
    () => startOfWeek.clone().add(6, 'days'),
    [startOfWeek]
  );

  const currentWeek = useMemo(() => {
    const days = [];
    let day = startOfWeek.clone();

    while (day <= endOfWeek) {
      days.push(day.clone());
      day.add(1, 'day');
    }
    return days;
  }, [startOfWeek, endOfWeek]);

  function nextWeek() {
    setStartOfWeek((prev) => prev.clone().add(1, 'week'));
  }

  function prevWeek() {
    setStartOfWeek((prev) => prev.clone().subtract(1, 'week'));
  }

  const dateRender = ({ date }) => {
    return (
      <View>
        <Text style={styles.date}>{date.format('dddd')}</Text>
        <Text style={styles.date}>{date.format('DD')}</Text>
      </View>
    );
  };

  return <View>{dateRender({ date: moment() })}</View>; 
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontColor: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    padding: 15,
  },
});
export default CalendarStrip;
