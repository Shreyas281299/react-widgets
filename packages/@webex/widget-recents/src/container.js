import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import classNames from 'classnames';
import {autobind} from 'core-decorators';
import {compose} from 'recompose';

import {enhancer as mediaEnhancer} from '@webex/redux-module-media';
import {
  fetchSpace,
  removeSpace,
  updateSpaceWithActivity,
  updateSpaceRead
} from '@webex/redux-module-spaces';
import {storeActivities} from '@webex/redux-module-activities';
import {getFeature} from '@webex/redux-module-features';

import LoadingScreen from '@webex/react-component-loading-screen';
import ErrorDisplay from '@webex/react-component-error-display';
import SpacesList from '@webex/react-component-spaces-list';

import messages from './messages';

import NoSpaces from './components/NoSpaces';
import RecentsHeader from './components/RecentsHeader';

import enhancers from './enhancers';
import getRecentsWidgetProps from './selector';
import {updateSpaceKeywordFilter, updateWidgetStatus} from './actions';

import styles from './styles.css';
import './momentum.scss';

import {
  eventNames,
  constructRoomsEventData,
  constructCallEventData
} from './events';

const injectedPropTypes = {
  currentUser: PropTypes.object,
  currentUserAvatar: PropTypes.object,
  errors: PropTypes.object.isRequired,
  incomingCall: PropTypes.object,
  media: PropTypes.object.isRequired,
  mercuryStatus: PropTypes.object.isRequired,
  spacesById: PropTypes.object.isRequired,
  spacesList: PropTypes.object.isRequired,
  spacesListArray: PropTypes.array.isRequired,
  sparkInstance: PropTypes.object,
  sparkState: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  teams: PropTypes.object.isRequired,
  widgetRecents: PropTypes.object.isRequired,
  widgetStatus: PropTypes.object.isRequired,
  addError: PropTypes.func.isRequired,
  features: PropTypes.object.isRequired,
  keywordFilter: PropTypes.string,
  fetchAvatar: PropTypes.func.isRequired,
  fetchSpace: PropTypes.func.isRequired,
  getFeature: PropTypes.func.isRequired,
  removeSpace: PropTypes.func.isRequired,
  updateSpaceRead: PropTypes.func.isRequired,
  updateSpaceWithActivity: PropTypes.func.isRequired,
  updateSpaceKeywordFilter: PropTypes.func.isRequired,
  updateWidgetStatus: PropTypes.func.isRequired
};

export const ownPropTypes = {
  basicMode: PropTypes.bool,
  enableAddButton: PropTypes.bool,
  enableSpaceListFilter: PropTypes.bool,
  enableUserProfile: PropTypes.bool,
  enableUserProfileMenu: PropTypes.bool,
  muteNotifications: PropTypes.bool,
  spaceLoadCount: PropTypes.number
};

const defaultProps = {
  basicMode: false,
  enableAddButton: false,
  enableUserProfile: true,
  enableUserProfileMenu: false,
  enableSpaceListFilter: true,
  spaceLoadCount: 25
};

export class RecentsWidget extends Component {
  componentWillReceiveProps(nextProps) {
    this.addListeners(nextProps);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.spacesList !== this.props.spacesList
      || nextProps.errors !== this.props.errors
      || nextProps.widgetRecents !== this.props.widgetRecents
      || nextProps.incomingCall !== this.props.incomingCall;
  }

  @autobind
  getSpaceFromCall(call) {
    if (call.instance.locus && call.instance.locus.conversationUrl) {
      return this.props.spacesById.get(call.instance.locus.conversationUrl.split('/').pop());
    }

    return '';
  }

  @autobind
  addListeners(nextProps) {
    const {
      incomingCall
    } = nextProps;

    if (incomingCall && !this.props.incomingCall) {
      this.handleCall(incomingCall.instance);
    }
  }

  @autobind
  handleCall(call) {
    const {
      props,
      handleEvent
    } = this;
    const {
      spacesById
    } = props;
    let space;

    if (call.conversationUrl) {
      space = spacesById.get(call.conversationUrl.split('/').pop());
    }
    else {
      // We don't know anything about this space for this call
      space = {
        id: call.id
      };
    }

    handleEvent(eventNames.CALLS_CREATED, constructCallEventData(call, space));
  }

  @autobind
  handleSpaceClick(spaceId) {
    const space = this.props.spacesList.get(spaceId);

    this.handleEvent(eventNames.SPACES_SELECTED, constructRoomsEventData(space));
  }

  @autobind
  handleSpaceCallClick(spaceId) {
    const space = this.props.spacesList.get(spaceId);
    const roomData = constructRoomsEventData(space);

    this.handleEvent(eventNames.SPACES_SELECTED, {
      action: eventNames.ACTION_CALL,
      ...roomData
    });
  }

  @autobind
  handleAddClick() {
    this.handleEvent(eventNames.ADD_CLICKED, {});
  }

  @autobind
  handleListScroll({scrollTop}) {
    const isScrolledToTop = scrollTop === 0;

    if (isScrolledToTop !== this.props.widgetStatus.isScrolledToTop) {
      this.props.updateWidgetStatus({isScrolledToTop});
    }
  }

  @autobind
  handleProfileClick() {
    const {
      currentUserWithAvatar
    } = this.props;

    this.handleEvent(eventNames.PROFILE_CLICKED, currentUserWithAvatar);
  }

  @autobind
  handleSignOutClick() {
    this.handleEvent(eventNames.USER_SIGNOUT_CLICKED, {});
  }

  /**
   * Event handler in case one isn't provided
   * @param {string} name
   * @param {object} data
   * @returns {undefined}
   */
  @autobind
  handleEvent(name, data) {
    const {
      onEvent,
      sparkInstance
    } = this.props;
    const logData = Object.assign({}, data);

    // Omit call objet from logger to prevent call range error
    if (data.call) {
      logData.call = '--- OMITTED ---';
    }
    sparkInstance.logger.info(`event handler - ${name}`, logData);
    if (typeof onEvent === 'function') {
      this.props.onEvent(name, data);
    }
  }

  @autobind
  handleSpaceFilterInput(event) {
    const {props} = this;
    const keyword = event.target.value;

    props.updateSpaceKeywordFilter(keyword);
  }

  render() {
    const {props} = this;
    const {
      enableAddButton,
      enableSpaceListFilter,
      enableUserProfile,
      enableUserProfileMenu,
      errors,
      features,
      keywordFilter,
      spacesListArray,
      currentUser,
      currentUserWithAvatar,
      widgetStatus
    } = props;
    const {formatMessage} = props.intl;

    let displaySubtitle, displayTitle, temporary, widgetError;

    // Recents widget is ready once we have some spaces or a search causing spaces to be empty
    const isFiltered = keywordFilter && keywordFilter.length;
    const isReady = (widgetStatus.hasFetchedInitialSpaces || isFiltered);

    // Recents widget is loading more until it has fetched all spaces
    const isLoadingMore = !widgetStatus.hasFetchedAllSpaces;

    // Display the header if any of these options are true, otherwise, hide header.
    const showHeader = enableSpaceListFilter || enableAddButton || enableUserProfile;
    const hasSpaces = widgetStatus.hasFetchedInitialSpaces && spacesListArray.length > 0;
    const emptyMessage = !hasSpaces && enableAddButton ? formatMessage(messages.createSpacePlus)
      : formatMessage(messages.createSpaceTeams);

    if (errors.get('hasError')) {
      widgetError = errors.get('errors').first();
      ({
        displayTitle,
        displaySubtitle,
        temporary
      } = widgetError);
    }

    if (isReady) {
      return (
        <div className={classNames('webex-recents-widget', 'md', styles.recentsWidget)}>
          {
            errors.get('hasError') &&
            <div className={classNames('webex-error-wrapper', styles.errorWrapper)}>
              <ErrorDisplay
                secondaryTitle={displaySubtitle}
                title={displayTitle}
                transparent={temporary}
              />
            </div>
          }
          {
            showHeader &&
            <RecentsHeader
              currentUserWithAvatar={currentUserWithAvatar}
              enableAddButton={enableAddButton}
              enableSpaceListFilter={enableSpaceListFilter}
              enableUserProfile={enableUserProfile}
              enableUserProfileMenu={enableUserProfileMenu}
              hideBottomBorder={widgetStatus.isScrolledToTop}
              onAddClick={this.handleAddClick}
              onFilterChange={this.handleSpaceFilterInput}
              onProfileClick={this.handleProfileClick}
              onSignOutClick={this.handleSignOutClick}
            />
          }
          {
            hasSpaces &&
            <div className={classNames('webex-spaces-list-wrapper', styles.spacesListWrapper)}>
              <SpacesList
                currentUser={currentUser}
                features={features}
                formatMessage={formatMessage}
                hasCalling
                isLoadingMore={isLoadingMore}
                onCallClick={this.handleSpaceCallClick}
                onClick={this.handleSpaceClick}
                onScroll={this.handleListScroll}
                spaces={spacesListArray}
                searchTerm={typeof keywordFilter === 'string' ? keywordFilter : ''}
              />
            </div>
          }
          {
            !hasSpaces &&
            <NoSpaces
              title={formatMessage(messages.noSpaces)}
              emptyMessage={emptyMessage}
            />
          }
        </div>
      );
    }
    if (errors.get('hasError')) {
      return (
        <div className={classNames('webex-recents-widget', 'md', styles.recentsWidget)}>
          <ErrorDisplay
            secondaryTitle={displaySubtitle}
            title={displayTitle}
            transparent={temporary}
          />
        </div>
      );
    }

    return (
      <div className={classNames('webex-recents-widget', 'md', styles.recentsWidget)}>
        <LoadingScreen />
      </div>
    );
  }
}


RecentsWidget.propTypes = {
  ...injectedPropTypes,
  ...ownPropTypes
};

RecentsWidget.defaultProps = {...defaultProps};

export default compose(
  connect(
    getRecentsWidgetProps,
    (dispatch) => bindActionCreators({
      fetchSpace,
      getFeature,
      removeSpace,
      updateSpaceRead,
      updateSpaceWithActivity,
      storeActivities,
      updateSpaceKeywordFilter,
      updateWidgetStatus
    }, dispatch)
  ),
  ...enhancers,
  mediaEnhancer
)(RecentsWidget);
