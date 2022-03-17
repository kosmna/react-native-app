import axios from 'axios'
import React from 'react'
import { Clipboard, Image, ScrollView, ToastAndroid, TouchableOpacity, View } from 'react-native'
import firebase from 'react-native-firebase'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Share from 'react-native-share'
import Carousel from 'react-native-snap-carousel'
import Loading from '../../components/Loading'
import { Text } from '../../components/StyledText'
import { fonts } from '../../styles'
import { androidPackageName, Authentication, BookAuthentication, bookngogo_url, iosPackageName, shareDomainPrefix, BackendUrl, BookBackendUrl } from '../backend/constants'
import Faq from '../help/Faq'


const data = [1, 2, 3]

export default class ReferEarn extends React.Component {

    static navigationOptions = {
        title: 'Refer & Earn'
    }

    state = {
        carousel_index: 1,
        userInfo: this.props.navigation.getParam('userInfo'),
        loading: true,
        faq_data: []
    }

    componentDidMount() {
        this.get_referral_details()
        this.get_faqs()
    }

    get_referral_details = () => {
        let payload = JSON.stringify({
            'Authorization': BookAuthentication,
            "referral_code": this.state.userInfo.partner_referral_code,
            "partner_id": this.state.userInfo.partner_id,
        })

        axios({
            method: 'POST',
            url: BookBackendUrl + '/bnggetreferraldetails' + '?data=' + payload,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                if (data.success === true) {
                    this.setState({ referral_earn_amount: data.referral_earn_amount, referral_text: data.referral_text }, this.update_referral_text)
                }
                else
                    ToastAndroid.show('API Error', ToastAndroid.SHORT)
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    update_referral_text = () => {
        let link = new firebase.links
            .DynamicLink(bookngogo_url + '?referred_partner_id=' + this.state.userInfo.partner_id, shareDomainPrefix)
            .android.setPackageName(androidPackageName)
            .ios.setBundleId(iosPackageName)

        firebase.links().createShortDynamicLink(link, 'SHORT')
            .then((link) => {
                let referral_text = this.state.referral_text + '\n\n' + link
                this.setState({ referral_text, loading: false })
            })
    }

    get_faqs = () => {
        let payload = JSON.stringify({
            'Authorization': BookAuthentication,
            "referral_code": this.state.userInfo.partner_referral_code,
            "partner_id": this.state.userInfo.partner_id,
        })

        axios({
            method: 'POST',
            url: BookBackendUrl + '/bnggetreferfaqs' + '?data=' + payload,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                if (data.success === true) {
                    this.setState({ faq_data: data.faq_data })
                }
                else
                    ToastAndroid.show('API Error', ToastAndroid.SHORT)
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    _renderItem = ({ item, index }) => {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', height: hp(20), overflow: 'hidden', backgroundColor: '#0093DD', borderRadius: wp(1) }}>
                <View style={{}}>
                    <Text style={{ color: 'white', fontSize: wp(4.5), fontFamily: fonts.primaryRegular }}>Earn ${this.state.referral_earn_amount} on a</Text>
                    <Text style={{ color: 'white', fontSize: wp(4.5), fontFamily: fonts.primaryRegular }}>successfull referral</Text>
                </View>
                <Image
                    source={require('../../../assets/images/profile/gift.png')}
                    style={{ width: hp(10), height: hp(10) }}
                />
            </View>
        )
    }

    render() {

        if (this.state.loading)
            return <Loading />

        return (
            <View style={{ flex: 1 }}>
                <ScrollView style={{ paddingVertical: hp(3) }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Carousel
                            ref={(c) => { this._carousel = c }}
                            data={data}
                            renderItem={this._renderItem}
                            sliderWidth={wp(100)}
                            itemWidth={wp(95)}
                            loop={true}
                            autoplay={true}
                            lockScrollWhileSnapping={true}
                            onSnapToItem={(index) => {
                                this.setState({ carousel_index: index })
                            }}
                        />
                        {/* Pagination */}
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: hp(1) }}>
                            <View style={{ height: wp(1.5), width: wp(1.5), borderRadius: wp(0.75), backgroundColor: this.state.carousel_index == 0 ? '#AFAFAF' : '#F1EEEE', marginRight: wp(2) }} />
                            <View style={{ height: wp(1.5), width: wp(1.5), borderRadius: wp(0.75), backgroundColor: this.state.carousel_index == 1 ? '#AFAFAF' : '#F1EEEE', marginRight: wp(2) }} />
                            <View style={{ height: wp(1.5), width: wp(1.5), borderRadius: wp(0.75), backgroundColor: this.state.carousel_index == 2 ? '#AFAFAF' : '#F1EEEE' }} />
                        </View>

                    </View>
                    <View style={{ marginTop: hp(5), marginHorizontal: wp(5) }}>
                        <TouchableOpacity
                            style={{ height: hp(7), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: wp(2), elevation: 2, backgroundColor: 'white', paddingHorizontal: wp(5), fontFamily: fonts.primaryRegular }}
                            onPress={() => {
                                Share.open({ message: this.state.referral_text })
                                    .then((res) => { console.log(res) })
                                    .catch((err) => { console.log(err) })
                            }}
                        >
                            <Text style={{ fontSize: wp(4), color: '#515151' }}>Share your referral link</Text>
                            <Image
                                source={require('../../../assets/images/profile/share.png')}
                                style={{ width: wp(4.7), height: wp(4.2) }}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ height: hp(7), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: wp(2), elevation: 2, backgroundColor: 'white', paddingHorizontal: wp(5), fontFamily: fonts.primaryRegular, marginTop: hp(3) }}
                            onPress={() => {
                                Clipboard.setString(this.state.referral_text)
                                ToastAndroid.show('Copied to clipboard!', ToastAndroid.SHORT)
                            }}
                        >
                            <Text style={{ fontSize: wp(4), color: '#515151' }}>Copy Referral link</Text>
                            <Image
                                source={require('../../../assets/images/profile/copy.png')}
                                style={{ width: wp(3.7), height: wp(4.5) }}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={[{ marginTop: hp(5), marginLeft: wp(5) }]}>
                        <Text style={{ fontSize: wp(6), fontFamily: fonts.primarySemiBold, color: "#918888" }}>FAQ's</Text>
                    </View>
                    {this.state.faq_data.map(i => {
                        return (
                            <Faq
                                key={i.sequence}
                                question={i.question}
                                answer={i.answer}
                            />
                        )
                    })}

                </ScrollView>
            </View>
        )
    }
}