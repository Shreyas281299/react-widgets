import {addError} from '@webex/redux-module-errors';
import {storeActivities} from '@webex/redux-module-activities';
import {
  createConversationBegin,
  computeRoomProperties,
  storeConversation
} from '@webex/redux-module-conversation';
import {storeUsers} from '@webex/redux-module-users';

import {
  TAG_LOCKED,
  constructSpace,
  constructSpaces,
  constructSpaceFromHydraRoom
} from './helpers';

export const STORE_SPACES = 'spaces/STORE_SPACES';
export const UPDATE_SPACE_WITH_ACTIVITY = 'spaces/UPDATE_SPACE_WITH_ACTIVITY';
export const UPDATE_SPACE_READ = 'spaces/UPDATE_SPACE_READ';
export const ADD_SPACE_TAGS = 'spaces/ADD_SPACE_TAGS';
export const REMOVE_SPACE_TAGS = 'spaces/REMOVE_SPACE_TAGS';
export const REMOVE_SPACE = 'spaces/REMOVE_SPACE';
export const STORE_SPACE = 'spaces/STORE_SPACE';
export const STORE_INITIAL_SPACE = 'spaces/STORE_INITIAL_SPACE';

// The options to pass to convo service when fetching multiple spaces (for recents)
const spacesConversationOptions = {
  personRefresh: false,
  participantsLimit: 0,
  activitiesLimit: 0,
  computeTitleIfEmpty: true,
  globalId: true,
  paginate: true
};

/**
 * Updates the last seen date of a space
 * @param {String} spaceId
 * @param {String} lastSeenDate
 * @returns {Object}
 */
export function updateSpaceRead(spaceId, lastSeenDate) {
  return {
    type: UPDATE_SPACE_READ,
    payload: {
      lastSeenDate,
      spaceId
    }
  };
}

/**
 * Adds to a space's tags with the provided array
 *
 * @export
 * @param {String} spaceId
 * @param {Array} tags
 * @returns {Object}
 */
export function addSpaceTags(spaceId, tags) {
  return {
    type: ADD_SPACE_TAGS,
    payload: {
      spaceId,
      tags
    }
  };
}

/**
 * Removes from a space's tags the provided array
 *
 * @export
 * @param {String} spaceId
 * @param {Array} tags
 * @returns {Object}
 */
export function removeSpaceTags(spaceId, tags) {
  return {
    type: REMOVE_SPACE_TAGS,
    payload: {
      spaceId,
      tags
    }
  };
}

export function removeSpace(id) {
  return {
    type: REMOVE_SPACE,
    payload: {
      id
    }
  };
}


export function storeSpaces(spaces) {
  return {
    type: STORE_SPACES,
    payload: {
      spaces: constructSpaces(spaces)
    }
  };
}

function storeInitialSpace(id) {
  return {
    type: STORE_INITIAL_SPACE,
    payload: {
      id
    }
  };
}

/**
 * Adds a rate limit error to the errors module
 * @param {function} dispatch
 * @param {String} name
 */
function addLoadError(dispatch, name) {
  dispatch(addError({
    code: name,
    id: 'redux-module-spaces-load',
    displayTitle: 'Something\'s not right',
    displaySubtitle: `Unable to load spaces. Please try again later. [${name}]`,
    temporary: false
  }));
}

function decryptSpace(space) {
  if (typeof space.decrypt === 'function') {
    return space.decrypt()
      .then((s) => Promise.resolve(s));
  }

  return Promise.resolve(new Error('Space cannot be decrypted'));
}

/**
 * Updates the target space with incoming Mercury activity
 *
 * @export
 * @param {Object} activity
 * @param {Boolean} isSelf if actor is the same as this user
 * @param {Boolean} isReadable if the activity is a readable activity
 * @returns {Object} action
 */
export function updateSpaceWithActivity(activity, isSelf, isReadable = false) {
  // We update lastReadableActivityDate, and the activity attached to this Space
  const space = {
    id: activity.target.id,
    latestActivity: activity.id,
    isLocked: activity.object.tags && activity.object.tags.includes(TAG_LOCKED)
  };

  if (isSelf) {
    space.lastSeenActivityDate = activity.published;
  }

  if (isReadable) {
    space.lastReadableActivityDate = activity.published;
  }

  return {
    type: UPDATE_SPACE_WITH_ACTIVITY,
    payload: {
      space
    }
  };
}

/**
 * Fetches single space from server
 *
 * @export
 * @param {Object} sparkInstance
 * @param {Object} space - represents the space to fetch.
 *   Contains a 'url' or an 'id' and 'cluster'
 * @returns {function} thunk
 */
export function fetchSpace(sparkInstance, space) {
  return (dispatch) => {
    dispatch(storeInitialSpace(space.id));
    // This dispatch was moved here to maintain the legacy conversation redux
    // store values for usage within 'widget-message'. This dispatch clears and
    // initializes the redux store's 'conversation' value.
    dispatch(createConversationBegin());

    return sparkInstance.internal.conversation.get(space, {
      activitiesLimit: 40,
      participantsLimit: -1,
      participantAckFilter: 'all',
      includeParticipants: true,
      globalId: true,
      latestActivity: true
    })
      .then((fullSpace) => {
        dispatch(storeUsers(fullSpace.participants.items));
        dispatch(storeActivities(fullSpace.activities.items));
        dispatch(storeSpaces([fullSpace]));

        // This dispatch was moved here to maintain the legacy conversation
        // redux store values for usage within 'widget-message'. This dispatch
        // stores the conversation details in the redux store's 'conversation'
        // value.
        dispatch(storeConversation(
          computeRoomProperties(fullSpace, sparkInstance)
        ));

        return Promise.resolve(constructSpace(fullSpace));
      })
      .catch((err) => {
        addLoadError(dispatch, err.name);

        throw (err);
      });
  };
}

/**
 * Fetches spaces encrypted, stores encrypted spaces, then decrypts them.
 * This provides a better first time UX due to the fact that users can
 * see the decryption progress of each space.
 *
 * @export
 * @param {object} sparkInstance
 * @param {object} [options={}]
 * @returns {function} thunk
 */
export function fetchSpacesEncrypted(sparkInstance, options = {}) {
  const listOptions = Object.assign({
    deferDecrypt: true,
    summary: true
  }, spacesConversationOptions, options);

  return (dispatch) => sparkInstance.internal.conversation
    .list(listOptions)
    .then((items) => {
      const spaces = items.map((space) => {
        const decryptPromise = decryptSpace(space)
          .then((decryptedSpace) => {
            if (decryptedSpace) {
              const s = Object.assign({}, decryptedSpace, {isDecrypting: false});

              dispatch(storeSpaces([s]));

              return Promise.resolve(constructSpace(s));
            }

            return Promise.resolve(new Error('Space was not decrypted correctly'));
          });

        return Object.assign({}, space, {
          isDecrypting: true,
          decryptPromise
        });
      });

      dispatch(storeSpaces(spaces));

      return Promise.resolve(spaces);
    })
    .catch((err) => {
      addLoadError(dispatch, err.name);

      throw (err);
    });
}

/**
 * Fetches a list of spaces with options
 *
 * @export
 * @param {Object} sparkInstance
 * @param {Object} options
 * @returns {Function} thunk
 */
export function fetchSpaces(sparkInstance, options = {}) {
  const listOptions = Object.assign({}, spacesConversationOptions, options);

  return (dispatch) => sparkInstance.internal.conversation
    .list(listOptions)
    .then((spaces) => {
      dispatch(storeSpaces(spaces));

      const constructedSpaces = spaces.map(constructSpace);

      return Promise.resolve(constructedSpaces);
    })
    .catch((err) => {
      addLoadError(dispatch, err.name);

      throw (err);
    });
}

export function fetchSpacesHydra(sparkInstance, options = {}) {
  const defaultHydraOptions = {
    max: 100,
    sortBy: 'lastactivity'
  };

  const listOptions = Object.assign({}, defaultHydraOptions, options);

  return (dispatch) => sparkInstance.rooms
    .list(listOptions)
    .then((rooms) => {
      const spaces = rooms.items.map(constructSpaceFromHydraRoom);

      dispatch(storeSpaces(spaces));

      const constructedSpaces = spaces.map(constructSpace);

      return Promise.resolve(constructedSpaces);
    })
    .catch((err) => {
      addLoadError(dispatch, err.name);

      throw (err);
    });
}
