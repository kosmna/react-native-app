import { compose, withState } from 'recompose';
import { connect } from 'react-redux';

import HomeScreen from './HomeView';
import { UserLogin, UserLogout } from './HomeState';

export default compose(
  connect(
    state => ({
      isLogin: state.home.isLogin,
      userInfo: state.home.userInfo,
    }),
    {
      UserLogin,
      UserLogout,
    },
),
  withState('isExtended', 'setIsExtended', false)
)(
  HomeScreen,
);
