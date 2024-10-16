import {buildDestinationLookup} from './reducer';

export const JOIN_MEETING = 'meetings/JOIN_MEETING';
export const LEAVE_MEETING = 'meetings/LEAVE_MEETING';
export const STORE_MEETING = 'meetings/STORE_MEETING';
export const UPDATE_MEETING_STATE = 'meetings/UPDATE_MEETING_STATE';

// Redux Actions

function joinMeeting(meeting) {
  return {
    type: JOIN_MEETING,
    payload: {
      meeting
    }
  };
}

function leaveMeetingAction(meeting) {
  return {
    type: LEAVE_MEETING,
    payload: {
      meeting
    }
  };
}

function storeMeeting({destinationType, destinationId, meeting}) {
  return {
    type: STORE_MEETING,
    payload: {
      destinationType,
      destinationId,
      meeting
    }
  };
}

function updateMeetingState(meeting, meetingState) {
  return {
    type: UPDATE_MEETING_STATE,
    payload: {
      meeting,
      meetingState
    }
  };
}

// Helper Methods

function bindMeetingEvents(meeting, dispatch) {
  // Handle media streams changes to ready state
  meeting.on('media:ready', (media) => {
    if (!media) {
      return;
    }
    if (media.type === 'local') {
      dispatch(updateMeetingState(meeting, {hasLocalMedia: true}));
    }
    if (media.type === 'remoteVideo') {
      dispatch(updateMeetingState(meeting, {hasRemoteVideo: true}));
    }
    if (media.type === 'remoteAudio') {
      dispatch(updateMeetingState(meeting, {hasRemoteAudio: true}));
    }
  });

  /* eslint-disable no-warning-comments */
  // TODO: Add media:stopped handlers

  // TODO: Add meeting stopped & destroyed handlers
  /* eslint-enable no-warning-comments */
}

/**
 * Gets the meeting instance from the SDK plugin
 *
 * @param {Object} config
 * @param {String} config.destinationId
 * @param {String} config.destinationType
 * @param {String} config.meetingId
 * @param {Object} config.meetings Redux state object from the store
 * @param {Object} sdkInstance
 * @returns {Object} meeting instance
 */
function getMeetingFromSDK({
  destinationId,
  destinationType,
  meetingId,
  meetings
}, sdkInstance) {
  let calculatedMeetingId = meetingId;

  if (!meetingId) {
    if (!destinationId || !destinationType || !meetings) {
      throw new Error('#getMeetingFromSDK - unable to lookup meeting');
    }

    const destination = buildDestinationLookup({destinationId, destinationType});

    calculatedMeetingId = meetings.getIn(['byDestination', destination]);
  }

  const meeting = sdkInstance.meetings.meetingCollection.meetings[calculatedMeetingId];

  if (!meeting) {
    throw new Error('#getMeetingFromSDK - unable to locate meeting with id: ', calculatedMeetingId);
  }

  return meeting;
}

// Exported Action Creators (Should return thunks)

/**
 * Creates a meeting and joins it via the SDK
 *
 * @param {Object} config
 * @param {String} config.destinationId
 * @param {String} config.destinationType
 * @param {Object} sdkInstance
 * @returns {Thunk}
 */
export function createAndJoinMeeting({destinationType, destinationId}, sdkInstance) {
  return (dispatch) => sdkInstance.meetings.create(destinationId)
    .then((meeting) => {
      dispatch(storeMeeting({destinationId, destinationType, meeting}));

      bindMeetingEvents(meeting, dispatch);

      return meeting.join().then(() => {
        dispatch(joinMeeting(meeting));

        return meeting;
      });
    });
}

/**
 * Gets local media and adds it to the meeting
 *
 * @param {Object} config
 * @param {String} config.meetingId
 * @param {boolean} config.receiveVideo
 * @param {boolean} config.receiveAudio
 * @param {boolean} config.receiveShare
 * @param {boolean} config.sendAudio
 * @param {boolean} config.sendVideo
 * @param {boolean} config.sendShare
 * @param {Object} sdkInstance
 * @returns {Thunk}
 */
export function addMediaToMeeting({
  meetingId,
  receiveVideo,
  receiveAudio,
  receiveShare,
  sendVideo,
  sendAudio,
  sendShare
}, sdkInstance) {
  return () => {
    // Get meeting instance from the SDK
    const meeting = getMeetingFromSDK({meetingId}, sdkInstance);

    const mediaSettings = {
      receiveVideo,
      receiveAudio,
      receiveShare,
      sendVideo,
      sendAudio,
      sendShare
    };

    // Get our local media stream and add it to the meeting
    return meeting.getMediaStreams(mediaSettings).then((mediaStreams) => {
      const [localStream, localShare] = mediaStreams;

      meeting.addMedia({
        localShare,
        localStream,
        mediaSettings
      });
    });
  };
}

/**
 * Leaves a meeting via the SDK
 *
 * @param {Object} config
 * @param {String} config.destinationId
 * @param {String} config.destinationType
 * @param {Object} sdkInstance
 * @returns {Thunk}
  */
export function leaveMeeting({destinationType, destinationId}, sdkInstance) {
  return (dispatch, getState) => {
    const {meetings} = getState();

    // Get meeting instance from the SDK
    const meeting = getMeetingFromSDK({destinationId, destinationType, meetings}, sdkInstance);

    return meeting.leave().then(() => {
      dispatch(leaveMeetingAction(meeting));

      return meeting;
    });
  };
}