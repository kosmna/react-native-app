import MyCards from '../myCards/myCards'
import AddCard from '../myCards/addCard'
import EditCard from '../myCards/editCard'
import GogoCard from '../myCards/gogoCard'
import AddBankAccount from '../myCards/addBankAccount'
import GogoCardApply from '../myCards/gogoCardApply'
import ActivateCard from '../myCards/activateCard'
import SuspendCard from '../myCards/suspendCard'
import BankCustomerCreate from '../myCards/bankCustomerCreate'
import ProfileScreen from './ProfileViewContainer'
import { createStackNavigator, createAppContainer } from "react-navigation"
import Notifications from './Notifications'
import MySearches from './mySearches'

import React from 'react'
import {
    View,
} from 'react-native'

import { Text } from '../../components/StyledText'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import UserProfile from './UserProfileContainer'
// import UpdatePwdScreen from './UpdatePwdContainer';
import CoTraveller from './CoTraveller'
import EditCoTraveller from './EditCoTraveller'
import AddCoTraveller from './AddCoTraveller'
import ReferEarn from './ReferEarn'
import TripsScreen from './MyTrips'
import ChangePassword from './UpdatePwdContainer'
import SavedSearchWebview from './SavedSearchWebview'
import MyDeals from './MyDeals'
import MyDealsWebview from './MyDealsWebview'



const ProfileNavigator = createStackNavigator({
    ProfileScreen: ProfileScreen,
    MyCards: MyCards,
    AddCard: AddCard,
    EditCard: EditCard,
    GogoCard: GogoCard,
    GogoCardApply: GogoCardApply,
    ActivateCard: ActivateCard,
    SuspendCard: SuspendCard,
    UserProfile: UserProfile,
    CoTraveller: CoTraveller,
    EditCoTraveller: EditCoTraveller,
    AddCoTraveller: AddCoTraveller,
    ReferEarn: ReferEarn,
    Notifications: Notifications,
    TripsScreen: TripsScreen,
    ChangePassword: ChangePassword,
    MySearches: MySearches,
    SavedSearchWebview: SavedSearchWebview,
    MyDeals: MyDeals,
    MyDealsWebview: MyDealsWebview,
    BankCustomerCreate: BankCustomerCreate,
    AddBankAccount: AddBankAccount
}, {
    initialRouteName: 'ProfileScreen',
    defaultNavigationOptions: {
        // Use default Navigation Bar, handles both ios and android back button functionality correctly
        headerTitle: (props) => {
            return (
                <View style={{ flex: 0.9 }}>
                    <Text style={{ fontSize: wp(4), textAlign: 'center' }}>{props.children}</Text>
                </View>
            )
        }
    }
})

export default createAppContainer(ProfileNavigator)