/* eslint no-underscore-dangle: 0  */

import React from 'react';
import {ToggleSwitch} from '@momentum-ui/react';
import * as AdaptiveCard from 'adaptivecards';
import {v4 as UUID} from 'uuid';
import {renderCardElement} from '@webex/react-component-utils';

const valueOn = 'true';
const valueOff = 'false';

/**
 * Replaces Toggle Input of adaptive Card with MD(Momentum Design) ToggleSwitch Component
 * @returns {HTMLElement}
 */
class MDToggleInput extends AdaptiveCard.ToggleInput {
  constructor(addChildNode) {
    super();
    this.addChildNode = addChildNode;
  }

  /**
   * returns the assigned value to internalRender() method
   * @param {boolean} newValue
   */
  get value() {
    return this._value ? valueOn : valueOff;
  }

  /**
   * assigns the value when data is sent in the JSON request
   * @param {string} newValue
   */
  set value(newValue) {
    this._value = !!newValue;
  }

  /**
   * renders momentum design `<ToggleSwitch />` Component
   * @returns {HTMLElement}
   */
  internalRender() {
    this._checkboxInputElement = document.createElement('div');
    this._value = this.defaultValue === valueOn;
    const jsx = (
      <ToggleSwitch
        label={this.title}
        checked={this._value}
        className="ac-input"
        onChange={(event) => {
          this.value = event.target.checked;
        }}
        htmlId={`__ac-${UUID()}`}
      />
    );

    renderCardElement(jsx, this._checkboxInputElement, this.addChildNode);

    return this._checkboxInputElement;
  }
}

export default MDToggleInput;
