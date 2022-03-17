// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import SplashView from './SplashView';

export default compose(
    connect(
        state => ({
          isLogin: state.home.isLogin,
          userInfo: state.home.userInfo,
        }),
        {

        },
      )    
)(
    SplashView,
);