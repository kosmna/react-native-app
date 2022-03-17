
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
    ToastAndroid,
    Alert
} from 'react-native'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Text } from '../../../components/StyledText'
import { BackendUrl, Authentication } from '../../backend/constants'
import axios from 'axios'
import Loading from '../../../components/Loading'

export default class GivengogoHomeScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: wp(6) }}>
                        <Image
                            style={{ height: hp(4.5), resizeMode: 'contain' }}
                            source={require('../../../../assets/images/rewards/givengogo.png')}
                        />
                    </View>
                )
            }
        }
    }

    state = {
        userInfo: this.props.navigation.getParam('userInfo'),
        partner_id: this.props.navigation.getParam('userInfo').partner_id,
        partner_referral_code: this.props.navigation.getParam('userInfo').partner_referral_code,
        loading: true,
        top_loading: false,
        split_percentage_popup: false,
    }

    componentDidMount() {
        this.get_merchant_list()

        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            (payload) => {
                if (this.props.navigation.getParam('reload', false)) {
                    this.props.navigation.setParams({ 'reload': false })
                    this.setState({ top_loading: true })
                    this.get_merchant_list()
                }
            }
        )
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove()
    }

    get_merchant_list = () => {
        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.state.partner_referral_code,
            'partner_id': this.state.partner_id
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/getbnggivengogomerchantsharelist' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                if (data.success)
                    this.setState({ loyalty_balance: data.loyalty_balance, givengogomerchantshare_list: JSON.parse(JSON.stringify(data.givengogomerchantshare_list)), original_givengogomerchantshare_list: JSON.parse(JSON.stringify(data.givengogomerchantshare_list)), loading: false, top_loading: false })
                else
                    ToastAndroid.show('API Error', ToastAndroid.SHORT)
            })
            .catch(function (error) {
                ToastAndroid.show('API Error' + error, ToastAndroid.SHORT)
            })
    }

    update_merchent_list = (total_percentage_validation) => {

        let total_percentage = 0
        this.state.givengogomerchantshare_list.forEach((item) => {
            total_percentage = total_percentage + parseInt(item.percentage)
        })

        if (total_percentage_validation && total_percentage !== 100) {
            ToastAndroid.show('Total percentage must be equal to 100', ToastAndroid.SHORT)
            return
        }


        this.setState({ top_loading: true, split_percentage_popup: false })

        let merchant_list = []
        this.state.givengogomerchantshare_list.forEach((merchant) => {
            merchant_list.push({
                merchant_id: merchant.merchant_id,
                percentage: merchant.percentage,
                is_own: merchant.is_own ? 1 : 0
            })
        })

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.state.partner_referral_code,
            'partner_id': this.state.partner_id,
            'merchant_share_list': merchant_list
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/addbnggivengogomerchantsharelist' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                if (data.success) {
                    this.get_merchant_list()
                }
                else
                    ToastAndroid.show('API Error', ToastAndroid.SHORT)
            })
            .catch(function (error) {
                ToastAndroid.show('API Error' + error, ToastAndroid.SHORT)
            })
    }

    remove_merchant = (merchant_id) => {
        let givengogomerchantshare_list = JSON.parse(JSON.stringify(this.state.givengogomerchantshare_list.filter(obj => obj.merchant_id != merchant_id)))

        if (givengogomerchantshare_list.length == 0) {
            this.setState({ givengogomerchantshare_list: givengogomerchantshare_list, split_percentage_popup: true },
                () => this.update_merchent_list(total_percentage_validation = false))
        }
        else {
            ToastAndroid.show('Please update the split percentage', ToastAndroid.LONG)
            this.setState({ givengogomerchantshare_list: givengogomerchantshare_list, split_percentage_popup: true })
        }
    }

    render() {

        if (this.state.loading)
            return <Loading />

        let split_list = []
        this.state.givengogomerchantshare_list.forEach((merchant, index) => {
            split_list.push(
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: wp(10), paddingRight: wp(15), marginBottom: hp(2) }}>
                    <Text style={{ width: '60%' }}>{merchant.merchant_name}</Text>
                    <View style={{ width: '15%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={{ borderBottomWidth: 1, borderBottomColor: 'gray', paddingVertical: 0, marginVertical: 0, width: '80%' }}
                            keyboardType={'number-pad'}
                            maxLength={3}
                            defaultValue={merchant.percentage.toString()}
                            value={merchant.percentage.toString()}
                            onChangeText={(percentage) => {
                                let temp_merchant_list = this.state.givengogomerchantshare_list
                                temp_merchant_list[index]['percentage'] = percentage

                                this.setState({ givengogomerchantshare_list: temp_merchant_list })
                            }}
                        />
                        <Text>%</Text>
                    </View>
                </View>
            )
        })

        let total_percentage = 0
        this.state.givengogomerchantshare_list.forEach((merchant) => {
            total_percentage = total_percentage + parseInt(merchant.percentage)
        })
        split_list.push(
            <View key='line_break' style={{ backgroundColor: '#F2F2F2', height: 3, width: '100%', marginTop: 7 }} />
        )
        split_list.push(
            <View key='total_percentage' style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: wp(10), paddingRight: wp(15), marginTop: hp(2) }}>
                <Text style={{ width: '60%' }}>Total</Text>
                <View style={{ width: '15%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput
                        style={{ paddingVertical: 0, marginVertical: 0, width: '80%' }}
                        keyboardType={'number-pad'}
                        value={total_percentage ? total_percentage.toString() : '0'}
                        editable={false}
                    />
                    <Text>%</Text>
                </View>
            </View>
        )

        let percentage_split_modal = (
            <Modal
                transparent={true}
                visible={this.state.split_percentage_popup}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0,0.3)' }}>
                    <View style={{ display: 'flex', justifyContent: 'center', paddingBottom: hp(2), width: wp(90), marginTop: hp(30), marginHorizontal: wp(5), backgroundColor: 'white', elevation: 4 }}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(5), paddingVertical: hp(2), backgroundColor: '#E8F9F7' }}>
                            <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: '#0193DD' }}>Split Fund</Text>
                            <TouchableOpacity
                                onPress={() => this.setState({ givengogomerchantshare_list: JSON.parse(JSON.stringify(this.state.original_givengogomerchantshare_list)), split_percentage_popup: false }, () => console.warn(this.state))}
                            >
                                <Image
                                    style={{ width: wp(4), height: wp(4) }}
                                    source={require('../../../../assets/images/my_point/modal_close.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ marginVertical: hp(2) }}>
                            {split_list}
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{ width: wp(20), height: hp(4.5), backgroundColor: '#0093DD', justifyContent: 'center', alignItems: 'center', borderRadius: wp(1) }}
                                onPress={this.update_merchent_list}
                            >
                                <Text style={{ color: 'white', fontSize: wp(4), textAlign: 'center' }}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )

        let givengogomerchantshare_list = []
        this.state.givengogomerchantshare_list.forEach((merchant, index) => {
            givengogomerchantshare_list.push(
                <View
                    key={index}
                    style={{ marginLeft: wp(5), marginRight: wp(10), height: 40, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: hp(2) }}
                >
                    <View style={{ minWidth: '50%' }}>
                        <Text
                            style={[
                                { fontSize: wp(3.3), fontFamily: "Open Sans", color: "black" },
                                { marginHorizontal: 6, marginBottom: 5 }
                            ]}>{merchant.merchant_name}</Text>
                        <View style={{ height: 1, backgroundColor: '#A2A2A4', opacity: 0.17 }} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{ borderWidth: 1, borderColor: 'gray', borderRadius: wp(1) }}
                            onPress={() => this.setState({ split_percentage_popup: !this.state.split_percentage_popup })}
                        >
                            <Text style={{ fontSize: wp(3.2), marginHorizontal: wp(2), marginVertical: hp(0.5) }}>{merchant.percentage}%</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginLeft: wp(7) }}
                            onPress={() => {
                                Alert.alert(
                                    'Remove ' + merchant.merchant_name + ' ?',
                                    merchant.merchant_name + ' will be removed from your donation list.',
                                    [
                                        {
                                            text: 'Cancel',
                                            style: 'cancel',
                                        },
                                        { text: 'OK', onPress: () => this.remove_merchant(merchant.merchant_id) },
                                    ],
                                    { cancelable: false },
                                )

                            }}
                        >
                            <Image
                                source={require('../../../../assets/images/help/close.png')}
                                style={{ width: wp(3), height: wp(3) }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        })

        if (givengogomerchantshare_list.length == 0)
            givengogomerchantshare_list.push(
                <View key="no-merchant" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <Text style={{ fontSize: wp(3.5), textAlign: 'center' }}>You have not added any Organizations yet</Text>
                </View>
            )

        return (
            <SafeAreaView style={styles.container}>
                {this.state.top_loading && <Loading />}

                <ScrollView
                    style={[styles.container]}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={[
                            { backgroundColor: '#E8F9F7', borderRadius: 4, marginHorizontal: 10, },
                            { paddingTop: 10, paddingBottom: 8, marginTop: 13, paddingHorizontal: 22 }
                        ]}
                    >
                        <Text style={{ fontSize: wp(3), fontFamily: "Open Sans", color: "#5E5E5E" }}>Balance</Text>
                        <Text style={{ fontSize: wp(7), fontFamily: "Open Sans", color: "#0D4BC8", marginTop: 5 }}>${this.state.loyalty_balance}</Text>
                        <Text style={{ fontSize: wp(2.7), fontFamily: "Open Sans", color: "#5E5E5E", marginTop: 3 }}>( Auto distributed once the balance reaches $25 )</Text>
                    </View>

                    <TouchableOpacity
                        style={[
                            { marginLeft: 11, marginRight: 13 },
                            { paddingTop: 18, paddingHorizontal: 21, paddingBottom: 21, marginTop: 15 },
                            { elevation: wp(0.7), backgroundColor: 'white', borderRadius: wp(1) }
                        ]}
                        onPress={() => {
                            this.props.navigation.navigate('ExploreOrg', { userInfo: this.state.userInfo })
                        }}
                    >
                        <Text style={{ fontSize: wp(3.5), fontFamily: "Open Sans", color: "#5E5E5E", fontWeight: 'bold' }} >Explore Organisations</Text>
                    </TouchableOpacity>

                    <Text
                        style={[
                            { fontSize: 14, fontFamily: "Open Sans", fontWeight: "600", color: "#0093DD" },
                            { marginHorizontal: 19, marginTop: hp(4) }
                        ]}>You are donating givengogo funds to</Text>

                    <View style={{ marginVertical: hp(3) }}>
                        {givengogomerchantshare_list}
                    </View>

                    <TouchableOpacity
                        style={{ marginHorizontal: wp(3), height: 40, flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(3) }}
                        onPress={() => this.props.navigation.navigate('ExploreOrg', { userInfo: this.state.userInfo })}
                    >
                        <View style={{ flexDirection: 'column-reverse' }}>
                            <View style={{ height: 1, backgroundColor: '#A2A2A4', opacity: 0.17 }} />
                            <Text
                                style={[
                                    { fontSize: wp(3.5), fontFamily: "Open Sans", color: "#A2A2A4", opacity: 0.42 },
                                    { marginHorizontal: 6, marginBottom: 10 }
                                ]}>Add your preferred organisation to donate</Text>
                        </View>
                        <View style={{ width: wp(15), height: '100%', borderRadius: wp(1.5), backgroundColor: '#0193DD', marginLeft: wp(2.5) }}>
                            <View
                                style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ fontSize: 12, fontFamily: 'Open Sans', color: '#FFFFFF' }}>+ Add</Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {false &&
                        <View style={{ marginHorizontal: 19, paddingBottom: 18, paddingTop: 14 }}>
                            <Text style={{ fontSize: wp(3.5), fontFamily: 'Open Sans', color: '#A2A2A4' }}>Add Organizations to donate by splitting the fund amount</Text>
                            <TouchableOpacity
                                style={{ width: 62, height: 30, marginTop: 10, backgroundColor: '#A2A2A4', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => console.log('Clicked +Add')}
                            >
                                <Text style={{ fontSize: 12, fontFamily: 'Open Sans', color: '#FFFFFF' }}>+ Add</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={{ backgroundColor: '#F2F2F2', height: 5, width: '100%', marginTop: 7 }} />
                    <View style={{ width: '100%', paddingLeft: 15, paddingRight: 13, paddingTop: 21, paddingBottom: 90 }}>
                        <TouchableOpacity
                            style={[
                                { paddingTop: 17, paddingHorizontal: 21, paddingBottom: 16 },
                                { elevation: wp(0.5), backgroundColor: 'white', borderRadius: wp(1) }
                            ]}
                            onPress={() => this.props.navigation.navigate('SubscriptionView',
                                { userInfo: this.state.userInfo }
                            )}
                        >
                            <Text style={{ fontSize: wp(3.2), fontFamily: "Open Sans", color: "#5E5E5E" }}>Subscription</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                { paddingTop: 17, paddingHorizontal: 21, paddingBottom: 16, marginTop: 15 },
                                { elevation: wp(0.5), backgroundColor: 'white', borderRadius: wp(1) }
                            ]}
                            onPress={() => console.log("BBBBBBBB")}
                        >
                            <Text style={{ fontSize: wp(3.2), fontFamily: "Open Sans", color: "#5E5E5E" }}>Donate History</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                { paddingTop: 17, paddingHorizontal: 21, paddingBottom: 16, marginTop: 15 },
                                { elevation: wp(0.5), backgroundColor: 'white', borderRadius: wp(1) }
                            ]}
                            onPress={() => console.log("BBBBBBBB")}
                        >
                            <Text style={{ fontSize: wp(3.2), fontFamily: "Open Sans", color: "#5E5E5E" }}>Transactions</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {percentage_split_modal}
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
})