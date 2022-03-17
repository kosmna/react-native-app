import { compose, lifecycle } from 'recompose';
import { Platform, UIManager, StatusBar } from 'react-native';

import AppView from './AppView';

export default compose(
  lifecycle({
    componentWillMount() {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {

        UIManager.setLayoutAnimationEnabledExperimental &&
          UIManager.setLayoutAnimationEnabledExperimental(true);
      }
    },
  }),
)(AppView);
