import {compose, lifecycle} from 'recompose';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {connectToMercury} from '@webex/redux-module-mercury';
import {getUser} from '@webex/redux-module-users';

import {destinationTypes} from '../index';
import getMeetingsWidgetProps from '../selector';


function fetchDestinationDetails(props) {
  const {sdkInstance, users} = props;

  if (!props.destinationId || !props.destinationType) {
    // This situation handled in errors.js
    return;
  }

  if (props.destinationType === destinationTypes.EMAIL) {
    // Get User ID
    const userID = users.getIn(['byEmail', props.destinationId]);

    // If it doesn't have a user id, start the request to get it
    if (!userID) {
      props.getUser({email: props.destinationId}, sdkInstance);
    }
  }
}

/**
 * Connects to the websocket server (mercury)
 * @param {object} props
 */
function connectWebsocket(props) {
  const {
    sdkInstance,
    mercuryStatus
  } = props;


  if (!mercuryStatus.hasConnected
      && !mercuryStatus.connecting
      && !mercuryStatus.connected
      && sdkInstance.internal.device.registered) {
    props.connectToMercury(sdkInstance);
  }
}


/**
 * The main setup process that proceeds through a series of events
 * based on the state of the application.
 *
 * @export
 * @param {*} props
 */
export function setup(props) {
  const {
    mercuryStatus,
    sdkInstance,
    sdkState
  } = props;

  // We cannot do anything until the sdk is ready
  if (sdkInstance
    && sdkState.authenticated
    && sdkState.registered
    && !sdkState.hasError
  ) {
    if (!mercuryStatus.connected) {
      connectWebsocket(props);
    }
    else {
      fetchDestinationDetails(props);
    }
  }
}

export default compose(
  connect(
    getMeetingsWidgetProps,
    (dispatch) => bindActionCreators({
      connectToMercury,
      getUser
    }, dispatch)
  ),
  lifecycle({
    componentWillMount() {
      setup(this.props);
    },
    shouldComponentUpdate(nextProps) {
      return nextProps !== this.props;
    },
    componentWillReceiveProps(nextProps) {
      setup(nextProps, this.props);
    }
  })
);
