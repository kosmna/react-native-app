import axios from 'axios'
import React from 'react'
import _ from 'lodash'
import { Image, Modal, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import { TextInput } from '../../components'
import { Text } from '../../components/StyledText'
import { fonts } from '../../styles'
import { Authentication, BackendUrl } from '../backend/constants'


class BookngogoPointView extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: wp(7) }}>
                        <Image
                            style={{ height: hp(4), resizeMode: 'contain', marginTop: hp(0.4) }}
                            source={require('../../../assets/images/my_point/bookngogo_dollar.png')}
                        />
                    </View>
                )
            }
        }
    }

    constructor(props) {
        super(props)
        let outlet_data_obj = this.props.navigation.getParam('outlet_data')

        let outlet_data = { 'Bookngogo': outlet_data_obj['Bookngogo'] }

        merchantInfo = {}
        amount_entered = {}
        for (key in outlet_data) {

            merchantInfo[outlet_data[key].id] = {
                enable: true,
                amount: outlet_data[key].total_gogo,
                name: key,
            }

            amount_entered[outlet_data[key].id] = parseInt(outlet_data[key].total_gogo)
        }

        this.state = {
            outlet_data: outlet_data,
            merchantInfo: merchantInfo,
            convertMode: "Cash",
            visibleConvert: false,
            securePassword: true,
            amount_entered: amount_entered
        }

    }


    onToggleSelect = (index) => {
        let visibleConvert = false
        const orgState = this.state.merchantInfo[index].enable
        const { merchantInfo } = this.state
        merchantInfo[index].enable = !orgState
        this.setState({ merchantInfo })
        for (let i in this.state.merchantInfo) {
            if (this.state.merchantInfo[i].enable)
                visibleConvert = true
        }
        this.setState({ show_convert_button: visibleConvert })
    };

    toggleSecurePassword = () => {
        const orgState = this.state.securePassword
        this.setState({ securePassword: !orgState })
    }

    styleModeButton = (mode) => {
        if (mode === this.state.convertMode)
            return { backgroundColor: '#00A4F6' }
        return { backgroundColor: '#fff' }
    }

    styleModeButtonText = (mode) => {
        if (mode === this.state.convertMode)
            return { color: 'white' }
        return { color: '#7A7C80' }
    }

    setMode = (mode) => {
        this.setState({ convertMode: mode })
    }

    radioStyle = (index) => {
        const style = {
            justifyContent: 'center',
            marginTop: wp(1.5),
            width: wp(12),
            height: wp(7),
            borderRadius: wp(4),
            borderWidth: 1,
            borderColor: '#dcdce0'
        }
        if (this.state.merchantInfo[index] && this.state.merchantInfo[index].enable) {
            style.backgroundColor = '#4BD964'
            style.alignItems = 'flex-end'
        }
        return style
    }

    convert_api_call = () => {
        if (!this.state.convertMode && this.state.convertMode == '') {
            ToastAndroid.show('Please select Convert Mode', ToastAndroid.SHORT)
            return
        }

        let outlets = []
        let total_points = 0

        for (let key in this.state.amount_entered) {

            if (this.state.merchantInfo[key].enable !== true)
                continue

            let merchent_data = {}
            merchent_data[this.state.merchantInfo[key].name] = parseInt(this.state.amount_entered[key])
            total_points = total_points + parseInt(this.state.amount_entered[key])
            outlets.push(merchent_data)
        }

        if (this.state.convertMode == "Cash") {
            total_points = total_points / 2
        }

        let payload = JSON.stringify({
            "points": { "total_points": total_points, "outlets": outlets },
            "points_type": this.state.convertMode,
            "partner_id": this.props.partner_id,
            "referral_code": this.props.referral_code,
            "Authorization": Authentication
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/convertbngrewardpoints' + '?data=' + payload,
            responseType: 'json'
        })
            .then((response) => {
                if (response.data.success) {
                    this.props.navigation.goBack()
                    ToastAndroid.show('Successfully converted', ToastAndroid.LONG)
                }
                else
                    ToastAndroid.show('API Error', ToastAndroid.SHORT)
            })
            .catch((error) => {
                ToastAndroid.show('API Error', ToastAndroid.SHORT)
                console.warn(error)
            })
    }

    render_outlets = () => {
        let return_data = []
        let outlet_data = this.state.outlet_data
        for (let key in outlet_data) {

            return_data.push(
                <View key={outlet_data[key].id} style={{ marginLeft: wp(4), marginTop: wp(3.5), marginHorizontal: wp(5) }}>
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', height: wp(11.5) }}>
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                            {/* <TouchableOpacity
                                style={this.radioStyle(outlet_data[key].id)}
                                onPress={() => this.onToggleSelect(outlet_data[key].id)}
                            >
                                <View style={{ justifyContent: 'center', width: wp(6.5), height: wp(6.5), borderRadius: wp(3.5), borderWidth: 1, borderColor: '#dcdce0', backgroundColor: '#FFFFFF' }} />
                            </TouchableOpacity> */}

                            <View style={{ flexDirection: "row", marginLeft: wp(3), width: wp(41), height: wp(11.5), marginTop: hp(0.5) }}>
                                <Image
                                    style={{ width: wp(41), height: wp(11.5), alignSelf: "center", resizeMode: 'contain' }}
                                    source={{ uri: outlet_data[key].points[0].logo.replace('http://', 'https://') }}
                                />
                            </View>

                            <View style={{ marginHorizontal: wp(3), justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: wp(4), fontFamily: fonts.primarySemiBold, color: '#7A7C80' }}>{outlet_data[key]['total_gogo']}</Text>
                            </View>

                            <View style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'gray', borderRadius: wp(1) }}>
                                <TextInput
                                    onChangeText={(amount) => {
                                        amount = parseInt(amount) ? parseInt(amount) : 0

                                        if (amount > outlet_data[key].total_gogo)
                                            return

                                        let amount_entered = this.state.amount_entered
                                        amount_entered[outlet_data[key].id] = amount

                                        this.setState({ amount_entered: amount_entered })
                                    }}
                                    value={this.state.amount_entered[outlet_data[key].id].toString()}
                                    style={{ fontSize: wp(4), marginHorizontal: wp(2), textAlign: 'center', color: 'black', paddingVertical: 0, marginVertical: 0, height: hp(3.5) }}
                                    autoCorrect={false}
                                    defaultValue={this.state.merchantInfo[outlet_data[key].id].amount.toString()}
                                    keyboardType={'number-pad'}
                                />
                            </View>
                        </View>
                        <TouchableOpacity
                            style={{ justifyContent: 'center', flexDirection: 'row-reverse' }}
                            onPress={() => this.props.navigation.navigate('MerchantPointDetail', { outlet_data: outlet_data[key] })}
                        >
                            <Image
                                style={{ alignSelf: 'center', width: wp(4.25), height: wp(5), resizeMode: 'stretch' }}
                                source={require('../../../assets/images/my_point/list.png')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

        return return_data
    }

    render() {

        let total_selected_amount = 0

        for (let key in this.state.amount_entered) {
            if (this.state.merchantInfo[key].enable !== true)
                continue

            total_selected_amount = total_selected_amount + parseInt(this.state.amount_entered[key])
        }

        return (
            <View style={styles.container}>
                <View style={{ flex: 0.4 }}>
                    <ScrollView style={styles.container}>
                        <View style={{ marginVertical: hp(2) }}>
                            <Text style={{ fontSize: wp(4), fontWeight: 'bold', marginLeft: wp(5) }}>Convert your GoGo$</Text>
                        </View>
                        {this.render_outlets()}
                    </ScrollView>
                </View>

                <View style={{ flex: 0.6, justifyContent: 'space-evenly', backgroundColor: '#fff' }}>

                    <View style={{ backgroundColor: "#C0C0C0", height: 1, width: '100%', marginVertical: hp(2) }} />

                    {/* Convert your gogo points */}
                    <View style={{ flexDirection: "row", justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: wp(5) }}>
                        <Text style={{ flex: 0.5, fontSize: wp(4), color: '#918888', }}>Convert your</Text>
                        <Image
                            style={{ height: wp(15), width: wp(28), resizeMode: 'contain', marginTop: hp(0.5), marginRight: wp(5) }}
                            source={require('../../../assets/images/my_point/bookngogo_dollar.png')}
                        />
                        <Text style={{ flex: 0.2, fontSize: wp(4.5), color: '#515151', }}>{total_selected_amount}</Text>
                    </View>

                    <View style={{ backgroundColor: "#C0C0C0", height: 1, width: '100%', marginVertical: hp(2) }} />

                    {/* Buttons */}
                    <View style={{ flexDirection: "row", justifyContent: 'center', marginHorizontal: wp(5) }}>

                        {/* <TouchableOpacity
                            style={[this.styleModeButton("Travel"), { flexDirection: "row", width: wp(40), height: wp(11), justifyContent: 'center', alignItems: 'center', borderRadius: wp(2), elevation: 3 }]}
                            onPress={() => this.setMode("Travel")}
                        >
                            <Text style={[this.styleModeButtonText('Travel'), { fontSize: wp(4.5), fontFamily: fonts.primarySemiBold, alignSelf: 'center' }]}>Travel $</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity
                            style={[this.styleModeButton("Cash"), { flexDirection: "row", width: wp(40), height: wp(11), justifyContent: 'center', alignItems: 'center', borderRadius: wp(2), elevation: 3 }]}
                            onPress={() => this.setMode("Cash")}
                        >
                            <Text style={[this.styleModeButtonText('Cash'), { fontSize: wp(4.5), fontFamily: fonts.primarySemiBold, alignSelf: 'center' }]}>Cash</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={{ backgroundColor: "#C0C0C0", height: 1, width: '100%', marginVertical: hp(2) }} />

                    {/* Converted Value */}
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', paddingHorizontal: wp(5), }}>
                        <View style={{ flexDirection: "row", flex: 0.5, height: wp(9), alignItems: 'center' }}>
                            <Text style={{ fontSize: wp(4), fontFamily: fonts.primaryRegular, }}>Converted value</Text>
                        </View>
                        <View style={{ flexDirection: "row", flex: 0.5, height: wp(9), marginLeft: wp(3.25), borderRadius: wp(1), justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6F4F4' }} >
                            <Text style={{ fontSize: wp(4), fontFamily: fonts.primaryRegular, }}>{this.state.convertMode == "Cash" ? (total_selected_amount / 2) : total_selected_amount}</Text>
                        </View>
                    </View>

                    <View style={{ backgroundColor: "#C0C0C0", height: 1, width: '100%', marginVertical: hp(2) }} />

                    {/* Convert Button */}
                    <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'center', marginBottom: hp(2) }}>
                        <TouchableOpacity
                            style={{ flexDirection: "row", height: wp(11.5), width: wp(32.5), borderRadius: wp(1.5), justifyContent: 'center', backgroundColor: '#00A4F6' }}
                            onPress={this.convert_api_call}
                        >
                            <Text style={{ fontSize: wp(4.25), fontFamily: fonts.primarySemiBold, color: '#FFFFFF', marginTop: 11 }}>Convert</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textInput: {
        alignSelf: 'stretch',
        width: '100%',
        marginTop: 2,
        color: '#7A7C80',
        fontSize: wp(4.5)
    },
})


function mapStateToProps(state) {
    return {
        'partner_id': state.home.userInfo.partner_id,
        'referral_code': state.home.userInfo.partner_referral_code
    }
}

export default connect(mapStateToProps)(BookngogoPointView)