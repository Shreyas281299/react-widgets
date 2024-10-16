import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classNames from 'classnames';
import {fetchAvatarsForUsers} from '@webex/redux-module-avatar';
import TypingAvatar from '@webex/react-component-typing-avatar';
import Badge from '@webex/react-component-badge';

import getReadReceiptsProps from './selectors';
import styles from './styles.css';

const injectedPropTypes = {
  fetchAvatarsForUsers: PropTypes.func.isRequired,
  readReceipts: PropTypes.shape({
    hiddenUsers: PropTypes.array,
    visibleUsers: PropTypes.array
  }),
  sparkInstance: PropTypes.object
};

const propTypes = {
  ...injectedPropTypes
};

export class ReadReceipts extends Component {
  componentWillReceiveProps(nextProps) {
    const {visibleUsers} = this.props.readReceipts;
    const nextUsers = nextProps.readReceipts.visibleUsers;

    if (visibleUsers !== nextUsers) {
      this.props.fetchAvatarsForUsers(nextUsers.map((user) => user.userId), this.props.sparkInstance);
    }
  }

  shouldComponentUpdate(nextProps) {
    const {props} = this;

    return nextProps.readReceipts !== props.readReceipts;
  }

  render() {
    const {hiddenUsers, visibleUsers} = this.props.readReceipts;
    const readReceipts = visibleUsers.map((user) =>
      (<TypingAvatar
        avatarId={user.userId}
        isTyping={user.isTyping}
        key={user.userId}
        name={user.displayName}
      />));

    if (hiddenUsers.length) {
      const badgeTooltip = hiddenUsers
        .slice(0, 10)
        .map((u) => <p key={u.userId}>{u.displayName}</p>);

      if (hiddenUsers.length > 10) {
        const remainingHidden = `+${hiddenUsers.length - 10}`;

        badgeTooltip.push(<p>{remainingHidden}</p>);
      }
      readReceipts.push(
        <Badge
          key={`${hiddenUsers.length}-remaining`}
          tooltip={badgeTooltip}
        >
          {`+${hiddenUsers.length}`}
        </Badge>
      );
    }

    return (
      <div className={classNames('webex-read-receipts', styles.readReceipts)}>
        {readReceipts}
      </div>
    );
  }
}


ReadReceipts.propTypes = propTypes;

export default connect(
  getReadReceiptsProps,
  (dispatch) => bindActionCreators({
    fetchAvatarsForUsers
  }, dispatch)
)(ReadReceipts);