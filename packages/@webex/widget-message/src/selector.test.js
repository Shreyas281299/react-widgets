import {fromJS} from 'immutable';

import {records as UsersRecords} from '@webex/redux-module-users';

import getMessageWidgetProps, {getSpace} from './selector';

describe('widget-message selectors', () => {
  describe('#getSpace selector', () => {
    const mockedUsers = fromJS({
      currentUserId: 'abc-123',
      byId: {
        'abc-123': new UsersRecords.User({
          id: 'abc-123',
          displayName: 'Me',
          nickName: 'Me',
          email: 'me@testable.net',
          orgId: 'abc-org'
        })
      }
    });

    it('should get a one on one conversation space', () => {
      const mockedConversation = fromJS({
        id: 'abc-123-convo',
        lastReadableActivityDate: '2012-01-01 00:00:00',
        locusUrl: 'abc-123',
        participants: [
          {
            emailAddress: 'me@testable.net'
          },
          {
            displayName: 'You Convo',
            emailAddress: 'you@testable.net'
          }
        ],
        published: true,
        status: {
          isOneOnOne: true
        },
        tags: ['ONE_ON_ONE']
      });

      const space = getSpace.resultFunc(mockedConversation, mockedUsers);

      expect(space).toMatchSnapshot();
    });

    it('should get a group conversation space', () => {
      const mockedConversation = fromJS({
        displayName: 'mock group convo',
        id: 'abc-456-convo',
        lastReadableActivityDate: '2012-01-01 00:00:00',
        locusUrl: 'abc-123',
        participants: [
          {
            emailAddress: 'me@testable.net'
          },
          {
            displayName: 'You Convo',
            emailAddress: 'you@testable.net'
          }
        ],
        published: true,
        status: {
          isOneOnOne: false
        },
        tags: [],
        team: {
          color: 'blue',
          displayName: 'our team',
          id: 'team-id'
        }
      });

      const space = getSpace.resultFunc(mockedConversation, mockedUsers);

      expect(space).toMatchSnapshot();
    });
  });

  describe('#getMessageWidgetProps selector', () => {
    it('should return message widget props', () => {
      const sparkInstance = {mocked: true};
      const sparkState = fromJS({mocked: true});
      const conversation = fromJS({id: 'abc-123'});
      const participants = fromJS(['a', 'b']);
      const activities = fromJS(['1', '2', '3']);
      const space = {mocked: true};
      const activitiesStatus = fromJS({});
      const features = fromJS({});
      const oldPublishedDate = Date.now();
      const props = getMessageWidgetProps.resultFunc(
        sparkInstance, sparkState, conversation, oldPublishedDate,
        participants, activities, space, activitiesStatus, features
      );

      expect(props).toMatchSnapshot();
    });
  });
});
