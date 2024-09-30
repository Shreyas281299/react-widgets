import {
  ListItemBase,
  ListNext,
  PopoverNext as Popover
} from '@momentum-ui/react-collaboration';
import { IWebexIntCallableEntity } from '@webex/component-adapter-interfaces/dist/esm/src';
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import useWebexClasses from '../hooks/useWebexClasses';
import './CallSelectPopover.scss';
import './SearchContactsList.styles.scss';

interface ICallSelectPopoverProps {
  callables: IWebexIntCallableEntity[];
  isVideo?: boolean;
  children: React.ReactElement;
  makeCall?: (address: string, isVideo?: boolean, label?: string) => void;
  label?: string;
  onHide?: () => void;
  buttonRef?: React.RefObject<HTMLButtonElement>; // Add buttonRef property
}

export interface ICallSelectPopoverHandle {
  hidePopover: () => void;
}

/**
 *
 * @param {ICallSelectPopoverProps} props
 * @param props.callables all callable addresses
 * @param props.isVideo whether a call initialized from this popover will be a audio or video call
 * @param props.children button that controls showing the popover
 */
export const CallSelectPopover = forwardRef<
  ICallSelectPopoverHandle,
  ICallSelectPopoverProps
>(({ callables, isVideo, children, makeCall, label, onHide, buttonRef }, ref) => {
  const [cssClasses, sc] = useWebexClasses('call-select-popover');
  const [instance, setInstance] = useState<any>();
  const channelLabel = 'channel';
  const searchPadLabel = 'searchpad';
  const channelMembersSearch = 'Search channel members';
  useImperativeHandle(ref, () => ({
    hidePopover() {
      instance?.hide();
    },
  }));
  
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        console.log('Escape key pressed')
        instance?.hide();
      }
    };

    const buttonElement = buttonRef?.current;
    buttonElement?.addEventListener('keydown', handleKeyPress);

    return () => {
      buttonElement?.removeEventListener('keydown', handleKeyPress);
    };
  }, [instance]); 

  useEffect(() => {
    const handleListItemKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation(); // Stop event propagation
        instance?.hide();
      }
    };

    const observer = new MutationObserver(() => {
      const listItems = document.querySelectorAll('.md-modal-container-wrapper .md-list-item-base-wrapper');
      listItems.forEach(item => {
        item.addEventListener('keydown', handleListItemKeyPress as EventListener);
      });
    });

    if (instance) {
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer.disconnect();
    };
  }, [instance, buttonRef]);

  const handleHide = () => {
    if (onHide) {
      onHide();
    }
  };

  if (callables.length === 1) {
    return React.cloneElement(children, {
      onPress: () => makeCall && makeCall(callables[0].address, isVideo, label == channelMembersSearch ? channelLabel : searchPadLabel),
    });
  }

  return (
    <Popover
      color="primary"
      delay={[0, 0]}
      placement="bottom"
      showArrow
      trigger="click"
      interactive
      triggerComponent={React.cloneElement(children, { ref: buttonRef })} 
      variant="small"
      setInstance={setInstance}
      hideOnEsc
      strategy="fixed"
      data-testid={`webex-call-select-popover--${isVideo ? 'video' : 'audio'}`}
      className={cssClasses}
      onHide={handleHide}
    >
      <ListNext listSize={callables.length}>
        {callables.map((item, callableIndex) => (
          <ListItemBase
            key={item.address}
            itemIndex={callableIndex}
            isPadded
            onPress={() => makeCall && makeCall(item.address, isVideo, label == channelMembersSearch ? channelLabel : searchPadLabel)}
          >
            <div className={sc('item')}>
              <span className={sc('item-type')}>{item.type}:</span>
              <span>{item.address}</span>
            </div>
          </ListItemBase>
        ))}
      </ListNext>
    </Popover>
  );
});

CallSelectPopover.defaultProps = {
  isVideo: false,
};
