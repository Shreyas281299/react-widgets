import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {autobind} from 'core-decorators';
import {getDisplayName} from '@webex/react-component-utils';

import styles from './styles.css';

const propTypes = {
  onScroll: PropTypes.func
};

const defaultProps = {
  onScroll: () => {}
};

export default function injectScrollable(WrappedComponent) {
  class ScrollableComponent extends Component {
    shouldComponentUpdate(nextProps) {
      return nextProps !== this.props;
    }

    @autobind
    getNode(node) {
      this.node = node;
    }

    getScrollHeight() {
      return this.node.scrollHeight;
    }

    getScrollTop() {
      return this.node.scrollTop;
    }

    setScrollTop(top) {
      this.node.scrollTop = top;
    }

    scrollToBottom() {
      const {node} = this;

      node.scrollTop = node.scrollHeight;
    }

    isScrolledToTop() {
      return this.node.scrollTop < 100;
    }

    isScrolledToBottom() {
      const {node} = this;

      return node.scrollHeight - node.offsetHeight - node.scrollTop < 150;
    }

    render() {
      return (
        <div className={styles.scrollable} onScroll={this.props.onScroll} ref={this.getNode}>
          <WrappedComponent {...this.props} />
        </div>
      );
    }
  }

  ScrollableComponent.propTypes = propTypes;
  ScrollableComponent.defaultProps = defaultProps;

  ScrollableComponent.displayName = `ScrollableComponent(${getDisplayName(WrappedComponent)})`;
  ScrollableComponent.WrappedComponent = WrappedComponent;

  return ScrollableComponent;
}
