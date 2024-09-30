import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import {initialState} from './reducer';

import * as actions from '.';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


let activity,
  avatar,
  file,
  mockSpark,
  person,
  rooms,
  space,
  spaces,
  store,
  team,
  user1,
  user2;

describe('redux-module-space actions ', () => {
  beforeEach(() => {
    store = mockStore(initialState);

    person = {
      avatar: 'https://avatar-url'
    };

    avatar = {
      objectType: 'content',
      files: {
        items: [
          {
            objectType: 'file',
            url: 'https://fileUrl',
            fileSize: 56520,
            mimeType: 'image/png',
            scr: {}
          }
        ]
      },
      contentCategory: 'images'
    };

    team = {
      displayName: 'Test Team',
      color: '#C589C5',
      generalConversationUuid: 'spaceId',
      id: 'teamId',
      archived: false
    };

    user1 = {
      entryEmail: 'person1@email.com',
      displayName: 'Person 1',
      emailAddress: 'person1@email.com',
      objectType: 'person',
      type: 'PERSON',
      id: 'other-userid',
      orgId: '12345678-1234-1234-1234-123456789000'
    };

    user2 = {
      entryEmail: 'person2@email.com',
      displayName: 'Person 2',
      emailAddress: 'person2@email.com',
      objectType: 'person',
      type: 'PERSON',
      id: 'this-user-id',
      orgId: '12345678-1234-1234-1234-123456789000'
    };

    activity = {
      published: '2017-06-07T15:13:56.326Z',
      url: 'https://activityUrl',
      target: {
        id: 'conversationId',
        objectType: 'conversation',
        url: 'https://converstaionUrl',
        participants: {
          items: []
        },
        activities: {
          items: []
        },
        tags: []
      },
      encryptionKeyUrl: 'https://encryptionKeyUrl',
      actor: user1,
      objectType: 'activity',
      id: 'activityId',
      verb: 'post',
      object: {
        objectType: 'comment',
        displayName: 'Great work team!!!'
      }
    };

    // Hydra rooms request
    rooms = {
      items: [
        {
          id: 'Y2lzY29zcGFyazovL3VzL1JPT00vYmJjZWIxYWQtNDNmMS0zYjU4LTkxNDctZjE0YmIwYzRkMTU0',
          title: 'Project Unicorn - Sprint 0',
          type: 'group',
          isLocked: true,
          teamId: 'Y2lzY29zcGFyazovL3VzL1JPT00vNjRlNDVhZTAtYzQ2Yi0xMWU1LTlkZjktMGQ0MWUzNDIxOTcz',
          lastActivity: '2016-04-21T19:12:48.920Z',
          creatorId: 'Y2lzY29zcGFyazovL3VzL1BFT1BMRS9mNWIzNjE4Ny1jOGRkLTQ3MjctOGIyZi1mOWM0NDdmMjkwNDY',
          created: '2016-04-21T19:01:55.966'
        }
      ]
    };

    space = {
      participants: {
        items: [user1, user2]
      },
      lastReadableActivityDate: '2017-06-07T15:13:56.326Z',
      displayName: 'Space 1',
      lastSeenActivityDate: '2017-06-07T15:13:34.505Z',
      published: '2016-02-29T17:49:17.029Z',
      url: 'https://converstaionUrl',
      locusUrl: 'https://converstaionLocusUrl',
      activities: {
        items: [activity]
      },
      tags: [
        'MUTED',
        'FAVORITE',
        'LOCKED',
        'TEAM',
        'JOINED',
        'MESSAGE_NOTIFICATIONS_OFF',
        'MENTION_NOTIFICATIONS_ON'
      ],
      avatar,
      type: 'group',
      id: 'spaceId',
      cluster: 'us',
      team,
      conversationWebUrl: 'https://conversationWebUrl'
    };

    spaces = [
      space,
      space,
      space
    ];


    file = new Uint8Array();

    mockSpark = {
      internal: {
        device: {
          userId: 'this-user-id'
        },
        conversation: {
          get: jest.fn(() => Promise.resolve(space)),
          download: jest.fn(() => Promise.resolve(file)),
          list: jest.fn(() => Promise.resolve(spaces))
        }
      },
      people: {
        get: jest.fn(() => Promise.resolve(person))
      },
      rooms: {
        list: jest.fn(() => Promise.resolve(rooms))
      }
    };
  });

  it('has exported actions', () => {
    expect(actions).toMatchSnapshot();
  });

  describe('#addSpaceTags', () => {
    it('properly updates space tags', () => {
      const tags = ['MESSAGE_NOTIFICATIONS_ON'];
      const id = 'spaceId';

      store.dispatch(actions.addSpaceTags(id, tags));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('#fetchSpaces', () => {
    it('properly fetches spaces', () => {
      store.dispatch(actions.fetchSpaces(mockSpark)).then(() => {
        expect(mockSpark.internal.conversation.list).toHaveBeenCalled();
        expect(store.getActions()).toMatchSnapshot();
      });
    });

    it('adds error when fetch fails', async () => {
      mockSpark.internal.conversation.list = jest.fn(() => Promise.reject(new Error('Mock List Failure')));
      try {
        await store.dispatch(actions.fetchSpaces(mockSpark));
      }
      catch (e) {
        expect(store.getActions()).toMatchSnapshot();
      }
    });
  });

  describe('#fetchSpacesEncrypted', () => {
    it('properly fetches encrypted spaces', () => {
      store.dispatch(actions.fetchSpacesEncrypted(mockSpark)).then(() => {
        expect(mockSpark.internal.conversation.list).toHaveBeenCalled();
        const listCalls = mockSpark.internal.conversation.list.calls;

        expect(listCalls[0][0].deferDecrypt).toBe(true);
        expect(store.getActions()).toMatchSnapshot();
      });
    });

    it('adds error when fetch fails', async () => {
      mockSpark.internal.conversation.list = jest.fn(() => Promise.reject(new Error('Mock List Failure')));
      try {
        await store.dispatch(actions.fetchSpaces(mockSpark));
      }
      catch (e) {
        expect(store.getActions()).toMatchSnapshot();
      }
    });
  });

  describe('#fetchSpace', () => {
    it('properly fetches a space', () => {
      store.dispatch(actions.fetchSpace(mockSpark, {id: 'spaceId'})).then(() => {
        expect(mockSpark.internal.conversation.get).toHaveBeenCalled();
        expect(store.getActions()).toMatchSnapshot();
      });
    });

    it('filters delete messages from a space', () => {
      space.activities.items = [
        {
          actor: {
            displayName: ''
          },
          verb: 'delete',
          object: {
            displayName: ''
          }
        },
        {
          actor: {
            displayName: 'Marty McFly'
          },
          verb: 'post',
          object: {
            displayName: 'check this out!'
          }
        }
      ];
      mockSpark.internal.conversation.get = jest.fn(() => Promise.resolve(space));
      store.dispatch(actions.fetchSpace(mockSpark, {id: 'spaceId'})).then(() => {
        expect(mockSpark.internal.conversation.get).toHaveBeenCalled();
        expect(store.getActions()).toMatchSnapshot();
      });
    });

    it('adds error when fetch fails', async () => {
      mockSpark.internal.conversation.get = jest.fn(() => Promise.reject(new Error('Mock List Failure')));
      try {
        await store.dispatch(actions.fetchSpaces(mockSpark));
      }
      catch (e) {
        expect(store.getActions()).toMatchSnapshot();
      }
    });
  });

  describe('#fetchSpacesHydra', () => {
    it('properly fetches spaces from hydra', () => {
      store.dispatch(actions.fetchSpacesHydra(mockSpark)).then(() => {
        expect(mockSpark.rooms.list).toHaveBeenCalled();
        expect(store.getActions()).toMatchSnapshot();
      });
    });

    it('adds error when fetch fails', async () => {
      mockSpark.rooms.list = jest.fn(() => Promise.reject(new Error('Mock List Failure')));
      try {
        await store.dispatch(actions.fetchSpaces(mockSpark));
      }
      catch (e) {
        expect(store.getActions()).toMatchSnapshot();
      }
    });
  });

  describe('#removeSpace', () => {
    it('properly removes a space', () => {
      store.dispatch(actions.removeSpace('spaceId'));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('#removeSpaceTags', () => {
    it('properly updates space tags', () => {
      const tags = ['MESSAGE_NOTIFICATIONS_OFF'];
      const id = 'spaceId';

      store.dispatch(actions.removeSpaceTags(id, tags));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('#storeSpaces', () => {
    it('properly stores spaces', () => {
      store.dispatch(actions.storeSpaces([space]));
      expect(store.getActions()).toMatchSnapshot();
    });

    it('handles spaces without a lastReadableActivityDate', () => {
      space.lastReadableActivityDate = null;
      store.dispatch(actions.storeSpaces([space]));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('#updateSpaceWithActivity', () => {
    it('properly update space with self activity', () => {
      store.dispatch(actions.updateSpaceWithActivity(activity, true));
      expect(store.getActions()).toMatchSnapshot();
    });

    it('properly update space with readable self activity', () => {
      store.dispatch(actions.updateSpaceWithActivity(activity, true, true));
      expect(store.getActions()).toMatchSnapshot();
    });

    it('properly update space with others activity', () => {
      store.dispatch(actions.updateSpaceWithActivity(activity, false));
      expect(store.getActions()).toMatchSnapshot();
    });

    it('properly update space with others readable activity', () => {
      store.dispatch(actions.updateSpaceWithActivity(activity, false, true));
      expect(store.getActions()).toMatchSnapshot();
    });
  });

  describe('#updateSpaceRead', () => {
    it('properly updates lastSeenActivityDate for a space', () => {
      const timestamp = '2017-06-07T15:13:34.505Z';
      const id = 'spaceId';

      store.dispatch(actions.updateSpaceRead(timestamp, id));
      expect(store.getActions()).toMatchSnapshot();
    });
  });
});
