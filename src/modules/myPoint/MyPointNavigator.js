
import { createStackNavigator, createAppContainer } from "react-navigation"
import React from 'react'
import {
    View,
    Text
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import MyPointScreen from './MyPointView'
import GiftCard from './giftCard/GiftCardView'
import BookngogoGiftCard from './giftCard/BookngogoGiftCardView'
import BookngogoGiftCardConfirm from './giftCard/BookngogoGiftCardConfirmView'
import GiftCardPaymentMethod from './giftCard/GiftCardPaymentMethodView'
import OtherGiftCard from './giftCard/OtherGiftCardView'
import OtherGiftCardConfirm from './giftCard/OtherGiftCardConfirmView'
import GiftMyCardDetail from './giftCard/GiftMyCardDetailView'
import GiftMyCardMoreDetail from './giftCard/GiftMyCardMoreDetailView'
import OtherGiftCardList from './giftCard/OtherGiftCardListView'
import GiftCardPayment from './giftCard/GiftCardPayment'

import OrgDonate from './givenGoGo/DonateView'
import ExploreOrg from './givenGoGo/ExploreOrgView'
import GivengogoHome from './givenGoGo/GivengogoHomeView'
import LocalOrgList from './givenGoGo/LocalOrgListView'
import OrgCategoryList from './givenGoGo/OrgCategoryListView'
import OrgDetail from './givenGoGo/OrgDetailView'
import SubscriptionView from './givenGoGo/SubscriptionView'

import BookngogoPointView from './bookngogoPointView'
import GogoPointScreen from './GogoPointView'
import MerchantPointDetailScreen from './MerchantPointDetailView'
import TravelPointScreen from './TravelPointView'
import ConvertPointScreen from './ConvertPointView'
import GivengogoPayment from './givenGoGo/GivengogoPayment'

const MyPointNavigator = createStackNavigator({
    MyPointScreen,
    GiftCard,
    BookngogoGiftCard,
    BookngogoGiftCardConfirm,
    GiftCardPaymentMethod,
    OtherGiftCard,
    OtherGiftCardConfirm,
    GiftMyCardDetail,
    GiftMyCardMoreDetail,
    OtherGiftCardList,
    GivengogoHome,
    OrgDonate,
    ExploreOrg,
    LocalOrgList,
    OrgCategoryList,
    OrgDetail,
    SubscriptionView,
    GogoPoint: GogoPointScreen,
    BookngogoPoint: BookngogoPointView,
    MerchantPointDetail: MerchantPointDetailScreen,
    TravelPoint: TravelPointScreen,
    ConvertPoint: ConvertPointScreen,
    GivengogoPayment: GivengogoPayment,
    GiftCardPayment: GiftCardPayment
}, {
    initialRouteName: 'MyPointScreen',
    defaultNavigationOptions: {
        headerTitle: (props) => {
            return (
                <View style={{ flex: 0.9 }}>
                    <Text numberOfLines={1} style={{ fontSize: wp(4), textAlign: 'center' }}>{props.children}</Text>
                </View>
            )
        }
    }
})

export default createAppContainer(MyPointNavigator)