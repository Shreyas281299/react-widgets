import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PresenceAvatar from '@webex/react-container-presence-avatar';
import ButtonControls from '@webex/react-component-button-controls';

import styles from './styles.css';

const propTypes = {
  answerButtonLabel: PropTypes.string,
  avatarId: PropTypes.string,
  avatarImage: PropTypes.string,
  declineButtonLabel: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  incomingCallMessage: PropTypes.string,
  onAnswerClick: PropTypes.func.isRequired,
  onDeclineClick: PropTypes.func.isRequired
};

const defaultProps = {
  answerButtonLabel: '',
  avatarId: '',
  avatarImage: '',
  declineButtonLabel: '',
  incomingCallMessage: ''
};

function IncomingCall({
  answerButtonLabel,
  avatarId,
  avatarImage,
  declineButtonLabel,
  incomingCallMessage,
  onAnswerClick,
  onDeclineClick,
  displayName
}) {
  const buttons = [
    {
      accessibilityLabel: answerButtonLabel,
      label: answerButtonLabel,
      buttonType: 'camera',
      callControl: true,
      color: 'green',
      onClick: onAnswerClick
    },
    {
      accessibilityLabel: declineButtonLabel,
      label: declineButtonLabel,
      buttonType: 'cancel',
      callControl: true,
      onClick: onDeclineClick
    }
  ];

  return (
    <div className={classNames(styles.callInactiveContainer, 'call-inactive-container')}>
      <div>
        <PresenceAvatar
          avatarId={avatarId}
          image={avatarImage}
          name={displayName}
          size="40"
        />
      </div>
      <div className={classNames(styles.personName, 'call-person-name')}>
        {displayName}
      </div>
      <div className={classNames(styles.incomingCallLabel, 'incoming-call-label')}>
        {incomingCallMessage}
      </div>
      <div className={classNames(styles.callControls, 'call-controls-container')}>
        <ButtonControls
          buttons={buttons}
          showLabels
        />
      </div>
    </div>
  );
}

IncomingCall.propTypes = propTypes;
IncomingCall.defaultProps = defaultProps;

export default IncomingCall;