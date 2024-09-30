import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {constructHydraId} from '@webex/react-component-utils';

import styles from './at-mention.css';

const EVENT_NAME_MENTION_CLICKED = 'mention:clicked';

const propTypes = {
  content: PropTypes.string,
  onEvent: PropTypes.func
};

const defaultProps = {
  content: '',
  onEvent: () => {}
};

function AtMentionComponent({
  content,
  onEvent
}) {
  function isMention(target) {
    return target.tagName === 'SPARK-MENTION' && target.dataset;
  }

  function triggerEvent(e) {
    const {target} = e;

    if (isMention(target)) {
      onEvent(EVENT_NAME_MENTION_CLICKED, {
        type: target.dataset.objectType,
        id: constructHydraId(target.dataset.objectType, target.dataset.objectId)
      });
    }
  }

  function handleClick(e) {
    triggerEvent(e);
  }

  function handleKeyUp(e) {
    if (e.keyCode && e.keyCode === 13) {
      return triggerEvent(e);
    }

    return false;
  }

  return (
    <div
      className={classNames(styles.atMention)}
      // eslint-disable-reason content is generated from elsewhere in the app
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: content.replace(/<a(?![^>]*target="_blank"|\s*href\s*=\s*["'](?:mailto:|tel:))([^>]*)>/gi, '<a target="_blank"$1>')}}
      onClick={handleClick}
      onKeyUp={handleKeyUp}
      role="presentation"
    />
  );
}

AtMentionComponent.propTypes = propTypes;
AtMentionComponent.defaultProps = defaultProps;


export default (activity, onEvent) => {
  if (activity.mentions) {
    const component = (
      <AtMentionComponent
        content={activity.content}
        mentions={activity.mentions.items}
        onEvent={onEvent}
      />
    );

    return Object.assign({}, activity, {component});
  }

  return activity;
};
