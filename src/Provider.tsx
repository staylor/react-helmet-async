import type { PropsWithChildren } from 'react';
import React, { Component } from 'react';
import HelmetData from './HelmetData';
import type { HelmetServerState } from './types';

const defaultValue = {};

export const Context = React.createContext(defaultValue);

interface ProviderProps {
  context: {
    helmet: HelmetServerState;
  };
}

const canUseDOM = typeof document !== 'undefined';

export default class HelmetProvider extends Component<PropsWithChildren<ProviderProps>> {
  static canUseDOM = canUseDOM;

  helmetData: HelmetData;

  constructor(props: ProviderProps) {
    super(props);

    this.helmetData = new HelmetData(this.props.context || {}, HelmetProvider.canUseDOM);
  }

  render() {
    return <Context.Provider value={this.helmetData.value}>{this.props.children}</Context.Provider>;
  }
}
