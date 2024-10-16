# Webex Base Widget _(@webex/webex-widget-base)_

> This base React component does the initial React, Webex authentication, and Redux setup for all Webex widgets.

## Usage

There are a number of ways to use our `webex-widget-base` repo to begin developing your own widget on the Webex platform.

> **IMPORTANT NOTE**: In order to authenticate to Webex, the resulting components require an `accessToken` or `guestToken` prop that you must provide when instantiating your widget. Please see the [Authentication Section](#authentication)

### Quick Start

To automatically setup Webex connections, and register your widget into the global browser store, you can use the `webexWidgetBase` enhancer like so:

``` js
import webexWidgetBase from '@webex/webex-widget-base';

function MyWidget(props) {
  return <div>My Widget</div>;
}


export default webexWidgetBase('myWidget', MyWidget);
```

### Widgets using Redux

If you are also using `redux` for state management and want to provide your own reducers, import and use the `constructWebexEnhancer` higher order component instead:

``` js
import React, {Component} from 'react';
import {constructWebexEnhancer} from '@webex/webex-widget-base';

import reducers from './reducer';

class MyWidget extends Component {
  render() {
    return <div>My Widget's name is {this.props.displayName}</div>
  }
}

export default constructWebexEnhancer({
  name: 'myWidget',
  reducers
})(MyWidget);
```

By constructing your component like this, the constructor will combine your reducers with internal webex reducers and update your store with a `react-redux` `<Provider />`. This will allow you to `connect()` any child components and gain access to the store.

### Authentication

In order to authenticate to Webex, you must provide the resulting React Components with an `accessToken` prop.
This can be done programatically like so:

``` js
import MyWidget from './MyWidget';

class MyApp extends Component {
  render() {
    return <MyWidget accessToken={this.getState().accessToken} />;
  }
}

```

The widgets also support guest tokens in the form of JWT. To provide a guest token to authenticate, use the `guestToken` prop.

### SDK Instance

In addition to `accessToken` or `guestToken`, the widgets can accept the property `sdkInstance`.
This is a [Webex SDK](https://developer.webex.com/docs/sdks/browser) instance that has already been created and authenticated.
The SDK requires certain plugins to be loaded in order for the widgets to function properly:

* authorization
* logger
* meetings
* people
* rooms
* internal.conversation
* internal.feature
* internal.flag
* internal.mercury
* internal.presence
* internal.search
* internal.team

## Advance Usage

When your widget instantiates, it will get receive props from our main store. Some of the data and functions you will have access to:

- `sparkState`: an object that will provide you with device registration and authentication states
- `sparkInstance`: the `webex` object that is provided by the [Webex JS SDK](https://github.com/webex/webex-js-sdk/). You can use this object to interact with Webex APIs as the authenticated user.

### Additional Enhancers

This package also provides some additional enhancers to make your widget setup a bit easier:

- `withInitialState` (_default_): Establishes widget initial states with Redux and injects the React-Redux store `Provider` component
- `withBrowserGlobals` (_default_): Enables widgets to be instantiated globally using `window.webex.widget(el).widgetName` ([usage example](https://github.com/webex/react-widgets/tree/master/packages/@webex/widget-space#browser-globals))
- `withDataAPI` (_default_): Enables widgets to be instantiated using a data API ([usage example](https://github.com/webex/react-widgets/tree/master/packages/@webex/widget-space#data-api))
- `withIntl`: A helper for enabling [react-intl](https://github.com/yahoo/react-intl) in your widget. You can pass a config object that will make intl available to you: `{locale: 'en', messages}`

To use any of these enhancers you can apply them directly to a Component: `withIntl(MyComponent)`.
Or you can compose them using a libary like [recompose](https://github.com/acdlite/recompose):

``` js
import {compose} from 'recompose';
import {
  withIntl
} from '@webex/webex-widget-base';
import {MyWidget} from './MyWidget';

const MyWrappedWidget = compose(
  withIntl()
)(MyWidget);
```