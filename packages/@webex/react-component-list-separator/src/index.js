import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './styles.css';

const propTypes = {
  isInformative: PropTypes.bool,
  primaryText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]).isRequired
};

const defaultProps = {
  isInformative: false
};

function ListSeparator({
  isInformative,
  primaryText
}) {
  const mainStyles = ['separator', styles.separator];
  const textStyles = ['separator-text', styles.separatorText];
  const informativeClass = 'informative';

  if (isInformative) {
    mainStyles.push(informativeClass);
    mainStyles.push(styles[informativeClass]);
    textStyles.push(informativeClass);
    textStyles.push(styles[informativeClass]);
  }

  return (
    <div className={classNames(mainStyles)}>
      <p className={classNames(textStyles)}>{primaryText}</p>
    </div>
  );
}

ListSeparator.propTypes = propTypes;
ListSeparator.defaultProps = defaultProps;

export default ListSeparator;
