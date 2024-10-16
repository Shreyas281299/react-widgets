import reducer, {initialState, CallRecord} from './reducer';
import {
  DISMISS_INCOMING_CALL,
  CHECKING_WEB_RTC_SUPPORT,
  REMOVE_CALL,
  STORE_CALL,
  UPDATE_CALL_STATUS,
  UPDATE_STATUS,
  UPDATE_WEBRTC_SUPPORT
} from './actions';

let callInstance, callObject, callId;

describe('redux-module-media reducer', () => {
  beforeEach(() => {
    callInstance = {
      hangup: jest.fn(() => Promise.resolve()),
      acknowledge: jest.fn(() => Promise.resolve()),
      reject: jest.fn(() => Promise.resolve()),
      answer: jest.fn(() => Promise.resolve()),
      once: jest.fn(),
      on: jest.fn((eventName, callback) => Promise.resolve({eventName, callback})),
      off: jest.fn(),
      locusInfo: {
        url: 'https://locusUrl',
        fullState: {
          lastActive: 'Sun Feb 18 2018 18:21:05 GMT'
        }
      },
      direction: '',
      joined: '',
      status: '',
      receivingAudio: '',
      sendingAudio: '',
      sendingVideo: '',
      remoteMediaStream: '',
      localMediaStream: '',
      remoteAudioMuted: '',
      remoteVideoMuted: '',
      remoteAudioStream: '',
      remoteVideoStream: ''
    };

    callId = 'abc-123.gov';
    callObject = new CallRecord({
      instance: callInstance,
      id: callId
    });
  });

  it('should return an initial state', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot();
  });

  it('should handle CHECKING_WEB_RTC_SUPPORT', () => {
    expect(reducer(initialState, {
      type: CHECKING_WEB_RTC_SUPPORT
    })).toMatchSnapshot();
  });

  it('should handle UPDATE_WEBRTC_SUPPORT', () => {
    expect(reducer(initialState, {
      type: UPDATE_WEBRTC_SUPPORT,
      payload: {
        supported: true
      }
    })).toMatchSnapshot();
  });

  it('should handle UPDATE_STATUS', () => {
    expect(reducer(initialState, {
      type: UPDATE_STATUS,
      payload: {
        status: {
          isListening: true
        }
      }
    })).toMatchSnapshot();
  });

  it('should handle STORE_CALL', () => {
    expect(reducer(initialState, {
      type: STORE_CALL,
      payload: {
        call: {
          instance: {
            locusInfo: {
              fullState: {
                lastActive: '2018-02-13T14:46:59.874Z'
              },
              url: callObject.url
            }
          },
          mock: true
        },
        id: callId
      }
    })).toMatchSnapshot();
  });

  it('should handle STORE_CALL with destination', () => {
    expect(reducer(initialState, {
      type: STORE_CALL,
      payload: {
        call: {
          instance: {
            locusInfo: {
              fullState: {
                lastActive: '2018-02-13T14:46:59.874Z'
              },
              url: callObject.url
            }
          },
          mock: true
        },
        destination: 'abc@123.gov',
        id: callId
      }
    })).toMatchSnapshot();
  });

  it('should handle UPDATE_CALL_STATUS', () => {
    const updatedState = initialState.setIn(['byId', callId], callObject);

    expect(reducer(updatedState, {
      type: UPDATE_CALL_STATUS,
      payload: {
        call: {
          isReceivingVideo: true,
          isReceivingAudio: true
        },
        id: callId
      }
    })).toMatchSnapshot();
  });

  it('should handle REMOVE_CALL', () => {
    const updatedState = initialState.setIn(['byId', callId], callObject);

    expect(reducer(updatedState, {
      type: REMOVE_CALL,
      payload: {
        id: callId
      }
    })).toMatchSnapshot();
  });

  it('should handle DISMISS_INCOMING_CALL', () => {
    const updatedState = initialState.setIn(['byId', callId], callObject);

    expect(reducer(updatedState, {
      type: DISMISS_INCOMING_CALL,
      payload: {
        id: callId
      }
    })).toMatchSnapshot();
  });
});