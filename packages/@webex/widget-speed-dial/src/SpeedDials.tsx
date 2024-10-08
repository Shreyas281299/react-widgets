import { ISpeedDialRecord } from '@webex/component-adapter-interfaces/dist/cjs/src';
import { arrayMoveMutable } from 'array-move';
import React, { useEffect, useRef, useState } from 'react';

import {
  SortEnd,
  SortEvent,
  SortEventWithTag,
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';

import {
  Flex, Text
} from '@momentum-ui/react-collaboration';
import { useTranslation } from 'react-i18next';
import { SpeedDialAddBanner } from './SpeedDialAddBanner';
import { ISpeedDialProps, SpeedDialItem } from './SpeedDialItem';
import { ISpeedDialsListProps, ISpeedDialsProps } from './SpeedDials.types';
import useWebexClasses from './hooks/useWebexClasses';

import './SpeedDials.styles.scss';

interface ChildHandles {
  handleContextMenuTrigger: (e: KeyboardEvent) => void;
  handleContextMenuClose: (e: KeyboardEvent) => void;
  setSubMenuVisible: (visible: boolean) => void; // Add this line
  handleEnterKey:(e:KeyboardEvent) => void;
  setIsContextMenuVisible: (visible: boolean) => void;
  triggerHoverEffect: () => void;
  removeHoverEffect: () => void;
}


const DraggableIcon = () => (
  <div className="wxc-speed-dial-item__draggable" style={{ pointerEvents: 'none' }}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M8.5 17c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7-10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-7 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm7 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-7-14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  </div>
);

const DragHandle = SortableHandle(() => <DraggableIcon />);

const SortableItem = SortableElement<ISpeedDialProps>(
  ({
    item,
    isAudio,
    onPress,
    onAudioCallPress,
    onVideoCallPress,
    onRemovePress,
    onEditPress,
    selectedNodeForRearange
  }: ISpeedDialProps) => { 
    const [isContactFocused, setIsContactFocused] = useState(false);
    const childRef = useRef<ChildHandles | null>(null);

    useEffect(() => {
      const handleShiftF10Press = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && isContactFocused) {
          childRef.current?.handleEnterKey(e);
        } else if (e.shiftKey && e.key === 'F10' && isContactFocused) {
          childRef.current?.setIsContextMenuVisible(true);
          childRef.current?.handleContextMenuTrigger(e);
        } else if (e.key === 'Escape') {
          childRef.current?.handleContextMenuClose(e);
          childRef.current?.setIsContextMenuVisible(false);
        }
        else if ((e.shiftKey && e.key === 'Tab') || e.key === 'Tab'){
          childRef.current?.setIsContextMenuVisible(false);
        }
      };
      window.addEventListener('keydown', handleShiftF10Press);
  
      return () => {
        window.removeEventListener('keydown', handleShiftF10Press);
      };
    }, [isContactFocused]);

    const handleContextMenuTriggerFocus = () => {  
      setIsContactFocused(true);
      childRef.current?.setSubMenuVisible(false); 
      childRef.current?.triggerHoverEffect();
    };
    
    const handleContextMenuTriggerBlur = () => {
      setIsContactFocused(false); 
      // To handle reinitialization of aria label content after item has been rearranged
      selectedNodeForRearange && selectedNodeForRearange.removeAttribute('aria-label');
      childRef.current?.removeHoverEffect();
    };

       
    return ( 
    <li tabIndex={0}
    onFocus={handleContextMenuTriggerFocus}
    onBlur={handleContextMenuTriggerBlur}
    >
      <SpeedDialItem
        id={item?.id}
        key={item?.id}
        item={item}
        isAudio={isAudio}
        onPress={onPress}
        onAudioCallPress={onAudioCallPress}
        onVideoCallPress={onVideoCallPress}
        onEditPress={onEditPress}
        onRemovePress={onRemovePress}
        ref={childRef}
        selectedNodeForRearange={selectedNodeForRearange}
      >
        <DragHandle  />
      </SpeedDialItem>
    </li>
   
  )
  }
);

const SortableList = SortableContainer<ISpeedDialsListProps>(
  ({
    items = [],
    onPress,
    onVideoCallPress,
    onAudioCallPress,
    onEditPress,
    onRemovePress,
    className,
    selectedNodeForRearange
  }: {
    items: ISpeedDialRecord[];
    onPress?: (item: ISpeedDialRecord) => void;
    onVideoCallPress?: (item: ISpeedDialRecord) => void;
    onAudioCallPress?: (item: ISpeedDialRecord) => void;
    onEditPress?: (item: ISpeedDialRecord) => void;
    onRemovePress?: (id: string) => void;
    className: string;
    selectedNodeForRearange: Element;
  }) => (
    <ul className={className}>
      {items &&
        items.map((item, index) => (
          <SortableItem
            id={item.id}
            key={`speed-dial-${item.id}`}
            index={index}
            item={item}
            isAudio={item?.callType !== 'video'}
            onPress={onPress}
            onAudioCallPress={onAudioCallPress}
            onVideoCallPress={onVideoCallPress}
            onEditPress={onEditPress}
            onRemovePress={onRemovePress}
            selectedNodeForRearange={selectedNodeForRearange}
          />
        ))}
    </ul>
  )
);

/**
 * @description This is the Speed Dials component
 * @param {ISpeedDialsProps} obj - An object of props.
 * @param {Array} obj.items An array of speed dial items
 * @param {Function} obj.onSortEnd Function to call when sorting ends.
 * @param {Function} obj.onEditPress Function to call when edit action is pressed.
 * @param {Function} obj.onRemovePress Function to call when remove action is pressed.
 * @param {Function} obj.onVideoCallPress Function to call when video call button pressed.
 * @param {Function} obj.onAudioCallPress Function to call when audio call button pressed.
 * @returns {React.Component} SpeedDials component
 */
export const SpeedDials = ({
  items = [],
  onPress = undefined,
  onAudioCallPress = undefined,
  onVideoCallPress = undefined,
  onEditPress = undefined,
  onRemovePress = undefined,
  onSortEnd: onSortEndCb = undefined,
  onAddPress = undefined,
  listError,
}: ISpeedDialsProps) => {
  const [grabbing, setGrabbing] = useState<boolean>(false);
  const [classes, sc] = useWebexClasses('speed-dial', undefined, {
    grabbing,
  });
  const speedDialsRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('WebexSpeedDials');
  const [selectedNode, setSelectedNode] = useState<Element>();

  const handleSortEnd = ({oldIndex, newIndex, nodes}: SortEnd) => {
    setGrabbing(false);
    // Move the item only if the position changed
    if(oldIndex !== newIndex) {
       arrayMoveMutable(items, oldIndex, newIndex);
       if (onSortEndCb) {
           onSortEndCb(items);
         }
      }
      selectedNode && (selectedNode.ariaLabel = `${t('voiceover.contactNewPosition', { contactName: items[newIndex].displayName, newIndex: newIndex + 1, totalIndex: nodes.length })}`)
  };

  const handleShouldCancelStart = (event: SortEvent | SortEventWithTag): boolean => {
    // This should be the class name you use for your sortable items
    const sortableItemClassName = 'wxc-speed-dial-item__drag-handle';  

     // If the event is triggered by keyboard (e.g., spacebar), allow sorting to start
     if (event.type === 'keydown') {
      // Check if the correct key was pressed (e.g., spacebar)
      if ((event as unknown as KeyboardEvent).key === ' ') {
        return false;
      }
    }

    let target: HTMLElement | null = event.target as HTMLElement;
  
    while (target && target !== document.documentElement) {
      if (target.classList.contains(sortableItemClassName)) {
        return false; // Allow sorting to start because the target is a sortable item
      }
      target = target.parentElement;
    }
  
    return true; // Cancel sorting by default if none of the conditions above are met
  };

  if (items.length > 0 && !listError) {
    return (
      <div className={classes} ref={speedDialsRef}>
        <SortableList
          helperClass="wxc-sortable-item"
          helperContainer={speedDialsRef.current as HTMLElement}
          onSortEnd={handleSortEnd}
          onSortStart={() => setGrabbing(true)}
          shouldCancelStart={handleShouldCancelStart}
          onPress={onPress}
          onVideoCallPress={onVideoCallPress}
          onAudioCallPress={onAudioCallPress}
          onEditPress={onEditPress}
          onRemovePress={onRemovePress}
          useDragHandle={grabbing}
          items={items}
          axis="xy"
          className={sc('list')}
          updateBeforeSortStart={({node, index}, event) => {
            node.ariaLabel = `${t('voiceover.startRearranging', { contactName: items[index].displayName, numberType: items[index].phoneType })}, ${t('voiceover.adjustPosition')}, ${t('voiceover.stopRearranging')}, ${t('voiceover.currentPosition', { currentIndex: index+1, totalIndex: items.length })}`;
            setSelectedNode(node);
          }}
          selectedNodeForRearange={selectedNode}
        />
      </div>
    );
  }
  else if(listError) {
    return (
      <div className={sc('listError')}>
        <div className={sc('listImage')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="164" height="144" viewBox="0 0 164 144" fill="none">
          <path d="M78.166 98.2L64.266 119.1C63.366 120.4 64.366 122.2 65.966 122.2H77.666C78.366 122.2 78.866 123 78.566 123.6L70.566 141.1C70.066 142.1 71.366 143 72.166 142.2L96.866 117.5C98.166 116.2 97.266 114.1 95.466 114.1H88.166C87.366 114.1 86.866 113.2 87.366 112.5L94.866 101.5C96.366 99.3 98.866 98 101.466 98H135.466C149.666 98 161.566 86.9 161.966 72.7C162.366 58 150.566 46 135.966 46C133.866 46 131.766 46.3 129.866 46.7C128.166 21.7 107.366 2 81.966 2C59.466 2.2 40.666 17.6 35.366 38.5C34.266 38.4 33.066 38.3 31.866 38.3C15.066 38.3 1.36602 52.2 1.86602 69.1C2.26602 85.4 16.166 98.3 32.466 98.3H41.866M129.766 47C116.866 51.3 109.866 62.3 114.866 67.3C118.866 71.2 129.866 64.2 129.766 47Z" stroke="url(#paint0_linear_1062_1489)" stroke-width="2.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
          <defs>
          <linearGradient id="paint0_linear_1062_1489" x1="81.9143" y1="2" x2="81.9143" y2="142.508" gradientUnits="userSpaceOnUse">
          <stop stop-color="#F0677E"/>
          <stop offset="1" stop-color="#DB1F2E"/>
          </linearGradient>
          </defs>
        </svg>
        </div>
        <Flex className={sc('subheader-text')}>
            <Text className='subheader-text' type="header-primary">{t('errorNotification.error')}</Text>
          </Flex>
          <Text className='subheader-text-second' type="body-secondary">{t('errorNotification.listError')}</Text>
      </div>
    )
  }
  else {
    return (
      <div className={classes} ref={speedDialsRef}>
        <SpeedDialAddBanner addSpeedDial={onAddPress} />
      </div>

    )
  }
};
