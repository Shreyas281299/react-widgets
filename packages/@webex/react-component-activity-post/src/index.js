import React from 'react';
import PropTypes from 'prop-types';
import ActivityItemBase from '@webex/react-component-activity-item-base';
import ActivityText from '@webex/react-component-activity-text';
import AdaptiveCard from '@webex/react-component-adaptive-card';

const propTypes = {
  content: PropTypes.string,
  displayName: PropTypes.string,
  renderedComponent: PropTypes.element,
  cards: PropTypes.array,
  sdkInstance: PropTypes.object.isRequired,
  renderAdaptiveCard: PropTypes.bool,
  activityId: PropTypes.string,
  intl: PropTypes.object.isRequired
};

const defaultProps = {
  content: '',
  displayName: '',
  renderedComponent: null,
  cards: [],
  renderAdaptiveCard: false,
  activityId: undefined
};

function ActivityPost(props) {
  const {
    content,
    renderedComponent,
    displayName,
    renderAdaptiveCard,
    cards,
    sdkInstance,
    activityId,
    intl
  } = props;

  return (
    <ActivityItemBase {...props}>
      {renderAdaptiveCard
      ? <AdaptiveCard
          cards={cards}
          displayName={displayName}
          sdkInstance={sdkInstance}
          activityId={activityId}
          intl={intl}
      />
      : <ActivityText content={content} displayName={displayName} renderedComponent={renderedComponent} />}
    </ActivityItemBase>
  );
}

ActivityPost.propTypes = propTypes;
ActivityPost.defaultProps = defaultProps;

export default ActivityPost;