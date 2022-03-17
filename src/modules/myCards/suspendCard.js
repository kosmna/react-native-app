import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
    Alert,
    TextInput,
    ToastAndroid
} from 'react-native';

import { Text } from '../../components/StyledText';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { BackendUrl, Authentication } from '../backend/constants';

import { connect } from 'react-redux';


class SuspendCard extends React.Component {
    static navigationOptions = {
        title: 'Suspend Card'
    }

    constructor(props) {
        super(props);

        this.state = {
            secure_text_entry: true
        }
    }

    render() {
        return (
            <View>
                <View style={{ marginHorizontal: wp(10), marginTop: hp(4), marginBottom: hp(2) }}>
                    <View style={styles.each_row_container}>
                        <Text style={styles.disabled_label}>Name on Card</Text>
                        <Text style={styles.disabled_text}>Girish Jambagi</Text>
                    </View>
                    <View style={styles.each_row_container}>
                        <Text style={styles.disabled_label}>Enter Credit Card Number</Text>
                        <Text style={styles.disabled_text}>5123 4567 8901 2346</Text>
                    </View>
                </View>
                <View style={{ borderTopColor: '#D5D1D1', borderTopWidth: 1 }}></View>
                <View style={{ marginHorizontal: wp(10), marginTop: hp(2) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginVertical: hp(3) }}>
                        <Text style={{ color: '#515151', fontSize: wp(4) }}>Password</Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ secure_text_entry: !this.state.secure_text_entry })
                            }}
                        >
                            <Image
                                source={require('../../../assets/images/myCards/password_show_hide.png')}
                                style={{ width: wp(6), height: wp(6) }}
                            />
                        </TouchableOpacity>
                        <TextInput
                            style={{ ...styles.text_input, flex: 0.8, marginRight: 0, backgroundColor: '#F6F4F4' }}
                            secureTextEntry={this.state.secure_text_entry}
                            onChangeText={(password) => this.setState({ password: password })}
                        />
                    </View>
                    <LinearGradient colors={['#0093DD', '#005f8f']} style={styles.add_button}>
                        <TouchableOpacity
                            onPress={() => {

                                let request_data = JSON.stringify({
                                    'Authorization': Authentication,
                                    'referral_code': this.props.referral_code,
                                    'partner_id': this.props.partner_id,
                                    'proxyNumber': '234234234',
                                    'reason': 'Lost',
                                    'password': this.state.password
                                })

                                axios({
                                    method: 'POST',
                                    url: BackendUrl + '/markbngvirtualcardlost' + '?data=' + request_data,
                                    responseType: 'json'
                                })
                                    .then((response) => {
                                        if (response.data.success == true)
                                            ToastAndroid('Card has been successfully Suspended', ToastAndroid.SHORT)
                                        else
                                            ToastAndroid('Sorry something went wrong, please try again', ToastAndroid.SHORT)
                                        this.props.navigation.pop()
                                    })
                                    .catch((error) => {
                                        console.warn(error)
                                    })
                            }}
                        >
                            <Text style={styles.save_card_text}>Suspend Card</Text>
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
    text_input: {
        borderRadius: wp(1),
        borderWidth: wp(0.1),
        borderColor: 'gray',
        backgroundColor: 'white',
        marginVertical: wp(1.5),
        marginRight: wp(2),
        textAlign: 'center'
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

export default connect(mapStateToProps)(SuspendCard)