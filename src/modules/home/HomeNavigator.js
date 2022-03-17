import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from './HomeViewContainer';
import CategoryScreen from '../category/CategoryView'
import SearchScreen from '../search/SearchView'
import MapSearchScreen from '../map/MapSearchView'
import FrameScreen from '../frame/FrameViewContainer'
import MerchantScreen from '../merchant/MerchantViewContainer'
import MerchantDetailScreen from '../merchant/MerchantDetailView'
import VipAccessScreen from '../merchant/VipAccessView'
import VipAccessDetailScreen from '../merchant/VipAccessDetailView'
import DealDetailScreen from '../deal/DealDetailView'
import React from 'react';

const HomeNavigator = createStackNavigator({
    HomeScreen: HomeScreen,
    Category: CategoryScreen,
    Search: SearchScreen,
    Map: MapSearchScreen,
    Frame: FrameScreen,
    Merchant: MerchantScreen,
    MerchantDetail: MerchantDetailScreen,
    VipAccess: VipAccessScreen,
    VipAccessDetail: VipAccessDetailScreen,
    DealDetail: DealDetailScreen
}, {
    initialRouteName: 'HomeScreen',
    defaultNavigationOptions: {
        header: null,
        headerTitle: null,
    },
    navigationOptions: {
        header: null
    },
});

export default createAppContainer(HomeNavigator);