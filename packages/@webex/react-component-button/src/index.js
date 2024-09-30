import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '@webex/react-component-icon';

import styles from './styles.css';

const propTypes = {
  accessibilityLabel: PropTypes.string,
  buttonClassName: PropTypes.string,
  children: PropTypes.node,
  iconColor: PropTypes.string,
  iconType: PropTypes.string,
  label: PropTypes.string,
  labelPosition: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string
};

const defaultProps = {
  accessibilityLabel: '',
  buttonClassName: '',
  children: undefined,
  iconColor: 'white-100',
  iconType: '',
  label: '',
  labelPosition: '',
  title: ''
};


function Button(props) {
  const {
    accessibilityLabel,
    buttonClassName,
    children,
    iconColor,
    iconType,
    label,
    labelPosition,
    onClick,
    title
  } = props;

  const ariaLabel = accessibilityLabel || label || title;

  function handleKeyPress(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  }

  return (
    <div className={classNames('webex-button-container', styles.buttonContainer)}>
      <button
        aria-label={ariaLabel}
        className={classNames('webex-button', styles.button, buttonClassName)}
        onClick={onClick}
        onKeyPress={handleKeyPress}
      >
        {
          iconType &&
          <div className={classNames('webex-button-icon', styles.buttonIcon)} >
            <Icon color={iconColor} title={title} type={iconType} />
          </div>
        }
        {
          labelPosition !== 'bottom' &&
          label
        }
        {children}
      </button>
      {
        label && labelPosition === 'bottom' &&
        <div className={classNames('webex-label', styles.label, styles.labelBottom)}>{label}</div>
      }
    </div>
  );
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
