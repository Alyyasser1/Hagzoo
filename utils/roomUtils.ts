// Helper to format 17:00:00 -> 5:00 PM
  export const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    let hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    return `${hour}:${minutes} ${ampm.toLowerCase()}`;
  };