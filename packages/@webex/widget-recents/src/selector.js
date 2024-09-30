import {createSelector} from 'reselect';
import moment from 'moment';
import {OrderedMap} from 'immutable';
import {pick} from 'lodash';
import {
  formatDate,
  MENTION_NOTIFICATIONS_ON,
  MENTION_NOTIFICATIONS_OFF,
  MESSAGE_NOTIFICATIONS_ON,
  MESSAGE_NOTIFICATIONS_OFF,
  SPACE_TYPE_ONE_ON_ONE,
  SPACE_TYPE_GROUP
} from '@webex/react-component-utils';

import {getToParticipant} from './helpers';

const getWidget = (state) => state.widgetRecents;
const getSpark = (state) => state.spark;
const getSDKAdapter = (state) => state.spark.get('adaptor');
const getCurrentUser = (state) => state.users.getIn(['byId', state.users.get('currentUserId')]);
const getAvatars = (state) => state.avatar;
const getTeams = (state) => state.teams.get('byId');
const getSpaces = (state) => state.spaces.get('byId');
const getUsers = (state) => state.users.get('byId');
const getActivities = (state) => state.activities.get('byId');
const getMedia = (state) => state.media;
const getCallsById = (state) => state.media.byId;
const getMercuryStatus = (state) => state.mercury.get('status');
const getFeatures = (state) => state.features;
const getWidgetProps = (state, props) => props;

function sortByNewest(space) {
  return -moment(space.lastReadableActivityDate).format('x');
}

function constructSpace(space) {
  const {
    lastSeenActivityDate,
    lastReadableActivityDate
  } = space;
  const properties = [
    'id',
    'locusUrl',
    'globalId',
    'type',
    'participants',
    'published',
    'tags',
    'isDecrypting'
  ];
  const isUnread = lastSeenActivityDate ? moment(lastSeenActivityDate).isBefore(lastReadableActivityDate) : true;

  return {
    ...pick(space, properties),
    lastActivityTime: formatDate(lastReadableActivityDate),
    lastActivityTimestamp: lastReadableActivityDate,
    name: space.displayName || 'Untitled',
    isLocked: space.tags?.includes('LOCKED'),
    isUnread,
    isMentionNotificationsOn: space.tags?.includes(MENTION_NOTIFICATIONS_ON) ? true : undefined,
    isMentionNotificationsOff: space.tags?.includes(MENTION_NOTIFICATIONS_OFF) ? true : undefined,
    isMessageNotificationsOn: space.tags?.includes(MESSAGE_NOTIFICATIONS_ON) ? true : undefined,
    isMessageNotificationsOff: space.tags?.includes(MESSAGE_NOTIFICATIONS_OFF) ? true : undefined
  };
}

function constructOneOnOne({space, currentUser, users}) {
  const thisSpace = constructSpace(space);

  // Get the user ID of the participant that isn't current user
  let toPerson, toPersonId;

  const toParticipant = getToParticipant(space, currentUser.id);

  // Sometimes we have a direct convo with only one participant
  // (user has been deleted, etc)
  if (toParticipant) {
    toPersonId = toParticipant.id;
    toPerson = users.get(toPersonId);
  }

  if (toPerson) {
    thisSpace.toPersonId = toPersonId;
    thisSpace.toPersonEmail = toPerson.email;
    thisSpace.name = toPerson.displayName;
  }

  return thisSpace;
}

function constructGroup({space, team}) {
  const {
    id,
    displayName
  } = space;
  const thisSpace = constructSpace(space);

  thisSpace.name = displayName || 'Untitled';
  if (team) {
    thisSpace.teamName = team.displayName;
    thisSpace.teamColor = team.color;
    thisSpace.teamId = team.id;
    if (id === team.generalConversationId) {
      thisSpace.name = 'General';
    }
  }

  return thisSpace;
}

const getIncomingCall = createSelector(
  [getCallsById],
  (calls) => calls.find((call) => call.isIncoming && !call.isDismissed)
);

const getRecentSpaces = createSelector(
  [getSpaces, getActivities, getCurrentUser, getUsers, getTeams, getWidget, getWidgetProps],
  (spaces, activities, currentUser, users, teams, widget, widgetProps) => {
    let recents = new OrderedMap();

    const spaceType = widget.get('spaceType');

    spaces.toOrderedMap().sortBy(sortByNewest).forEach((space) => {
      if (!space.isHidden && !space.isFetching) {
        const spaceId = space.id;
        const team = teams.get(space.team);
        let constructedSpace;

        if (space.type === 'direct') {
          constructedSpace = constructOneOnOne({space, users, currentUser});
        }
        else {
          constructedSpace = constructGroup({space, team});
        }

        // All spaces report unread in basic mode due to service limitations
        if (widgetProps.basicMode) {
          constructedSpace.isUnread = false;
        }

        // Get Latest Activity
        const activity = activities.get(space.latestActivity);

        if (activity) {
          const actorId = activity.actor;
          const actor = users.get(actorId);

          constructedSpace.latestActivity = {
            actorName: actor && actor.displayName ? actor.displayName.split(' ')[0] : '',
            type: activity.type,
            object: activity.object,
            text: activity.object && activity.object.displayName,
            actor,
            tags: space.tags
          };
        }

        if (space.isDecrypting) {
          constructedSpace.name = 'Decrypting Space...';
        }

        recents = recents.set(spaceId, constructedSpace);
      }
    });

    // filter space list by type
    if (spaceType && [SPACE_TYPE_ONE_ON_ONE, SPACE_TYPE_GROUP].includes(spaceType)) {
      return recents.filter((space) => {
        const {type} = space;

        return spaceType === type;
      });
    }

    return recents;
  }
);


const getRecentSpacesWithDetail = createSelector(
  [getRecentSpaces, getAvatars, getMedia, getWidget],
  (recentSpaces, avatars, media, widget) => {
    const avatarItems = avatars.get('items');
    const keyword = widget.get('keyword');
    const spaces = recentSpaces.map((space) => {
      const s = Object.assign({}, space);

      // Get Avatar
      if (avatarItems.count()) {
        if (s.type === 'direct') {
          s.avatarUrl = avatarItems.get(s.toPersonId);
        }
        else {
          s.avatarUrl = avatarItems.get(s.id);
        }
      }
      // Get current call
      if (media.byId.size && media.hasIn(['byLocusUrl', s.locusUrl])) {
        s.call = media.getIn(['byId', media.getIn(['byLocusUrl', s.locusUrl])]);
        s.hasJoinedOnThisDevice = s.call.hasJoinedOnThisDevice;

        if (s.call.activeParticipantsCount > 0) {
          s.callStartTime = s.call.startTime;
        }
      }

      return s;
    });

    if (keyword && keyword.length > 0) {
      return spaces.filter(({name}) =>
        name.toLowerCase().includes(keyword.toLowerCase()));
    }

    return spaces;
  }
);

const getCurrentUserWithAvatar = createSelector(
  [getCurrentUser, getAvatars], (currentUser, avatars) => {
    let user;

    if (currentUser && currentUser.id) {
      user = Object.assign({}, currentUser.toJS(), {img: avatars.getIn(['items', currentUser.id])});
    }

    return user;
  }
);

const getRecentsWidgetProps = createSelector(
  [
    getWidget,
    getRecentSpacesWithDetail,
    getSpark,
    getSpaces,
    getIncomingCall,
    getMercuryStatus,
    getFeatures,
    getCurrentUserWithAvatar,
    getSDKAdapter
  ],
  (
    widget,
    spacesList,
    spark,
    spacesById,
    incomingCall,
    mercuryStatus,
    features,
    currentUserWithAvatar,
    sdkAdapter
  ) => {
    let lastActivityDate;

    if (spacesList && spacesList.count()) {
      lastActivityDate = spacesList.last().lastActivityTimestamp;
    }

    return {
      widgetStatus: widget.get('status').toJS(),
      keywordFilter: widget.get('keyword'),
      sparkState: spark.get('status').toJS(),
      sparkInstance: spark.get('spark'),
      widgetRecents: widget,
      spacesById,
      spacesList,
      spacesListArray: spacesList.toArray(),
      lastActivityDate,
      incomingCall,
      mercuryStatus: mercuryStatus.toJS(),
      features,
      currentUserWithAvatar: currentUserWithAvatar || {},
      sdkAdapter
    };
  }
);

export default getRecentsWidgetProps;
