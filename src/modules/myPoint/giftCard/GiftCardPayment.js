import axios from 'axios'
import React from 'react'
import { Alert, BackHandler, ToastAndroid, View } from 'react-native'
import { WebView } from 'react-native-webview'
import Loading from '../../../components/Loading'
import { Authentication, bookngogo_url, BackendUrl } from '../../backend/constants'


export default class GiftCardPayment extends React.Component {

    static navigationOptions = {
        header: null
    }

    state = {
        loading: true,
        userInfo: this.props.navigation.getParam('userInfo'),
        amount: this.props.navigation.getParam('amount'),
        merchant: this.props.navigation.getParam('merchant'),
        ref_id: this.props.navigation.getParam('order_id'),
        gift_card_data: this.props.navigation.getParam('gift_card_data')
    }

    register_back_handler = () => {
        // Do nothing when hardware back button is pressed
        this.back_handler = BackHandler.addEventListener('hardwareBackPress', () => {
            Alert.alert(
                'Cancel Payment?',
                'Are you sure you want to cancel the ongoing payment?',
                [
                    {
                        text: 'Cancel Payment',
                        onPress: () => {
                            ToastAndroid.show('PAYMENT CANCELLED', ToastAndroid.SHORT)
                            this.props.navigation.navigate('GiftCard')
                        },
                    },
                    { text: 'Continue', onPress: () => { } }
                ],
                { cancelable: false },
            )
            return true
        })
    }

    unregister_back_handler = () => {
        this.back_handler.remove()
    }

    componentDidMount() {
        this.register_back_handler()
    }

    componentWillUnmount() {
        this.unregister_back_handler()
    }

    // Close webview when back button is pressed in webview
    onMessage = (event) => {
        let post_data = JSON.parse(event.nativeEvent.data)
        console.warn(post_data)

        if (post_data.success) {
            ToastAndroid.show('PAYMENT SUCCESSFULL', ToastAndroid.SHORT)

            this.validate_gift_card(post_data.vpay_id)

            if (this.props.navigation.getParam('BookngogoGiftCard', false))
                this.props.navigation.navigate('BookngogoGiftCardConfirm', { payment_successfull: true })
            else
                this.props.navigation.navigate('OtherGiftCardConfirm', { payment_successfull: true })

        }
        else {
            this.props.navigation.goBack()
            ToastAndroid.show('PAYMENT FAILED', ToastAndroid.SHORT)
        }
    }

    validate_gift_card = (vpay_id) => {

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'partner_id': this.state.userInfo.partner_id,
            'referral_code': this.state.userInfo.partner_referral_code,
            'target_url': this.state.gift_card_data.target_url,
            'pos_order_id': this.state.ref_id,
            'vpay_list': [vpay_id],
            'points_earned': 0,
            'booking_total': this.state.amount,
            'outlet_id': this.state.merchant.merchant_id
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/bnggetgiftcardvalidate' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data

                if (data.success)
                    ToastAndroid.show('Gift Card Validated', ToastAndroid.SHORT)
                else
                    ToastAndroid.show('Gift Card Validation Failed', ToastAndroid.SHORT)

            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {

        let request_data = {
            hideheader: true,
            al_email: this.state.userInfo.partner_email,
            al_referral_code: this.state.userInfo.partner_referral_code,
            amount: this.state.amount,
            redeem_upto: 0, // Hardcoded for now. Has to be changed. Api has to be done.
            to_merchant_id: this.state.merchant.merchant_id,
            supplier_id: this.state.merchant.merchant_id,
            type: 'app',
            ref_id: this.state.ref_id
        }

        let query_string = new URLSearchParams(request_data).toString()

        return (
            <View style={{ flex: 1 }}>
                {this.state.loading && <Loading />}
                <WebView
                    source={{ uri: bookngogo_url + '/paymentrequest?' + query_string }}
                    onLoad={() => this.setState({ loading: false })}
                    onMessage={this.onMessage}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        )
    }
}
