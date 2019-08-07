declare module 'react-helmet-async' {
  import * as React from 'react';
  import Helmet, { HelmetData } from 'react-helmet';
  export { Helmet };

  export type FilledContext = {
    helmet: HelmetData;
  };

  type ProviderProps = {
    context?: {};
  };

  export class HelmetProvider extends React.Component<ProviderProps> {}
}
