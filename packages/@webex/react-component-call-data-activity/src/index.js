import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import messages from './messages';
import {parseActivityCallData} from './helpers';

const propTypes = {
  actor: PropTypes.shape({
    displayName: PropTypes.string.isRequired
  }),
  duration: PropTypes.number.isRequired,
  isGroupCall: PropTypes.bool.isRequired,
  participants: PropTypes.arrayOf(
    PropTypes.shape({
      isInitiator: PropTypes.bool,
      person: PropTypes.shape({
        entryUUID: PropTypes.string
      }),
      state: PropTypes.string
    })
  ).isRequired,
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
};

const defaultProps = {
  actor: {
    displayName: ''
  }
};

const CallDataActivityMessage = (props) => {
  const {
    actor,
    duration,
    isGroupCall,
    participants,
    currentUser
  } = props;
  const callData = {
    actor,
    duration,
    isGroupCall,
    participants
  };
  const parsedCallData = parseActivityCallData(callData, currentUser);

  return parsedCallData && (
    <FormattedMessage {...messages[parsedCallData.status]} values={{...parsedCallData.callInfo}} />
  );
};

CallDataActivityMessage.propTypes = propTypes;
CallDataActivityMessage.defaultProps = defaultProps;

export default CallDataActivityMessage;