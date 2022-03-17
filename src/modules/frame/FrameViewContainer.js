import { compose, withState } from 'recompose';
import { connect } from 'react-redux';

import FrameScreen from './FrameView';

export default compose(
  connect(
    state => ({
      isLogin: state.home.isLogin,
      userInfo: state.home.userInfo,
    }),
  ),
  withState('isExtended', 'setIsExtended', false)
  )(
  FrameScreen,
);
