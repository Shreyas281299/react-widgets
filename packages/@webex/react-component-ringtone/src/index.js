import {Component} from 'react';
import PropTypes from 'prop-types';
import {Howl} from 'howler';

import RingtoneIncoming from './media/Ringtone.mp3';
import RingtoneRingback from './media/Ringback_v2.mp3';

export const RINGTONE_TYPE_INCOMING = 'RINGTONE_TYPE_INCOMING';
export const RINGTONE_TYPE_RINGBACK = 'RINGTONE_TYPE_RINGBACK';

const propTypes = {
  play: PropTypes.bool,
  type: PropTypes.oneOf([RINGTONE_TYPE_INCOMING, RINGTONE_TYPE_RINGBACK]).isRequired
};

const defaultProps = {
  play: false
};

class Ringtone extends Component {
  constructor(props) {
    super(props);
    let src;

    switch (props.type) {
      case RINGTONE_TYPE_INCOMING:
        src = RingtoneIncoming;
        break;
      case RINGTONE_TYPE_RINGBACK:
        src = RingtoneRingback;
        break;
      default:
    }
    try {
      this.audio = new Howl({
        src: [src],
        loop: true
      });
    }
    catch (error) {
      // eslint-disable-reason No other way to log errors yet
      // eslint-disable-next-line no-console
      console.warn('Audio not available', error);
    }
  }

  componentDidMount() {
    if (this.props.play && this.audio) {
      this.audio.play();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {audio} = this;

    if (audio) {
      if (!nextProps.play && this.props.play) {
        audio.stop();
      }
      else if (nextProps.play && !this.props.play) {
        audio.play();
      }
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    if (this.audio) {
      this.audio.unload();
    }
  }

  render() {
    return null;
  }
}

Ringtone.propTypes = propTypes;
Ringtone.defaultProps = defaultProps;

export default Ringtone;