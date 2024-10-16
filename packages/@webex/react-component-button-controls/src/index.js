import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {ActivityButton, CallControl} from '@momentum-ui/react';

import styles from './styles.css';

const propTypes = {
  buttons: PropTypes.arrayOf(PropTypes.shape({
    accessibilityLabel: PropTypes.string,
    label: PropTypes.string,
    buttonClassName: PropTypes.string,
    buttonType: PropTypes.oneOfType([
      PropTypes.oneOf(['chat', 'camera', 'meetings', 'whiteboard', 'files', 'share-screen', 'tasks', 'microphone-muted', 'camera-muted', 'cancel']),
      PropTypes.shape({
        color: PropTypes.string,
        icon: PropTypes.element.isRequired
      })
    ]),
    callControl: PropTypes.bool,
    onClick: PropTypes.func
  })).isRequired,
  showLabels: PropTypes.bool

};

const defaultProps = {
  showLabels: false
};

function ButtonControls(props) {
  const {
    buttons,
    showLabels
  } = props;

  const buttonsRendered = buttons.map((button, idx) => {
    const label = showLabels && button.label ? button.label : '';
    const ariaLabel = button.accessibilityLabel || button.label;
    const key = button.key || `button-controls-${idx}`;

    if (button.callControl) {
      return (
        <CallControl
          active={button.active}
          ariaLabel={ariaLabel}
          key={key}
          label={label}
          onClick={button.onClick}
          type={button.buttonType}
        />
      );
    }

    return (
      <ActivityButton
        active={button.active}
        ariaLabel={ariaLabel}
        key={key}
        label={label}
        onClick={button.onClick}
        type={button.buttonType}
      />
    );
  });

  return (
    <div className={classNames('webex-controls-container', styles.controlContainer)}>
      {buttonsRendered}
    </div>
  );
}

ButtonControls.propTypes = propTypes;
ButtonControls.defaultProps = defaultProps;

export default ButtonControls;