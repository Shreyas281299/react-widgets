import moment from 'moment';

/**
 * format
 * - before a week ago from now: MM/DD/YY, h:mm meridiem
 * - yesterday: Yesterday at h:mm
 * - a week ago from now: DAY h:mm meridiem
 * - today: h:mm meridiem
 *
 * @param {Object} time moment object for specific time
 * @returns {String} nicely formatted timestamp
 */
export function formatDate(time) {
  const now = moment();
  let rawTime = time || moment();

  switch (typeof rawTime) {
    case 'number':
    case 'string':
      rawTime = moment(rawTime);
      break;
    default:
  }
  // note endOf(day) compare to normalize now no matter how it was created
  if (now.endOf('day').diff(rawTime, 'days') === 0) {
    // today
    return rawTime.format('h:mm A');
  }
  if (now.startOf('day').diff(rawTime) <= 86400000) {
    // yesterday (60*60*24*1000 = 86400000)
    return rawTime.calendar();
  }
  if (now.startOf('day').diff(rawTime) <= 518400000) {
    // 6 days ago from today (60*60*24*6*1000 = 518400000)
    return rawTime.format('dddd h:mm A');
  }

  return rawTime.format('M/D/YY, h:mm A');
}

export default {};
