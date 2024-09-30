import {validateAndDecodeId} from '@webex/react-component-utils';
import {addError} from '@webex/redux-module-errors';

import messages from './messages';

import {destinationTypes} from './constants';

export const FETCHING_SPACE_DETAILS = 'widget-space/FETCHING_SPACE_DETAILS';
export const RELOAD_WIDGET = 'widget-space/RELOAD_WIDGET';
export const STORE_ACTIVITY_TYPES = 'widget-space/STORE_ACTIVITY_TYPES';
export const STORE_DESTINATION = 'widget-space/STORE_DESTINATION';
export const STORE_SPACE_DETAILS = 'widget-space/STORE_SPACE_DETAILS';
export const TOGGLE_ACTIVITY_MENU_VISIBLE = 'widget-space/TOGGLE_ACTIVITY_MENU_VISIBLE';
export const UPDATE_ACTIVITY_TYPE = 'widget-space/UPDATE_ACTIVITY_TYPE';
export const UPDATE_ACTIVITY_TYPE_SECONDARY = 'widget-space/UPDATE_ACTIVITY_TYPE_SECONDARY';
export const UPDATE_ACTIVITY_MENU_VISIBLE = 'widget-space/UPDATE_ACTIVITY_MENU_VISIBLE';
export const UPDATE_WIDGET_STATUS = 'widget-space/UPDATE_WIDGET_STATUS';

export function updateActivityType(type) {
  return {
    type: UPDATE_ACTIVITY_TYPE,
    payload: {
      type
    }
  };
}

export function updateSecondaryActivityType(type) {
  return {
    type: UPDATE_ACTIVITY_TYPE_SECONDARY,
    payload: {
      type
    }
  };
}

/**
 * Resets the widget to "almost" default values
 * This is usually triggered when a destination changes
 *
 * @export
 * @returns {Object}
 */
export function reloadWidget() {
  return {
    type: RELOAD_WIDGET
  };
}

/**
 * Stores the space widget's destination
 *
 * @export
 * @param {Object} {id, location}
 * @returns {Object}
 */
export function storeDestination({id, cluster, type}) {
  return {
    type: STORE_DESTINATION,
    payload: {
      id,
      type,
      // Don't store a undefined value
      ...cluster && {cluster}
    }
  };
}

export function updateActivityMenuVisible(isActivityMenuVisible) {
  return {
    type: UPDATE_ACTIVITY_MENU_VISIBLE,
    payload: {
      isActivityMenuVisible
    }
  };
}

export function toggleActivityMenuVisible() {
  return {
    type: TOGGLE_ACTIVITY_MENU_VISIBLE
  };
}

function storeSpaceDetails(details) {
  return {
    type: STORE_SPACE_DETAILS,
    payload: {
      details
    }
  };
}

export function storeActivityTypes(activityTypes) {
  return {
    type: STORE_ACTIVITY_TYPES,
    payload: {
      activityTypes
    }
  };
}

export function updateWidgetStatus(status) {
  return {
    type: UPDATE_WIDGET_STATUS,
    payload: {
      status
    }
  };
}


function fetchingSpaceDetails() {
  return {
    type: FETCHING_SPACE_DETAILS
  };
}

/**
 * Gets details about the space
 * @param {Object} options.sparkInstance
 * @param {String} options.destinationId
 * @param {String} options.destinationType
 * @param {String} options.destinationCluster
 * @param {Object} options.intl
 * @returns {Thunk}
 */
export function getSpaceDetails({
  sparkInstance,
  destinationId,
  destinationType,
  intl
}) {
  return (dispatch) => {
    // We cannot fetch space details for 1:1's here, it will be handled in conversation store
    if ([
      destinationTypes.EMAIL,
      destinationTypes.USERID,
      destinationTypes.SIP,
      destinationTypes.PSTN
    ].includes(destinationType)) {
      return dispatch(storeSpaceDetails({
        type: 'direct'
      }));
    }
    const {formatMessage} = intl;
    const {id: spaceIdUUID} = validateAndDecodeId(destinationId);

    if (!spaceIdUUID) {
      const displayTitle = formatMessage(messages.unableToLoad);
      const displaySubtitle = formatMessage(messages.badSpaceId);

      return dispatch(addError({
        id: 'getSpace.badId',
        displayTitle,
        displaySubtitle,
        temporary: false
      }));
    }
    dispatch(fetchingSpaceDetails());

    return sparkInstance.request({
      service: 'hydra',
      resource: `/rooms/${destinationId}`
    })
      .then((res) => dispatch(storeSpaceDetails(res.body)))
      .catch((error) => {
        const displayTitle = formatMessage(messages.unableToLoad);
        let displaySubtitle;

        if (error.statusCode === 401) {
          displaySubtitle = formatMessage(messages.errorBadToken);
        }
        else if (error.statusCode === 404) {
          displaySubtitle = formatMessage(messages.errorNotFound);
        }

        return dispatch(addError({
          id: 'getSpace.hydraFail',
          displayTitle,
          displaySubtitle,
          temporary: false,
          code: error.statusCode
        }));
      });
  };
}
