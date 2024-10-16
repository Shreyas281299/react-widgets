import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import PresenceAvatar from '@webex/react-container-presence-avatar';
import ButtonControls from '@webex/react-component-button-controls';

import styles from './styles.css';

const propTypes = {
  avatarId: PropTypes.string,
  avatarImage: PropTypes.string,
  callButtonAriaLabel: PropTypes.string,
  callButtonLabel: PropTypes.string,
  displayName: PropTypes.string,
  onCallClick: PropTypes.func
};

const defaultProps = {
  avatarId: '',
  avatarImage: '',
  callButtonAriaLabel: 'Start Call',
  callButtonLabel: 'Call',
  displayName: 'Unknown',
  onCallClick: () => {}
};


function InactiveCall({
  avatarId,
  avatarImage,
  onCallClick,
  callButtonAriaLabel,
  callButtonLabel,
  displayName,
  setEscapedAuthentication
}) {

  const onClickHandler = () => {
    setEscapedAuthentication(false)
    onCallClick()
  }

  const buttons = [
    {
      label: callButtonLabel,
      accessibilityLabel: callButtonAriaLabel,
      buttonClassName: styles.callButton,
      buttonType: 'camera',
      onClick: onClickHandler
    }
  ];

  return (
    <div className={classNames(styles.callInactiveContainer, 'call-inactive-container')}>
      <PresenceAvatar
        avatarId={avatarId}
        image={avatarImage}
        name={displayName}
        size={84}
      />
      <div className={classNames(styles.personName, 'call-person-name')}>
        {displayName}
      </div>
      <div className={classNames(styles.callControls, 'call-controls-container')}>
        <ButtonControls buttons={buttons} showLabels />
      </div>
    </div>
  );
}

InactiveCall.propTypes = propTypes;
InactiveCall.defaultProps = defaultProps;

export default InactiveCall;