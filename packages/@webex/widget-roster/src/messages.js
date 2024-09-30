/*
 * WidgetRoster Messages
 *
 * This contains all the text for the Roster component.
 */
import {defineMessages} from 'react-intl';

export default defineMessages({
  addPeople: {
    id: 'ciscospark.container.roster.message.addPeople',
    defaultMessage: 'Add people'
  },
  addPlaceholder: {
    id: 'ciscospark.container.roster.message.addPeople.placeholder',
    defaultMessage: 'Who are you looking for?'
  },
  cancelDetails: {
    id: 'ciscospark.container.roster.message.cancelDetails',
    defaultMessage: 'Cancel'
  },
  removeParticipant: {
    id: 'ciscospark.container.roster.message.removeParticipant',
    defaultMessage: 'Remove'
  },
  noResults: {
    id: 'ciscospark.container.roster.message.addPeople.noResults',
    defaultMessage: 'No Results'
  },
  externalParticipants: {
    id: 'ciscospark.container.roster.message.externalParticipants',
    defaultMessage: 'People outside your company are included in this space'
  },
  moderators: {
    id: 'ciscospark.container.roster.title.moderators',
    defaultMessage: 'Moderators'
  },
  participants: {
    id: 'ciscospark.container.roster.title.participants',
    defaultMessage: 'Participants'
  },
  inMeeting: {
    id: 'ciscospark.container.roster.title.inMeeting',
    defaultMessage: 'In Meeting'
  },
  notInMeeting: {
    id: 'ciscospark.container.roster.title.notInMeeting',
    defaultMessage: 'Not in Meeting'
  }
});
