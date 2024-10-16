import {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';

import browserUtilities from './browserUtils';
import getNotificationDetails from './selectors';
import {
  notificationSent,
  setNotificationPermission,
  setNotificationSupported
} from './actions';
import {
  eventNames,
  constructNotificationEventData
} from './events';


const TIMEOUT_LENGTH = 10000;

const propTypes = {
  notifications: PropTypes.array,
  isSupported: PropTypes.bool,
  isMuted: PropTypes.bool,
  permission: PropTypes.string,
  onEvent: PropTypes.func,
  notificationSent: PropTypes.func,
  setNotificationPermission: PropTypes.func,
  setNotificationSupported: PropTypes.func

};

const defaultProps = {
  notifications: [],
  isSupported: false,
  isMuted: false,
  permission: '',
  onEvent: null,
  notificationSent: null,
  setNotificationPermission: null,
  setNotificationSupported: null
};

export class Notifications extends Component {
  componentDidMount() {
    const {props} = this;

    // Default state is not supported, once we know it is, don't check any more
    this.setup(props);
    this.displayNotifications();
  }

  shouldComponentUpdate(nextProps) {
    const {props} = this;

    return nextProps.notifications !== props.notifications
      || nextProps.isSupported !== props.isSupported
      || nextProps.permission !== props.permission;
  }

  componentDidUpdate() {
    this.setup(this.props);
    this.displayNotifications();
  }

  /**
   * Check for permissions and support
   *
   * @param {object} props
   * @returns null
   */

  setup(props) {
    if (!props.isSupported) {
      this.checkSupported();
    }
    if (_.isNull(props.permission) && props.isSupported) {
      this.requestPermission();
    }
  }

  /**
   * Requests permission from the browser to allow notifications
   *
   * @returns {Promise}
   */
  requestPermission() {
    const {props} = this;

    return browserUtilities.requestPermissionForNotifications(
      (permission) => props.setNotificationPermission(permission)
    );
  }

  /**
   * Checks if browser notifications are supported and updates store
   *
   */
  checkSupported() {
    const {props} = this;

    if (!props.isSupported && browserUtilities.isNotificationSupported()) {
      props.setNotificationSupported(true);
    }
  }

  /**
   * Processes notifications and displays them if needed
   *
   */
  displayNotifications() {
    const {
      notifications, onEvent, permission, isMuted
    } = this.props;
    const hasPermission = permission === browserUtilities.PERMISSION_GRANTED;

    if (notifications && notifications.length > 0) {
      notifications.forEach((notification) => {
        const {
          username, message, avatar, notificationId, alertType
        } = notification;

        if (alertType !== 'none' && !isMuted && hasPermission && browserUtilities.isBrowserHidden()) {
          // Actually display notification
          const n = browserUtilities.spawnNotification(message, avatar, username, TIMEOUT_LENGTH);
          // If there is an onEvent method
          const details = constructNotificationEventData(n, notification);

          if (onEvent && typeof onEvent === 'function') {
            onEvent(eventNames.NOTIFICATIONS_CREATED, details);
            n.addEventListener('click', () => {
              onEvent(eventNames.NOTIFICATIONS_CLICKED, details);
            });
          }
        }
        this.props.notificationSent(notificationId);
      });
    }
  }

  render() {
    return null;
  }
}

Notifications.propTypes = propTypes;
Notifications.defaultProps = defaultProps;

export default connect(
  getNotificationDetails,
  (dispatch) => bindActionCreators({
    notificationSent,
    setNotificationPermission,
    setNotificationSupported
  }, dispatch)
)(Notifications);