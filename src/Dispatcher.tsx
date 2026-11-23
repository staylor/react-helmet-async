import { PureComponent } from 'react';

import Provider from './Provider';
import handleStateChangeOnClient from './client';
import mapStateOnServer from './server';
import type { HelmetServerState, MappedServerState } from './types';
import { reducePropsToState } from './utils';

export interface DispatcherContextProp {
  setHelmet: (newState: HelmetServerState | null) => void;
  helmetInstances: {
    get: () => HelmetDispatcher[];
    add: (helmet: HelmetDispatcher) => void;
    remove: (helmet: HelmetDispatcher) => void;
  };
}

interface DispatcherProps {
  context: DispatcherContextProp;
}

export default class HelmetDispatcher extends PureComponent<DispatcherProps> {
  registered = false;

  componentDidMount() {
    this.register();
  }

  componentDidUpdate() {
    this.emitChange();
  }

  // Also runs when a <Suspense> boundary hides this instance again to show its fallback;
  // componentDidMount runs once the boundary shows it again.
  componentWillUnmount() {
    if (!this.registered) {
      return;
    }

    this.registered = false;

    const { helmetInstances } = this.props.context;
    helmetInstances.remove(this);
    this.emitChange();
  }

  emitChange() {
    const { helmetInstances, setHelmet } = this.props.context;
    let serverState: HelmetServerState | null = null;
    const state = reducePropsToState(
      helmetInstances.get().map((instance) => {
        const { context: _context, ...props } = instance.props as DispatcherProps &
          Record<string, unknown>;
        return props;
      })
    );
    if (Provider.canUseDOM) {
      handleStateChangeOnClient(state);
    } else if (mapStateOnServer) {
      serverState = mapStateOnServer(state as MappedServerState) as unknown as HelmetServerState;
    }
    setHelmet(serverState);
  }

  register() {
    if (this.registered) {
      return;
    }

    this.registered = true;

    const { helmetInstances } = this.props.context;
    helmetInstances.add(this);
    this.emitChange();
  }

  render() {
    // In the browser, instances register in componentDidMount: React can throw a render away
    // without committing it, as when a sibling suspends, and then componentWillUnmount never
    // runs to remove the instance. A server render never mounts, so there it happens here.
    if (!Provider.canUseDOM) {
      this.register();
    }

    return null;
  }
}
