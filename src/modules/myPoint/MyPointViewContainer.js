import { compose, withState } from 'recompose';

import MyPointScreen from './MyPointView';
import GogoPointScreen from './GogoPointView';
import TravelPointScreen from './TravelPointView';
import MerchantPointDetailScreen from './MerchantPointDetailView';

export default compose(withState('isExtended', 'setIsExtended', false))(
  MyPointScreen,
  GogoPointScreen,
  TravelPointScreen,
  MerchantPointDetailScreen
);
