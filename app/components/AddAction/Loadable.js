/**
 *
 * Asynchronously loads the component for AddAction
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
