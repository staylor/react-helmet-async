import React from 'react';
import { vi } from 'vitest';

import { Helmet } from '../../src';

import { render, unmount, getMountElement } from './utils';

vi.mock('../../src/reactVersion', () => ({ isReact19: true }));

afterEach(() => {
  unmount();
});

describe('React 19 – title', () => {
  describe('API', () => {
    it('renders a <title> element', () => {
      render(<Helmet title="Test Title" />);

      const title = getMountElement().querySelector('title');
      expect(title).not.toBeNull();
      expect(title!).toHaveTextContent('Test Title');
    });

    it('uses defaultTitle when title is not provided', () => {
      render(<Helmet defaultTitle="Fallback Title" />);

      const title = getMountElement().querySelector('title');
      expect(title).not.toBeNull();
      expect(title!).toHaveTextContent('Fallback Title');
    });

    it('prefers title over defaultTitle', () => {
      render(<Helmet defaultTitle="Fallback" title="Actual Title" />);

      const title = getMountElement().querySelector('title');
      expect(title).not.toBeNull();
      expect(title!).toHaveTextContent('Actual Title');
    });

    it('applies titleTemplate', () => {
      render(<Helmet title="My Page" titleTemplate="Site Name - %s" />);

      const title = getMountElement().querySelector('title');
      expect(title).not.toBeNull();
      expect(title!).toHaveTextContent('Site Name - My Page');
    });

    it('replaces multiple %s in titleTemplate', () => {
      render(<Helmet title="Test" titleTemplate="%s | %s" />);

      const title = getMountElement().querySelector('title');
      expect(title!).toHaveTextContent('Test | Test');
    });

    it('uses defaultTitle when title is empty and titleTemplate is set', () => {
      render(<Helmet defaultTitle="Fallback" title="" titleTemplate="Template: %s" />);

      const title = getMountElement().querySelector('title');
      expect(title).not.toBeNull();
      expect(title!).toHaveTextContent('Fallback');
    });

    it('renders dollar characters in title correctly with titleTemplate', () => {
      render(<Helmet title="te$t te$$t" titleTemplate="This is a %s" />);

      const title = getMountElement().querySelector('title');
      expect(title!).toHaveTextContent('This is a te$t te$$t');
    });

    it('does not render <title> when no title or defaultTitle is given', () => {
      render(<Helmet meta={[{ name: 'description', content: 'test' }]} />);

      const title = getMountElement().querySelector('title');
      expect(title).toBeNull();
    });
  });

  describe('Declarative API', () => {
    it('renders a <title> from children', () => {
      render(
        <Helmet>
          <title>Declarative Title</title>
        </Helmet>
      );

      const title = getMountElement().querySelector('title');
      expect(title).not.toBeNull();
      expect(title!).toHaveTextContent('Declarative Title');
    });

    it('handles title children with expressions', () => {
      const value = 'Dynamic';
      render(
        <Helmet>
          <title>Title: {value}</title>
        </Helmet>
      );

      const title = getMountElement().querySelector('title');
      expect(title!).toHaveTextContent('Title: Dynamic');
    });

    it('applies titleTemplate with declarative title', () => {
      render(
        <Helmet titleTemplate="Site - %s">
          <title>Page</title>
        </Helmet>
      );

      const title = getMountElement().querySelector('title');
      expect(title!).toHaveTextContent('Site - Page');
    });
  });
});
