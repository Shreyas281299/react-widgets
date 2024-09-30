import {createSelector} from 'reselect';
import {orderBy} from 'lodash';
import {getActivitiesFromThreadAndNonThreadCollections} from '@webex/redux-module-conversation';

const getConversationThreadActivities = (state) => state.conversation.get('threadActivities');
const getConversationNonThreadActivities = (state) => state.conversation.get('sortNonThreadActivities');
const getActivities = createSelector(
  [
    getConversationThreadActivities,
    getConversationNonThreadActivities
  ],
  getActivitiesFromThreadAndNonThreadCollections
);
const getParticipants = (state) => state.conversation.get('participants');
const getUsers = (state) => state.users;
const getTypingIndicators = (state) => state.indicators.get('typing');
const getSpark = (state, ownProps) => ownProps.sparkInstance || state.spark.get('spark');

const READ_RECEIPTS_SHOWN_LIMIT = 10;

const getCurrentUser = createSelector(
  [getUsers], (users) => users.getIn(['byId', users.get('currentUserId')])
);

const getReadReceipts = createSelector(
  [getCurrentUser, getActivities, getParticipants, getTypingIndicators],
  (currentUser, activities, participants, typing) => {
    const activity = activities.last();
    const readParticipants = participants
      .filter((participant) =>
        activity && currentUser && participant.get('id') !== currentUser.id &&
        participant.getIn(['roomProperties', 'lastSeenActivityUUID']) === activity.id)
      .toJS();

    const mappedParticipants = readParticipants
      .map((participant) => {
        const participantId = participant.id;
        // Typing events don't give us user IDs, only emails.
        const isTyping = typing.has(participant.emailAddress);

        return {
          displayName: participant.displayName,
          isTyping,
          userId: participantId
        };
      });
    const sortedParticipants = orderBy(mappedParticipants, 'isTyping', 'desc');
    const visibleUsers = sortedParticipants.slice(0, READ_RECEIPTS_SHOWN_LIMIT);
    const hiddenUsers = sortedParticipants.slice(READ_RECEIPTS_SHOWN_LIMIT);

    return {
      hiddenUsers,
      visibleUsers
    };
  }
);

const getReadReceiptsProps = createSelector(
  [getReadReceipts, getSpark],
  (readReceipts, sparkInstance) => ({
    readReceipts,
    sparkInstance
  })
);

export default getReadReceiptsProps;
