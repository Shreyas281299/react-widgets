import {compose} from 'recompose';
import {constructWebexEnhancer, withIntl} from '@webex/webex-widget-base';
import {enhancer as mercuryEnhancer} from '@webex/redux-module-mercury';
import {enhancer as mediaEnhancer} from '@webex/redux-module-media';

import {reducers} from './reducer';
import ConnectedMeet from './container';

import messages from './translations/en';

export {reducers};

export const destinationTypes = {
  SIP: 'sip',
  EMAIL: 'email',
  USERID: 'userId',
  SPACEID: 'spaceId',
  PSTN: 'pstn'
};

export default compose(
  constructWebexEnhancer({
    name: 'meet',
    reducers
  }),
  withIntl({locale: 'en', messages}),
  mediaEnhancer,
  mercuryEnhancer
)(ConnectedMeet);