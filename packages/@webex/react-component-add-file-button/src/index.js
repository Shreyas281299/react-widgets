import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon, {ICONS} from '@webex/react-component-icon';

import styles from './styles.css';

const propTypes = {
  onChange: PropTypes.func
};

const defaultProps = {
  onChange: () => {}
};

function AddFileButton(props) {
  const {
    onChange
  } = props;

  return (
    <div className={classNames('webex-add-file-container', styles.container)}>
      <button className={classNames('webex-add-file-button', styles.button)}>
        <span className={styles.icon}><Icon type={ICONS.ICON_TYPE_ADD} /></span>
      </button>
      <input
        className={classNames('webex-file-input', styles.fileInput)}
        multiple="multiple"
        onChange={onChange}
        type="file"
      />
    </div>
  );
}

AddFileButton.propTypes = propTypes;
AddFileButton.defaultProps = defaultProps;

export default AddFileButton;
