import {
  AvatarNext,
  ButtonCircle,
  Flex, ListItemBase,
  ListItemBaseSection
} from '@momentum-ui/react-collaboration';
import { IWebexIntContact } from '@webex/component-adapter-interfaces/dist/esm/src';
import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyLoadAvatarUrl } from '../hooks/useLazyLoadAvatarUrl';
import useWebexClasses from '../hooks/useWebexClasses';
import { removeBracketsAndContent } from '../utils/avatarInitials';
import {
  CallSelectPopover,
  ICallSelectPopoverHandle
} from './CallSelectPopover';
import './SearchContactsItem.scss';

type SearchContactsItemProps = {
  user: IWebexIntContact;
  index: number;
  onPress?: (user: IWebexIntContact) => void;
  isSelected?: boolean;
  style?: React.CSSProperties;
  makeCall?: (address: string, isVideo?: boolean, label?: string) => void;
  label?: string
};

/**
 * User object that appears in the search contacts list.  On hover will show audio and video calling buttons.
 * When clicking one of them, a dropdown appears with the possible call addresses if multiple exist.
 * If the user only has one callable address, it will immediately call that one address.
 *
 * @param {SearchContactsItemProps} props
 * @param props.style optional inline styles
 * @param props.user user to show call options for
 * @param props.index index within the list
 * @param props.isSelected whether it is selected within the list
 * @param props.onPress action to perform when the user list item is pressed
 */
export const SearchContactsItem = ({
  user,
  index,
  onPress = () => {},
  isSelected = false,
  style = undefined,
  makeCall,
  label
}: SearchContactsItemProps) => {
  const { t } = useTranslation('WebexSearchContacts');

  const [imageUrl] = useLazyLoadAvatarUrl(user.id, user.fetchAvatarUrl);

  const filteredEmails = user.emailAddresses && user.emailAddresses.length > 0 ? user.emailAddresses.filter(email => email.address !== undefined && email.address !== null && email.address.trim() !== '') : user.emailAddresses;
  const filteredphoneNumbers = user.phoneNumbers && user.phoneNumbers.length > 0 ? user.phoneNumbers.filter(number => number.address !== undefined && number.address !== null && number.address.trim() !== '') : user.phoneNumbers;
  const callables = [...filteredphoneNumbers, ...filteredEmails];
  const hasNoAddress = callables.length === 0 ? true : false;
  const [cssClasses, sc] = useWebexClasses('search-contacts-item');

  const audioCallRef = useRef<ICallSelectPopoverHandle>(null);
  const videoCallRef = useRef<ICallSelectPopoverHandle>(null);
  const audioButtonRef = useRef<HTMLButtonElement>(null);
  const videoButtonRef = useRef<HTMLButtonElement>(null);

  const onAudioCallButtonPress = useCallback(() => {
    videoCallRef?.current?.hidePopover();
    onPress(user);
  }, [videoCallRef, user, onPress]);

  const onVideoCallButtonPress = useCallback(() => {
    audioCallRef?.current?.hidePopover();
    onPress(user);
  }, [audioCallRef, user, onPress]);

  useEffect(() => {
    if (!isSelected) {
      videoCallRef?.current?.hidePopover();
      audioCallRef?.current?.hidePopover();
    }
  }, [audioCallRef, videoCallRef, isSelected]);

  const handlePopoverHideForAudio = useCallback(() => {
    audioButtonRef.current?.focus();
  }, []);

  const handlePopoverHideforVideo = useCallback(() => {
    videoButtonRef.current?.focus();
  }, []);

  return (
    <ListItemBase
      itemIndex={index}
      isPadded
      interactive
      shape="isPilled"
      style={style}
      className={cssClasses}
      isSelected={isSelected}
      onPress={() => onPress(user)}
      aria-label={`${(user.name)}, ${t('dialpadListFocusButton')}`}
    >
      <ListItemBaseSection position="start">
        <AvatarNext initials={removeBracketsAndContent(user.name)} title={user.name} size={32} src={imageUrl} />
      </ListItemBaseSection>
      <ListItemBaseSection position="fill">{user.name}</ListItemBaseSection>
      <ListItemBaseSection position="end">
        <Flex xgap=".5rem" className={sc('actions')}>
          <CallSelectPopover
            callables={callables}
            isVideo={false}
            ref={audioCallRef}
            makeCall={makeCall}
            label={label}
            onHide={handlePopoverHideForAudio}
            buttonRef={audioButtonRef}
          >
            <ButtonCircle
              color="join"
              size={28}
              onPress={onAudioCallButtonPress}
              title={t('audioCallLabel')}
              aria-label={t('audioCallLabel')}
              disabled={hasNoAddress}
              ref={audioButtonRef}
            >
              <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.4531 9.88166L11.9619 8.38851C11.7889 8.21573 11.5835 8.07873 11.3575 7.98536C11.1315 7.89199 10.8893 7.84407 10.6448 7.84434C10.4003 7.84461 10.1583 7.89306 9.93248 7.98693C9.70671 8.0808 9.50164 8.21825 9.32901 8.39141C9.32901 8.39141 8.68501 9.04706 8.41251 9.32236C7.43045 9.28791 6.49806 8.88201 5.80372 8.18665C5.10937 7.4913 4.70483 6.55832 4.67181 5.57621C4.94681 5.30336 5.60151 4.65896 5.60441 4.65621C5.95258 4.30645 6.14805 3.83304 6.14805 3.33953C6.14805 2.84603 5.95258 2.37261 5.60441 2.02286L4.11271 0.529506C3.75745 0.189672 3.28477 0 2.79314 0C2.30151 0 1.82883 0.189672 1.47356 0.529506L0.676213 1.32746C-0.400437 2.40501 -0.653787 6.17746 3.57901 10.4161C5.85346 12.6935 7.85981 13.5286 9.14301 13.8278C9.60773 13.9391 10.0836 13.997 10.5615 14.0004C11.3209 14.0535 12.0713 13.8106 12.6557 13.3228L13.4531 12.525C13.8028 12.1741 13.9992 11.6988 13.9992 11.2033C13.9992 10.7079 13.8028 10.2326 13.4531 9.88166ZM12.746 11.8167L11.9487 12.615C11.621 12.9431 10.6743 13.1568 9.36956 12.8531C8.21381 12.5831 6.39351 11.8186 4.28606 9.70836C0.523363 5.94046 0.683063 2.73651 1.38321 2.03541L2.18061 1.23746C2.26097 1.15688 2.35643 1.09295 2.46153 1.04933C2.56664 1.0057 2.67932 0.98325 2.79311 0.98325C2.90691 0.98325 3.01959 1.0057 3.12469 1.04933C3.22979 1.09295 3.32526 1.15688 3.40561 1.23746L4.89731 2.73066C5.05787 2.89176 5.14827 3.10978 5.14881 3.33723C5.14936 3.56469 5.06 3.78314 4.90021 3.94501C4.90021 3.94501 4.08521 4.74686 3.88751 4.94501C3.38606 5.44861 3.79426 7.59056 5.09751 8.89551C6.40121 10.2015 8.54181 10.6117 9.04331 10.1071C9.24056 9.91006 10.0389 9.09646 10.0389 9.09646C10.2002 8.93538 10.4189 8.8449 10.6468 8.8449C10.8748 8.8449 11.0934 8.93538 11.2547 9.09646L12.7459 10.5897C12.9082 10.7526 12.9994 10.9732 12.9994 11.2032C12.9994 11.4332 12.9083 11.6537 12.746 11.8167Z" fill="white"/>
              </svg>
            </ButtonCircle>
          </CallSelectPopover>
          <CallSelectPopover
            callables={callables}
            isVideo
            ref={videoCallRef}
            makeCall={makeCall}
            label={label}
            onHide={handlePopoverHideforVideo}
            buttonRef={videoButtonRef} 
          >
            <ButtonCircle
              color="join"
              size={28}
              onPress={onVideoCallButtonPress}
              title={t('videoCallLabel')}
              aria-label={t('videoCallLabel')}
              disabled={hasNoAddress}
              ref={videoButtonRef} 
            >
              <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5256 2.64893C13.3808 2.55888 13.2153 2.50755 13.0449 2.49986C12.8746 2.49216 12.7051 2.52836 12.5527 2.60498C12.5374 2.6128 12.5225 2.62109 12.5078 2.63037L11.001 3.58874V3C11.0002 2.3372 10.7366 1.70177 10.2679 1.23309C9.79921 0.764422 9.16378 0.500779 8.50098 0.5H2.50098C1.83817 0.500779 1.20274 0.764422 0.734071 1.23309C0.265398 1.70177 0.00175597 2.3372 0.000976562 3V9C0.00175465 9.6628 0.265397 10.2982 0.734069 10.7669C1.20274 11.2356 1.83817 11.4992 2.50098 11.5H8.50098C9.16378 11.4992 9.79921 11.2356 10.2679 10.7669C10.7366 10.2982 11.0002 9.6628 11.001 9V8.41095L12.5078 9.36868C12.5222 9.37795 12.5371 9.38625 12.5522 9.39406C12.7047 9.47038 12.8741 9.50645 13.0444 9.49885C13.2147 9.49125 13.3802 9.44024 13.5253 9.35066C13.6703 9.26107 13.7901 9.1359 13.8731 8.98701C13.9561 8.83813 13.9997 8.67049 13.9997 8.50002V3.49952C14.0004 3.32897 13.9571 3.16114 13.874 3.01216C13.791 2.86319 13.671 2.7381 13.5256 2.64893ZM10.001 9C10.0005 9.39769 9.84237 9.77897 9.56116 10.0602C9.27995 10.3414 8.89867 10.4996 8.50098 10.5H2.50098C2.10329 10.4996 1.72201 10.3414 1.4408 10.0602C1.15959 9.77897 1.00141 9.39769 1.00098 9V3C1.00141 2.60231 1.15959 2.22103 1.4408 1.93982C1.72201 1.65861 2.10329 1.50043 2.50098 1.5H8.50098C8.89867 1.50043 9.27995 1.65861 9.56116 1.93982C9.84237 2.22103 10.0005 2.60231 10.001 3V9ZM11.001 7.22614V4.77374L12.9998 3.50244L13 8.49658L11.001 7.22614Z" fill="white" fillOpacity="0.95"/>
              </svg>
            </ButtonCircle>
          </CallSelectPopover>
        </Flex>
      </ListItemBaseSection>
    </ListItemBase>
  );
};