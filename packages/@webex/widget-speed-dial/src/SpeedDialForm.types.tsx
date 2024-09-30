import { ISpeedDialRecord } from '@webex/component-adapter-interfaces/dist/cjs/src';
import React from 'react';

/**
 * https://docs.microsoft.com/en-us/graph/api/resources/contact?view=graph-rest-1.0#properties
 */
export type IFormData = ISpeedDialRecord;

export interface ISpeedDialFormProps {
  cancelText?: string;
  addText?: string;
  data?: IFormData;
  onSubmit?: (data: IFormData) => void;
  onCancel?: () => void;
  children?: React.ReactNode;
  isContact?: boolean;
  isEdit?: boolean;
  searchText?: string;
  usedPhonesList?: string[];
  inUseText?: string;
  inUsePlaceHolder?: string;
  handleEnterKeyPress?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  headerText?: string;
}

export interface ISelectItems {
  id: string;
  value: string;
}

export enum PhoneType {
  WORK = 'work',
  MAIL = 'mail',
  MOBILE = 'mobile',
  HANDSET = 'handset',
  VIDEO = 'video',
  AUDIOCALL = 'Audio call',
  VIDEOCALL = 'Video call',
  EMAIL = 'email',
  OTHER = 'other',
  SIP = 'sip'
}

export enum SpeedDialView{
  ADDVIEW = 'addView',
  SEARCHVIEW = 'searchView',
  EDITVIEW = 'editView',
  LIST = 'list',
  SEARCHADDVIEW = 'searchAddView',
  ERRORVIEW = 'errorView'
}

export enum PhoneValueTypes {
  WORK = 'Work',
  MOBILE = 'Mobile',
  MAIL = 'Mail'
}