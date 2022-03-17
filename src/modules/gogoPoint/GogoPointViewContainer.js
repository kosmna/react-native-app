import { compose, withState } from 'recompose';

import GogoPointScreen from './GogoPointView';

export default compose(withState('isExtended', 'setIsExtended', false))(
  GogoPointScreen,
);
