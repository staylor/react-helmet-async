import React from 'react';
import { vi } from 'vitest';

import { Helmet } from '../../src';

import { render, unmount, getMountElement } from './utils';

vi.mock('../../src/reactVersion', () => ({ isReact19: true }));

afterEach(() => {
  unmount();
});

describe('React 19 – HelmetProvider', () => {
  it('is a transparent passthrough (renders children directly)', () => {
    render(<div data-testid="child">Hello</div>);

    const child = getMountElement().querySelector('[data-testid="child"]');
    expect(child).not.toBeNull();
    expect(child!).toHaveTextContent('Hello');
  });

  it('does not populate context with helmet state', () => {
    const context = {} as any;

    // Render through the provider with context
    render(
      <Helmet>
        <title>Test</title>
      </Helmet>
    );

    // On React 19, context.helmet should not be populated
    // (the provider is a passthrough, no server state is set)
    expect(context.helmet).toBeUndefined();
  });

  it('works without a context prop', () => {
    // Should not throw
    render(<Helmet title="No Context" />);

    const title = getMountElement().querySelector('title');
    expect(title).not.toBeNull();
    expect(title!).toHaveTextContent('No Context');
  });

  it('renders Helmet elements alongside sibling content', () => {
    render(
      <div>
        <Helmet title="Page Title" meta={[{ name: 'description', content: 'A page' }]} />
        <h1>Page Content</h1>
      </div>
    );

    const mount = getMountElement();
    expect(mount.querySelector('title')).not.toBeNull();
    expect(mount.querySelector('meta[name="description"]')).not.toBeNull();
    expect(mount.querySelector('h1')!).toHaveTextContent('Page Content');
  });
});
