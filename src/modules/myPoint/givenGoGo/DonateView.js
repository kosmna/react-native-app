import axios from 'axios'
import React from 'react'
import { CheckBox, SafeAreaView, ScrollView, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import CircleCheckBox, { LABEL_POSITION } from 'react-native-circle-checkbox'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Text } from '../../../components/StyledText'
import { Authentication, BackendUrl } from '../../backend/constants'


export default class DonateScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        let merchant = navigation.getParam('merchant')
        return {
            title: 'Donate to ' + merchant.merchant_name
        }
    }

    state = {
        userInfo: this.props.navigation.getParam('userInfo'),
        partner_id: this.props.navigation.getParam('userInfo').partner_id,
        partner_referral_code: this.props.navigation.getParam('userInfo').partner_referral_code,
        merchant: this.props.navigation.getParam('merchant'),
        radio_index: 'one_time',
        radio_data: {
            "one_time": "One Time",
            "monthly": "Monthly",
            "quarterly": "Quarterly",
            "halfyearly": "Halfyearly",
            "annualy": "Annualy"
        },
        use_gogo: true,
        use_cash: true,
        use_card: true,
        use_account: true
    }

    add_subscription = () => {

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.state.partner_referral_code,
            'partner_id': this.state.partner_id,
            "merchant_id": this.state.merchant.merchant_id,
            "type": this.state.radio_index,
            "amount": this.state.amount
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/addbnggivengogosubscription' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                if (data.success) {
                    this.props.navigation.navigate('GivengogoHome')
                    ToastAndroid.show('Subscription successfully added', ToastAndroid.SHORT)
                }
                else
                    ToastAndroid.show('API Error', ToastAndroid.SHORT)
            })
            .catch(function (error) {
                ToastAndroid.show('API Error' + error, ToastAndroid.SHORT)
            })
    }

    _renderPeriodRadios() {
        let donateRadioViews = []
        for (const key in this.state.radio_data) {
            donateRadioViews.push(
                <View key={key} style={{ marginVertical: hp(1) }}>
                    <CircleCheckBox
                        checked={this.state.radio_index === key}
                        outerSize={wp(4)}
                        innerSize={wp(2)}
                        outerColor='#707070'
                        innerColor='#707070'
                        onToggle={() => { this.setState({ radio_index: key }) }}
                        styleCheckboxContainer={{ backgroundColor: '#00000000' }}
                        labelPosition={LABEL_POSITION.RIGHT}
                        label={this.state.radio_data[key]}
                    />
                </View>
            )
        }

        return donateRadioViews
    }

    make_payment = () => {
        this.props.navigation.navigate('GivengogoPayment',
            { userInfo: this.state.userInfo, amount: this.state.amount, merchant: this.state.merchant }
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView
                    style={[styles.container]}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ width: '100%', paddingVertical: hp(5), paddingHorizontal: wp(10), flexDirection: 'row', justifyContent: 'space-around', flexWrap: 'wrap' }}>
                        {this._renderPeriodRadios()}
                    </View>

                    <View style={{ marginTop: hp(3), paddingHorizontal: wp(10), width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: wp(3.5), fontFamily: "Open Sans", fontWeight: 'bold', lineHeight: 15, color: "#5E5E5E", textAlign: 'center' }}>Donation Amount</Text>
                        <View
                            style={{ width: '50%', marginTop: hp(2) }}
                        >
                            <TextInput
                                style={{ width: '100%', height: hp(4), paddingVertical: 0, marginVertical: 0, textAlign: 'center', fontSize: wp(3.5) }}
                                onChangeText={(amount) => this.setState({ amount: amount })}
                                keyboardType={'number-pad'}
                                defaultValue={'0'}
                            />
                            <View style={{ width: '100%', height: 1, marginTop: 1, backgroundColor: '#A2A2A4', opacity: 0.4 }} />
                        </View>
                    </View>

                    {(this.state.radio_index !== 'one_time') &&
                        <View style={styles.checkbox_container}>
                            <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', width: wp(40), marginBottom: hp(2) }}>Donation Sources</Text>
                            <View style={styles.each_checkbox}>
                                <CheckBox value={this.state.use_gogo} onValueChange={value => this.setState({ use_gogo: value })} />
                                <TouchableOpacity
                                    onPress={() => this.setState({ use_gogo: !this.state.use_gogo })}
                                >
                                    <Text style={{ marginLeft: wp(3), fontSize: wp(3.3) }}>Gogo$</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.each_checkbox}>
                                <CheckBox value={this.state.use_cash} onValueChange={value => this.setState({ use_cash: value })} />
                                <TouchableOpacity
                                    onPress={() => this.setState({ use_cash: !this.state.use_cash })}
                                >
                                    <Text style={{ marginLeft: wp(3), fontSize: wp(3.3) }}>Gogo Cash</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.each_checkbox}>
                                <CheckBox value={this.state.use_card} onValueChange={value => this.setState({ use_card: value })} />
                                <TouchableOpacity
                                    onPress={() => this.setState({ use_card: !this.state.use_card })}
                                >
                                    <Text style={{ marginLeft: wp(3), fontSize: wp(3.3) }}>Saved Cards</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.each_checkbox}>
                                <CheckBox value={this.state.use_account} onValueChange={value => this.setState({ use_account: value })} />
                                <TouchableOpacity
                                    onPress={() => this.setState({ use_account: !this.state.use_account })}
                                >
                                    <Text style={{ marginLeft: wp(3), fontSize: wp(3.3) }}>Saved Bank Account</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }

                    <View style={{ display: 'flex', width: '100%', alignItems: 'center', paddingHorizontal: 24, marginTop: this.state.radio_index === 'one_time' ? hp(8) : 0 }}>
                        <TouchableOpacity
                            style={{ width: '50%', backgroundColor: '#0093DD', borderRadius: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                            onPress={() => {

                                if (!this.state.radio_index) {
                                    ToastAndroid.show('Please select Subscription Type', ToastAndroid.SHORT)
                                    return
                                }

                                if (!this.state.amount || parseInt(this.state.amount) === 0) {
                                    ToastAndroid.show('Please enter amount', ToastAndroid.SHORT)
                                    return
                                }

                                this.state.radio_index === 'one_time' ? this.make_payment() : this.add_subscription()
                            }}
                        >
                            <Text style={{ textAlign: 'center', marginVertical: hp(2), fontSize: wp(3.5), fontFamily: "Open Sans", fontWeight: 'bold', color: "#FFFFFF" }}>{this.state.radio_index === 'one_time' ? 'Pay' : 'Confirm'}</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    checkbox_container: {
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp(4),
        marginTop: hp(6)
    },
    each_checkbox: {
        flexDirection: 'row',
        width: wp(40),
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
})