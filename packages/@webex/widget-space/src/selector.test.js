import {fromJS, Map} from 'immutable';

import {CallRecord} from '@webex/redux-module-media';

import {getCall, getSpaceDetails} from './selector';

import {destinationTypes} from './constants';

describe('widget-space selectors', () => {
  describe('#getSpaceDetails selector', () => {
    let mockedWidget, mockedUsers, mockedSpaces;
    const spaceId = '32af03b5-538c-4c16-bda9-6534097f2943';
    const userId = '6a9491af-7ff8-4732-a401-1eff35852bd5';
    const displayName = 'User abc 123';
    const spaceName = 'Cool Kids Chat';

    beforeEach(() => {
      const users = {
        byEmail: {
          'abc@123.net': userId
        },
        byId: {

        }
      };

      users.byId[userId] = {displayName};
      mockedUsers = fromJS(users);

      const spaces = {
        byId: {}
      };

      spaces.byId[spaceId] = {displayName: spaceName};
      mockedSpaces = fromJS(spaces);

      mockedWidget = fromJS({
        destination: {},
        spaceDetails: {}
      });
    });

    it('should fetch avatar and display name for email destination from users store', () => {
      mockedWidget = mockedWidget.set('destination', {id: 'abc@123.net', type: destinationTypes.EMAIL});

      const spaceDetails = getSpaceDetails.resultFunc(mockedWidget, mockedUsers, mockedSpaces);

      expect(spaceDetails.avatarId).toEqual(userId);
      expect(spaceDetails.title).toEqual(displayName);
    });

    it('should fetch avatar and display name for userId destination from users store', () => {
      mockedWidget = mockedWidget.set('destination', {id: userId, type: destinationTypes.USERID});

      const spaceDetails = getSpaceDetails.resultFunc(mockedWidget, mockedUsers, mockedSpaces);

      expect(spaceDetails.avatarId).toEqual(userId);
      expect(spaceDetails.title).toEqual(displayName);
    });

    it('should fetch avatar and display name for spaceId destination from spaces store', () => {
      mockedWidget = mockedWidget.set('destination', {id: spaceId, type: destinationTypes.SPACEID});

      const spaceDetails = getSpaceDetails.resultFunc(mockedWidget, mockedUsers, mockedSpaces);

      expect(spaceDetails.avatarId).toEqual(spaceId);
      expect(spaceDetails.title).toEqual(spaceName);
    });
  });

  describe('#getCall selector', () => {
    const mockedConversation = fromJS({
      locusUrl: 'http://abc-123'
    });

    it('should get the call specified by the conversation locus url', () => {
      const mockedMedia = Map({
        byLocusUrl: Map({
          'http://abc-123': 'abc-123'
        }),
        byId: Map({
          'abc-123': CallRecord({
            id: 'abc-123',
            locusUrl: 'http://abc-123'
          })
        })
      });
      const call = getCall.resultFunc(mockedConversation, mockedMedia);

      expect(call).toBeDefined();
    });

    it('should not get the call specified by the conversation locus url if dismissed', () => {
      const mockedMedia = Map({
        byId: Map({
          'abc-123': CallRecord({
            id: 'abc-123',
            isDismissed: true
          })
        })
      });
      const call = getCall.resultFunc(mockedConversation, mockedMedia);

      expect(call).not.toBeTruthy();
    });

    it('should return empty if there is no call for conversation locus url', () => {
      const mockedMedia = Map({
        byId: Map({
          'abc-1234': CallRecord({
            id: 'abc-1234'
          })
        })
      });
      const call = getCall.resultFunc(mockedConversation, mockedMedia);

      expect(call).not.toBeDefined();
    });

    it('should get call by destination when conversation is empty', () => {
      const mockedEmptyConversation = fromJS({});

      const mockedMedia = Map({
        byDestination: Map({
          'user@place.net': 'abc-1234'
        }),
        byId: Map({
          'abc-1234': CallRecord({
            id: 'abc-1234'
          })
        })
      });

      const mockedWidget = Map({
        destination: {
          id: 'user@place.net'
        }
      });

      const call = getCall.resultFunc(mockedEmptyConversation, mockedMedia, mockedWidget);

      expect(call).toBeDefined();
    });
  });
});
