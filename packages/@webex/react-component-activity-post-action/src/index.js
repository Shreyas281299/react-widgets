import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@webex/react-component-button';

import styles from './styles.css';

const propTypes = {
  iconColor: PropTypes.string,
  iconType: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string
};

const defaultProps = {
  iconColor: 'black',
  title: ''
};

function ActivityPostAction(props) {
  return (
    <div className={classNames('webex-post-action-item', styles.postActionItem)}>
      <Button iconColor={props.iconColor} iconType={props.iconType} onClick={props.onClick} title={props.title} />
    </div>
  );
}

ActivityPostAction.propTypes = propTypes;
ActivityPostAction.defaultProps = defaultProps;

export default ActivityPostAction;
