import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';

const propTypes = {
  startTime: PropTypes.number.isRequired
};

class Timer extends Component {
  componentDidMount() {
    clearInterval(this.interval);
    if (this.props.startTime) {
      this.interval = setInterval(this.forceUpdate.bind(this), 1000);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (!this.props.startTime) {
      return false;
    }
    const elapsed = Date.now() - this.props.startTime;
    let timeFormat = 'mm:ss';

    if (elapsed > 1000 * 3600) {
      timeFormat = 'hh:mm:ss';
    }

    return (
      <div className={classNames('webex-timer')}>
        {moment.utc(elapsed).format(timeFormat)}
      </div>
    );
  }
}

Timer.propTypes = propTypes;

export default Timer;
