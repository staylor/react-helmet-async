import React from 'react';
import { vi } from 'vitest';

import { Helmet } from '../../src';

import { render, unmount } from './utils';

vi.mock('../../src/reactVersion', () => ({ isReact19: true }));

afterEach(() => {
  unmount();
});

describe('React 19 – body attributes', () => {
  describe('API', () => {
    it('applies body attributes to <body> via DOM manipulation', () => {
      render(
        <Helmet
          bodyAttributes={{
            className: 'test-class',
            id: 'body-id',
          }}
        />
      );

      const bodyTag = document.body;
      expect(bodyTag).toHaveAttribute('class', 'test-class');
      expect(bodyTag).toHaveAttribute('id', 'body-id');
      expect(bodyTag).toHaveAttribute('data-rh-managed', 'class,id');
    });

    it('updates body attributes on re-render', () => {
      render(<Helmet bodyAttributes={{ className: 'first' }} />);

      expect(document.body).toHaveAttribute('class', 'first');

      render(<Helmet bodyAttributes={{ className: 'second' }} />);

      expect(document.body).toHaveAttribute('class', 'second');
    });

    it('removes body attributes that are no longer present', () => {
      render(<Helmet bodyAttributes={{ className: 'test', id: 'myid' }} />);

      expect(document.body).toHaveAttribute('class', 'test');
      expect(document.body).toHaveAttribute('id', 'myid');

      render(<Helmet bodyAttributes={{ className: 'test' }} />);

      expect(document.body).toHaveAttribute('class', 'test');
      expect(document.body).not.toHaveAttribute('id');
    });

    it('cleans up body attributes on unmount', () => {
      render(<Helmet bodyAttributes={{ className: 'test' }} />);

      expect(document.body).toHaveAttribute('class', 'test');

      unmount();

      expect(document.body).not.toHaveAttribute('class');
      expect(document.body).not.toHaveAttribute('data-rh-managed');
    });

    it('inner instance overrides outer instance for conflicting body attributes', () => {
      render(
        <>
          <Helmet bodyAttributes={{ className: 'outer' }} />
          <Helmet bodyAttributes={{ className: 'inner' }} />
        </>
      );

      expect(document.body).toHaveAttribute('class', 'inner');
    });

    it('restores outer instance body attributes when inner instance unmounts', () => {
      render(
        <>
          <Helmet bodyAttributes={{ className: 'outer' }} />
          <Helmet bodyAttributes={{ className: 'inner' }} />
        </>
      );

      expect(document.body).toHaveAttribute('class', 'inner');

      // Simulate unmounting the inner instance by re-rendering with only the outer
      render(<Helmet bodyAttributes={{ className: 'outer' }} />);

      expect(document.body).toHaveAttribute('class', 'outer');
    });
  });

  describe('Declarative API', () => {
    it('applies body attributes from <body> child', () => {
      render(
        <Helmet>
          <body className="test-class" id="body-id" />
        </Helmet>
      );

      const bodyTag = document.body;
      expect(bodyTag).toHaveAttribute('class', 'test-class');
      expect(bodyTag).toHaveAttribute('id', 'body-id');
    });
  });
});
