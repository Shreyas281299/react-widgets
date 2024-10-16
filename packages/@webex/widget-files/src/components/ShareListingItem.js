import React from 'react';
import PropTypes from 'prop-types';

import FileShareDisplay from '@webex/react-component-file-share-display';
import connectFileDownloader from '@webex/react-container-file-downloader';

function ShareListingItem({fileShare, onDownloadClick, type}) {
  return (
    <div>
      <FileShareDisplay
        actor={fileShare.actor}
        file={fileShare.item}
        isFetching={fileShare.item.isFetching}
        objectUrl={fileShare.item.objectUrl}
        onDownloadClick={onDownloadClick}
        type={type}
        timestamp={fileShare.timestamp}
      />
    </div>
  );
}

ShareListingItem.propTypes = {
  fileShare: PropTypes.shape({
    actor: PropTypes.object,
    activityId: PropTypes.string,
    item: PropTypes.object,
    timestamp: PropTypes.string
  }).isRequired,
  onDownloadClick: PropTypes.func.isRequired, // Injected via connectFileDownloader
  type: PropTypes.string.isRequired
};

export default connectFileDownloader(ShareListingItem);