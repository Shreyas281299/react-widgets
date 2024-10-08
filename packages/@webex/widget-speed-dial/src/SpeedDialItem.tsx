// @ts-nocheck
import {
  AvatarNext as Avatar,
  Flex,
  ListHeader,
  MenuNext as Menu,
  PopoverNext as Popover,
  Text
} from '@momentum-ui/react-collaboration';
import { Item, Section } from '@react-stately/collections';
import { ISpeedDialRecord } from '@webex/component-adapter-interfaces/dist/cjs';
import React, { useCallback, useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { ContextMenu, ContextMenuTrigger } from 'react-contextmenu';
import { useTranslation } from 'react-i18next';

import useWebexClasses from './hooks/useWebexClasses';

import { abbrDisplayName, removeCommaIfNeeded } from './SpeedDial.utils';
import './SpeedDialItem.styles.scss';
import { ISpeedDialItem } from './SpeedDials.types';
import { removeBracketsAndContent } from './utils/avatarInitials';

export interface ISpeedDialProps {
  id: string;
  /** The audio call for speed dial for the item */
  isAudio?: boolean;
  /** The avatar image for the item */
  item: ISpeedDialItem;
  /** The index for reference */
  itemIndex?: number;
  /** Triggered when speed dial item is pressed */
  onPress?: (item: ISpeedDialRecord) => void;
  /** Triggered when audio call action is pressed */
  onAudioCallPress?: (item: ISpeedDialRecord) => void;
  /** Triggered when video call action is pressed */
  onVideoCallPress?: (item: ISpeedDialRecord) => void;
  /** Triggered when remove action is pressed */
  onRemovePress?: (id: string) => void;
  /** Triggered when edit action is pressed */
  onEditPress?: (item: ISpeedDialRecord) => void;

  children?: React.ReactNode;
  /** To handle reinitialization of aria label content after item has been rearranged  */
  selectedNodeForRearange: Element | undefined;
}

/**
 * Speed Dial Item component renders individual entries.
 *
 * @param {ISpeedDialProps} obj The props for the component
 * @param {number} obj.itemIndex The index of the speed dial
 * @param {Function} obj.onVideoCallPress Handle when item video call button is pressed
 * @param {Function} obj.onAudioCallPress Handle when item audio call button is pressed
 * @param {Function} obj.onRemovePress Triggered when remove action is pressed
 * @param {Function} obj.onEditPress Triggered when edit action is pressed
 * @param {React.ReactNode} obj.children Drag handle component
 * @returns {React.Component} A CallHistoryItem for rendering
 */
export const SpeedDialItem = forwardRef(({
  id,
  item,
  isAudio = false,
  itemIndex = undefined,
  onPress = undefined,
  onAudioCallPress = undefined,
  onVideoCallPress = undefined,
  onEditPress = undefined,
  onRemovePress = undefined,
  children = undefined,
}: ISpeedDialProps, ref) => {
  const [classes, sc] = useWebexClasses('speed-dial-item', undefined, {});
  const { t } = useTranslation('WebexSpeedDials');
  const actionBtnRef = useRef<HTMLButtonElement>();
  const contextMenuId = `${id}-context-menu`;
  const removeLabel = t('item.remove.label');
  const editLabel = t('item.edit.label');
  const audioCallLabel = t('item.audioCall.label');
  const videoCallLabel = t('item.videoCall.label');
  const outlookRemoveLabel = t('item.removeOutLook.label');
  const deleteOutlookUserLabel = t('item.deleteOutlookUser.label');
  const originalContactDeletedLabel = t('item.originalContactDeleted.label');
  const contextTriggerRef = useRef<ContextMenu>(null);
  const submenuItemRef = useRef(null);
  const contactRef = useRef(null);
  const [isSubMenuVisible, setSubMenuVisible] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const dragandDropActionRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    handleEnterKey: (e) => {
      if(item?.isOutlookDeleted) {
        if (onRemovePress) {
          onRemovePress(item.id);
        }

      } else {
      if (onPress) {
        onPress(item)
      }
    }
    },
    handleContextMenuTrigger: (e) => {
    if (contactRef.current) {
      const position = {
        isVisible: true,
        x: contactRef.current.offsetLeft + 92,
        y: item?.isOutlookDeleted ? contactRef.current.offsetTop + 91 : contactRef.current.offsetTop - 30,
      };
      contextTriggerRef.current?.setState(position);

      // Prevent the default browser context menu
      e.preventDefault();

      if (submenuItemRef.current) {
        setTimeout(() => {
        submenuItemRef.current.focus();
        }, 20); //  20ms delay
      }
    }
    },
    handleContextMenuClose: (e) => {
      if (contactRef.current) {
        contextTriggerRef.current?.setState({
          isVisible: false,
          selectedItem: null,
          forceSubMenuOpen: false,
        });
  
        // Prevent the default browser context menu
        e.preventDefault();
      }
    },
    setSubMenuVisible,
    setIsContextMenuVisible,
    triggerHoverEffect: () => {
      let avatar: HTMLDivElement = actionsRef.current?.childNodes[0];
      let svg: HTMLDivElement = actionsRef.current?.childNodes[1];
      avatar.style.opacity = 0.1;
      svg.style.display = "block";
      svg.style.position = "absolute";
      svg.style.top = "50%";
      svg.style.left = "50%";
      svg.style.transform = "translateX(-50%) translateY(-50%)";
      if(contactRef){
        contactRef.current.style.background = "var(--theme-button-inverted-hover)";
      }
      if (item?.isOutlookDeleted) {
        let p: HTMLParagraphElement = svg?.childNodes[0];
        p.style.marginTop = "1.875rem";
        p.style.color = "var(--mds-color-theme-text-accent-normal)";
      }
      if (dragandDropActionRef.current) {
        const svgElement: HTMLDivElement = dragandDropActionRef.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.visibility = 'visible';
        }
      }
    },
    removeHoverEffect: () => {
      let avatar: HTMLDivElement = actionsRef.current?.childNodes[0];
      let svg: HTMLDivElement = actionsRef.current?.childNodes[1];
      avatar.style.opacity = '';
      svg.style.display = '';
      svg.style.position = '';
      svg.style.top = "";
      svg.style.left = "";
      svg.style.transform = "";
      if(contactRef){
        contactRef.current.style.background = "";
      }
      if (item?.isOutlookDeleted) {
        let p: HTMLParagraphElement = svg?.childNodes[0];
        p.style.marginTop = "";
        p.style.color = "";
      }
      if (dragandDropActionRef.current) {
        const svgElement: HTMLDivElement = dragandDropActionRef.current.querySelector('svg');
        if (svgElement) {
          svgElement.style.visibility = '';
          svgElement.style.color = ""
        }
      }
    }
  }));

  const handleClick = useCallback(() => {
    if (onPress) {
      onPress(item);
    }
  }, [item, onPress]);

  const handleRemoveOutlookContactOnClick = useCallback(() => {
    if (onRemovePress) {
      onRemovePress(item.id);
    }
  }, [item, onRemovePress]); 

  const handleAction = useCallback((key: React.Key) => {
    // close the menu when an action is pressed
    contextTriggerRef.current?.hideMenu({ keyCode: 27 });
    switch (key) {
      case '.$remove':
        if (onRemovePress) {
          onRemovePress(item.id);
        }
        break;
      case '.$edit':
        if (onEditPress) {
          onEditPress(item);
        }
        break;
      case '.$audioCall':
        if (onAudioCallPress) {
          onAudioCallPress(item);
        }
        break;
      case '.$videoCall':
        if (onVideoCallPress) {
          onVideoCallPress(item);
        }
        break;
      default:
        throw new Error('Cannot find action');
    }
  }, []);

  useEffect(() => {
    if (submenuItemRef.current) {
      submenuItemRef.current.removeAttribute('aria-labelledby');
      const items = submenuItemRef.current.querySelectorAll('[aria-labelledby]');
      items.forEach(item => {
        item.removeAttribute('aria-labelledby');
      });
    }
  }, []);  
  
  useEffect(() => {
    const handleFocusOut = (event: FocusEvent) => {
      if (isSubMenuVisible) {
        contextTriggerRef.current?.setState({
          isVisible: false,
          selectedItem: null,
          forceSubMenuOpen: false
        });
      };
    };
  
    if (isSubMenuVisible) {
      document.addEventListener('focusout', handleFocusOut);
      contextTriggerRef.current?.setState({
        isVisible: false,
        selectedItem: null,
        forceSubMenuOpen: false
      });
    } else {
      document.removeEventListener('focusout', handleFocusOut);
      contextTriggerRef.current?.setState({
        isVisible: false,
        selectedItem: null,
        forceSubMenuOpen: false
      });
    }
  
    // Ensure that the event listener is removed when the component unmounts
    return () => {
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, [isSubMenuVisible]);
  
  return (
    <>
      {!item?.isOutlookDeleted &&
        <>
          <ContextMenuTrigger id={contextMenuId} holdToDisplay={-1}>
            <div
              className={classes}
              title={removeCommaIfNeeded(item?.displayName)}
              key={itemIndex}
              onContextMenu={(e) => {
                e.preventDefault();
                setIsContextMenuVisible(true);
                actionBtnRef.current?.click();
              }}
              ref={contactRef}
              onClick={handleClick}
              aria-label={`${abbrDisplayName(item?.displayName)}, ${t('form.phoneTypes.'+ item?.phoneType)}, ${t('addSpeedBanner.dial.header')}, ${t('voiceover.enterCall', {callType: isAudio ? t('item.audioCall.label') : t('item.videoCall.label')})}, ${t('voiceover.openContextMenu')}, ${t('voiceover.rearrangeItem')}`}
            >
              <Flex
                alignItems="center"
                className={sc('content')}
                direction="column"
                role="button"
              >
                {children && (
                  <div className={sc('drag-handle')} ref={dragandDropActionRef}>
                    <span className={sc('drag-icon')}>{children}</span>
                  </div>
                )}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                <div className={sc('actions')} ref={actionsRef}>
                  <Flex className={sc('avatar')}>
                    <Avatar initials={removeBracketsAndContent(removeCommaIfNeeded(item?.displayName))} size={48} src={item?.photo} />
                  </Flex>
                  <Flex className={sc('action')}>
                    {isAudio &&
                      // <Icon scale={32} name="handset" weight="filled" />
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <path d="M30.1165 22.8688L26.7615 19.5136C26.0809 18.8355 25.159 18.455 24.1982 18.4556C23.2374 18.4563 22.3161 18.8379 21.6363 19.5169C21.6363 19.5169 19.8412 21.3429 19.4743 21.7296C18.2566 21.7498 17.0473 21.5239 15.919 21.0656C14.7906 20.6072 13.7664 19.9258 12.9078 19.0621C11.1941 17.3325 10.2185 15.0054 10.1864 12.5708C10.6292 12.127 12.453 10.334 12.4562 10.3307C12.7927 9.9945 13.0596 9.59529 13.2417 9.15587C13.4238 8.71646 13.5176 8.24547 13.5176 7.76982C13.5176 7.29416 13.4238 6.82317 13.2417 6.38376C13.0596 5.94435 12.7927 5.54513 12.4562 5.20892L9.1008 1.85417C8.40795 1.19307 7.48709 0.824219 6.52944 0.824219C5.57179 0.824219 4.65093 1.19307 3.95809 1.85417L2.16405 3.6472C0.831374 4.97987 0.445724 7.87585 1.17967 11.0253C1.83555 13.841 3.67245 18.2509 8.69535 23.275C13.7182 28.299 18.1294 30.1352 20.944 30.7915C21.9408 31.0291 22.9614 31.1522 23.9861 31.1585C25.5509 31.2752 27.1014 30.7916 28.3224 29.806L30.1165 28.0128C30.4543 27.6751 30.7223 27.2742 30.9052 26.8329C31.0881 26.3916 31.1822 25.9186 31.1822 25.4409C31.1822 24.9632 31.0881 24.4902 30.9052 24.0489C30.7223 23.6076 30.4543 23.2066 30.1165 22.869V22.8688Z" fill="var(--mds-color-theme-text-primary-normal)" fillOpacity="0.95" />
                      </svg>
                    }
                    {!isAudio &&
                      // <Icon scale={32} name="video" />
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="24" viewBox="0 0 32 24" fill="none">
                        <path d="M30.3863 4.93905C30.1333 4.78333 29.8437 4.69717 29.5467 4.68927C29.2497 4.68137 28.9559 4.75201 28.695 4.89405L24.4395 7.59968V5.25C24.438 3.9078 23.9041 2.621 22.955 1.67192C22.006 0.722836 20.7192 0.188989 19.377 0.1875H5.87695C4.53474 0.188959 3.24792 0.722796 2.29884 1.67188C1.34975 2.62097 0.815912 3.90779 0.814453 5.25V18.75C0.815912 20.0922 1.34975 21.379 2.29884 22.3281C3.24792 23.2772 4.53474 23.811 5.87695 23.8125H19.377C20.7192 23.811 22.006 23.2772 22.955 22.3281C23.9041 21.379 24.438 20.0922 24.4395 18.75V16.3998L28.7455 19.1345C29.0028 19.2631 29.2886 19.3237 29.5759 19.3107C29.8632 19.2977 30.1425 19.2115 30.3871 19.0603C30.6317 18.9091 30.8336 18.6978 30.9736 18.4466C31.1137 18.1954 31.1872 17.9126 31.1872 17.625V6.375C31.1884 6.08699 31.1154 5.80353 30.9751 5.552C30.8348 5.30046 30.632 5.08935 30.3863 4.93905Z" fill="var(--mds-color-theme-text-primary-normal)" fillOpacity="0.95" />
                      </svg>
                    }
                  </Flex>
                </div>
                <Flex direction="column" className={sc('meta')} alignItems="center">
                  <Text type="body-primary" className={sc('name')}>
                    {abbrDisplayName(item?.displayName)}
                  </Text>
                  <Text type="body-secondary" className={sc('status')}>
                    {/* {item?.phoneType} */}
                    {t('form.phoneTypes.'+ item?.phoneType)}
                  </Text>
                </Flex>
              </Flex>
            </div>
          </ContextMenuTrigger>
          {/* Context Menu Actions */}
          <ContextMenu
            className={sc('context-menu')}
            id={contextMenuId}
            preventHideOnResize
            preventHideOnContextMenu
            ref={contextTriggerRef}
            style={{visibility: Boolean(isContextMenuVisible) ? 'visible' : 'hidden'}}
          >
            <div
            className='TestingMenu'  
             onFocus={() => {
              setSubMenuVisible(false);
            }}
            onBlur={() => {
              setSubMenuVisible(true);
            }}
            >
            <Menu
              key={`${item?.id}-menu`}
              aria-label="Speed Dial Item Menu"
              disabledKeys={[item?.callType as React.Key]}
              defaultSelectedKeys={item?.callType}
              onAction={handleAction}
              className={sc('menu')}
              ref={submenuItemRef}
            >
              <Section key={0}>
                <Item key="audioCall" aria-label={t('voiceover.btnAudioCall')} >{audioCallLabel}</Item>
                <Item key="videoCall"  aria-label={t('voiceover.btnVideoCall')} >{videoCallLabel}</Item>
              </Section>
              <Section
                key={1}
                title={<ListHeader outline outlineColor="secondary" />}
              >
                {(!item || (item.id && item.id.startsWith('l_'))) && (
                  <Item key="edit" aria-label={t('voiceover.btnEdit')} >{editLabel}</Item>
                )}
                <Item key="remove" aria-label={t('voiceover.btnRemove')} >{removeLabel}</Item>
              </Section>
            </Menu>
            </div>
          </ContextMenu>
        </>
      }
      {item?.isOutlookDeleted &&
        <Popover
          color="primary"
          delay={[0, 0]}
          placement="top"
          showArrow
          trigger="mouseenter"
          className="tooltip_outlook"
          triggerComponent={
            <div onClick={handleRemoveOutlookContactOnClick}>
              <ContextMenuTrigger id={contextMenuId} holdToDisplay={-1}>
                <div
                  className={classes}
                  key={itemIndex}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setIsContextMenuVisible(true);
                    actionBtnRef.current?.click();
                  }}
                  ref={contactRef}          
                  aria-label={`${deleteOutlookUserLabel} ${t('voiceover.removeDeletedContact')} ${t('voiceover.openContextMenu')}`}
                >
                  <Flex
                    alignItems="center"
                    className={sc('content')}
                    direction="column"
                    role="button"
                  >
                    {children && (
                      <div className={sc('drag-handle')}>
                        {/* <span className={sc('drag-icon')}>{children}</span> */}
                        <div className='warningIcon'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="17" viewBox="0 0 18 17" fill="none">
                            <path d="M17.4967 13.6869L10.6241 1.81255C10.4595 1.52751 10.2227 1.29082 9.93762 1.12626C9.65252 0.9617 9.32914 0.875069 8.99997 0.875069C8.67079 0.875069 8.34741 0.9617 8.06232 1.12626C7.77723 1.29082 7.54047 1.52751 7.37582 1.81255L7.37645 1.81192L0.501447 13.6875C0.336892 13.9726 0.250256 14.2959 0.250244 14.625C0.250233 14.9541 0.336847 15.2774 0.501381 15.5624C0.665916 15.8475 0.902575 16.0842 1.18758 16.2487C1.47257 16.4133 1.79587 16.5 2.12498 16.5H15.8732C16.2024 16.5001 16.5258 16.4135 16.811 16.2489C17.0961 16.0843 17.3328 15.8475 17.4974 15.5624C17.662 15.2772 17.7485 14.9538 17.7484 14.6246C17.7483 14.2953 17.6615 13.972 17.4967 13.6869ZM16.4145 14.9376C16.3605 15.0334 16.2818 15.1129 16.1866 15.1679C16.0913 15.2228 15.9831 15.2512 15.8731 15.2501H2.12497C2.01537 15.25 1.90772 15.221 1.81282 15.1662C1.71792 15.1114 1.6391 15.0326 1.58426 14.9377C1.52942 14.8428 1.50049 14.7351 1.50038 14.6255C1.50026 14.5159 1.52896 14.4082 1.58359 14.3132L8.45797 2.43819L8.45859 2.43756C8.51353 2.34249 8.59253 2.26356 8.68765 2.20871C8.78277 2.15385 8.89065 2.125 9.00046 2.12507C9.11026 2.12513 9.21811 2.1541 9.31316 2.20907C9.40822 2.26403 9.48713 2.34305 9.54196 2.43819L16.4145 14.3126C16.4705 14.4072 16.5001 14.5151 16.5001 14.6251C16.5001 14.735 16.4705 14.8429 16.4145 14.9376Z" fill="#C54303" />
                            <path d="M9.00005 14C9.43152 14 9.7813 13.6502 9.7813 13.2187C9.7813 12.7873 9.43152 12.4375 9.00005 12.4375C8.56857 12.4375 8.2188 12.7873 8.2188 13.2187C8.2188 13.6502 8.56857 14 9.00005 14Z" fill="#C54303" />
                            <path d="M8.99997 11.5C9.08206 11.5001 9.16335 11.484 9.2392 11.4526C9.31505 11.4212 9.38397 11.3751 9.44202 11.3171C9.50006 11.259 9.5461 11.1901 9.57749 11.1143C9.60889 11.0384 9.62502 10.9571 9.62497 10.875V6.50005C9.62497 6.33429 9.55912 6.17532 9.44191 6.05811C9.3247 5.9409 9.16573 5.87505 8.99997 5.87505C8.83421 5.87505 8.67524 5.9409 8.55803 6.05811C8.44082 6.17532 8.37497 6.33429 8.37497 6.50005V10.875C8.37492 10.9571 8.39106 11.0384 8.42245 11.1143C8.45384 11.1901 8.49988 11.2591 8.55792 11.3171C8.61597 11.3751 8.68489 11.4212 8.76074 11.4526C8.83659 11.484 8.91788 11.5001 8.99997 11.5Z" fill="#C54303" />
                          </svg>
                        </div>
                      </div>
                    )}
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                    <div className={sc('actions')} ref={actionsRef}>
                      <Flex className={sc('avatar')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                          <g opacity="0.65">
                            <rect width="48" height="48" rx="24" fill="#A65E00" />
                            <path d="M29.7097 22.9718C29.0031 22.5426 28.2498 22.1956 27.4645 21.9375C28.4073 21.2134 29.0996 20.212 29.444 19.0741C29.7884 17.9363 29.7675 16.7191 29.3844 15.5937C29.0013 14.4682 28.2752 13.4912 27.3081 12.7997C26.341 12.1083 25.1815 11.7373 23.9927 11.7389C22.8038 11.7405 21.6454 12.1145 20.6801 12.8085C19.7148 13.5025 18.9913 14.4815 18.6111 15.6079C18.231 16.7343 18.2134 17.9515 18.5608 19.0885C18.9081 20.2255 19.6031 21.225 20.5478 21.9466C16.4936 23.2995 13.5 26.9247 13.5 31.0672C13.5117 31.6092 13.6437 32.1417 13.8863 32.6264C14.129 33.1111 14.4762 33.5359 14.9031 33.87C16.8445 35.5286 20.5436 36.2455 24.0367 36.2455C25.2421 36.249 26.4459 36.1596 27.6376 35.978C27.8669 35.942 28.0725 35.8163 28.2092 35.6287C28.3459 35.441 28.4025 35.2068 28.3664 34.9774C28.3304 34.7481 28.2047 34.5424 28.0171 34.4057C27.8294 34.2691 27.5952 34.2125 27.3658 34.2485C22.949 34.9458 17.9758 34.1939 16.0404 32.5396C15.8063 32.3695 15.6136 32.1488 15.4767 31.8938C15.3399 31.6389 15.2624 31.3563 15.25 31.0673C15.25 26.7623 19.2567 23.1248 24 23.1248C25.6924 23.1222 27.3528 23.5861 28.7988 24.4655C28.9968 24.5846 29.2339 24.6205 29.4583 24.5654C29.6827 24.5102 29.8762 24.3686 29.9965 24.1713C30.1168 23.974 30.1542 23.7372 30.1004 23.5124C30.0467 23.2877 29.9063 23.0933 29.7097 22.9718ZM20.0625 17.4372C20.0625 16.6585 20.2934 15.8972 20.7261 15.2497C21.1587 14.6022 21.7737 14.0975 22.4932 13.7995C23.2127 13.5014 24.0044 13.4235 24.7682 13.5754C25.532 13.7273 26.2336 14.1023 26.7842 14.653C27.3349 15.2037 27.7099 15.9053 27.8618 16.6691C28.0138 17.4329 27.9358 18.2246 27.6378 18.944C27.3398 19.6635 26.8351 20.2785 26.1876 20.7111C25.54 21.1438 24.7788 21.3747 24 21.3747C22.9561 21.3736 21.9552 20.9584 21.217 20.2202C20.4789 19.482 20.0636 18.4812 20.0625 17.4372Z" fill="white" fillOpacity="0.95" />
                            <path d="M32.7497 35.5938C33.3537 35.5938 33.8434 35.1041 33.8434 34.5C33.8434 33.8959 33.3537 33.4062 32.7497 33.4062C32.1456 33.4062 31.6559 33.8959 31.6559 34.5C31.6559 35.1041 32.1456 35.5938 32.7497 35.5938Z" fill="white" fillOpacity="0.95" />
                            <path d="M32.75 25.7497C31.9804 25.7528 31.2434 26.061 30.7008 26.6068C30.1582 27.1526 29.8543 27.8914 29.8558 28.661C29.8558 28.893 29.948 29.1156 30.1121 29.2797C30.2762 29.4438 30.4988 29.536 30.7308 29.536C30.9629 29.536 31.1855 29.4438 31.3496 29.2797C31.5136 29.1156 31.6058 28.893 31.6058 28.661C31.6036 28.5093 31.6316 28.3587 31.6881 28.218C31.7446 28.0772 31.8285 27.9491 31.935 27.841C32.0414 27.733 32.1683 27.6472 32.3082 27.5887C32.4482 27.5301 32.5983 27.5 32.75 27.5C32.9017 27.5 33.0518 27.5301 33.1918 27.5887C33.3317 27.6472 33.4586 27.733 33.565 27.841C33.6715 27.9491 33.7554 28.0772 33.8119 28.218C33.8684 28.3587 33.8964 28.5093 33.8942 28.661C33.8917 28.9622 33.7698 29.2502 33.5553 29.4618C33.3409 29.6734 33.0513 29.7913 32.75 29.7897C32.6351 29.7897 32.5213 29.8123 32.4151 29.8562C32.3089 29.9002 32.2124 29.9646 32.1311 30.0459C32.0499 30.1271 31.9854 30.2236 31.9415 30.3298C31.8975 30.436 31.8749 30.5498 31.875 30.6647V31.8747C31.875 32.1068 31.9672 32.3293 32.1313 32.4934C32.2954 32.6575 32.5179 32.7497 32.75 32.7497C32.9821 32.7497 33.2046 32.6575 33.3687 32.4934C33.5328 32.3293 33.625 32.1068 33.625 31.8747V31.4056C34.2836 31.1964 34.8457 30.7586 35.2097 30.1712C35.5738 29.5839 35.7158 28.8857 35.6101 28.2028C35.5045 27.5199 35.1581 26.8973 34.6336 26.4475C34.1091 25.9976 33.441 25.7501 32.75 25.7497Z" fill="white" fillOpacity="0.95" />
                          </g>
                        </svg>
                      </Flex>
                      <Flex className={sc('action')}>
                        <Text type="body-primary" className={sc('name removeText')}>
                          {outlookRemoveLabel}
                        </Text>
                      </Flex>
                    </div>
                    <Flex direction="column" className={sc('meta')} alignItems="center">
                      <Text type="body-primary" className={sc('deletedName')}>
                        {deleteOutlookUserLabel}
                      </Text>
                    </Flex>
                  </Flex>
                </div>
              </ContextMenuTrigger>
              {/* Context Menu Actions */}
              <ContextMenu
                className={sc('context-menu')}
                id={contextMenuId}
                preventHideOnResize
                preventHideOnContextMenu
                ref={contextTriggerRef}
                style={{visibility: Boolean(isContextMenuVisible) ? 'visible' : 'hidden'}}
              >
                <div
                 onFocus={() => {
                  setSubMenuVisible(false);
                }}
                onBlur={() => {
                  setSubMenuVisible(true);
                }} >
                <Menu
                  key={`${item?.id}-menu`}
                  aria-label="Speed Dial Item Menu"
                  disabledKeys={[item?.callType as React.Key]}
                  defaultSelectedKeys={item?.callType}
                  onAction={handleAction}
                  className={sc('menu')}
                  ref={submenuItemRef}
                >
                  <Section
                    key={1}
                    aria-label={t('voiceover.btnRemove')}
                  >
                    <Item key="remove" >{removeLabel}</Item>
                  </Section>
                </Menu>
                </div>
              </ContextMenu>
            </div>
          }
          variant="small"
        >
          <p>{originalContactDeletedLabel}</p>
        </Popover>
      }
    </>
  );
});
