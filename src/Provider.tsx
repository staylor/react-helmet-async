import type { PropsWithChildren } from 'react';
import React, { Component } from 'react';

import HelmetData, { isDocument } from './HelmetData';
import { isReact19 } from './reactVersion';
import type { HelmetServerState } from './types';

const defaultValue = {};

export const Context = React.createContext(defaultValue);

interface ProviderProps {
  context?: {
    helmet?: HelmetServerState | null;
  };
}

export default class HelmetProvider extends Component<PropsWithChildren<ProviderProps>> {
  static canUseDOM = isDocument;

  helmetData: HelmetData | null;

  constructor(props: PropsWithChildren<ProviderProps>) {
    super(props);

    // React 19+ handles <head> element hoisting natively, so the provider
    // is a simple passthrough — no need for the HelmetData bookkeeping.
    if (isReact19) {
      this.helmetData = null;
    } else {
      this.helmetData = new HelmetData(this.props.context || {}, HelmetProvider.canUseDOM);
    }
  }

  render() {
    if (isReact19) {
      return <>{this.props.children}</>;
    }

    return (
      <Context.Provider value={this.helmetData!.value}>{this.props.children}</Context.Provider>
    );
  }
}
