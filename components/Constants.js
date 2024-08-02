export const COLORS = {
  primary: "#B80D0D",
  secondary: "#DB8A8A",
  tertiary: "#424344",
  maroon: "#630B0B",
  black: "#000000",
  white: "#FFFFFF",
};

export const FONTSIZES = {
  small: 16,
  medium: 20,
  large: 24,
};

export const DIMENSIONS = {
  componentWidth: "95%",
  cornerCurve: 5,
};

export const VALIDEMAILS = ["northeastern.edu", "husky.neu.edu"];

export function createTimeRange(startTime, durationMinutes) {
  // Parse the start time into a Date object
  const [hours, minutes, period] = startTime
    .match(/(\d+):(\d+)\s*(AM|PM)/i)
    .slice(1);
  let startDate = new Date();
  startDate.setHours(
    period.toUpperCase() === "PM" && hours !== "12"
      ? parseInt(hours) + 12
      : parseInt(hours),
    parseInt(minutes)
  );

  // Create a new Date object for the end time by adding the duration
  let endDate = new Date(startDate);
  endDate.setMinutes(startDate.getMinutes() + durationMinutes);

  // Format the time as "hh:mm AM/PM"
  const formatTime = (date) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes} ${period}`;
  };

  // Return the formatted time range string
  return `${formatTime(startDate)} - ${formatTime(endDate)}`;
}

