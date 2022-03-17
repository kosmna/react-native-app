import axios from 'axios'
import React from 'react'
import { StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import { Text } from '../../components/StyledText'
import { Authentication, BackendUrl } from '../backend/constants'


class ActivateCard extends React.Component {
    static navigationOptions = {
        title: 'Activate Card'
    }

    constructor(props) {
        super(props)

        this.state = {
            secure_text_entry: true,
            cc_name: this.props.navigation.getParam('cc_name'),
            cc_no: this.props.navigation.getParam('cc_no')
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <View style={{ marginHorizontal: wp(10), marginTop: hp(4), marginBottom: hp(2) }}>
                    <View style={styles.each_row_container}>
                        <Text style={styles.disabled_label}>Name on Card</Text>
                        <Text style={styles.disabled_text}>{this.state.cc_name}</Text>
                    </View>
                    <View style={styles.each_row_container}>
                        <Text style={styles.disabled_label}>Enter Credit Card Number</Text>
                        <Text style={styles.disabled_text}>{this.state.cc_no}</Text>
                    </View>
                    <View style={{ ...styles.each_row_container, flexDirection: 'row' }}>
                        <View style={{ flex: 0.4 }}>
                            <Text style={styles.enabled_label}>Expire/Validity</Text>
                            <View style={{ ...styles.text_input_container, flexDirection: 'row' }}>
                                <TextInput
                                    style={{ ...styles.text_input, width: wp(12) }}
                                    placeholder={'MM'}
                                    onChangeText={(exp_month) => {
                                        this.setState({ exp_month: exp_month })
                                    }}
                                    maxLength={2}
                                />
                                <TextInput
                                    style={{ ...styles.text_input, marginLeft: wp(2), width: wp(12) }}
                                    placeholder={'YY'}
                                    onChangeText={(exp_year) => {
                                        this.setState({ exp_year: exp_year })
                                    }}
                                    maxLength={2}
                                />
                            </View>
                        </View>
                        <View style={{ flex: 0.4 }}>
                            <Text style={styles.enabled_label}>CVV</Text>
                            <View style={styles.text_input_container}>
                                <TextInput
                                    style={{ ...styles.text_input, width: wp(20) }}
                                    placeholder={'XXXX'}
                                    onChangeText={(cvv) => {
                                        this.setState({ cvv: cvv })
                                    }}
                                    maxLength={4}
                                />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ marginHorizontal: wp(10), marginTop: hp(2) }}>
                    <LinearGradient colors={['#0093DD', '#005f8f']} style={styles.add_button}>
                        <TouchableOpacity
                            onPress={() => {

                                if (!this.state.cvv || !this.state.exp_month || !this.state.exp_year) {
                                    ToastAndroid.show('Please fill all required data', ToastAndroid.SHORT)
                                    return
                                }

                                let payload = JSON.parse({
                                    'Authorization': Authentication,
                                    'referral_code': this.props.referral_code,
                                    'partner_id': this.props.partner_id,
                                    'expirationMonth': '02',
                                    'expirationYear': '2019',
                                    'cvv': this.state.cvv,
                                })
                                axios({
                                    method: 'POST',
                                    url: BackendUrl + '/activatebngvirtualcard?data=' + payload,

                                    responseType: 'json'
                                })
                                    .then((response) => {
                                        if (response.data.success == true)
                                            alert('Request to activate card has been successfully sent.')
                                        else
                                            alert('Sorry something went wrong, please try again')
                                    })
                                    .catch((error) => {
                                        console.warn(error)
                                    })

                            }}
                        >
                            <Text style={styles.save_card_text}>Activate Card</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View >
        )
    }

}

const styles = StyleSheet.create({
    each_row_container: {
        marginVertical: hp(1.5)
    },
    disabled_label: {
        color: '#ACACAC',
        marginBottom: hp(1),
        fontSize: wp(3.5)
    },
    disabled_text: {
        color: '#ACACAC',
        fontWeight: 'bold',
        fontSize: wp(4.3)
    },
    enabled_label: {
        color: '#515151',
        marginBottom: hp(1)
    },
    text_input_container: {
        marginVertical: wp(1.5),
        marginRight: wp(2),
    },
    text_input: {
        borderRadius: wp(1),
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: 'white',
        textAlign: 'center',
        margin: 0,
        padding: 0,
        height: hp(5),
    },
    add_button: {
        width: '100%',
        height: hp(5),
        marginTop: hp(2),
        borderRadius: hp(0.5)
    },
    save_card_text: {
        width: '100%',
        height: '100%',
        fontSize: wp(4),
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
})


function mapStateToProps(state) {
    return {
        'partner_id': state.home.userInfo.partner_id,
        'referral_code': state.home.userInfo.partner_referral_code
    }
}

export default connect(mapStateToProps)(ActivateCard)