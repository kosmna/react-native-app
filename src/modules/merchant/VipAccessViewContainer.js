import { compose, withState } from 'recompose';

import VipAccessScreen from './VipAccessView';
import VipAccessDetailScreen from './VipAccessDetailView';

export default compose(withState('isExtended', 'setIsExtended', false))(
  VipAccessScreen,
  VipAccessDetailScreen,
);
