/* eslint no-use-before-define: ["error", { "functions": false }] */

import {first} from 'rxjs/operators';

import {constructCallObject} from './helpers';

export const UPDATE_STATUS = 'media/UPDATE_STATUS';

export const DISMISS_INCOMING_CALL = 'media/DISMISS_INCOMING_CALL';
export const STORE_CALL = 'media/STORE_CALL';
export const UPDATE_CALL_STATUS = 'media/UPDATE_CALL_STATUS';
export const UPDATE_CALL_ERROR = 'media/UPDATE_CALL_ERROR';
export const REMOVE_CALL = 'media/REMOVE_CALL';

const tap = (promise) => (arg) => Promise.resolve()
  .then(promise(arg))
  .then(() => arg);

/* Actions */

function removeCall(id) {
  return {
    type: REMOVE_CALL,
    payload: {
      id
    }
  };
}

export function storeCall({call, id, destination}) {
  // check if this is a locus replaced call
  return {
    type: STORE_CALL,
    payload: {
      id,
      call: constructCallObject(call),
      destination
    }
  };
}

function updateCallError({call, error, id}) {
  return {
    type: UPDATE_CALL_ERROR,
    payload: {
      id: id || call.id,
      error
    }
  };
}

function updateCallStatus({call, id, eventName}) {
  return {
    type: UPDATE_CALL_STATUS,
    payload: {
      id,
      call: constructCallObject(call),
      eventName
    }
  };
}

function updateStatus(status) {
  return {
    type: UPDATE_STATUS,
    payload: {
      status
    }
  };
}

/* Exported Actions */

/**
 * Accepts an incoming call
 *
 * @export
 * @param {object} incomingCall
 * @returns {Promise}
 */
export function acceptIncomingCall(incomingCall, {sdkAdapter, destinationId, cleanUp}) {
  return (dispatch) => {
    const {meetingsAdapter} = sdkAdapter;

    return Promise.resolve()
      .then(() => meetingsAdapter.datasource.meetings.getMeetingByType('locusUrl', incomingCall.locusUrl))
      .then((meeting) => {
        const bye = meeting.leave;

        // eslint-disable-next-line no-param-reassign
        meeting.leave = (...args) => bye.bind(meeting)(...args)
          .then(() => dispatch(removeCall(incomingCall.id)))
          .then(() => dispatch(cleanUp()))
          // eslint-disable-next-line no-param-reassign
          .finally(() => { meeting.leave = bye.bind(meeting); });

        return meeting;
      })
      .then((meeting) => meetingsAdapter.getLocalMedia(meeting.id).toPromise()
        .then(({localAudio, localVideo}) => meetingsAdapter.fetchMeetingTitle(destinationId)
          .then((title) => {
            const m = meetingsAdapter.meetings[meeting.id];

            // eslint-disable-next-line no-param-reassign
            meetingsAdapter.meetings[meeting.id] = {
              ...m,
              ID: meeting.id,
              title,
              localAudio,
              localVideo,
              localShare: {stream: null},
              remoteAudio: null,
              remoteVideo: null,
              remoteShare: null,
              state: 'NOT_JOINED'
            };

            return meeting;
          })))
      .then(tap((meeting) => {
        processCall({dispatch, call: {...meeting}, destinationId});
      }))
      .then(tap((meeting) => dispatch(updateCallStatus({
        call: {
          ...meeting,
          hasJoinedOnThisDevice: true
        },
        id: meeting.id
      }))))
      .then(tap((meeting) => meetingsAdapter.joinMeeting(meeting.id)))
      .catch((err) => updateCallError({call: incomingCall, error: err}));
  };
}

/**
 * Declines an incoming call
 *
 * @export
 * @param {object} incomingCall
 * @returns {Thunk}
 */
export function declineIncomingCall(incomingCall, {meetingsAdapter}) {
  const {meetings} = meetingsAdapter.datasource;

  return (dispatch) => {
    const meeting = meetings.getMeetingByType('id', incomingCall.id);

    if (meeting) meeting.decline();
    dispatch(removeCall(incomingCall.id));

    return Promise.resolve();
  };
}

/**
 * Dismisses an incoming call, marking it so.
 * Note: This does not decline the call, just for tracking purposes
 * @param {string} id
 * @returns {object}
 */
export function dismissIncomingCall(id) {
  return {
    type: DISMISS_INCOMING_CALL,
    payload: {
      id
    }
  };
}

/**
 * Hangs up and removes call
 * @param {object} call
 * @returns {Promise}
 */
export function hangupCall({call, id}) {
  return (dispatch) => {
    // Don't update call states after hangup
    call.off();

    // Only call.hangup() when local user wants to hangup.
    // SDK handles .hangup() when call becomes `inactive`
    return call.hangup()
      .then(() => dispatch(removeCall(id)))
      .catch(() => dispatch(removeCall(id)));
  };
}

/**
 * Listens for all call events and handles them
 * @param {Object} sparkInstance
 * @returns {Promise}
 */
export function listenForCalls(sparkInstance) {
  return (dispatch) => {
    dispatch(updateStatus({isListening: true, isListeningToIncoming: true}));

    return Promise.all([
      handleIncomingCalls(sparkInstance),
      handleCreatedCalls(sparkInstance, dispatch),
      handleRemovedCalls(sparkInstance, dispatch)
    ]);
  };
}

const getMeeting = ({sdkAdapter: {meetingsAdapter}, destination}) => new Promise((resolve) => {
  meetingsAdapter.createMeeting(destination)
    .pipe(first())
    .subscribe(({ID}) =>
      resolve(meetingsAdapter.datasource.meetings.getMeetingByType('id', ID)));
})
  .then(tap((meeting) => meetingsAdapter.datasource.meetings.meetingCollection.set(meeting)))
  .then((meeting) => meetingsAdapter.getLocalMedia(meeting.id).toPromise()
    .then(({localAudio, localVideo}) => meetingsAdapter.fetchMeetingTitle(destination)
      .then((title) => {
        const m = meetingsAdapter.meetings[meeting.id];

        // eslint-disable-next-line no-param-reassign
        meetingsAdapter.meetings[meeting.id] = {
          ...m,
          ID: meeting.id,
          title,
          localAudio,
          localVideo,
          localShare: {stream: null},
          remoteAudio: null,
          remoteVideo: null,
          remoteShare: null,
          state: 'NOT_JOINED'
        };

        return meeting;
      })));

/**
 * Call a user with an email address or userId
 *
 * @export
 * @param {Object} sdkAdapter
 * @param {String} data.destination
 * @returns {Promise}
 */
export function placeCall(sdkAdapter, {destination, cleanUp}) {
  const {meetingsAdapter} = sdkAdapter;

  return (dispatch) => getMeeting({sdkAdapter, destination})
    .then(tap((meeting) => processCall({dispatch, call: {...meeting}, destination})))
    .then((meeting) => {
      const bye = meeting.leave;

      // eslint-disable-next-line no-param-reassign
      meeting.leave = (...args) => bye.bind(meeting)(...args)
        .then(() => dispatch(removeCall(meeting.id)))
        .then(() => dispatch(cleanUp()))
        // eslint-disable-next-line no-param-reassign
        .finally(() => { meeting.leave = bye.bind(meeting); });

      return meeting;
    })
    .then(tap((meeting) => {
      if(meeting.passwordStatus != 'REQUIRED') {
        meetingsAdapter.joinMeeting(meeting.id)
      }
  }));
}

/**
 * Process and store a call object from outside widgets
 * @param {Object} call
 * @returns {Function}
 */
export function storeExternalCall(call) {
  return (dispatch) => {
    const {id} = processCall({dispatch, call});

    return {id, call};
  };
}


/* Helper Functions */

/**
 * Processes a call by binding events and storing
 * @param {*} params.dispatch
 * @param {Object} params.meeting
 * @returns {Object} {id, call}
 */
function processCall({dispatch, call, destination}) {
  const value = {call, id: call.id, destination};

  dispatch(storeCall(value));

  return value;
}

/**
 * Auto acknowledges incoming meetings.
 * @param {object} sparkInstance
 * @param {object} dispatch
 * @returns {Promise}
 */
function handleIncomingCalls(sparkInstance) {
  return sparkInstance.meetings.on('meeting:added', ({type, meeting}) => {
    if (type === 'INCOMING') {
      // Handle incoming meeting
      meeting.acknowledge({type: 'INCOMING'});
    }
  });
}

/**
 * Listens for new incoming meetings
 * @param {object} sparkInstance
 * @param {object} dispatch
 * @returns {Promise}
 */
function handleCreatedCalls(sparkInstance, dispatch) {
  const processMeeting = (meeting) => {
    const call = {
      ...meeting,
      direction: 'in',
      hasJoinedOnThisDevice: false
    };

    processCall({dispatch, call});
  };
  const getMeetingById = ({id}) => sparkInstance.meetings.getMeetingByType('id', id);

  sparkInstance.meetings.on('meeting:added', ({meeting}) => {
    meeting.members.on('members:update', () => {
      setTimeout(() => {
        const call = {
          id: meeting.id,
          ...getMeetingById(meeting)
        };

        processMeeting(call);
      }, 0);
    });

    processMeeting(meeting);
  });

  return Promise.resolve();
}

function handleRemovedCalls(sparkInstance, dispatch) {
  return sparkInstance.meetings.on('meeting:removed', ({meetingId}) => {
    dispatch(removeCall(meetingId));
  });
}