import { Component } from 'react';
import shallowEqual from 'shallowequal';

import handleStateChangeOnClient from './client';
import mapStateOnServer from './server';
import { reducePropsToState } from './utils';
import Provider from './Provider';
import type { HelmetServerState } from './types';

export interface DispatcherContextProp {
  setHelmet: (newState: HelmetServerState) => void;
  helmetInstances: {
    get: () => HelmetDispatcher[];
    add: (helmet: HelmetDispatcher) => void;
    remove: (helmet: HelmetDispatcher) => void;
  };
}

interface DispatcherProps {
  context: DispatcherContextProp;
}

export default class HelmetDispatcher extends Component<DispatcherProps> {
  rendered = false;

  shouldComponentUpdate(nextProps: DispatcherProps) {
    return !shallowEqual(nextProps, this.props);
  }

  componentDidUpdate() {
    this.emitChange();
  }

  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState = null;
    const state = reducePropsToState(
      helmetInstances.get().map(instance => {
        const props = { ...instance.props };
        // @ts-ignore
        delete props.context;
        return props;
      })
    );
    if (Provider.canUseDOM) {
      handleStateChangeOnClient(state);
    } else if (mapStateOnServer) {
      serverState = mapStateOnServer(state);
    }
    // @ts-ignore
    setHelmet(serverState);
  }

  // componentWillMount will be deprecated
  // for SSR, initialize on first render
  // constructor is also unsafe in StrictMode
  init() {
    if (this.rendered) {
      return;
    }

    this.rendered = true;

    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }

  render() {
    this.init();

    return null;
  }
}
