import { compose, withState } from 'recompose';

import SearchScreen from './SearchView';

export default compose(withState('isExtended', 'setIsExtended', false))(
  SearchScreen,
);
