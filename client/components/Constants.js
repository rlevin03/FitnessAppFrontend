export const COLORS = {
  primary: '#C8102E',
  secondary: '#98D1B5',
  tertiary: '#424344',
  maroon: '#630B0B',
  black: '#000000',
  white: '#FFFFFF',
};

export const FONTSIZES = {
  small: 16,
  medium: 20,
  large: 24,
};

export const DIMENSIONS = {
  componentWidth: '95%',
  cornerCurve: 5,
};

export const VALIDEMAILS = ['northeastern.edu', 'husky.neu.edu', 'gmail.com'];

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
