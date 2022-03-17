import { compose, withState } from 'recompose';

import CategoryScreen from './CategoryView';

export default compose(withState('isExtended', 'setIsExtended', false))(
  CategoryScreen,
);
