
import _ from 'lodash'
import React from 'react'
import { Image, StyleSheet, Text, Alert, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { createBottomTabNavigator, NavigationActions } from 'react-navigation'
import GogosterScreen from "../gogoster/gogoster"
import ExtendScreen from '../home/ExtendView'
import HomeNavigator from '../home/HomeNavigator'
import MyPointNavigator from '../myPoint/MyPointNavigator'
import ProfileNavigator from '../profile/ProfileNavigator'
import CustomBottomTab from "./CustomBottomTab"
import MeIcon from './MeIcon'

const iconHome = require('../../../assets/images/tabbar/home.png')
const iconMe = require('../../../assets/images/tabbar/me.png')
const iconRewards = require('../../../assets/images/tabbar/rewards.png')
const iconHelp = require('../../../assets/images/tabbar/help.png')
const iconGogoster = require('../../../assets/images/gogoster_icon.png')
const iconExtend = require('../../../assets/images/tabbar/more.png')

const styles = StyleSheet.create({
  tabBarItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarIcon: {
    width: wp(4.4),
    height: wp(4.4),
  },
  tabBarIconFocused: {
    tintColor: '#0093DD',
  },
  tabBarLabel: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    fontSize: wp(3.2)
  },
  tabBarLabelFocused: {
    color: '#0093DD',
  },
  headerContainer: {
    height: hp(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const getScreenRegisteredFunctions = navState => {
  // When we use stack navigators. 
  // Also needed for react-navigation@2
  const { routes, index, params } = navState

  if (navState.hasOwnProperty('index')) {
    return getScreenRegisteredFunctions(routes[index])
  }
  // When we have the final screen params
  else {
    // console.log("params are sent in maintabnavgtr as params = " , params)
    return params
  }
}

const bottomTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: HomeNavigator,
      navigationOptions: {
        header: null,
      },
    },
    Gogoster: {
      screen: GogosterScreen,
      navigationOptions: {
        header: null,
      },
      lazy: false
    },
    Me: {
      screen: ProfileNavigator,
    },
    Rewards: {
      screen: MyPointNavigator,
      navigationOptions: {
        header: null
      },
    },
    More: {
      screen: ExtendScreen
    },
  },
  {
    tabBarComponent: CustomBottomTab, // Custom component to show and hide bottom tab navigator whenever keyboard opens up or closes.
    lazy: false,
    // resetOnBlur: true,
    defaultNavigationOptions: ({ navigation }) => ({

      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state
        let iconSource
        switch (routeName) {
          case 'Home':
            iconSource = iconHome
            break
          case 'Gogoster':
            iconSource = iconGogoster
            break
          case 'Me':
            return <MeIcon focused={focused} horizontal={horizontal} tintColor={tintColor} />
          case 'Rewards':
            iconSource = iconRewards
            break
          case 'Help':
            iconSource = iconHelp
            break
          case 'More':
            iconSource = iconExtend
            break
          default:
            iconSource = iconHelp
        }
        return (
          <View style={styles.tabBarItemContainer}>
            <Image
              resizeMode="contain"
              source={iconSource}
              style={[styles.tabBarIcon, focused && styles.tabBarIconFocused]}
            />
          </View>
        )
      },
      tabBarLabel: ({ focused }) => {
        const { routeName } = navigation.state
        return (
          <Text style={[styles.tabBarLabel, focused && styles.tabBarLabelFocused]}>
            {routeName}
          </Text>
        )
      },
      tabBarOnPress: ({ navigation, defaultHandler }) => {

        // Close Home Webviews if 'Home' tab is pressed.
        if (navigation && navigation.state.routeName === 'Home' && navigation.isFocused()) {
          const screenFunctions = getScreenRegisteredFunctions(navigation.state)

          if (screenFunctions && typeof screenFunctions.close_webview === 'function') {
            screenFunctions.close_webview()
          }
        }

        // Refresh gogoster webview if 'Gogoster' tab is pressed.
        if (navigation && navigation.state.routeName === 'Gogoster' && navigation.isFocused()) {
          const screenFunctions = getScreenRegisteredFunctions(navigation.state)

          if (screenFunctions && typeof screenFunctions.tapOnTabNavigator === 'function') {
            screenFunctions.tapOnTabNavigator()
          }
        }

        // Prevent navigation and show alert if non-logged in user tries to access these tabs.
        if (navigation.state.routeName === 'Me' && navigation.state.routes[0].params && !navigation.state.routes[0].params.userInfo) {
          show_login_alert(navigation)
          return
        }
        else if (navigation.state.routeName === 'Rewards' && navigation.state.routes[0].params && !navigation.state.routes[0].params.userInfo) {
          show_login_alert(navigation)
          return
        }
        else if (navigation.state.routeName === 'More' && navigation.state.params && !navigation.state.params.userInfo) {
          show_login_alert(navigation)
          return
        }
        //

        navigation.popToTop()
        defaultHandler()
      }
    }),
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false
  },
)

const show_login_alert = (navigation) => {
  Alert.alert(
    'Login Now',
    'You need to Login to access this feature',
    [
      {
        text: 'Later', onPress: () => { }
      },
      {
        text: 'Login', onPress: () => {
          navigation.navigate('Auth')
        }
      },
    ],
    { cancelable: false },
  )
}


// const defaultGetStateForAction = bottomTabNavigator.router.getStateForAction

// bottomTabNavigator.router.getStateForAction = (action, state) => {

//   if (
//     state &&
//     action.type === NavigationActions.NAVIGATE &&
//     (state.routes[state.index].routeName === 'Home') &&
//     (action.routeName === 'Me' || action.routeName === 'Rewards' || action.routeName === 'More')
//   ) {

//     // let index = _.findIndex(state.routes[state.index].routes, obj => obj.routeName === 'HomeScreen')
//     let firstScreen = state.routes[state.index].routes[0]

//     if (!firstScreen.params || !firstScreen.params.userInfo) {
//       ToastAndroid.show('You need to Login to use this feature', ToastAndroid.SHORT)

//       // Returning null from getStateForAction means that the action
//       // has been handled/blocked, but there is not a new state
//       return null
//     }
//   }

//   return defaultGetStateForAction(action, state)
// }

export default bottomTabNavigator