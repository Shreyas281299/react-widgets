import reducer, {initialState} from './reducer';
import {
  REGISTER_DEVICE_FAILURE,
  UNREGISTER_DEVICE_FAILURE,
  STORE_SPARK_INSTANCE,
  UPDATE_SPARK_STATUS
} from './actions';

describe('spark reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {}))
      .toMatchSnapshot();
  });

  it('should handle STORE_SPARK_INSTANCE', () => {
    expect(reducer(initialState, {
      type: STORE_SPARK_INSTANCE,
      payload: {
        spark: {
          mock: true
        },
        status: {
          authenticated: true,
          authenticating: false,
          registered: false
        }
      }
    })).toMatchSnapshot();
  });

  it('should handle UPDATE_SPARK_STATUS', () => {
    expect(reducer(initialState, {
      type: UPDATE_SPARK_STATUS,
      payload: {
        status: {
          authenticated: true,
          registered: true
        }
      }
    })).toMatchSnapshot();
  });

  it('should handle REGISTER_DEVICE_FAILURE', () => {
    expect(reducer(initialState, {
      type: REGISTER_DEVICE_FAILURE,
      payload: {
        error: new Error('device failure')
      }
    })).toMatchSnapshot();
  });

  it('should handle UNREGISTER_DEVICE_FAILURE', () => {
    expect(reducer(initialState, {
      type: UNREGISTER_DEVICE_FAILURE,
      payload: {
        error: new Error('device failure')
      }
    })).toMatchSnapshot();
  });
});