
import axios from 'axios'
import React from 'react'
import { Image, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Loading from '../../../components/Loading'
import { Text } from '../../../components/StyledText'
import { Authentication, BackendUrl } from '../../backend/constants'


export default class OtherGiftCardConfirmScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Preview Card'
        }
    }

    constructor(props) {
        super(props)

        let giftDetail = this.props.navigation.getParam('giftDetail')
        let denominationIndex = this.props.navigation.getParam('denominationIndex')

        let earn_points = giftDetail.value_restriction_list[denominationIndex].loyalty_lines['0_0']

        this.state = {
            amount: "0",
            buyingType: this.props.navigation.getParam('buyingType'),
            recipientName: this.props.navigation.getParam('recipientName'),
            recipientMail: this.props.navigation.getParam('recipientMail'),
            to: this.props.navigation.getParam('to'),
            loading: false,
            giftDetail: this.props.navigation.getParam('giftDetail'),
            userInfo: this.props.navigation.getParam('userInfo'),
            giftData: this.props.navigation.getParam('giftData'),
            denominationIndex: this.props.navigation.getParam('denominationIndex'),
            earn_points: earn_points
        }
    }

    componentDidMount() {

        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            (payload) => {
                if (this.props.navigation.getParam('payment_successfull', false)) {
                    this.props.navigation.navigate({
                        routeName: 'GiftCard',
                        params: { userInfo: this.props.userInfo, newTabIndex: (this.state.buyingType === 0) ? 1 : 2 },
                    })
                }
            }
        )
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove()
    }


    tabStyle(index) {
        if (index === this.state.tabIndex)
            return styles.statusItemPrimary
        return {}
    }

    tabTextStyle(index) {
        if (index === this.state.tabIndex)
            return styles.statusTextPrimary
        return {}
    }

    _purchaseGiftCard = async () => {
        this.setState({ loading: true })

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'partner_id': this.state.userInfo.partner_id,
            'referral_code': this.state.userInfo.partner_referral_code,
            'email': this.state.userInfo.partner_email,
            'purchased_for': (this.state.buyingType === 0) ? 'self' : 'others',
            'recipient_email': (this.state.buyingType === 0) ? this.state.userInfo.partner_email : this.state.recipientMail,
            'recipient_name': (this.state.buyingType === 0) ? this.state.userInfo.partner_name : this.state.recipientName,
            'message': (this.state.buyingType === 0) ? 'Enjoy your giftcard' : this.state.to,
            'giftcard_name': this.state.giftDetail.name,
            'id': this.state.giftDetail.id,
            'valueid': this.state.giftDetail.value_restriction_list[this.state.denominationIndex].valueid,
            'value': this.state.giftDetail.value_restriction_list[this.state.denominationIndex].value,
            'price': this.state.giftDetail.value_restriction_list[this.state.denominationIndex].price,
            'valuelogo_url': this.state.giftDetail.value_restriction_list[this.state.denominationIndex].valuelogo_url,
            'expiration_unit': this.state.giftDetail.expiration_unit,
            'expiration_validity_unit': this.state.giftDetail.expiration_validity_unit,
            'is_own': this.state.giftDetail.is_own,
            'target_url': this.state.giftDetail.target_url,
            'merchant_id': this.state.giftDetail.merchant_id,
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/bnggetgiftcardpurchase' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                this.setState({ loading: false })

                let data = response.data

                if (!data.success) {
                    ToastAndroid.show('Gift Card Purchase api error', ToastAndroid.SHORT)
                }

                this.props.navigation.navigate(
                    'GiftCardPayment',
                    {
                        userInfo: this.state.userInfo,
                        merchant: { merchant_id: this.state.giftDetail.merchant_id },
                        amount: this.state.giftDetail.value_restriction_list[this.state.denominationIndex].price,
                        order_id: data.pos_order_details.order_id,
                        gift_card_data: this.state.giftDetail
                    }
                )

            })
            .catch((error) => {
                this.setState({ loading: false })
                console.log(error)
            })
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading && <Loading />}
                <ScrollView style={{ flex: 1, paddingBottom: hp(5) }}>
                    <View style={{ marginHorizontal: wp(5), marginTop: hp(5), borderRadius: wp(2), elevation: 2 }}>
                        <View style={{ height: wp(45) }}>
                            <Image
                                style={{ width: '100%', height: wp(45), resizeMode: 'cover' }}
                                source={{ uri: this.state.giftDetail.logo_url }}
                            />
                            <Text style={{ marginTop: -wp(42), marginLeft: wp(50), paddingRight: 5, textAlign: 'right', color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>{'$' + this.state.giftDetail.value_restriction_list[this.state.denominationIndex].value}</Text>
                        </View>
                        <View style={{ marginLeft: 13, marginHorizontal: 13, marginTop: wp(5), justifyContent: "space-between", flexDirection: 'row' }}>
                            <View>
                                <Text style={{ color: '#635B5B', fontSize: 13, }}>{'Dear ' + this.state.recipientName}</Text>
                                <Text style={{ marginTop: 7, color: '#8D8D8D', fontSize: 13 }}>{(this.state.buyingType === 0) ? 'Enjoy your giftcard' : this.state.to}</Text>
                            </View>
                            <View>
                                <Image
                                    style={{ alignSelf: 'flex-end', width: wp(28.5), height: wp(8), resizeMode: 'contain' }}
                                    source={{ uri: this.state.giftDetail.merchant_url.replace('http://', 'https://') }}
                                />
                            </View>
                        </View>

                        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: hp(3) }}>

                            {(this.state.earn_points.travel && (this.state.earn_points.travel.points !== 0)) &&
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/rewards/travel.png')}
                                        style={{ width: wp(15), height: wp(5) }}
                                    />
                                    <Text style={{ fontSize: wp(3.5), textAlign: 'center', marginTop: hp(1) }}>{this.state.earn_points.travel.points}</Text>
                                </View>
                            }

                            {(this.state.earn_points.gogo && (this.state.earn_points.gogo.points !== 0)) &&
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/rewards/gogo$.png')}
                                        style={{ width: wp(15), height: wp(5) }}
                                    />
                                    <Text style={{ fontSize: wp(3.5), textAlign: 'center', marginTop: hp(1) }}>{this.state.earn_points.give.points}</Text>
                                </View>
                            }

                            {(this.state.earn_points.give && (this.state.earn_points.give.points !== 0)) &&
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Image
                                        source={require('../../../../assets/images/rewards/givengogo.png')}
                                        style={{ width: wp(20), height: wp(5) }}
                                    />
                                    <Text style={{ fontSize: wp(3.5), textAlign: 'center', marginTop: hp(1) }}>{20}</Text>
                                </View>
                            }

                        </View>
                    </View>
                </ScrollView>
                <TouchableOpacity
                    style={{ flex: 0.1, backgroundColor: '#0093DD', width: '100%', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => this._purchaseGiftCard()}
                >
                    <Text style={{ fontSize: 18, color: "#FCFEFF", fontWeight: '600' }}>
                        Proceed to Pay
                        </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    statusItem: {
        marginLeft: 0,
        height: 27,
        borderColor: '#0093DD',
        borderWidth: 1,
        justifyContent: 'center',
        color: '#0093DD'
    },
    textInput: {
        marginTop: -6,
        color: '#7A7C80',
        fontSize: wp(3.5),
    },
})
