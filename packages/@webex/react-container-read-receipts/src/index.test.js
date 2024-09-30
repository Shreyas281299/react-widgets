import React from 'react';
import renderer from 'react-test-renderer';
import {reducers} from '@webex/widget-message';
import {withInitialState} from '@webex/webex-widget-base';

import ReadReceipts from '.';

describe('ReadReceipts container', () => {
  it('renders properly', () => {
    const ReadReceiptsComponent = withInitialState({reducers})(ReadReceipts);
    const component = renderer.create(
      <ReadReceiptsComponent />
    );

    expect(component).toMatchSnapshot();
  });
});
