import { Provider } from 'react-redux';
import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './src/redux/store';

import AppView from './src/modules/AppViewContainer';
import { MenuProvider } from 'react-native-popup-menu';
import axios from 'axios'


// For debugging. Logs all API call response.
axios.interceptors.response.use(response => {
  console.log('\n%c API Call : %s: \n \n', 'color: #000; font-size: 12px', response.config.url, response.data, '\n \n');
  return response
})

export default class App extends React.Component {

  render() {
    return (
      <Provider store={store} >
        <PersistGate
          loading={
            <View style={styles.container}>
              <ActivityIndicator />
            </View>
          }
          persistor={persistor}
        >
          <MenuProvider>
            <AppView />
          </MenuProvider>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});
