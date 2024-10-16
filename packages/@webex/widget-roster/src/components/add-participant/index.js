import React from 'react';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import classNames from 'classnames';
import PeopleList from '@webex/react-component-people-list';

import {Button, Icon, Input, Spinner} from '@momentum-ui/react';

import styles from './styles.css';

const propTypes = {
  noResultsMessage: PropTypes.string.isRequired,
  onAddPerson: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchResults: PropTypes.shape({
    inProgress: PropTypes.bool,
    date: PropTypes.number,
    results: PropTypes.array
  }),
  searchTerm: PropTypes.string
};

const defaultProps = {
  searchResults: undefined,
  searchTerm: ''
};


function AddParticipant({
  noResultsMessage,
  onChange,
  onDismiss,
  onAddPerson,
  placeholder,
  searchResults,
  searchTerm
}) {
  const baseClassPrefix = 'webex-roster-add-participant';

  function handleChange(e) {
    onChange(e.target.value);
  }

  function handleClose() {
    onChange('');
    onDismiss();
  }

  function handleClick(person) {
    onAddPerson(person);
  }

  function handleInvite() {
    onAddPerson(searchTerm);
  }

  function handleKeyPressInvite(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      onAddPerson(searchTerm);
    }
  }

  let results;

  if (searchResults) {
    if (searchResults.inProgress) {
      results = (
        <div className={classNames(`${baseClassPrefix}-results-loading`, styles.resultsLoading)}>
          <Spinner />
        </div>
      );
    }
    else if (searchResults.results && searchResults.results.length) {
      results = (
        <div className={classNames(`${baseClassPrefix}-results`, styles.results, styles.fullHeight)}>
          <PeopleList
            items={[{people: searchResults.results}]}
            onItemClick={handleClick}
          />
        </div>
      );
    }
    else if (searchResults.results && searchResults.results.length === 0 && isEmail(searchTerm)) {
      results = (
        <div
          className={classNames(`${baseClassPrefix}-results-invite`, styles.resultsInvite)}
          onClick={handleInvite}
          onKeyPress={handleKeyPressInvite}
          role="button"
          tabIndex="0"
        >
          <div className={classNames(`${baseClassPrefix}-results-invite-icon`, styles.resultsInviteIcon)}><Icon name="icon-email-invite_24" /></div>
          <div>{`Invite ${searchTerm}`}</div>
        </div>
      );
    }
    else if (searchTerm) {
      results = (
        <div className={classNames(`${baseClassPrefix}-results-none`, styles.resultsNone)}>
          <div>{noResultsMessage}</div>
        </div>
      );
    }
  }

  return (
    <div className={classNames(`${baseClassPrefix}`, styles.addPartipicant)}>
      <div className={classNames(styles.searchBar)}>
        <div className={classNames(`${baseClassPrefix}-close-button-container`, styles.closeButton)}>
          <Button
            ariaLabel="Close Search"
            circle
            onClick={handleClose}
            size={28}
          >
            <Icon name="icon-arrow-left_12" />
          </Button>
        </div>
        <Input
          name="addParticipantSearchInput"
          htmlId="addParticipantSearchInput"
          onChange={handleChange}
          placeholder={placeholder}
          className={classNames(styles.searchInput, 'md-input--filled')}
          value={searchTerm}
        />
      </div>
      {results}
    </div>
  );
}

AddParticipant.propTypes = propTypes;
AddParticipant.defaultProps = defaultProps;

export default AddParticipant;