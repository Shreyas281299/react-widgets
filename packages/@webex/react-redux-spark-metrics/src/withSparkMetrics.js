import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {autobind} from 'core-decorators';
import {wrapDisplayName} from 'recompose';

import {
  deleteMetric,
  storeMetric,
  addToQueue,
  clearQueue,
  updateMetricsStatus
} from './actions';
import events from './metrics-events';

const NS = 'webex-widget-';


export default function withSparkMetrics(widgetName) {
  const defaultFields = {
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    widgetVersion: process.env.REACT_WEBEX_VERSION,
    iteration: 0
  };

  const defaultTags = {
    widgetName
  };

  return (BaseComponent) => {
    /* eslint-disable-reason need to refactor before adding default props */
    /* eslint-disable react/require-default-props */
    const injectedProps = {
      sparkInstance: PropTypes.object,
      sparkState: PropTypes.object,
      metricsStore: PropTypes.object,
      updateMetricsStatus: PropTypes.func,
      deleteMetric: PropTypes.func,
      storeMetric: PropTypes.func,
      addToQueue: PropTypes.func,
      clearQueue: PropTypes.func
    };


    class InjectSparkMetrics extends Component {
      static formatMetricData({
        data, action, event, fields, tags
      }) {
        return {
          type: ['operational'],
          tags: Object.assign({}, defaultTags, {
            action,
            event
          }, tags),
          fields: Object.assign({}, defaultFields, {
            data
          }, fields)
        };
      }

      constructor(props) {
        super(props);
        this.startTime = window.performance.now();
      }

      componentWillMount() {
        this.sendStartMetric({
          ...events.WIDGET_LOAD,
          data: this.startTime
        });
      }

      componentWillReceiveProps(nextProps) {
        // Try to send queue on every load if there is something to send
        this.sendQueue(nextProps);
      }

      shouldComponentUpdate() {
        return true;
      }

      componentWillUnmount() {
        this.sendElapsedTime(events.WIDGET_UNMOUNT);
      }

      @autobind
      canSendMetric() {
        const {
          sparkInstance,
          sparkState
        } = this.props;

        return sparkInstance && sparkState.get('authenticated') && sparkState.get('registered');
      }


      @autobind
      hasQueuedMetrics() {
        const {
          metricsStore
        } = this.props;

        return metricsStore && metricsStore.get('queue').count();
      }


      @autobind
      sendMetric(metric) {
        const {props} = this;
        const {sparkInstance} = props;
        const {
          resource
        } = metric;
        const formattedData = InjectSparkMetrics.formatMetricData(metric);

        if (this.canSendMetric()) {
          try {
            return sparkInstance.internal.metrics
              .submitClientMetrics(`${NS}${resource}`, formattedData);
          }
          catch (e) {
            // Don't do anything
          }
        }

        return props.addToQueue(metric);
      }

      @autobind
      sendElapsedTime(metric) {
        if (metric) {
          const updatedMetric = Object.assign({}, metric);

          updatedMetric.data = window.performance.now() - this.startTime;

          return this.sendMetric(updatedMetric);
        }

        return Promise.resolve();
      }

      @autobind
      sendSavedMetric(metricName) {
        const {props} = this;
        const {
          metricsStore
        } = props;
        const metric = metricsStore.getIn(['items', metricName]);

        if (metric) {
          return this.sendMetric(metric.toJS())
            .then(() => props.deleteMetric(metricName));
        }

        return false;
      }

      @autobind
      sendQueue(props) {
        const {
          canSendMetric,
          hasQueuedMetrics,
          sendMetric
        } = this;
        const {
          metricsStore
        } = props;

        if (canSendMetric() && hasQueuedMetrics() && !metricsStore.getIn(['status', 'isSendingQueue'])) {
          props.updateMetricsStatus({isSendingQueue: true});

          return Promise.all(metricsStore.get('queue')
            .map((metric) => sendMetric(metric.toJS())))
            .then(() => {
              props.clearQueue();

              return props.updateMetricsStatus({isSendingQueue: false});
            });
        }

        return Promise.resolve();
      }

      @autobind
      sendStartMetric(metric) {
        const computedMetric = Object.assign({}, {
          action: 'start',
          data: window.performance.now()
        }, metric);
        const metricName = [metric.resource, metric.event, 'start'].join(':');

        this.props.storeMetric(metricName, computedMetric);

        return this.sendMetric(computedMetric);
      }

      @autobind
      sendEndMetric(metric) {
        // Grab end timestamp
        const end = window.performance.now();
        // Check for starting time
        const startName = [metric.resource, metric.event, 'start'].join(':');
        const start = this.props.metricsStore.getIn(['items', startName, 'data']);

        if (start) {
          // construct and send end metric
          const endMetric = Object.assign({}, {
            action: 'end',
            data: end
          }, metric);
          const sendEnd = this.sendMetric(endMetric);

          // construct and send duration metric
          const durationMetric = Object.assign({}, {
            action: 'duration',
            data: end - start
          }, metric);
          const sendDuration = this.sendMetric(durationMetric);

          this.props.deleteMetric(startName);

          return Promise.all([sendEnd, sendDuration]);
        }

        return Promise.resolve();
      }

      render() {
        const {
          sendQueue,
          sendMetric,
          sendElapsedTime,
          sendStartMetric,
          sendEndMetric
        } = this;

        const metrics = {
          sendQueue,
          sendMetric,
          sendElapsedTime,
          sendStartMetric,
          sendEndMetric
        };

        return <BaseComponent {...this.props} metrics={metrics} />;
      }
    }

    InjectSparkMetrics.propTypes = injectedProps;
    InjectSparkMetrics.displayName = wrapDisplayName(BaseComponent, 'withSparkMetrics');

    return connect(
      (state) => ({
        metricsStore: state.metricsStore,
        sparkInstance: state.spark.get('spark'),
        sparkState: state.spark.get('status')
      }),
      (dispatch) => bindActionCreators({
        deleteMetric,
        storeMetric,
        addToQueue,
        clearQueue,
        updateMetricsStatus
      }, dispatch)
    )(InjectSparkMetrics);
  };
}