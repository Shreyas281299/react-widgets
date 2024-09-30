import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from './actions';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

let mockSpark;
let mockConversation;

describe('redux-module-conversation actions', () => {
  beforeEach(() => {
    mockConversation = {
      id: 'created-conversation',
      participants: {
        items: [{
          id: 'this-user-id',
          roomProperties: {
            isModerator: false
          }
        }]
      },
      tags: []
    };

    mockSpark = {
      internal: {
        conversation: {
          acknowledge: jest.fn(() => Promise.resolve()),
          add: jest.fn(() => Promise.resolve(mockConversation)),
          create: jest.fn(() => Promise.resolve(mockConversation)),
          delete: jest.fn(() => Promise.resolve()),
          get: jest.fn(() => Promise.resolve(mockConversation)),
          leave: jest.fn(() => Promise.resolve(mockConversation)),
          listActivities: jest.fn(() => Promise.resolve([{mockActivity: 'mockActivity'}])),
          cardAction: jest.fn(() => Promise.resolve({activity: {id: '7erfber34'}}))
        },
        device: {
          userId: 'this-user-id'
        }
      }
    };
  });

  it('has exported actions', () => {
    expect(actions).toMatchSnapshot();
  });

  describe('#acknowledgeActivityOnServer', () => {
    it('can acknowledge an activity', () => {
      const store = mockStore({});
      const activity = {id: 'activity-to-acknowledge'};

      return store.dispatch(actions.acknowledgeActivityOnServer({toJS: jest.fn()}, activity, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#addParticipant', () => {
    it('can add a participant', () => {
      const store = mockStore({});

      store.dispatch(actions.addParticipant({id: 'add-me'}));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('#addParticipantToConversation', () => {
    it('can start the request to add a participant to a conversation', () => {
      const store = mockStore({});

      return store.dispatch(actions.addParticipantToConversation({toJS: jest.fn()}, {}, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('can start the request to add a participant to a conversation via email', () => {
      const store = mockStore({});

      return store.dispatch(actions.addParticipantToConversation({toJS: jest.fn()}, 'my@email.net', mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('errors when sending a participant string that isn\'t an email', () => {
      const store = mockStore({});

      return store.dispatch(actions.addParticipantToConversation({toJS: jest.fn()}, 'not an email', mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('can handle an error from adding a participant to a conversation', () => {
      const store = mockStore({});

      mockSpark.internal.conversation.add = jest.fn(() => Promise.reject(new Error('Nope. Not going to happen.')));

      return store.dispatch(actions.addParticipantToConversation({toJS: jest.fn()}, {}, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#createConversation', () => {
    it('can create a conversation', () => {
      const store = mockStore({});
      const participants = ['ricky.testerson@test.net', 'professor.xavier@school.edu'];

      return store.dispatch(actions.createConversation(participants, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('can create a conversation with hydra ids', () => {
      const participants = ['Y2lzY29zcGFyazovL3VzL1BFT1BMRS9hMWJhZTk5Mi0xMWI1LTQ5YWItOGMwYi1lOGU4NzE2ZTFlYjA'];
      const store = mockStore({});

      return store.dispatch(actions.createConversation(participants, mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.create.mock.calls).toMatchSnapshot();
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('handles errors during create a conversation', () => {
      mockSpark.internal.conversation.create = jest.fn(() => Promise.reject(new Error('failed. hard.')));
      const store = mockStore({});
      const participants = ['ricky.testerson@test.net', 'professor.xavier@school.edu'];

      return store.dispatch(actions.createConversation(participants, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#deleteActivity', () => {
    it('can delete an activity', () => {
      const store = mockStore({});

      return store.dispatch(actions.deleteActivity({toJS: jest.fn()}, {}, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#getConversation', () => {
    beforeEach(() => {
      mockConversation.id = 'got-conversation';
    });

    it('can get a conversation by uuid', () => {
      const uuid = '34abf792-10a7-4d5c-ae46-88f1bcaa07e4';
      const store = mockStore({});

      return store.dispatch(actions.getConversation(uuid, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('can get a conversation by hydra id', () => {
      const hydraId = 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS9hMWJhZTk5Mi0xMWI1LTQ5YWItOGMwYi1lOGU4NzE2ZTFlYjA';
      const store = mockStore({});

      return store.dispatch(actions.getConversation(hydraId, mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.get.mock.calls).toMatchSnapshot();
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('sets the locked status of a room properly', () => {
      const uuid = '34abf792-10a7-4d5c-ae46-88f1bcaa07e4';
      const store = mockStore({});

      mockConversation.tags = ['LOCKED'];
      mockSpark.internal.conversation.get = jest.fn(() => Promise.resolve(mockConversation));

      return store.dispatch(actions.getConversation(uuid, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('sets the moderator status of a room properly', () => {
      const uuid = '34abf792-10a7-4d5c-ae46-88f1bcaa07e4';
      const store = mockStore({});

      mockConversation.tags = ['LOCKED'];
      mockConversation.participants.items[0].roomProperties.isModerator = true;
      mockSpark.internal.conversation.get = jest.fn(() => Promise.resolve(mockConversation));

      return store.dispatch(actions.getConversation(uuid, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('handles errors during get a conversation', () => {
      mockSpark.internal.conversation.get = jest.fn(() => Promise.reject(new Error('failed. hard.')));
      const store = mockStore({});
      const uuid = '34abf792-10a7-4d5c-ae46-88f1bcaa07e4';

      return store.dispatch(actions.getConversation(uuid, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#loadMissingActivities', () => {
    it('can load missing activities', () => {
      const store = mockStore({});
      const conversationId = 'abc123';
      const sinceDate = '2017-02-22T17:11:56.952Z';

      return store.dispatch(actions.loadMissingActivities(conversationId, sinceDate, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#loadPreviousMessages', () => {
    it('can load previous messages', () => {
      const store = mockStore({});
      const conversationId = 'abc123';
      const maxDate = '2017-02-22T17:11:56.952Z';

      return store.dispatch(actions.loadPreviousMessages(conversationId, maxDate, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#removeParticipant', () => {
    it('can remove a participant', () => {
      const store = mockStore({});

      store.dispatch(actions.removeParticipant({id: 'remove-me'}));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('#removeParticipantFromConversation', () => {
    it('can start the request to remove a participant to a conversation', () => {
      const store = mockStore({});

      return store.dispatch(actions.removeParticipantFromConversation({toJS: jest.fn()}, {}, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('can handle an error from adding a participant to a conversation', () => {
      const store = mockStore({});

      mockSpark.internal.conversation.leave = jest.fn(() => Promise.reject(new Error('Nope. Not going to happen.')));

      return store.dispatch(actions.removeParticipantFromConversation({toJS: jest.fn()}, {}, mockSpark))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#resetConversation', () => {
    it('should reset the state back to initial state', () => {
      const store = mockStore({});

      store.dispatch(actions.resetConversation());
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('#updateConversationState', () => {
    it('can update state', () => {
      const store = mockStore({});

      store.dispatch(actions.updateConversationState({isLoaded: true}));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('#submitAdaptiveCardActions', () => {
    it('can start request when card action submitted', () => {
      const store = mockStore({});
      const url = ' https://conv-a.wbx2.com/conversation/api/v1/conversations/04e50f70-3057-11ea-8aa3-8930493d4da7';
      const actionInput = {
        objectType: 'submit',
        inputs: {
          FoodChoice: 'Steak',
          SteakTemp: 'medium-rare',
          SteakOther: 'hi',
          Vegetarian: 'false'
        }
      };
      const parentId = '77981d00-3061-11ea-bc29-4b6836e60516';
      const buttonClicked = document.createElement('button');

      buttonClicked.innerHTML = 'submit';

      return store
        .dispatch(actions.handleAdaptiveCardSubmitAction(url, actionInput, parentId, mockSpark, buttonClicked))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });
});
