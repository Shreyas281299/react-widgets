/* eslint no-underscore-dangle: 0  */

import React from 'react';
import {Input} from '@momentum-ui/react';
import * as AdaptiveCard from 'adaptivecards';
import classnames from 'classnames';
import {renderCardElement} from '@webex/react-component-utils';

/**
 * Replaces Text Input of adaptive Card with MD(Momentum Design) Input Component
 * @returns {HTMLElement}
 */
class MDTextInput extends AdaptiveCard.TextInput {
  constructor(addChildNode) {
    super();
    this.addChildNode = addChildNode;
  }

  /**
   * returns the assigned value to internalRender() method
   * @returns {string}
   */
  get value() {
    return this._value;
  }

  /**
   * assigns the value when the data is sent in the JSON request
   * @param {string} newValue
   */
  set value(newValue) {
    this._value = newValue;
  }

  /**
   * renders momentum design `<Input />` Component
   * @returns {HTMLElement}
   */
  internalRender() {
    this.value = this.defaultValue || '';

    // Input style of Adaptive card supports Text, email, phone and url
    // Momentum Design only has text and email so rendering phone and url as text
    const inputStyles = {
      0: 'Text',
      1: 'Text',
      2: 'Text',
      3: 'Email'
    };

    this._inputElement = document.createElement('div');
    const jsx = (
      <Input
        label={this.title}
        value={this.value}
        maxLength={this.maxLength || null}
        placeholder={this.placeholder}
        type={inputStyles[this.style].toLowerCase()}
        multiline={!!this.isMultiline}
        className={classnames('ac-input', 'ac-textInput', {'ac-multiline': !!this.isMultiline})}
        onChange={(event) => {
          this.value = event.target.value;
        }}
        clear
      />
    );

    renderCardElement(jsx, this._inputElement, this.addChildNode);

    return this._inputElement;
  }
}

export default MDTextInput;