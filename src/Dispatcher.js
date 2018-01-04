import { Component } from 'react';
import shallowEqual from 'shallowequal';
import handleStateChangeOnClient from './client';
import mapStateOnServer from './server';
import { reducePropsToState } from './utils';
import Provider, { providerShape } from './Provider';

export default class Dispatcher extends Component {
  static contextTypes = providerShape;

  shouldComponentUpdate(nextProps) {
    return !shallowEqual(nextProps, this.props);
  }

  emitChange() {
    const { helmetInstances, setHelmet } = this.context;
    let serverState = null;
    const state = reducePropsToState(helmetInstances.get().map(instance => instance.props));
    if (Provider.canUseDOM) {
      handleStateChangeOnClient(state);
    } else if (mapStateOnServer) {
      serverState = mapStateOnServer(state);
    }
    setHelmet(serverState, state);
  }

  componentWillMount() {
    const { helmetInstances } = this.context;
    helmetInstances.add(this);
    this.emitChange();
  }

  componentDidUpdate() {
    this.emitChange();
  }

  componentWillUnmount() {
    const { helmetInstances } = this.context;
    helmetInstances.remove(this);
    this.emitChange();
  }

  render() {
    return null;
  }
}
