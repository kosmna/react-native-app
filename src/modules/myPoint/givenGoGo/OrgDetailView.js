
import React from 'react'
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    ToastAndroid,
    TextInput
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Text } from '../../../components/StyledText'
import { BackendUrl, Authentication } from '../../backend/constants'
import axios from 'axios'
import Loading from '../../../components/Loading'
import _ from 'lodash'

export default class OrgDetailScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        let merchant = navigation.getParam('merchant')
        return {
            title: merchant.merchant_name
        }
    }

    state = {
        userInfo: this.props.navigation.getParam('userInfo'),
        partner_id: this.props.navigation.getParam('userInfo').partner_id,
        partner_referral_code: this.props.navigation.getParam('userInfo').partner_referral_code,
        merchant: this.props.navigation.getParam('merchant'),
        loading: true,
        split_percentage_popup: false
    };

    componentDidMount() {
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
                if (data.success) {
                    let givengogomerchantshare_list = _.unionBy(data.givengogomerchantshare_list, [this.state.merchant], 'merchant_id')
                    this.setState({ loyalty_balance: data.loyalty_balance, givengogomerchantshare_list: JSON.parse(JSON.stringify(givengogomerchantshare_list)), original_givengogomerchantshare_list: JSON.parse(JSON.stringify(givengogomerchantshare_list)), loading: false })
                }
                else
                    ToastAndroid.show('API Error', ToastAndroid.SHORT)
            })
            .catch(function (error) {
                ToastAndroid.show('API Error' + error, ToastAndroid.SHORT)
            })
    }

    update_merchent_list = () => {
        let total_percentage = 0
        this.state.givengogomerchantshare_list.forEach((item) => {
            total_percentage = total_percentage + parseInt(item.percentage)
        })

        if (total_percentage !== 100) {
            ToastAndroid.show('Total percentage must be equal to 100', ToastAndroid.SHORT)
            return
        }

        this.setState({ loading: true, split_percentage_popup: false })

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
                    this.props.navigation.navigate('GivengogoHome', { reload: true })
                    ToastAndroid.show('Organization added to your donation list', ToastAndroid.SHORT)
                }
                else
                    ToastAndroid.show('API Error', ToastAndroid.SHORT)
            })
            .catch(function (error) {
                ToastAndroid.show('API Error' + error, ToastAndroid.SHORT)
            })
    }

    render() {

        let percentage_split_modal = null
        if (!this.state.loading) {

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
                                defaultValue={merchant.percentage ? merchant.percentage.toString() : '0'}
                                value={merchant.percentage ? merchant.percentage.toString() : ''}
                                onChangeText={(percentage) => {
                                    let temp_merchant_list = JSON.parse(JSON.stringify(this.state.givengogomerchantshare_list))
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
                total_percentage = total_percentage + (parseInt(merchant.percentage) || 0)
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

            percentage_split_modal = (
                <Modal
                    transparent={true}
                    visible={this.state.split_percentage_popup}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0,0.3)' }}>
                        <View style={{ display: 'flex', justifyContent: 'center', paddingBottom: hp(2), width: wp(90), marginTop: hp(30), marginHorizontal: wp(5), backgroundColor: 'white', elevation: 4 }}>
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: wp(5), paddingVertical: hp(2), backgroundColor: '#E8F9F7' }}>
                                <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: '#0193DD' }}>Split Fund</Text>
                                <TouchableOpacity
                                    onPress={() => this.setState({ givengogomerchantshare_list: JSON.parse(JSON.stringify(this.state.original_givengogomerchantshare_list)), split_percentage_popup: false })}
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
        }

        return (
            <SafeAreaView style={styles.container}>
                {this.state.loading && <Loading />}
                {percentage_split_modal}

                <ScrollView
                    style={[styles.container]}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <Image
                        style={{ marginLeft: 15, marginRight: 15, marginTop: 13, height: 110, borderRadius: 4, resizeMode: 'stretch' }}
                        source={require('../../../../assets/images/home/flat-traveling-banner.png')}
                    />
                    <View
                        style={{ paddingLeft: wp(7), paddingRight: wp(7), marginTop: -25, height: 80, flexDirection: 'row' }}
                    >
                        <View
                            style={[
                                { width: 80, height: 80, borderRadius: 4, backgroundColor: '#FFFFFF', padding: 5 },
                                { elevation: 3 }
                            ]}
                        >
                            <Image
                                style={{ width: 75, height: 75, alignSelf: "center", resizeMode: 'stretch', borderRadius: 4 }}
                                source={{ uri: this.state.merchant.image_url }}
                            />
                        </View>
                        <View style={{ flexDirection: 'column-reverse', flex: 1, marginLeft: 11, paddingRight: 4, marginTop: 4 }}>
                            <Text numberOfLines={1} style={{ width: '100%', lineHeight: 18, letterSpacing: 0.14, fontSize: 13, fontFamily: "Open Sans", color: "#A2A2A4" }}>{this.state.merchant.website.split(',')[0]}</Text>
                            <Text numberOfLines={1} style={{ width: '100%', lineHeight: 19, fontSize: 14, fontFamily: "Open Sans", fontWeight: "600", color: "#5E5E5E", marginBottom: 1 }}>{this.state.merchant.merchant_name}</Text>
                        </View>
                    </View>
                    <Text style={{ width: '100%', marginTop: 12, paddingHorizontal: 18, lineHeight: 18, fontSize: 13, fontFamily: "Open Sans", fontWeight: "600", color: "#515151" }}>{this.state.merchant.description}</Text>

                    <View style={{ backgroundColor: "#CACCCF", height: 1, marginTop: 16.5, width: '100%', opacity: 0.21 }} />

                    {this.state.merchant.is_own &&
                        <View style={{ marginTop: 18, paddingHorizontal: '13%', flexDirection: "row", justifyContent: 'space-around', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{ width: 50, alignItems: 'center' }}
                                onPress={() => this.props.navigation.navigate('OrgDonate', { userInfo: this.state.userInfo, merchant: this.state.merchant })}
                            >
                                <Image
                                    style={{ alignSelf: 'center', width: 20, height: 26, resizeMode: 'contain' }}
                                    source={require('../../../../assets/images/rewards/icn_donate.png')}
                                />
                                <Text style={{ width: '100%', textAlign: 'center', lineHeight: 15, fontSize: 11, fontFamily: "Open Sans", fontWeight: '200', color: "#6D6B6B" }}>Donate</Text>
                            </TouchableOpacity>

                            <View
                                style={{ width: 50, alignItems: 'center' }}
                            >
                                <Image
                                    style={{ alignSelf: 'center', width: 20, height: 26, resizeMode: 'contain' }}
                                    source={require('../../../../assets/images/rewards/icn_shopping_bag.png')}
                                />
                                <Text style={{ width: '100%', textAlign: 'center', lineHeight: 15, fontSize: 11, fontFamily: "Open Sans", fontWeight: '200', color: "#6D6B6B" }}>Shop</Text>
                            </View>
                        </View>
                    }
                    <View style={{ height: 20 }} />
                </ScrollView>
                <View style={{ width: '100%', height: 90, alignItems: 'center', paddingRight: 7 }}>
                    <TouchableOpacity
                        style={{ width: 162, height: 50, backgroundColor: '#0093DD', borderRadius: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => {
                            // Show the modal
                            this.setState({ split_percentage_popup: !this.state.split_percentage_popup })
                        }}
                    >
                        <Image
                            style={{ alignSelf: 'center', width: 19, height: 21, resizeMode: 'contain' }}
                            source={require('../../../../assets/images/rewards/icn_heart_yellow.png')}
                        />
                        <Text
                            style={{ textAlign: 'center', marginLeft: 11, lineHeight: 15, fontSize: wp(3.2), fontFamily: "Open Sans", fontWeight: '200', color: "#FFFFFF" }}
                        >
                            Add to{"\n"}GivenGogo
                </Text>
                    </TouchableOpacity>
                </View>
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