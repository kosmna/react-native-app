import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation'

import SplashScreen from '../splash/SplashViewContainer'
import MainTabNavigator from './MainTabNavigator'
import ProfileScreen from '../profile/ProfileViewContainer'
import AuthScreen from '../auth/AuthViewContainer'
import CategoryScreen from '../category/CategoryView'
import SearchScreen from '../search/SearchView'
import MapSearchScreen from '../map/MapSearchView'
import FrameScreen from '../frame/FrameViewContainer'

import MerchantScreen from '../merchant/MerchantViewContainer'
import MerchantDetailScreen from '../merchant/MerchantDetailView'
import VipAccessScreen from '../merchant/VipAccessView'
import VipAccessDetailScreen from '../merchant/VipAccessDetailView'
import DealDetailScreen from '../deal/DealDetailView'
import MerchantHelp from '../help/HelpNavigator'
import TripIdeasNavigator from '../tripIdeas/TripIdeasNavigator'
import EventNavigator from '../event/Navigator'

const stackNavigator = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
      navigationOptions: () => ({
        header: null,
      }),
    },
    TripIdeas: {
      screen: TripIdeasNavigator,
      navigationOptions: () => ({
        header: null,
      }),
    },
    Event: {
      screen: EventNavigator,
      navigationOptions: () => ({
        header: null,
      }),
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        title: 'Profile',
      },
    },
    Category: {
      screen: CategoryScreen,
      navigationOptions: {
        header: null
      },
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        header: null
      },
    },
    Map: {
      screen: MapSearchScreen,
      navigationOptions: {
        header: null
      },
    },
    Frame: {
      screen: FrameScreen,
      navigationOptions: {
        header: null
      },
    },
    Merchant: {
      screen: MerchantScreen,
      navigationOptions: {
        header: null
      },
    },
    MerchantDetail: {
      screen: MerchantDetailScreen,
      navigationOptions: {
        header: null
      },
    },
    VipAccess: {
      screen: VipAccessScreen,
      navigationOptions: {
        header: null
      },
    },
    VipAccessDetail: {
      screen: VipAccessDetailScreen,
      navigationOptions: {
        header: null
      },
    },
    DealDetail: {
      screen: DealDetailScreen,
      navigationOptions: {
        header: null
      },
    },
    Auth: {
      screen: AuthScreen,
      navigationOptions: {
        header: null,
      },
    },
    MerchantHelp: {
      screen: MerchantHelp,
      navigationOptions: {
        title: 'Merchant Help',
        header: null
      }
    }
  },
)

const InitialNavigator = createSwitchNavigator({
  // Splash: SplashScreen,
  InitialAuth: AuthScreen,
  App: stackNavigator
})

export default createAppContainer(InitialNavigator)
