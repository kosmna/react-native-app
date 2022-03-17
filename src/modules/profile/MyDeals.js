import axios from 'axios'
import moment from 'moment'
import React from 'react'
import { Image, ScrollView, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Loading from '../../components/Loading'
import { Text } from '../../components/StyledText'
import { BackendUrl } from '../backend/constants'


export default class MyDeals extends React.Component {

    static navigationOptions = {
        title: 'My Deals'
    }

    state = {
        loading: true,
        deal_view: 'upcoming',
        partner_id: this.props.navigation.getParam('userInfo').partner_id,
        referral_code: this.props.navigation.getParam('userInfo').partner_referral_code
    }

    componentDidMount() {
        let query_string = JSON.stringify({
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": "Basic YWRtaW46S0EpQGwzNTU2",
            "partner_id": this.state.partner_id,
            "referral_code": this.state.referral_code
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/getaccessvipuserredeemedoffer?data=' + query_string,
            responseType: 'json'
        })
            .then((response) => {
                data = response.data
                if (data.success)
                    this.setState({ avip_redeemed_dict: data.avip_redeemed_dict, loading: false })
                else {
                    this.setState({ avip_redeemed_dict: test_json, loading: false })
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    display_deals = () => {

        let return_data = []
        let avip_redeemed_dict = this.state.avip_redeemed_dict

        for (const key in avip_redeemed_dict) {

            let redeemed_date = moment(avip_redeemed_dict[key].redeemed_date)
            let expiry_date = moment(avip_redeemed_dict[key].expires_on)

            if (this.state.deal_view == 'past' && expiry_date > moment())
                continue

            if (this.state.deal_view == 'upcoming' && expiry_date <= moment())
                continue

            return_data.push(
                <TouchableOpacity key={key}
                    style={{ elevation: wp(1), backgroundColor: 'white', marginVertical: hp(1), marginHorizontal: wp(5), borderRadius: wp(2) }}
                    onPress={() => {
                        if (this.state.deal_view == 'past')
                            ToastAndroid.show('Deal is expired', ToastAndroid.SHORT)
                        else
                            this.props.navigation.navigate('MyDealsWebview', { data: avip_redeemed_dict[key] })
                    }}
                >
                    <View style={{ flexDirection: 'row', marginHorizontal: wp(5), marginTop: hp(2) }}>
                        <Image
                            source={{ uri: avip_redeemed_dict[key].store_logo_url }}
                            style={{ height: wp(20), width: wp(20) }}
                        />
                        <View style={{ marginLeft: wp(5) }}>
                            <View style={{ flexDirection: 'row', width: wp(50) }}>
                                <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', flexWrap: 'wrap' }}>{avip_redeemed_dict[key].store_name}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: wp(50) }}>
                                <Text style={{ flex: 1, flexWrap: 'wrap', fontSize: wp(3), color: '#A2A2A4' }}>{avip_redeemed_dict[key].complete_address}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ paddingVertical: hp(2), paddingHorizontal: wp(5), borderBottomWidth: 1, borderBottomColor: '#0000002E' }}>
                        <Text style={{ fontSize: wp(4) }}>{avip_redeemed_dict[key].offer_name}</Text>
                    </View>

                    <View style={{ marginVertical: hp(1), marginHorizontal: wp(5) }}>
                        <Text style={{ fontSize: wp(2.8) }}>{redeemed_date.format("MMMM Do YYYY, h:mm:ss A")}</Text>
                    </View>

                </TouchableOpacity>
            )
        }

        if (return_data.length == 0)
            return_data.push(
                <View key={'no_data'} style={{ marginVertical: hp(4), alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: wp(4) }}>No Deals to Show</Text>
                </View>
            )

        return return_data
    }

    render() {

        if (this.state.loading)
            return <Loading />

        return (
            <View style={{ flex: 1 }}>
                {/* Upcoming or past deal switcher */}
                <View style={{ flexDirection: 'row', borderRadius: 3, borderWidth: 2, borderColor: '#0093DD', width: wp(60), height: hp(3.5), marginHorizontal: wp(20), marginVertical: hp(3.5) }}>
                    <TouchableOpacity
                        style={{ flex: 0.5, backgroundColor: this.state.deal_view == 'upcoming' ? '#0093DD' : 'white', justifyContent: 'center', alignSelf: 'center', height: '100%' }}
                        onPress={() => this.setState({ deal_view: 'upcoming' })}
                    >
                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: wp(3.5), color: this.state.deal_view == 'upcoming' ? 'white' : 'black', fontWeight: this.state.deal_view == 'upcoming' ? 'bold' : 'normal' }}>Upcoming</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 0.5, justifyContent: 'center', alignSelf: 'center', height: '100%', backgroundColor: this.state.deal_view == 'past' ? '#0093DD' : 'white' }}
                        onPress={() => this.setState({ deal_view: 'past' })}
                    >
                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: wp(3.5), color: this.state.deal_view == 'past' ? 'white' : 'black', fontWeight: this.state.deal_view == 'past' ? 'bold' : 'normal' }}>Past</Text>
                    </TouchableOpacity>
                </View>

                {/* List of Deals */}
                <ScrollView>
                    {this.display_deals()}
                </ScrollView>
            </View>
        )

    }
}
