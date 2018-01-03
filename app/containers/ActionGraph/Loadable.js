/**
 *
 * Asynchronously loads the component for ActionGraph
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
