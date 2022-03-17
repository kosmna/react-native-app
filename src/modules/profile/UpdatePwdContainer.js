import { compose } from 'recompose';
import { connect } from 'react-redux';

import UpdatePwdScreen from './UpdatePwdView';

import { ProfileUpdate } from '../home/HomeState';

export default compose(
    connect(
        state => ({
          userInfo: state.home.userInfo,
        }),
        {
          ProfileUpdate,
        },
      )    
)(
    UpdatePwdScreen,
);
