import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.css';

const propTypes = {
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onSubmit: PropTypes.func,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  textAreaClassName: PropTypes.string,
  value: PropTypes.string
};

const defaultProps = {
  onBlur: () => {},
  onChange: undefined,
  onFocus: () => {},
  onKeyDown: PropTypes.func,
  onSubmit: () => {},
  placeholder: '',
  rows: 1,
  textAreaClassName: '',
  value: ''
};

function TextArea({
  textAreaClassName,
  onBlur,
  onChange,
  onFocus,
  onKeyDown,
  onSubmit,
  placeholder,
  rows,
  value
}) {
  const textAreaProps = {
    className: classNames('webex-textarea', styles.textarea, textAreaClassName),
    onBlur,
    onChange,
    onFocus,
    onKeyDown,
    onSubmit,
    placeholder,
    rows
  };

  // Only set text area value if onChange method exists, otherwise use existing value
  if (onChange && value !== undefined) {
    textAreaProps.value = value;
  }

  return (
    <textarea {...textAreaProps} />
  );
}

TextArea.propTypes = propTypes;
TextArea.defaultProps = defaultProps;

export default TextArea;