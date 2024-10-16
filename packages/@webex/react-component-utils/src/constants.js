export const API_ACTIVITY_VERB = {
  ACKNOWLEDGE: 'acknowledge',
  ADD: 'add',
  ADD_MICROAPP_INSTANCE: 'addMicroappInstance',
  ARCHIVE: 'archive',
  ASSIGN: 'assign',
  ASSIGN_MODERATOR: 'assignModerator',
  CANCEL: 'cancel',
  CREATE: 'create',
  DECLINE: 'decline',
  DELETE: 'delete',
  FAVORITE: 'favorite',
  GAP: 'gap',
  HIDE: 'hide',
  LEAVE: 'leave',
  LOCK: 'lock',
  MUTE: 'mute',
  POST: 'post',
  REMOVE: 'remove',
  SCHEDULE: 'schedule',
  SET: 'set',
  SHARE: 'share',
  START: 'start',
  TAG: 'tag',
  TERMINATE: 'terminate',
  TOMBSTONE: 'tombstone',
  UNARCHIVE: 'unarchive',
  UNASSIGN: 'unassign',
  UNASSIGN_MODERATOR: 'unassignModerator',
  UNFAVORITE: 'unfavorite',
  UNHIDE: 'unhide',
  UNLOCK: 'unlock',
  UNMUTE: 'unmute',
  UNSET: 'unset',
  UNTAG: 'untag',
  UPDATE: 'update',
  UPDATEKEY: 'updateKey'
};

export const API_ACTIVITY_TYPE = {
  REPLY: 'reply'
};

export const MENTION_NOTIFICATIONS_ON = 'MENTION_NOTIFICATIONS_ON';
export const MENTION_NOTIFICATIONS_OFF = 'MENTION_NOTIFICATIONS_OFF';
export const MESSAGE_NOTIFICATIONS_ON = 'MESSAGE_NOTIFICATIONS_ON';
export const MESSAGE_NOTIFICATIONS_OFF = 'MESSAGE_NOTIFICATIONS_OFF';

export const NOTIFICATIONS_GLOBAL = 'NOTIFICATIONS_GLOBAL';
export const NOTIFICATIONS_OFF = 'NOTIFICATIONS_OFF';
export const NOTIFICATIONS_MENTIONS = 'NOTIFICATIONS_MENTIONS';
export const NOTIFICATIONS_ALL = 'NOTIFICATIONS_ALL';
export const EMAIL_NOTIFICATIONS_MENTIONS = 'EMAIL_NOTIFICATIONS_MENTIONS';
export const EMAIL_NOTIFICATIONS_ONE_TO_ONES = 'EMAIL_NOTIFICATIONS_ONE_TO_ONES';
export const EMAIL_NOTIFICATIONS_DIGEST_EMAILS = 'EMAIL_NOTIFICATIONS_DIGEST_EMAILS';

export const NOTIFICATIONS_BADGE_NONE = 'NOTIFICATIONS_BADGE_NONE';
export const NOTIFICATIONS_BADGE_UNREAD = 'NOTIFICATIONS_BADGE_UNREAD';
export const NOTIFICATIONS_BADGE_MENTION = 'NOTIFICATIONS_BADGE_MENTION';
export const NOTIFICATIONS_BADGE_MUTE = 'NOTIFICATIONS_BADGE_MUTE';
export const NOTIFICATIONS_BADGE_UNMUTE = 'NOTIFICATIONS_BADGE_UNMUTE';

export const FEATURES_USER = 'user';
export const FEATURES_GROUP_MESSAGE_NOTIFICATIONS = 'group-message-notifications';
export const FEATURES_MENTION_NOTIFICATIONS = 'mention-notifications';

export const SPACE_TYPE_ONE_ON_ONE = 'direct';
export const SPACE_TYPE_GROUP = 'group';

export const TAG_MUTED = 'MUTED';

export const CARD_ATTACHMENT_TYPE = 'AdaptiveCard';
export const CARD_CONTAINS_IMAGE = 'cardReference';
export const ACTIVITY_CARDS = 'cards';
export const ACTIVITY_OBJECT_CONTENT_CATEGORY_IMAGES = 'images';
export const ADAPTIVE_CARD_OPEN_URL_ACTION = 'Action.OpenUrl';
export const ADAPTIVE_CARD_SUBMIT_ACTION = 'Action.Submit';

export const FEATURES_DEVELOPER = 'developer';
export const FEATURES_WIDGET_ADAPTIVE_CARD = 'WIDGET_ADAPTIVE_CARD';
export const FEATURES_WIDGET_ADAPTIVE_CARD_OFF = 'WIDGET_ADAPTIVE_CARD_OFF';
export const FEATURES_WIDGET_ADAPTIVE_CARD_ON = 'WIDGET_ADAPTIVE_CARD_ON';

export const DEFAULT_VALUE_CHECK_BOX = 'Choose';
export const TEXT_INPUT_ELEMENT = 'Input.Text';
export const TOGGLE_INPUT_ELEMENT = 'Input.Toggle';
export const CHOICE_SET_INPUT_ELEMENT = 'Input.ChoiceSet';
export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';
export const PENDING = 'PENDING';


export const FILE_TYPES = {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheet',
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'presentation',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc',
  'application/vnd.ms-excel': 'spreadsheet',
  'application/octet-stream': 'binary',
  'application/zip': 'zip'
};

export const FILE_ATTACHMENT_MAX_SIZE = 150000000; // 150 MB threshold limit

export const ADAPTIVE_CARD_HOST_CONFIG = {
  hostCapabilities: {
    capabilities: null
  },
  choiceSetInputValueSeparator: ',',
  supportsInteractivity: true,
  fontFamily: 'CiscoSansTT Regular',
  spacing: {
    small: 4,
    default: 12,
    medium: 12,
    large: 12,
    extraLarge: 16,
    padding: 12
  },
  fontSizes: {
    small: 12,
    default: 14,
    medium: 16,
    large: 20,
    extraLarge: 24
  },
  fontWeights: {
    lighter: 300,
    default: 400,
    bolder: 700
  },
  imageSizes: {
    small: 40,
    medium: 80,
    large: 160
  },
  containerStyles: {
    default: {
      foregroundColors: {
        default: {
          default: '#171B1F',
          subtle: '#535759'
        },
        dark: {
          default: '#535759',
          subtle: '#535759'
        },
        light: {
          default: '#535759',
          subtle: '#929596'
        },
        accent: {
          default: '#007EA8',
          subtle: '#00A0D1'
        },
        good: {
          default: '#1B8728',
          subtle: '#24AB31'
        },
        warning: {
          default: '#D93829',
          subtle: '#FF5C4A'
        },
        attention: {
          default: '#C74F0E',
          subtle: '#F26B1D'
        }
      },
      backgroundColor: '#FFFFFF'
    },
    emphasis: {
      foregroundColors: {
        default: {
          default: '#171B1F',
          subtle: '#535759'
        },
        dark: {
          default: '#171B1F',
          subtle: '#535759'
        },
        light: {
          default: '#535759',
          subtle: '#929596'
        },
        accent: {
          default: '#007EA8',
          subtle: '#00A0D1'
        },
        good: {
          default: '#1B8728',
          subtle: '#24AB31'
        },
        warning: {
          default: '#D93829',
          subtle: '#FF5C4A'
        },
        attention: {
          default: '#C74F0E',
          subtle: '#F26B1D'
        }
      },
      backgroundColor: '#F2F4F5'
    }
  },
  actions: {
    maxActions: 5,
    buttonSpacing: 8,
    showCard: {
      actionMode: 'Inline',
      inlineTopMargin: 16,
      style: 'emphasis'
    },
    preExpandSingleShowCardAction: false,
    actionsOrientation: 'Horizontal',
    actionAlignment: 'Left'
  },
  adaptiveCard: {
    allowCustomStyle: false
  },
  imageSet: {
    maxImageHeight: 100
  },
  media: {
    allowInlinePlayback: true
  },
  factSet: {
    title: {
      size: 'Default',
      color: 'Default',
      isSubtle: false,
      weight: 'Bolder',
      wrap: true
    },
    value: {
      size: 'Default',
      color: 'Default',
      isSubtle: false,
      weight: 'Default',
      wrap: true
    },
    spacing: 10
  },
  cssClassNamePrefix: null
};