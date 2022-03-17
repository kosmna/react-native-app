import { compose, withState } from 'recompose';
import { connect } from 'react-redux';

import MerchantScreen from './MerchantView';
import MerchantDetailScreen from './MerchantDetailView';

export default compose(
  connect(
    state => ({
      isLogin: state.home.isLogin,
      userInfo: state.home.userInfo,
    }),
  ),
  withState('isExtended', 'setIsExtended', false)
  )(
  MerchantScreen,
  MerchantDetailScreen,
);
