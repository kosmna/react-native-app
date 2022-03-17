import { compose, withState } from 'recompose';

import SearchScreen from './MapSearchView';

export default compose(withState('isExtended', 'setIsExtended', false))(
  SearchScreen,
);
