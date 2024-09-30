import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Img} from 'react-image';
import {Spinner} from '@momentum-ui/react';

import logo from './logo.png';
import styles from './styles.css';

const propTypes = {
  loadingMessage: PropTypes.string
};

const defaultProps = {
  loadingMessage: ''
};

function LoadingScreen({loadingMessage}) {
  return (
    <div className={classNames('webex-teams-loading', styles.loading)}>
      <Img src={logo} alt="Webex Logo" className={classNames('webex-teams-spark-logo', styles.logo)} />
      <div className={classNames('webex-teams-loading-message', styles.loadingMessage)} >
        {loadingMessage}
      </div>
      <div className={classNames('webex-teams-spinner-container', styles.spinner)}>
        <Spinner />
      </div>
    </div>
  );
}

LoadingScreen.propTypes = propTypes;
LoadingScreen.defaultProps = defaultProps;

export default LoadingScreen;
