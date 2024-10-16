import {fromJS} from 'immutable';

import reducer, {initialState} from './reducer';
import {
  ACKNOWLEDGE_ACTIVITY,
  ADD_ACTIVITIES_TO_CONVERSATION,
  ADD_PARTICIPANT,
  ADD_PARTICIPANT_INFLIGHT,
  CREATE_CONVERSATION,
  CREATE_CONVERSATION_BEGIN,
  RECEIVE_MERCURY_ACTIVITY,
  RECEIVE_MERCURY_COMMENT,
  REMOVE_PARTICIPANT,
  REMOVE_PARTICIPANT_INFLIGHT,
  RESET_CONVERSATION,
  UPDATE_CONVERSATION_STATE,
  ACKNOWLEDGE_ADAPTIVE_CARD_SUBMIT_ACTION
} from './actions';

describe('redux module conversation reducer', () => {
  let mockConversation, mockParticipant;

  beforeEach(() => {
    mockConversation = {
      id: 'mock-conversation-id',
      objectType: 'conversation',
      url: 'https://conv-a.wbx2.com/conversation/api/v1/conversations/mock-conversation-id',
      published: '2017-02-22T17:11:56.887Z',
      displayName: 'Mock Conversation',
      participants: {
        items: [
          {
            id: 'mock-person-1',
            objectType: 'person',
            displayName: 'Steve Tester',
            orgId: 'consumer',
            emailAddress: 'steve.tester@gmail.com',
            entryUUID: 'mock-person-1',
            type: 'PERSON',
            roomProperties: {
              lastAckTime: '1498660470979',
              lastAckDate: '2017-06-28T14:34:30.979Z',
              lastSeenActivityUUID: 'e51add10-5c0e-11e7-81f3-bf0ed55d8b4a',
              lastSeenActivityDate: '2017-06-28T14:34:30.113Z',
              isModerator: false
            },
            entryEmail: 'steve.tester@gmail.com'
          },
          {
            id: 'mock-person-2',
            objectType: 'person',
            displayName: 'John Tester',
            orgId: 'consumer',
            emailAddress: 'john.tester@gmail.com',
            entryUUID: 'mock-person-2',
            type: 'PERSON',
            roomProperties: {
              lastAckTime: '1505419760598',
              lastAckDate: '2017-09-14T20:09:20.598Z',
              isModerator: true,
              lastSeenActivityUUID: '277197c0-9987-11e7-a3f8-f164486cb97d',
              lastSeenActivityDate: '2017-09-14T19:59:01.948Z'
            },
            entryEmail: 'john.tester@gmail.com'
          }
        ]
      },
      activities: {
        items: [
          {
            id: 'mock-activity-1',
            objectType: 'activity',
            url: 'https://conv-a.wbx2.com/conversation/api/v1/activities/mock-activity-1',
            published: '2017-05-02T20:20:23.489Z',
            verb: 'post',
            actor: {
              id: 'mock-person-2',
              objectType: 'person'
            },
            object: {
              objectType: 'comment',
              displayName: '123'
            },
            target: {
              id: 'mock-conversation-id',
              objectType: 'conversation',
              url: 'https://conv-a.wbx2.com/conversation/api/v1/conversations/mock-conversation-id',
              participants: {
                items: []
              },
              activities: {
                items: []
              },
              tags: []
            }
          },
          {
            id: 'mock-activity-2',
            objectType: 'activity',
            url: 'https://conv-a.wbx2.com/conversation/api/v1/activities/mock-activity-2',
            published: '2017-05-02T20:21:11.330Z',
            verb: 'post',
            actor: {
              id: 'mock-person-1',
              objectType: 'person'
            },
            object: {
              objectType: 'comment',
              displayName: '11'
            },
            target: {
              id: 'mock-conversation-id',
              objectType: 'conversation',
              url: 'https://conv-a.wbx2.com/conversation/api/v1/conversations/mock-conversation-id',
              participants: {
                items: []
              },
              activities: {
                items: []
              },
              tags: []
            }
          }
        ]
      },
      tags: [
        'LOCKED',
        'MODERATOR'
      ],
      lastRelevantActivityDate: '2017-07-12T19:27:51.102Z',
      lastRelevantActivityTtl: 604800,
      lastSeenActivityDate: '2017-09-14T20:00:00.816Z',
      lastReadableActivityDate: '2017-09-14T19:59:01.948Z',
      custodianOrg: {
        orgId: 'consumer',
        orgName: 'Consumer Organization'
      },
      userPreferences: {}
    };

    mockParticipant = {
      id: 'mock-person-3',
      objectType: 'person',
      displayName: 'Alice Tester',
      orgId: 'consumer',
      emailAddress: 'alice.tester@gmail.com',
      entryUUID: 'mock-person-3',
      type: 'PERSON',
      roomProperties: {
        lastAckTime: '1498660470979',
        lastAckDate: '2017-06-28T14:34:30.979Z',
        lastSeenActivityUUID: 'e51add10-5c0e-11e7-81f3-bf0ed55d8b4a',
        lastSeenActivityDate: '2017-06-28T14:34:30.113Z',
        isModerator: false
      },
      entryEmail: 'alice.tester@gmail.com'
    };
  });

  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot();
  });

  it('should handle ACKNOWLEDGE_ACTIVITY', () => {
    expect(reducer(initialState, {
      type: ACKNOWLEDGE_ACTIVITY,
      payload: {
        activity: {
          id: 'abc-123',
          mock: true
        }
      }
    })).toMatchSnapshot();
  });

  it('should handle ACKNOWLEDGE_ACTIVITY', () => {
    expect(reducer(initialState, {
      type: ACKNOWLEDGE_ACTIVITY,
      payload: {
        activity: {
          id: 'abc-123',
          mock: true
        }
      }
    })).toMatchSnapshot();
  });

  describe('ADD_ACTIVITIES_TO_CONVERSATION', () => {
    it('should add activities to the conversation', () => {
      expect(reducer(initialState, {
        type: ADD_ACTIVITIES_TO_CONVERSATION,
        payload: {
          activities: [{
            id: 'abc-123',
            object: {
              objectType: 'comment',
              displayName: '11'
            },
            published: 1505420755171,
            url: 'http://activity.url/abc-123',
            mock: true
          }]
        }
      })).toMatchSnapshot();
    });

    it('should filter content update activities', () => {
      expect(reducer(initialState, {
        type: ADD_ACTIVITIES_TO_CONVERSATION,
        payload: {
          activities: [{
            id: 'abc-123',
            object: {
              objectType: 'comment',
              displayName: '11'
            },
            published: 1505420755171,
            url: 'http://activity.url/abc-123',
            mock: true
          },
          {
            id: 'abc-123-filter-me',
            object: {
              objectType: 'content',
              displayName: '11'
            },
            published: 1505420755171,
            url: 'http://activity.url/abc-123',
            verb: 'update',
            mock: true,
            note: 'this should not be in snapshot'
          }]
        }
      })).toMatchSnapshot();
    });

    it('should not filter content activities', () => {
      expect(reducer(initialState, {
        type: ADD_ACTIVITIES_TO_CONVERSATION,
        payload: {
          activities: [{
            id: 'abc-123',
            object: {
              objectType: 'comment',
              displayName: '11'
            },
            published: 1505420755171,
            url: 'http://activity.url/abc-123',
            mock: true
          },
          {
            id: 'abc-123-dont-filter-me-bro',
            object: {
              objectType: 'content',
              displayName: '11'
            },
            published: 1505420755171,
            url: 'http://activity.url/abc-123',
            verb: 'share',
            mock: true,
            note: 'this should be in snapshot'
          }]
        }
      })).toMatchSnapshot();
    });
  });


  describe('ADD_PARTICIPANT', () => {
    it('should handle add participant and remove from in flight', () => {
      const updatedState = initialState
        .setIn(['inFlightParticipants', 'adding', mockParticipant.id], mockParticipant);

      expect(reducer(updatedState, {
        type: ADD_PARTICIPANT,
        payload: {
          participant: mockParticipant
        }
      })).toMatchSnapshot();
    });

    it('should handle add participant and remove side boarded user from in flight', () => {
      const updatedState = initialState
        .setIn(['inFlightParticipants', 'adding', mockParticipant.emailAddress], mockParticipant);

      expect(reducer(updatedState, {
        type: ADD_PARTICIPANT,
        payload: {
          participant: mockParticipant
        }
      })).toMatchSnapshot();
    });
  });

  it('should handle ADD_PARTICIPANT_INFLIGHT', () => {
    expect(reducer(initialState, {
      type: ADD_PARTICIPANT_INFLIGHT,
      payload: {
        participant: mockParticipant
      }
    })).toMatchSnapshot();
  });

  it('should handle CREATE_CONVERSATION', () => {
    expect(reducer(initialState, {
      type: CREATE_CONVERSATION,
      payload: {
        conversation: mockConversation
      }
    })).toMatchSnapshot();
  });

  it('should handle CREATE_CONVERSATION_BEGIN', () => {
    expect(reducer(initialState, {
      type: CREATE_CONVERSATION_BEGIN
    })).toMatchSnapshot();
  });

  it('should handle RECEIVE_MERCURY_ACTIVITY', () => {
    const deleteId = 'delete-me';
    const updatedState = initialState
      .setIn(['sortNonThreadActivities', deleteId], {id: deleteId, mock: true})
      .set('threadActivities', {});

    expect(reducer(updatedState, {
      type: RECEIVE_MERCURY_ACTIVITY,
      payload: {
        activity: {
          object: {
            id: deleteId
          },
          verb: 'delete'
        }
      }
    })).toMatchSnapshot();
  });

  it('should handle RECEIVE_MERCURY_COMMENT', () => {
    expect(reducer(initialState, {
      type: RECEIVE_MERCURY_COMMENT,
      payload: {
        activity: {
          id: 'abc-123',
          mock: true,
          url: 'abc-123'
        }
      }
    })).toMatchSnapshot();
  });

  it('should handle REMOVE_PARTICIPANT', () => {
    const participants = initialState.get('participants').push(fromJS(mockParticipant));
    const updatedState = initialState
      .set('participants', participants)
      .setIn(['inFlightParticipants', 'removing', mockParticipant.id], mockParticipant);

    expect(reducer(updatedState, {
      type: REMOVE_PARTICIPANT,
      payload: {
        participant: mockParticipant
      }
    })).toMatchSnapshot();
  });

  it('should handle REMOVE_PARTICIPANT_INFLIGHT', () => {
    expect(reducer(initialState, {
      type: REMOVE_PARTICIPANT_INFLIGHT,
      payload: {
        participant: mockParticipant
      }
    })).toMatchSnapshot();
  });

  it('should handle RESET_CONVERSATION', () => {
    const updatedState = initialState
      .set('id', '12345');

    expect(reducer(updatedState, {
      type: RESET_CONVERSATION
    })).toMatchSnapshot();
  });

  it('should handle UPDATE_CONVERSATION_STATE', () => {
    expect(reducer(initialState, {
      type: UPDATE_CONVERSATION_STATE,
      payload: {
        conversationState: {
          isLoadingMissing: true
        }
      }
    })).toMatchSnapshot();
  });

  it('should handle ACKNOWLEDGE_ADAPTIVE_CARD_SUBMIT_ACTION', () => {
    expect(reducer(initialState, {
      type: ACKNOWLEDGE_ADAPTIVE_CARD_SUBMIT_ACTION,
      payload: {
        activity: {
          id: '7erfber34'
        }
      }
    })).toMatchSnapshot();
  });
});