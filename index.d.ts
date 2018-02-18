declare module 'react-helmet-async' {
  import Helmet, { HelmetData } from 'react-helmet';
  export default Helmet;

  export type FilledContext = {
    helmet: HelmetData;
  };

  type ProviderProps = {
    context?: {};
  };

  export class HelmetProvider extends React.Component<ProviderProps> {}
}
