

import React from 'react'
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    ToastAndroid,
    Alert
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Text } from '../../../components/StyledText'
import Loading from '../../../components/Loading'
import { BackendUrl, Authentication } from '../../backend/constants'
import axios from 'axios'
import _ from 'lodash'
import SwitchToggle from '@dooboo-ui/native-switch-toggle'
import moment from 'moment'


export default class ExploreOrgScreen extends React.Component {

    static navigationOptions = {
        title: 'Subscriptions'
    }

    state = {
        userInfo: this.props.navigation.getParam('userInfo'),
        partner_id: this.props.navigation.getParam('userInfo').partner_id,
        partner_referral_code: this.props.navigation.getParam('userInfo').partner_referral_code,
        loading: true,
        subscription_type_data: {
            "one_time": "One Time",
            "monthly": "Monthly",
            "quarterly": "Quarterly",
            "halfyearly": "Halfyearly",
            "annualy": "Annualy"
        }
    }

    componentDidMount() {
        this.get_subscription_list()
    }

    get_subscription_list = () => {
        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.state.partner_referral_code,
            'partner_id': this.state.partner_id,
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/bnggivengogosubscriptionlist' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                if (data.success) {
                    this.setState({ givengogo_subscription_list: data.givengogo_subscription_list, loading: false })
                }
                else
                    ToastAndroid.show('API Error', ToastAndroid.SHORT)
            })
            .catch(function (error) {
                ToastAndroid.show('API Error' + error, ToastAndroid.SHORT)
            })
    }

    render() {

        if (this.state.loading)
            return <Loading />

        let subscription_list = []
        let givengogo_subscription_list = JSON.parse(JSON.stringify(this.state.givengogo_subscription_list))

        givengogo_subscription_list.forEach((subscription, index) => {
            subscription_list.push(
                <View key={index} style={{ borderRadius: wp(1), marginVertical: hp(1), marginHorizontal: wp(4), paddingHorizontal: wp(4), paddingVertical: hp(2), elevation: wp(1), backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <SwitchToggle
                            containerStyle={{
                                width: wp(10),
                                borderRadius: wp(10),
                                backgroundColor: '#ccc',
                                padding: 2,
                            }}
                            circleStyle={{
                                width: wp(5),
                                height: wp(5),
                                borderRadius: wp(10),
                                backgroundColor: 'white', // rgb(102,134,205)
                            }}
                            switchOn={subscription.is_active}
                            onPress={() => {

                                if (subscription.is_active) {
                                    Alert.alert(
                                        'Deactivate Subscription?',
                                        'Donation will be stopped for ' + subscription.merchant_name,
                                        [
                                            {
                                                text: 'Cancel',
                                                onPress: () => { },
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'OK', onPress: () => {
                                                    let arr_index = _.findIndex(givengogo_subscription_list, (obj) => obj.merchant_id == subscription.merchant_id)

                                                    givengogo_subscription_list[arr_index].is_active = !givengogo_subscription_list[arr_index].is_active
                                                    this.setState({ givengogo_subscription_list: givengogo_subscription_list })
                                                }
                                            },
                                        ],
                                        { cancelable: false },
                                    )
                                }
                                else {
                                    Alert.alert(
                                        'Activate Subscription?',
                                        'You will start donating to ' + subscription.merchant_name,
                                        [
                                            {
                                                text: 'Cancel',
                                                onPress: () => { },
                                                style: 'cancel',
                                            },
                                            {
                                                text: 'OK', onPress: () => {
                                                    let arr_index = _.findIndex(givengogo_subscription_list, (obj) => obj.merchant_id == subscription.merchant_id)

                                                    givengogo_subscription_list[arr_index].is_active = !givengogo_subscription_list[arr_index].is_active
                                                    this.setState({ givengogo_subscription_list: givengogo_subscription_list })
                                                }
                                            },
                                        ],
                                        { cancelable: false },
                                    )
                                }

                            }}
                            circleColorOff="white"
                            circleColorOn="green"
                            duration={200}
                        />
                        <Text style={{ flex: 0.5, fontSize: wp(3.5) }}>{subscription.merchant_name}</Text>
                        <Text style={{ fontSize: wp(3.5), fontWeight: 'bold' }}>${subscription.amount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: hp(3) }}>
                        <Text style={{ fontSize: wp(3.2) }}>{moment(subscription.start_date).format("MMMM Do YYYY")}</Text>
                        <Text style={{ fontSize: wp(3.5), fontWeight: 'bold' }}>{this.state.subscription_type_data[subscription.type]}</Text>
                    </View>
                </View>
            )
        })

        if (givengogo_subscription_list.length === 0)
            subscription_list.push(
                <View key="no-merchant" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: hp(10) }}>
                    <Text style={{ fontSize: wp(3.5), textAlign: 'center' }}>You have not added any subscriptions yet</Text>
                </View>
            )

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView style={{ paddingVertical: hp(3) }}>
                    {subscription_list}
                </ScrollView>
            </SafeAreaView>
        )
    }
}
