import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {bytesToSize} from '@webex/react-component-utils';
import ChipFile from '@webex/react-component-chip-file';

import styles from './styles.css';

const propTypes = {
  files: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      id: PropTypes.string,
      thumbnail: PropTypes.string,
      fileSize: PropTypes.number
    }))
  }).isRequired,
  onFileRemove: PropTypes.func.isRequired
};

function FileStagingArea({
  onFileRemove,
  files
}) {
  if (!files || !Object.keys(files).length) {
    return null;
  }

  const fileChips = [];

  // eslint-disable-next-line react/prop-types
  files.forEach((file) => {
    const chipProps = {
      name: file.name,
      size: bytesToSize(file.fileSize),
      id: file.id,
      onRemove: onFileRemove,
      thumbnail: file.thumbnail
    };

    const chip = (
      <div className={classNames('webex-chip-container', styles.chipContainer)} key={file.id}>
        <ChipFile {...chipProps} />
      </div>
    );

    fileChips.push(chip);
  });

  return (
    <div className={classNames('webex-file-staging-area', styles.fileStagingArea)}>
      <div className={classNames('webex-staged-files', styles.files)}>
        {fileChips}
      </div>
    </div>
  );
}

FileStagingArea.propTypes = propTypes;

export default FileStagingArea;