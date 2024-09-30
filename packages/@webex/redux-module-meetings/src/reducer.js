import {
  Record,
  Map
} from 'immutable';

import {
  JOIN_MEETING,
  LEAVE_MEETING,
  STORE_MEETING,
  UPDATE_MEETING_STATE
} from './actions';

const MeetingState = Record({
  joined: false,
  hasLocalMedia: false,
  hasRemoteVideo: false,
  hasRemoteAudio: false
});

const InitialState = Record({
  byDestination: Map(),
  byLocusUrl: Map(),
  byId: Map()
});

export const initialState = new InitialState();

export function buildDestinationLookup({destinationId, destinationType}) {
  if (!destinationId || !destinationType) {
    throw new Error('#buildDestinationLookup - requires destinationID and destinationType');
  }

  return `${destinationType}-${destinationId}`;
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    // The source of truth for the meetings objects is the meetings collection
    // within the SDK. Instead of storing the meeting object in the redux store,
    // we will just be storing IDs and meeting state in order to do the collection lookup.
    case STORE_MEETING: {
      const {
        meeting,
        destinationId,
        destinationType
      } = action.payload;

      const {locusUrl, id} = meeting;
      const destination = buildDestinationLookup({destinationId, destinationType});

      let updatedState = state.setIn(['byId', id], new MeetingState());

      // Store a link to the meeting's ID by destination
      updatedState = updatedState.setIn(['byDestination', destination], id);

      // Store a link to the meeting's ID by locus
      if (locusUrl) {
        updatedState = updatedState.setIn(['byLocusUrl', locusUrl], id);
      }

      return updatedState;
    }

    // Update the meeting state to show it has been joined
    case JOIN_MEETING: {
      const {meeting} = action.payload;

      return state.setIn(['byId', meeting.id, 'joined'], true);
    }

    // Update the meeting state to show it was left and not joined
    case LEAVE_MEETING: {
      const {meeting} = action.payload;

      return state.setIn(['byId', meeting.id, 'joined'], false);
    }

    // Update the meeting state
    case UPDATE_MEETING_STATE: {
      const {meeting, meetingState} = action.payload;

      return state.mergeIn(['byId', meeting.id], meetingState);
    }

    default:
      return state;
  }
}
