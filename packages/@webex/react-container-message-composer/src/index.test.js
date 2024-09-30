import React from 'react';
import renderer from 'react-test-renderer';
import {Map} from 'immutable';
import uuid from 'uuid';

import {reducers} from '@webex/widget-space';
import {withInitialState} from '@webex/webex-widget-base';
import {initialState as activityInitialState} from '@webex/redux-module-activity';

import ConnectedMessageComposer, {MessageComposer} from '.';

let component, spark, MessageComposerComponent;

describe('MessageComposer component', () => {
  beforeEach(() => {
    spark = {
      internal: {
        conversation: {
          updateTypingStatus: jest.fn(() => Promise.resolve())
        }
      }
    };
    MessageComposerComponent = withInitialState({reducers})(ConnectedMessageComposer);
  });

  describe('snapshot tests', () => {
    it('renders properly', () => {
      const uuidSpy = jest.spyOn(uuid, 'v4').mockReturnValue('FAKE_INPUT_ID');

      component = renderer.create(
        <MessageComposerComponent
          composerActions={{attachFiles: true}}
          onSubmit={jest.fn()}
          placeholder="Message Placeholder"
          sparkInstance={spark}
          value="This is a message"
        />
      );
      expect(component).toMatchSnapshot();

      uuidSpy.mockRestore();
    });

    it('renders submit button', () => {
      const uuidSpy = jest.spyOn(uuid, 'v4').mockReturnValue('FAKE_INPUT_ID');

      component = renderer.create(
        <MessageComposerComponent
          composerActions={{attachFiles: true}}
          onSubmit={jest.fn()}
          placeholder="Message Placeholder"
          sparkInstance={spark}
          value="This is a message"
          showSubmitButton
        />
      );
      expect(component).toMatchSnapshot();

      uuidSpy.mockRestore();
    });
  });

  describe('class method tests', () => {
    it('does not send empty message', () => {
      const props = {
        activity: activityInitialState,
        conversation: new Map(),
        setUserTyping: jest.fn(),
        submitActivity: jest.fn(),
        user: new Map({
          currentUser: new Map()
        })
      };
      const messageComposer = new MessageComposer(props);

      messageComposer.handleSubmit();
      expect(messageComposer.props.setUserTyping).not.toHaveBeenCalled();
      expect(messageComposer.props.submitActivity).not.toHaveBeenCalled();
    });

    it('sends message properly', () => {
      const props = {
        activity: activityInitialState.set('text', 'testing'),
        conversation: new Map(),
        setUserTyping: jest.fn(),
        submitActivity: jest.fn(),
        user: new Map({
          currentUser: new Map()
        })
      };
      const messageComposer = new MessageComposer(props);

      messageComposer.handleSubmit();
      expect(messageComposer.props.setUserTyping).toHaveBeenCalled();
      expect(messageComposer.props.submitActivity).toHaveBeenCalled();
    });

    describe('sending typing indicators', () => {
      let event, messageComposer, setUserTyping;
      const conversation = new Map();
      const sparkInstance = {};

      beforeEach(() => {
        setUserTyping = jest.fn();
        const props = {
          activity: activityInitialState,
          blurTextArea: jest.fn(),
          conversation,
          setUserTyping,
          sparkInstance,
          storeActivityText: jest.fn()
        };

        messageComposer = new MessageComposer(props);
      });

      it('sets user typing on text in field', () => {
        event = {target: {value: 'd'}};
        messageComposer.handleTextChange(event);
        expect(setUserTyping).toHaveBeenCalledWith(true, conversation, sparkInstance);
      });

      it('clears typing on blur', () => {
        messageComposer.handleTextAreaBlur();
        expect(setUserTyping).toHaveBeenCalledWith(false, conversation, sparkInstance);
      });

      it('clears typing when field is changed to empty', () => {
        messageComposer.handleTextChange({target: {value: ''}});
        expect(setUserTyping).toHaveBeenCalledWith(false, conversation, sparkInstance);
      });
    });

    describe('enter key processing', () => {
      let event;
      const props = {
        activity: activityInitialState,
        conversation: new Map(),
        setUserTyping: jest.fn()
      };
      const messageComposer = new MessageComposer(props);

      beforeEach(() => {
        messageComposer.handleSubmit = jest.fn();
        event = {
          keyCode: 13,
          shiftKey: false,
          altKey: false,
          ctrlKey: false,
          metaKey: false,
          preventDefault: jest.fn()
        };
      });

      it('doesn\'t submit upon enter key when sendMessageOnReturnKey is false', () => {
        const messageComposerDisabled = new MessageComposer({
          ...props,
          sendMessageOnReturnKey: false
        });

        messageComposerDisabled.handleSubmit = jest.fn();

        messageComposerDisabled.handleKeyDown(event);
        expect(messageComposerDisabled.handleSubmit).not.toHaveBeenCalled();
      });

      it('doesn\'t submit upon enter key with shift modifiers', () => {
        event.shiftKey = true;
        messageComposer.handleKeyDown(event);
        expect(messageComposer.handleSubmit).not.toHaveBeenCalled();
      });

      it('doesn\'t submit upon enter key with alt modifiers', () => {
        event.altKey = true;
        messageComposer.handleKeyDown(event);
        expect(messageComposer.handleSubmit).not.toHaveBeenCalled();
      });

      it('doesn\'t submit upon enter key with ctrl modifiers', () => {
        event.ctrlKey = true;
        messageComposer.handleKeyDown(event);
        expect(messageComposer.handleSubmit).not.toHaveBeenCalled();
      });

      it('doesn\'t submit upon enter key with meta modifiers', () => {
        event.metaKey = true;
        messageComposer.handleKeyDown(event);
        expect(messageComposer.handleSubmit).not.toHaveBeenCalled();
      });
    });
  });
});
