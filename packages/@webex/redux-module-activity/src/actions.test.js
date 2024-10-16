import {OrderedMap} from 'immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from './actions';
import {initialState} from './reducer';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const toImmutable = (obj) => (
  {
    get: jest.fn((key) => obj[key]),
    toJS: jest.fn(() => obj)
  }
);

let conversation, mockSpark;

describe('redux-module-activity actions', () => {
  beforeEach(() => {
    mockSpark = {
      internal: {
        conversation: {
          makeShare: jest.fn(() => ({add: jest.fn()})),
          post: jest.fn(() => Promise.resolve({})),
          share: jest.fn(() => Promise.resolve({})),
          updateTypingStatus: jest.fn(() => Promise.resolve({}))
        }
      }
    };

    conversation = {
      id: 'test-conversation'
    };
  });

  it('has exported actions', () => {
    expect(actions.addFiles).toBeDefined();
    expect(actions.removeFile).toBeDefined();
    expect(actions.retryFailedActivity).toBeDefined();
    expect(actions.submitActivity).toBeDefined();
    expect(actions.setUserTyping).toBeDefined();
  });

  describe('#addFiles', () => {
    it('can create a share activity and add files to it', () => {
      const store = mockStore({});
      const activity = initialState;
      const file = {
        clientTempId: 'temp-file.png',
        displayName: 'temp-file',
        fileSize: 123456789,
        type: 'image'
      };

      return store.dispatch(actions.addFiles(toImmutable(conversation), activity, [file], mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.makeShare).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('can add files to an existing share activity', () => {
      const store = mockStore({});
      const activity = initialState.set('shareActivity', {add: jest.fn()});
      const file = {
        clientTempId: 'temp-file.png',
        displayName: 'temp-file',
        fileSize: 123456789,
        type: 'image'
      };

      return store.dispatch(actions.addFiles(toImmutable(conversation), activity, [file], mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.makeShare).not.toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#removeFile', () => {
    it('can remove files from a share activity', () => {
      const store = mockStore({});
      const activity = initialState
        .set('shareActivity', {remove: jest.fn(() => Promise.resolve({}))})
        .set('files', new OrderedMap({file: {clientTempId: 'file', type: 'image'}, file2: {clientTempId: 'file2', type: 'image'}}));

      return store.dispatch(actions.removeFile('file', activity))
        .then(() => {
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#retryFailedActivity', () => {
    it('retries a failed post activity', () => {
      const store = mockStore({});
      const activity = {
        _meta: {
          conversation: {},
          shareActivity: undefined,
          text: 'What a failure I\'ve become'
        },
        id: 'failed-activity-id',
        verb: 'post'
      };

      return store.dispatch(actions.retryFailedActivity(activity, mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.post).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('retries a failed share activity', () => {
      const store = mockStore({});
      const activity = {
        _meta: {
          conversation: {},
          shareActivity: {},
          text: 'What a failure I\'ve become'
        },
        id: 'failed-activity-id',
        verb: 'share'
      };

      return store.dispatch(actions.retryFailedActivity(activity, mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.share).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#submitActivity', () => {
    it('does not submit an empty activity', () => {
      const store = mockStore({});
      const activity = initialState;

      return store.dispatch(actions.submitActivity(toImmutable(conversation), activity, {}, mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.post).not.toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('can submit a post activity', () => {
      const store = mockStore({});
      const activity = initialState
        .set('text', '**bold** yo!');

      return store.dispatch(actions.submitActivity(toImmutable(conversation), activity, {}, mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.post).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('can submit a share activity', () => {
      const store = mockStore({});
      const activity = initialState
        .set('text', '**bold** yo!')
        .set('shareActivity', {})
        .set('files', new OrderedMap({file: {clientTempId: 'file', type: 'image'}, file2: {clientTempId: 'file2', type: 'image'}}));

      return store.dispatch(actions.submitActivity(toImmutable(conversation), activity, {}, mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.share).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('can submit a share activity with no text', () => {
      const store = mockStore({});
      const activity = initialState
        .set('shareActivity', {})
        .set('files', new OrderedMap({file: {clientTempId: 'file', type: 'image'}, file2: {clientTempId: 'file2', type: 'image'}}));

      return store.dispatch(actions.submitActivity(toImmutable(conversation), activity, {}, mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.share).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('saves a failed post activity', () => {
      const store = mockStore({});
      const activity = initialState
        .set('text', '**bold** yo!');

      mockSpark.internal.conversation.post = jest.fn(() => Promise.reject(new Error('no network')));

      return store.dispatch(actions.submitActivity(toImmutable(conversation), activity, {}, mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.post).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });

    it('saves a failed share activity', () => {
      const store = mockStore({});
      const activity = initialState
        .set('text', '**bold** yo!')
        .set('shareActivity', {})
        .set('files', new OrderedMap({file: {clientTempId: 'file', type: 'image'}, file2: {clientTempId: 'file2', type: 'image'}}));

      mockSpark.internal.conversation.share = jest.fn(() => Promise.reject(new Error('no network')));

      return store.dispatch(actions.submitActivity(toImmutable(conversation), activity, {}, mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.share).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });

  describe('#setUserTyping', () => {
    it('should update the typing status', () => {
      const store = mockStore({
        activity: initialState
      });

      return store.dispatch(actions.setUserTyping(true, toImmutable(conversation), mockSpark))
        .then(() => {
          expect(mockSpark.internal.conversation.updateTypingStatus).toHaveBeenCalled();
          expect(store.getActions()).toMatchSnapshot();
        });
    });
  });
});