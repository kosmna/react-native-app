import axios from 'axios'
import React from 'react'
import { BackHandler, ToastAndroid, View, Alert } from 'react-native'
import { WebView } from 'react-native-webview'
import { BackendUrl, Authentication, bookngogo_url } from '../../backend/constants'
import Loading from '../../../components/Loading'


export default class GivengogoPayment extends React.Component {

    static navigationOptions = {
        header: null
    }

    state = {
        loading: true,
        top_loading: true,
        userInfo: this.props.navigation.getParam('userInfo'),
        amount: this.props.navigation.getParam('amount'),
        merchant: this.props.navigation.getParam('merchant')
    };

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
                            this.props.navigation.navigate('GivengogoHome')
                            ToastAndroid.show('PAYMENT CANCELLED', ToastAndroid.SHORT)
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

    create_transaction = () => {
        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.state.userInfo.partner_referral_code,
            'partner_id': this.state.userInfo.partner_id,
            'merchant_id': this.state.merchant.merchant_id,
            'type': 'one_time',
            'amount': this.state.amount,
            'percentage': 0,
            'payment_ref': "",
            'transaction_id': 0,
            'state': ""
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/addbnggivengogotransaction' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                if (response.data.success)
                    this.setState({ ref_id: response.data.givengogo_transaction_list[0], loading: false })
                else
                    console.warn('/addbnggivengogotransaction API Error')
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    componentDidMount() {
        this.register_back_handler()
        this.create_transaction()
    }

    componentWillUnmount() {
        this.unregister_back_handler()
    }

    // Close webview when back button is pressed in webview
    onMessage = (event) => {
        let post_data = JSON.parse(event.nativeEvent.data)

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.state.userInfo.partner_referral_code,
            'partner_id': this.state.userInfo.partner_id,
            'merchant_id': this.state.merchant.merchant_id,
            'type': 'one_time',
            'amount': this.state.amount,
            'percentage': 0,
            'payment_ref': this.state.ref_id,
            'transaction_id': 0,
            'state': post_data.success ? 'success' : 'cancel'
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/addbnggivengogotransaction' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                if (response.data.success)
                    ToastAndroid.show('Updated Transaction', ToastAndroid.SHORT)
                else
                    console.warn('/addbnggivengogotransaction API Error')
            })
            .catch((error) => {
                console.warn(error)
            })

        if (post_data.success) {
            this.props.navigation.navigate('GivengogoHome')
            ToastAndroid.show('PAYMENT SUCCESSFULL', ToastAndroid.SHORT)
        }
        else {
            this.props.navigation.goBack()
            ToastAndroid.show('PAYMENT FAILED', ToastAndroid.SHORT)
        }
    }

    render() {

        if (this.state.loading)
            return <Loading />

        let request_data = {
            hideheader: true,
            al_email: this.state.userInfo.partner_email,
            al_referral_code: this.state.userInfo.partner_referral_code,
            amount: this.state.amount,
            redeem_upto: 0, // Hardcoded for now. Has to be changed. Api has to be done.
            to_merchant_id: 50,
            supplier_id: 50,
            type: 'app',
            ref_id: this.state.ref_id
        }

        let query_string = new URLSearchParams(request_data).toString()

        return (
            <View style={{ flex: 1 }}>
                <WebView
                    source={{ uri: bookngogo_url + '/paymentrequest?' + query_string }}
                    onLoad={() => this.setState({ loading: false, top_loading: false })}
                    onMessage={this.onMessage}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
                {this.state.top_loading && <Loading />}
            </View>
        )
    }
}
