import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';

import CallDataActivityMessage from '@webex/react-component-call-data-activity';

import messages from './messages';
import styles from './styles.css';

// eslint-disable-next-line no-warning-comments
// TODO: Migrate message verbs into a top level helper package

export const SYSTEM_MESSAGE_VERB_TOMBSTONE = 'tombstone';
export const SYSTEM_MESSAGE_VERB_CREATE = 'create';
export const SYSTEM_MESSAGE_VERB_UPDATE = 'update';
export const SYSTEM_MESSAGE_VERB_ADD = 'add';
export const SYSTEM_MESSAGE_VERB_LEAVE = 'leave';
export const SYSTEM_MESSAGE_VERBS = [
  SYSTEM_MESSAGE_VERB_CREATE,
  SYSTEM_MESSAGE_VERB_TOMBSTONE,
  SYSTEM_MESSAGE_VERB_UPDATE,
  SYSTEM_MESSAGE_VERB_ADD,
  SYSTEM_MESSAGE_VERB_LEAVE
];

const propTypes = {
  activity: PropTypes.shape({
    duration: PropTypes.number,
    isGroupCall: PropTypes.bool,
    participants: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          isInitiator: PropTypes.bool,
          person: PropTypes.shape({
            entryUUID: PropTypes.string
          }),
          state: PropTypes.string
        })
      )
    })
  }),
  actor: PropTypes.shape({
    entryUUID: PropTypes.string
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.string
  }),
  isSelf: PropTypes.bool,
  name: PropTypes.string.isRequired,
  timestamp: PropTypes.string,
  verb: PropTypes.string.isRequired
};

const defaultProps = {
  activity: {
    duration: null,
    isGroupCall: false,
    participants: {
      items: []
    }
  },
  actor: {},
  currentUser: {},
  isSelf: false,
  timestamp: ''
};

function ActivitySystemMessage(props) {
  const {
    activity,
    actor,
    currentUser,
    isSelf,
    name,
    timestamp,
    verb
  } = props;

  let systemMessage;

  switch (verb) {
    case SYSTEM_MESSAGE_VERB_ADD: {
      if (isSelf) {
        systemMessage = <FormattedMessage {...messages.youAdded} values={{name}} />;
      }
      else {
        systemMessage = <FormattedMessage {...messages.someoneAdded} values={{name}} />;
      }
      break;
    }
    case SYSTEM_MESSAGE_VERB_CREATE: {
      if (isSelf) {
        systemMessage = <FormattedMessage {...messages.youCreate} />;
      }
      else {
        systemMessage = <FormattedMessage {...messages.someoneCreate} values={{name}} />;
      }
      break;
    }
    case SYSTEM_MESSAGE_VERB_LEAVE: {
      if (isSelf) {
        systemMessage = <FormattedMessage {...messages.youRemoved} values={{name}} />;
      }
      else {
        systemMessage = <FormattedMessage {...messages.someoneRemoved} values={{name}} />;
      }
      break;
    }
    case SYSTEM_MESSAGE_VERB_TOMBSTONE: {
      if (isSelf) {
        systemMessage = <FormattedMessage {...messages.youDelete} />;
      }
      else {
        systemMessage = <FormattedMessage {...messages.someoneDelete} values={{name}} />;
      }
      break;
    }
    case SYSTEM_MESSAGE_VERB_UPDATE: {
      systemMessage = (
        <CallDataActivityMessage
          actor={actor}
          currentUser={currentUser}
          duration={activity.duration}
          isGroupCall={activity.isGroupCall}
          participants={activity.participants.items}
        />
      );
      break;
    }
    default:
      return null;
  }

  return (
    <div className={classNames('webex-system-message', styles.systemMessage)}>
      {systemMessage} {timestamp}
    </div>
  );
}

ActivitySystemMessage.propTypes = propTypes;
ActivitySystemMessage.defaultProps = defaultProps;

export default ActivitySystemMessage;