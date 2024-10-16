const mocks = [];

function genMockFunction() {
  const mock = jest.fn(() => Promise.resolve());

  mocks.push(mock);

  return mock;
}

export default function createSpark() {
  const spark = {
    isAuthenticated: false,
    isAuthenticating: false,
    ready: false,
    util: {
      html: {
        filterSync: genMockFunction(),
        escapeSync: jest.fn((param) => param.toString())
      }
    },
    authenticate: genMockFunction(),
    listenToAndRun: genMockFunction(),
    config: {trackingIdPrefix: 'testTrackingIdPrefix'},
    client: {trackingIdBase: 'testTrackingIdBase'},
    credentials: {
      federation: true,
      authorization: {
      }
    },
    internal: {
      device: {
        url: 'https://example.com/devices/1',
        services: {
          roomServiceUrl: 'https://example.com/devices/services/room/1'
        },
        remove: genMockFunction(),
        getServiceUrl: jest.fn(() => ''),
        register: genMockFunction(),
        unregister: genMockFunction()
      },

      encryption: {
        decryptScr: genMockFunction(),
        decryptText: genMockFunction(),
        encryptText: genMockFunction(),
        getUnusedKey: genMockFunction(),
        download: genMockFunction(),
        keystore: {
          clear: genMockFunction()
        },
        kms: {
          prepareRequest: genMockFunction(),
          request: genMockFunction()
        }
      },

      user: {
        activate: genMockFunction(),
        register: genMockFunction()
      },
      mercury: {
        connect: genMockFunction(),
        on: genMockFunction(),
        once: genMockFunction(),
        listen: genMockFunction(),
        listenToAndRun: genMockFunction(),
        stopListening: genMockFunction()
      },

      conversation: {
        assign: genMockFunction(),
        download: genMockFunction(),
        get: genMockFunction(),
        unassign: genMockFunction(),
        update: genMockFunction()
      }
    },


    feature: {
      getFeature: genMockFunction()
    },

    support: {
      submitCallLogs: genMockFunction()
    },

    flagging: {
      flag: genMockFunction(),
      mapToActivities: genMockFunction()
    },

    board: {
      decryptContents: genMockFunction(),
      decryptSingleContent: genMockFunction(),
      encryptContents: genMockFunction(),
      encryptSingleContent: genMockFunction(),
      persistence: {
        ping: genMockFunction(),
        register: genMockFunction(),
        createChannel: genMockFunction(),
        getChannel: genMockFunction(),
        getChannels: genMockFunction(),
        addContent: genMockFunction(),
        addImage: genMockFunction(),
        getAllContent: genMockFunction(),
        deleteContent: genMockFunction(),
        deleteAllContent: genMockFunction()
      },
      realtime: {
        on: genMockFunction(),
        publish: genMockFunction(),
        once: genMockFunction(),
        set: genMockFunction()
      }
    },

    on: genMockFunction(),

    request: genMockFunction(),

    search: {
      search: genMockFunction(),
      people: genMockFunction()
    }
  };

  return spark;
}