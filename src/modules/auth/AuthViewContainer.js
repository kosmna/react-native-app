// @flow
import { compose } from 'recompose';
import { connect } from 'react-redux';

import AuthView from './AuthView';
import { UserLogin } from '../home/HomeState';

export default compose(
    connect(
        state => ({
          isLogin: state.home.isLogin,
          userInfo: state.home.userInfo,
        }),
        {
          UserLogin,
        },
      )    
)(
    AuthView,
);
