import React from 'react';

import { Helmet } from '../../src';

function MetaPage() {
  return (
    <Helmet>
      <title>E2E Test Page</title>
      <meta charSet="utf-8" />
      <meta name="description" content="E2E test description" />
      <meta property="og:title" content="E2E OG Title" />
      <link rel="canonical" href="https://example.com/e2e" />
      <link rel="stylesheet" href="/test.css" type="text/css" />
      <base href="https://example.com/" />
      <style type="text/css">{`body { background: red; }`}</style>
      <script type="application/ld+json">{`{"@context":"http://schema.org"}`}</script>
      <noscript>{`<link rel="stylesheet" href="/noscript.css" />`}</noscript>
      <html lang="en" className="e2e-html" />
      <body className="e2e-body" data-page="meta" />
    </Helmet>
  );
}

function TitleTemplatePage() {
  return (
    <>
      <Helmet titleTemplate="Site Name - %s" defaultTitle="Site Name">
        <title>Templated</title>
      </Helmet>
      <div id="title-template-content">Title Template Page</div>
    </>
  );
}

function ApiPage() {
  return (
    <Helmet
      title="API Title"
      meta={[
        { name: 'robots', content: 'noindex' },
        { property: 'og:url', content: 'https://example.com/api' },
      ]}
      link={[{ rel: 'canonical', href: 'https://example.com/api' }]}
    >
      <html lang="fr" />
      <body className="api-body" />
    </Helmet>
  );
}

function NestedPage() {
  return (
    <div>
      <Helmet>
        <title>Outer Title</title>
        <meta name="description" content="Outer description" />
      </Helmet>
      <div>
        <Helmet>
          <title>Inner Title</title>
          <meta name="description" content="Inner description" />
          <meta name="keywords" content="inner,nested" />
        </Helmet>
      </div>
    </div>
  );
}

type Page = 'meta' | 'title-template' | 'api' | 'nested';

function getPage(): Page {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    return (params.get('page') as Page) || 'meta';
  }
  return 'meta';
}

export function App({ page: serverPage }: { page?: Page }) {
  const page = serverPage || getPage();
  return (
    <div id="app">
      {page === 'meta' && <MetaPage />}
      {page === 'title-template' && <TitleTemplatePage />}
      {page === 'api' && <ApiPage />}
      {page === 'nested' && <NestedPage />}
      <p id="page-indicator">{page}</p>
    </div>
  );
}

export type { Page };
export default App;
