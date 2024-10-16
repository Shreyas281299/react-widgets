import {DEFAULT_SPACE_COUNT, setup} from './setup';

describe('widget-recents: enhancers: setup', () => {
  let props;

  beforeEach(() => {
    props = {
      basicMode: false,
      mercuryStatus: {
        hasConnected: false,
        connecting: false,
        connected: false
      },
      spacesList: [],
      sparkInstance: {
        internal: {
          device: {
            registered: false
          }
        }
      },
      sparkState: {
        authenticated: false,
        registered: false,
        hasError: false
      },
      users: {
        get: () => 'my-user-id'
      },
      widgetRecents: {
        spaceType: 'all'
      },
      widgetStatus: {
        isFetchingAvatars: false,
        hasFetchedAvatars: false,
        isFetchingInitialSpaces: false,
        hasFetchedInitialSpaces: false,
        isFetchingAllSpaces: false,
        hasFetchedAllSpaces: false,
        hasFetchedGroupMessageNotificationFeature: false,
        hasFetchedMentionNotificationFeature: false
      },
      spacesById: {
        has: jest.fn(() => true),
        get: jest.fn((a) => a)
      },
      // Mocked action creators
      connectToMercury: jest.fn(),
      fetchAvatar: jest.fn(),
      fetchSpaces: jest.fn(() => Promise.resolve()),
      fetchSpacesEncrypted: jest.fn(() => Promise.resolve()),
      fetchSpacesHydra: jest.fn(() => Promise.resolve()),
      getFeature: jest.fn(() => Promise.resolve()),
      updateWidgetStatus: jest.fn()
    };
  });

  describe('#setup', () => {
    describe('initial state', () => {
      it('does not do anything until spark registration', () => {
        setup(props);

        expect(props.connectToMercury).not.toHaveBeenCalled();
        expect(props.updateWidgetStatus).not.toHaveBeenCalled();
        expect(props.getFeature).not.toHaveBeenCalled();
      });
    });

    describe('after spark registration', () => {
      beforeEach(() => {
        props.sparkState.authenticated = true;
        props.sparkState.registered = true;
        props.sparkInstance.internal.device.registered = true;
      });

      it('does not do any requests on error state', () => {
        props.sparkState.hasError = true;
        setup(props);

        expect(props.connectToMercury).not.toHaveBeenCalled();
        expect(props.updateWidgetStatus).not.toHaveBeenCalled();
        expect(props.getFeature).not.toHaveBeenCalled();
      });

      it('gets feature flags', () => {
        setup(props);

        expect(props.getFeature).toHaveBeenCalled();
      });

      it('does not get feature flags after initial fetch', () => {
        props.widgetStatus.hasFetchedGroupMessageNotificationFeature = true;
        props.widgetStatus.hasFetchedMentionNotificationFeature = true;

        setup(props);

        expect(props.getFeature).not.toHaveBeenCalled();
      });

      it('connects to websockets', () => {
        setup(props);

        expect(props.connectToMercury).toHaveBeenCalled();
      });
    });

    describe('after websocket connect', () => {
      beforeEach(() => {
        props.sparkState.authenticated = true;
        props.sparkState.registered = true;
        props.sparkInstance.internal.device.registered = true;

        props.mercuryStatus.connected = true;

        props.widgetStatus.hasFetchedGroupMessageNotificationFeature = true;
        props.widgetStatus.hasFetchedMentionNotificationFeature = true;
      });

      describe('with basic mode enabled', () => {
        beforeEach(() => {
          props.basicMode = true;
        });

        it('should get initial spaces from hydra', () => {
          setup(props);

          expect(props.fetchSpacesHydra).toHaveBeenCalled();
        });

        it('should set hasFetchedInitialSpaces to true after load', async () => {
          await setup(props);

          expect(props.updateWidgetStatus.mock.calls[1][0].hasFetchedInitialSpaces).toBe(true);
        });

        it('should set hasFetchedAllSpaces to true after load', async () => {
          await setup(props);

          expect(props.updateWidgetStatus.mock.calls[1][0].hasFetchedAllSpaces).toBe(true);
        });

        it('should load the amount based on spaceLoadCount', () => {
          props.spaceLoadCount = 10;

          setup(props);
          const fetchConfig = props.fetchSpacesHydra.mock.calls[0][1];

          expect(fetchConfig.max).toBe(10);
        });

        it('should default the amount if not provided by spaceLoadCount to DEFAULT_SPACE_COUNT', () => {
          props.spaceLoadCount = '';

          setup(props);
          const fetchConfig = props.fetchSpacesHydra.mock.calls[0][1];

          expect(fetchConfig.max).toBe(DEFAULT_SPACE_COUNT);
        });
      });
    });

    describe('after initial space fetch', () => {
      beforeEach(() => {
        // SDK Register
        props.sparkState.authenticated = true;
        props.sparkState.registered = true;
        props.sparkInstance.internal.device.registered = true;
        // Websocket
        props.mercuryStatus.connected = true;
        // Initial Fetch
        props.widgetStatus.isFetchingInitialSpaces = true;
        props.widgetStatus.hasFetchedInitialSpaces = true;
      });

      it('should not get all spaces again during all space load', () => {
        props.widgetStatus.isFetchingAllSpaces = true;
        setup(props);

        expect(props.fetchSpaces).not.toHaveBeenCalled();
      });

      it('should not get all spaces again after all space load', () => {
        props.widgetStatus.hasFetchedAllSpaces = true;
        setup(props);
        expect(props.fetchSpaces).not.toHaveBeenCalled();
      });

      it('should not get all spaces in basic mode', () => {
        props.basicMode = true;
        setup(props);
        expect(props.fetchSpaces).not.toHaveBeenCalled();
      });
    });

    describe('after all space fetch', () => {
      beforeEach(() => {
        // SDK Register
        props.sparkState.authenticated = true;
        props.sparkState.registered = true;
        props.sparkInstance.internal.device.registered = true;
        // Websocket
        props.mercuryStatus.connected = true;
        // Initial Fetch
        props.widgetStatus.isFetchingInitialSpaces = true;
        props.widgetStatus.hasFetchedInitialSpaces = true;
        // All Space Fetch
        props.widgetStatus.isFetchingAllSpaces = true;
        props.widgetStatus.hasFetchedAllSpaces = true;
        props.spacesList = [
          {
            isDecrypting: false,
            participants: [
              {
                id: 'abc123'
              },
              {
                id: 'my-user-id'
              }
            ],
            type: 'direct'
          },
          {
            isDecrypting: false,
            participants: [
              {
                id: 'abc123'
              },
              {
                id: 'my-user-id'
              }
            ],
            type: 'group'
          },
          {
            isDecrypting: true,
            type: 'group'
          }
        ];
      });

      it('should get all avatars', () => {
        setup(props);

        expect(props.fetchAvatar).toHaveBeenCalled();
      });

      it('should not get all avatars again during all avatar load', () => {
        props.widgetStatus.isFetchingAvatars = true;
        setup(props);

        expect(props.fetchAvatar).not.toHaveBeenCalled();
      });

      it('should not get all avatars again after all avatar load', () => {
        props.widgetStatus.hasFetchedAvatars = true;
        setup(props);

        expect(props.fetchAvatar).not.toHaveBeenCalled();
      });
    });
  });
});