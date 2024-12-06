import { Dimensions } from 'react-native';

// Should be official northeastern colors
export const COLORS = {
  primary: '#C8102E',
  secondary: '#98D1B5',
  tertiary: '#424344',
  maroon: '#630B0B',
  black: '#000000',
  white: '#FFFFFF',
};

export const isTablet = Dimensions.get('window').width >= 768;

export const FONTSIZES = {
  small: isTablet ? 20 : 16,
  medium: isTablet ? 24 : 20,
  large: isTablet ? 28 : 24,
};

export const DIMENSIONS = {
  componentWidth: isTablet ? '90%' : '95%',
  cornerCurve: isTablet ? 8 : 5,
};

// Valid emails domains. gmail is included for testing purposes and should be removed in production.
export const VALIDEMAILS = ['northeastern.edu', 'husky.neu.edu', 'gmail.com'];

// The campuses that are available for selection
export const CAMPUSES = ['Boston', 'Oakland', 'London', 'Seattle'];

export function createTimeRange(startDateTime, durationMinutes) {
  const startDate = new Date(startDateTime);

  const startHours = startDate.getHours();
  const startMinutes = startDate.getMinutes();

  const endDate = new Date(startDate.getTime() + durationMinutes * 60000);

  const startTime = startDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const endTime = endDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return `${startTime} - ${endTime}`;
}

export const adjustDateToLocal = (isoDateString) => {
  const date = new Date(isoDateString);
  const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  return localDate;
};
