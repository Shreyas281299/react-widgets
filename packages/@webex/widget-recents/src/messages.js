/*
 * WidgetRecents Messages
 *
 * This contains all the text for the FeaturePage component.
 */
import {defineMessages} from 'react-intl';

export default defineMessages({
  sharedFile: {
    id: 'ciscospark.container.recents.sharedFile',
    defaultMessage: 'Shared a file'
  },
  noSpaces: {
    id: 'ciscospark.container.recents.noSpaces',
    defaultMessage: 'No spaces yet'
  },
  createSpacePlus: {
    id: 'ciscospark.container.recents.createSpacePlus',
    defaultMessage: 'Create a space using the plus button next to the search bar above.'
  },
  createSpaceTeams: {
    id: 'ciscospark.container.recents.createSpaceTeams',
    defaultMessage: 'Create spaces in Webex to see them here.'
  },
  unavailable: {
    id: 'ciscospark.container.recents.userUnavailable',
    defaultMessage: '{actorName} was unavailable.'
  },
  addedToSpace: {
    id: 'ciscospark.container.recents.addedToSpace',
    defaultMessage: '{actorName} added {targetName} to this space.'
  },
  answerButtonLabel: {
    id: 'ciscospark.container.recents.button.answer',
    defaultMessage: 'Answer'
  },
  declineButtonLabel: {
    id: 'ciscospark.container.recents.button.decline',
    defaultMessage: 'Decline'
  },
  incomingCallMessage: {
    id: 'ciscospark.container.recents.message.incomingCall',
    defaultMessage: 'Incoming call'
  },
  errorConnection: {
    id: 'ciscospark.container.recents.error.connection',
    defaultMessage: 'Connection unavailable.'
  },
  errorBadToken: {
    id: 'ciscospark.container.recents.error.badtoken',
    defaultMessage: 'Error: Bad or Invalid Access Token'
  },
  unableToLoad: {
    id: 'ciscospark.container.recents.error.unabletoload',
    defaultMessage: 'Unable to Load Recents'
  },
  unknownError: {
    id: 'ciscospark.container.recents.error.unknown',
    defaultMessage: 'There was a problem loading recents'
  },
  reconnecting: {
    id: 'ciscospark.container.recents.error.reconnecting',
    defaultMessage: 'Reconnecting...'
  },
  viewOlderSpacesButtonLabel: {
    id: 'ciscospark.container.recents.button.viewOlderSpaces',
    defaultMessage: 'View Older Spaces'
  }
});