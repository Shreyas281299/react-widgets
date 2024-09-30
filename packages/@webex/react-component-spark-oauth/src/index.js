import {Component} from 'react';
import PropTypes from 'prop-types';
import '@webex/internal-plugin-encryption';
import LocalStorageStoreAdapter from '@webex/storage-adapter-local-storage';
import Spark from '@webex/webex-core';

const propTypes = {
  clientId: PropTypes.string.isRequired,
  clientSecret: PropTypes.string.isRequired,
  doAuth: PropTypes.bool,
  onAuth: PropTypes.func,
  redirectUri: PropTypes.string.isRequired,
  scope: PropTypes.string.isRequired
};

const defaultProps = {
  doAuth: false,
  onAuth: () => {}
};

class SparkOAuth extends Component {
  componentDidMount() {
    this.spark = new Spark({
      config: {
        credentials: {
          oauth: {
            client_id: this.props.clientId,
            client_secret: this.props.clientSecret,
            scope: this.props.scope,
            redirect_uri: this.props.redirectUri
          }
        },
        storage: {
          boundedAdapter: new LocalStorageStoreAdapter('webex-embedded')
        }
      }
    });

    this.spark.listenToAndRun(this.spark, 'change:canAuthorize', () => {
      this.checkForOauthToken();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.doAuth && nextProps.doAuth !== this.props.doAuth) {
      this.spark.authenticate();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  checkForOauthToken() {
    const {credentials} = this.spark;

    if (credentials.canAuthorize && credentials.supertoken) {
      const {supertoken} = credentials;

      this.props.onAuth(supertoken.access_token);
    }
  }

  render() {
    return null;
  }
}

SparkOAuth.propTypes = propTypes;
SparkOAuth.defaultProps = defaultProps;

export default SparkOAuth;
