import { compose } from 'recompose';
import { connect } from 'react-redux';

import UserProfile from './UserProfile';

import { PROFILE_UPDATE } from '../home/HomeState';

export default compose(
    connect(
        state => ({
          isLogin: state.home.isLogin,
          userInfo: state.home.userInfo,
        }),
        {
          PROFILE_UPDATE,
        },
      )    
)(
    UserProfile,
);
