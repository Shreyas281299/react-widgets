import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ActivityPost from '@webex/react-component-activity-post';
import ActivityShareFiles from '@webex/react-component-activity-share-files';
import ActivitySystemMessage, {SYSTEM_MESSAGE_VERBS} from '@webex/react-component-activity-system-message';
import {hasAdaptiveCard, FEATURES_WIDGET_ADAPTIVE_CARD_ON, ACTIVITY_CARDS} from '@webex/react-component-utils';

import styles from './styles.css';

const POST_VERB = 'post';
const SHARE_VERB = 'share';
const LINKS_CONTENT_CATEGORY = 'links';


const propTypes = {
  actor: PropTypes.shape({
    displayName: PropTypes.displayName
  }).isRequired,
  activity: PropTypes.shape({
    cards: PropTypes.array,
    component: PropTypes.element,
    contentCategory: PropTypes.string,
    content: PropTypes.string,
    displayName: PropTypes.string,
    files: PropTypes.shape({
      items: PropTypes.arrayOf(PropTypes.shape({
        image: PropTypes.shape({
          url: PropTypes.string
        }),
        thumbnail: PropTypes.string,
        mimeType: PropTypes.string,
        url: PropTypes.string
      }))
    })
  }).isRequired,
  timestamp: PropTypes.string.isRequired,
  isAdditional: PropTypes.bool,
  isReply: PropTypes.bool,
  verb: PropTypes.string.isRequired,
  adaptiveCardFeatureState: PropTypes.string.isRequired,
  sdkInstance: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  intl: PropTypes.object.isRequired
};

const defaultProps = {
  isAdditional: false,
  isReply: false
};

/**
 * It will store the links and the names of the file and display them
 * as link components separated by commas
 * @param {Object} props
 * @returns {Object} Activity post Item
 */
function createECMItemComponents(props) {
  const links = [];
  /* eslint-disable react/prop-types */
  const {activity} = props;
  let content = 'This ECM file is not supported';

  if (activity.links && activity.links.items) {
    for (const item of activity.links.items) {
      links.push(`<a href="${item.sslr.loc}">${item.displayName}</a>`);
    }

    content = activity.displayName
      ? `${links.join('\n')} \n ${activity.displayName}`
      : `${links.join('\n')}`;
  }

  return (
    <ActivityPost
      content={content}
      displayName={activity.displayName}
      renderedComponent={activity.component}
      {...props}
    />
  );
  /* eslint-enable react/prop-types */
}

function ActivityItem(props) {
  const {
    activity,
    isAdditional,
    isReply,
    verb,
    adaptiveCardFeatureState,
    sdkInstance,
    id,
    intl
  } = props;

  let itemComponent = '';
  let shouldRenderAdaptiveCard = false;

  if (Object.prototype.hasOwnProperty.call(activity, ACTIVITY_CARDS)) {
    shouldRenderAdaptiveCard = hasAdaptiveCard(activity.cards, sdkInstance);
  }
  if (verb === POST_VERB) {
    itemComponent = (
      <ActivityPost
        renderAdaptiveCard={(shouldRenderAdaptiveCard && adaptiveCardFeatureState === FEATURES_WIDGET_ADAPTIVE_CARD_ON
          )}
        cards={activity.cards}
        content={activity.content}
        displayName={activity.displayName}
        renderedComponent={activity.component}
        activityId={id}
        intl={intl}
        {...props}
      />
    );
  }
  else if (verb === SHARE_VERB) {
    if (activity.contentCategory === LINKS_CONTENT_CATEGORY) {
      // ECM files will be displayed as links for now
      itemComponent = createECMItemComponents(props);
    }
    else {
      itemComponent = (
        <ActivityShareFiles
          renderAdaptiveCard={(shouldRenderAdaptiveCard && adaptiveCardFeatureState === FEATURES_WIDGET_ADAPTIVE_CARD_ON
          )}
          cards={activity.cards}
          activityId={id}
          content={activity.content}
          displayName={activity.displayName}
          files={activity.files.items}
          intl={intl}
          {...props}
        />
      );
    }
  }
  else if (SYSTEM_MESSAGE_VERBS.indexOf(verb) !== -1) {
    itemComponent = <ActivitySystemMessage {...props} />;
  }

  const style = isReply ? styles.activityReplyItemContainer : styles.activityItemContainer;

  return (
    <div className={classNames('webex-activity-item-container', style, isAdditional ? styles.additional : '')}>
      {itemComponent}
    </div>
  );
}

ActivityItem.propTypes = propTypes;
ActivityItem.defaultProps = defaultProps;

export default ActivityItem;