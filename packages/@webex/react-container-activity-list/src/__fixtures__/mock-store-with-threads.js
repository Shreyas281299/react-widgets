import configureStore from 'redux-mock-store';
import {fromJS} from 'immutable';
import {initialState as avatar} from '@webex/redux-module-avatar';
import {initialState as presence} from '@webex/redux-module-presence';
import {initialState as activity} from '@webex/redux-module-activity';
import {initialState as conversation} from '@webex/redux-module-conversation';
import {initialState as flags} from '@webex/redux-module-flags';
import {initialState as indicators} from '@webex/redux-module-indicators';
import {initialState as users} from '@webex/redux-module-users';

const activities = [{
  id: '3f977de0-d1d9-11e6-869c-1154edc7a0cf',
  objectType: 'activity',
  url: 'https://conv-a.wbx2.com/conversation/api/v1/activities/3f977de0-d1d9-11e6-869c-1154edc7a0cf',
  published: '2015-01-03T17:22:48.638Z',
  verb: 'post',
  actor: {
    id: '12abd-dc77-4747-af67-2e38ba0fb762',
    objectType: 'person',
    displayName: 'Ricky Testerson',
    orgId: 'consumer',
    emailAddress: 'Ricky.Testerson@gmail.com',
    entryUUID: '12abd-dc77-4747-af67-2e38ba0fb762',
    type: 'PERSON',
    entryEmail: 'Ricky.Testerson@gmail.com'
  },
  object: {
    objectType: 'comment',
    displayName: 'hi'
  },
  target: {
    id: 'ba0ae11-7199-3dee-86b1-9bbef68320f0',
    objectType: 'conversation',
    url: 'https://conv-a.wbx2.com/conversation/api/v1/conversations/ba0ae11-7199-3dee-86b1-9bbef68320f0',
    participants: {
      items: []
    },
    activities: {
      items: []
    },
    tags: [],
    defaultActivityEncryptionKeyUrl: 'https://encryption-a.wbx2.com/encryption/api/v1/keys/11f13e-a95e-41c5-b1b1-daaa926f3432',
    kmsResourceObjectUrl: 'https://encryption-a.wbx2.com/encryption/api/v1/resources/829717c4-9a99-41cc-aff9-7660efc39fb4'
  },
  clientTempId: 'ac3c3e5c-4f63-41aa-94bd-2a1951aac747',
  encryptionKeyUrl: 'https://encryption-a.wbx2.com/encryption/api/v1/keys/11f13e-a95e-41c5-b1b1-daaa926f3432'
}, {
  id: '8f013af0-d455-11e6-9f2d-5f2147b91ac0',
  objectType: 'activity',
  url: 'https://conv-a.wbx2.com/conversation/api/v1/activities/8f013af0-d455-11e6-9f2d-5f2147b91ac0',
  published: '2015-01-06T21:17:41.791Z',
  verb: 'post',
  actor: {
    id: '5sa32-dc77-4747-af67-2e38ba0fb762',
    objectType: 'person',
    displayName: 'Jon Langley',
    orgId: 'consumer',
    emailAddress: 'Jon.Langley@gmail.com',
    entryUUID: '5sa32-dc77-4747-af67-2e38ba0fb762',
    type: 'PERSON',
    entryEmail: 'Jon.Langley@gmail.com'
  },
  object: {
    objectType: 'comment',
    displayName: '123'
  },
  target: {
    id: 'ba0ae11-7199-3dee-86b1-9bbef68320f0',
    objectType: 'conversation',
    url: 'https://conv-a.wbx2.com/conversation/api/v1/conversations/ba0ae11-7199-3dee-86b1-9bbef68320f0',
    participants: {
      items: []
    },
    activities: {
      items: []
    },
    tags: [],
    defaultActivityEncryptionKeyUrl: 'https://encryption-a.wbx2.com/encryption/api/v1/keys/11f13e-a95e-41c5-b1b1-daaa926f3432',
    kmsResourceObjectUrl: 'https://encryption-a.wbx2.com/encryption/api/v1/resources/829717c4-9a99-41cc-aff9-7660efc39fb4'
  },
  clientTempId: 'abc-123-346',
  encryptionKeyUrl: 'https://encryption-a.wbx2.com/encryption/api/v1/keys/11f13e-a95e-41c5-b1b1-daaa926f3432'
}, {
  id: '6cc26e40-c1d0-11e8-be73-fb59db7aeff3',
  machineUserId: '8912e485-4944-4d25-b33f-8142f5f16ce8"',
  actor: {
    displayName: 'Adam Miller',
    emailAddress: 'aMiller.test@gmail.com',
    entryEmail: 'aMiller.test@cisco.com',
    entryUUID: '7d340ace-9d05-43f2-a27d-f88694b4024f',
    id: '7d340ace-9d05-43f2-a27d-f88694b4024f',
    objectType: 'person',
    orgId: '1eb65fdf-9643-417f-9974-ad72cae0e10f',
    type: 'PERSON'
  },
  object: {
    type: 'LYRA_SPACE'
  },
  verb: 'add'
}, {
  id: '6cc26e40-c1d0-11e8-be73-fb59db7aeff3',
  machineUserId: '8912e485-4944-4d25-b33f-8142f5f16ce8"',
  actor: {
    displayName: 'Adam Miller',
    emailAddress: 'aMiller.test@gmail.com',
    entryEmail: 'aMiller.test@cisco.com',
    entryUUID: '7d340ace-9d05-43f2-a27d-f88694b4024f',
    id: '7d340ace-9d05-43f2-a27d-f88694b4024f',
    objectType: 'person',
    orgId: '1eb65fdf-9643-417f-9974-ad72cae0e10f',
    type: 'PERSON'
  },
  object: {
    type: 'LYRA_SPACE'
  },
  verb: 'leave'
}];

const threadActivities = {
  '8f013af0-d455-11e6-9f2d-5f2147b91ac0': [{
    id: '8f013af0-d455-11e6-9f2d-5f2147b91ac1',
    objectType: 'activity',
    url: 'https://conv-a.wbx2.com/conversation/api/v1/activities/8f013af0-d455-11e6-9f2d-5f2147b91ac1',
    published: '2015-01-06T21:17:41.791Z',
    verb: 'post',
    actor: {
      id: '5sa32-dc77-4747-af67-2e38ba0fb762',
      objectType: 'person',
      displayName: 'Jon Langley',
      orgId: 'consumer',
      emailAddress: 'Jon.Langley@gmail.com',
      entryUUID: '5sa32-dc77-4747-af67-2e38ba0fb762',
      type: 'PERSON',
      entryEmail: 'Jon.Langley@gmail.com'
    },
    object: {
      objectType: 'comment',
      displayName: 'reply'
    },
    parent: {
      id: '8f013af0-d455-11e6-9f2d-5f2147b91ac0',
      type: 'reply'
    },
    target: {
      id: 'ba0ae11-7199-3dee-86b1-9bbef68320f0',
      objectType: 'conversation',
      url: 'https://conv-a.wbx2.com/conversation/api/v1/conversations/ba0ae11-7199-3dee-86b1-9bbef68320f0',
      participants: {
        items: []
      },
      activities: {
        items: []
      },
      tags: [],
      defaultActivityEncryptionKeyUrl: 'https://encryption-a.wbx2.com/encryption/api/v1/keys/11f13e-a95e-41c5-b1b1-daaa926f3432',
      kmsResourceObjectUrl: 'https://encryption-a.wbx2.com/encryption/api/v1/resources/829717c4-9a99-41cc-aff9-7660efc39fb4'
    },
    clientTempId: 'abc-123-347',
    encryptionKeyUrl: 'https://encryption-a.wbx2.com/encryption/api/v1/keys/11f13e-a95e-41c5-b1b1-daaa926f3432'
  }]
};

const mockedCurrentUser = {
  id: '12abd-dc77-4747-af67-2e38ba0fb762',
  objectType: 'person',
  displayName: 'Ricky Testerson',
  orgId: 'consumer',
  emailAddress: 'Ricky.Testerson@gmail.com',
  entryUUID: '12abd-dc77-4747-af67-2e38ba0fb762',
  type: 'PERSON',
  entryEmail: 'Ricky.Testerson@gmail.com'
};

const middlewares = [];
const mockStore = configureStore(middlewares);

const mockedConversation = conversation
  .set('sortNonThreadActivities', activities)
  .set('threadActivities', threadActivities);

const flag = {
  activityUrl: 'https://conv-a.wbx2.com/conversation/api/v1/activities/8f013af0-d455-11e6-9f2d-5f2147b91ac0'
};

const store = mockStore({
  activity,
  avatar,
  conversation: mockedConversation,
  flags: flags.setIn(['flags', flag.activityUrl], fromJS(flag)),
  indicators,
  presence,
  users: users.set('currentUserId', mockedCurrentUser.id).setIn(['byId', mockedCurrentUser.id], mockedCurrentUser)
});

export default store;
