export const formatDurationForAnnouncement = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedHours = hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : '';
    const formattedMinutes = minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : '';
    const formattedSeconds = `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  
    const formattedDuration = [formattedHours, formattedMinutes, formattedSeconds]
      .filter(Boolean) // Remove empty strings
      .join(' ');
  
    return `duration ${formattedDuration}`;
  };
  
  export const formatPhoneNumberForAnnouncement = (phoneNumber: string): string => {
    if (phoneNumber?.match(/^\d|^\+/)) {
      return phoneNumber?.split('').map((digit) => digit).join(' ');
    }
    return phoneNumber;
  }

  export const formatVoiceMailTimeDurationForAnnouncement = (duration: number): string => {
    const durationInSeconds = Math.floor(duration / 1000);
    const formattedDuration = new Date(durationInSeconds * 1000).toISOString().substr(11, 8); // Format as "HH:mm:ss"
    const [hours, minutes, seconds] = formattedDuration.split(':').map(Number);
      let announcement = '';
      if (hours > 0) {
        announcement += `${hours} hour${hours !== 1 ? 's' : ''} `;
      }
      
      if (minutes > 0) {
        announcement += `${minutes} minute${minutes !== 1 ? 's' : ''} `;
      }
    
      if (seconds > 0) {
        announcement += `${seconds} second${seconds !== 1 ? 's' : ''}`;
      }
    return `duration ${announcement}`;
  };

  export const formatSleekBarCurrTimeDurationForAnnouncement = (duration: number): string => {

    const durationInSeconds = duration / 1000;
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    const milliseconds = Math.floor((duration - seconds * 1000 - minutes * 60000 - hours * 3600000));

    const parts = [
      hours > 0 ? `${hours} hour${hours !== 1 ? 's' : ''}` : '',
      minutes > 0 ? `${minutes} minute${minutes !== 1 ? 's' : ''}` : '',
      seconds > 0 ? `${seconds} second${seconds !== 1 ? 's' : ''}` : '',
      milliseconds > 0 ? `${milliseconds} millisecond${milliseconds !== 1 ? 's' : ''}` : '',
    ].filter(part => part !== '');

    return parts.join(' ');
  };