import {
  fromJS,
  Record
} from 'immutable';

import {union} from 'lodash';

import {
  ADD_SPACE_TAGS,
  REMOVE_SPACE,
  REMOVE_SPACE_TAGS,
  STORE_SPACES,
  STORE_INITIAL_SPACE,
  UPDATE_SPACE_READ,
  UPDATE_SPACE_WITH_ACTIVITY
} from './actions';

export const Space = Record({
  latestActivity: null,
  avatar: '',
  displayName: '',
  id: null,
  globalId: null,
  url: '',
  locusUrl: '',
  activities: [],
  lastReadableActivityDate: '',
  lastSeenActivityDate: '',
  lastActivityTimestamp: '',
  conversationWebUrl: '',
  participants: [],
  type: '',
  published: '',
  tags: [],
  team: null,
  isDecrypting: false,
  isLocked: false,
  isHidden: false,
  isFetching: false
});

export const initialState = fromJS({
  byId: {}
});


export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SPACE_TAGS: {
      const {spaceId, tags} = action.payload;

      if (state.hasIn(['byId', spaceId])) {
        const originalTags = state.getIn(['byId', spaceId, 'tags']);

        return state.setIn(['byId', spaceId, 'tags'], union(originalTags, tags));
      }

      return state;
    }

    case REMOVE_SPACE:
      return state.deleteIn(['byId', action.payload.id]);

    case REMOVE_SPACE_TAGS: {
      const {spaceId, tags} = action.payload;

      if (state.hasIn(['byId', spaceId])) {
        const modifiedTags = state.getIn(['byId', spaceId, 'tags']);

        tags.forEach((t) => {
          const index = modifiedTags.indexOf(t);

          if (index !== -1) {
            modifiedTags.splice(index, 1);
          }
        });

        return state.setIn(['byId', spaceId, 'tags'], modifiedTags);
      }

      return state;
    }

    case STORE_INITIAL_SPACE: {
      const {id} = action.payload;

      return state.setIn(['byId', id], new Space({
        id,
        isFetching: true
      }));
    }

    case STORE_SPACES: {
      const spaces = {};

      action.payload.spaces.forEach((s) => {
        spaces[s.id] = new Space(s);
      });

      return state.mergeDeepIn(['byId'], spaces);
    }

    case UPDATE_SPACE_WITH_ACTIVITY: {
      const {space} = action.payload;

      if (state.hasIn(['byId', space.id])) {
        return state.mergeDeepIn(['byId', space.id], space);
      }

      return state;
    }

    case UPDATE_SPACE_READ: {
      const {lastSeenDate, spaceId} = action.payload;

      return state.setIn(['byId', spaceId, 'lastSeenActivityDate'], lastSeenDate);
    }

    default:
      return state;
  }
}