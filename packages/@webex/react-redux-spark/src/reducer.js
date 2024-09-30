import {fromJS, Record} from 'immutable';

import {
  REGISTER_DEVICE_FAILURE,
  UNREGISTER_DEVICE_FAILURE,
  STORE_SPARK_INSTANCE,
  STORE_SPARK_ADAPTOR,
  UPDATE_SPARK_STATUS
} from './actions';

const Status = Record({
  authenticated: false,
  authenticating: false,
  registered: false,
  registerError: false,
  registering: false,
  unregisterError: false,
  unregistering: false
});

export const initialState = fromJS({
  error: null,
  spark: null,
  status: new Status()
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SPARK_STATUS:
      return state.mergeDeep({
        status: action.payload.status
      });

    case STORE_SPARK_INSTANCE:
      return state.set('spark', action.payload.spark)
        .mergeDeep({
          status: action.payload.status
        });

    case STORE_SPARK_ADAPTOR:
      return state.set('adaptor', action.payload.adaptor);

    case REGISTER_DEVICE_FAILURE:
      return state.set('error', fromJS(action.payload.error))
        .setIn(['status', 'registerError'], true)
        .setIn(['status', 'registering'], false);

    case UNREGISTER_DEVICE_FAILURE:
      return state.set('error', fromJS(action.payload.error))
        .setIn(['status', 'unregisterError'], true)
        .setIn(['status', 'unregistering'], false);

    default:
      return state;
  }
}
