import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import PresenceAvatar from '@webex/react-container-presence-avatar';

import {Icon} from '@momentum-ui/react';

import styles from './styles.css';


const propTypes = {
  actorId: PropTypes.string,
  children: PropTypes.element.isRequired,
  hasError: PropTypes.bool,
  id: PropTypes.string.isRequired,
  isAdditional: PropTypes.bool,
  isFlagged: PropTypes.bool,
  isFlagPending: PropTypes.bool,
  isPending: PropTypes.bool,
  isSelf: PropTypes.bool,
  name: PropTypes.string,
  onActivityDelete: PropTypes.func,
  onActivityFlag: PropTypes.func,
  onActivityRetry: PropTypes.func,
  timestamp: PropTypes.string
};

const defaultProps = {
  actorId: '',
  hasError: false,
  isAdditional: false,
  isFlagged: false,
  isFlagPending: false,
  isPending: false,
  isSelf: false,
  name: '',
  onActivityDelete: () => {},
  onActivityFlag: () => {},
  onActivityRetry: () => {},
  timestamp: ''
};

function ActivityItemBase({
  actorId,
  children,
  id,
  isAdditional,
  hasError,
  isFlagged,
  isFlagPending,
  isPending,
  isSelf,
  name,
  onActivityDelete,
  onActivityFlag,
  onActivityRetry,
  timestamp
}) {
  let deleteAction;
  let flagAction;
  let errorDisplay;
  const displayName = isSelf ? 'You' : name;

  function handleOnDelete() {
    onActivityDelete(id);
  }

  function handleOnFlag() {
    onActivityFlag(id);
  }

  function handleOnRetry() {
    onActivityRetry(id);
  }

  function getActionClassNames({highlight = false, flagActionPending = false} = {}) {
    const actionClassNames = ['activity-post-action', styles.activityPostAction];

    if (highlight) {
      actionClassNames.push('isHighlighted', styles.isHighlighted);
    }
    if (flagActionPending) {
      actionClassNames.push('flagActionPending');
    }

    return actionClassNames;
  }

  if (!isPending) {
    flagAction = (
      <div className={classNames(getActionClassNames({highlight: isFlagged, flagActionPending: isFlagPending}))}>
        <Icon
          ariaLabel="Flag for follow-up"
          color="black-100"
          name={isFlagged ? 'flag-active_16' : 'flag_16'}
          onClick={handleOnFlag}
          aria-pressed={isFlagged}
        />
      </div>
    );
    if (isSelf) {
      deleteAction = (
        <div className={classNames(getActionClassNames())}>
          <Icon
            ariaLabel="Delete message"
            color="black-100"
            name="clear_16"
            onClick={handleOnDelete}
          />
        </div>
      );
    }
    else {
      deleteAction = (
        <div className={classNames(getActionClassNames())}>
          <div className={classNames('webex-action-spacer', styles.actionSpacer)} />
        </div>
      );
    }
  }

  if (hasError) {
    errorDisplay = (
      <div
        className={classNames('webex-activity-error', styles.error)}
        role="presentation"
      >
        <button onClick={handleOnRetry}>Unable to post. Click to retry</button>
      </div>
    );
  }

  const activityItemClasses = [
    'activity-item',
    styles.activityItem,
    isAdditional ? classNames('activity-item-additional', styles.additional) : '',
    isPending ? classNames('activity-item-pending', styles.pending) : ''
  ];

  const avatarClasses = [
    'webex-avatar-wrapper',
    'webex-activity-item-avatar-wrapper',
    styles.avatarWrapper,
    isSelf ? styles.selfAvatar : ''
  ];

  return (
    <div className={classNames(activityItemClasses)}>
      <div className={classNames(avatarClasses)}>
        <PresenceAvatar
          avatarId={actorId}
          isSelfAvatar={isSelf}
          name={name}
          size={36}
        />
      </div>
      <div className={classNames('webex-content-container', styles.contentContainer)}>
        <div className={classNames('webex-meta', styles.meta)}>
          <div className={classNames('webex-display-name', styles.displayName)} title={name}>{displayName}</div>
          <div className={classNames('webex-published', styles.published)}>{timestamp}</div>
        </div>
        <div className={classNames('webex-activity-content', styles.content)}>
          {children}
        </div>
        {errorDisplay}
      </div>
      <div className={classNames('webex-activity-post-actions', styles.activityPostActions)} >
        {flagAction}
        {deleteAction}
      </div>
    </div>
  );
}

ActivityItemBase.propTypes = propTypes;
ActivityItemBase.defaultProps = defaultProps;

export default ActivityItemBase;
