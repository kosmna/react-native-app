import axios from 'axios'
import _ from 'lodash'
import React from 'react'
import { Animated, Image, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import Loading from '../../components/Loading'
import { Text } from '../../components/StyledText'
import Faq from '../../modules/help/Faq'
import { fonts } from '../../styles'
import { Authentication, BackendUrl, BookBackendUrl } from '../backend/constants'


class MyPointScreen extends React.Component {

    static navigationOptions = {
        header: null
    }

    state = {
        question1Visible: false,
        question2Visible: false,
        question3Visible: false,
        no_transactions: false,
        loading: true,
        top_loading: true,
        fetched_faqs_array: []
    };

    componentDidMount() {
        this.props.navigation.setParams({ userInfo: this.props.userInfo }) // Do not remove

        if (!this.props.userInfo)
            return

        this.get_loyalty_details()
        this.load_faqs_array_from_server()

        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            (payload) => {
                this.setState({ top_loading: true })
                this.get_loyalty_details()
            }
        )
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove()
    }

    get_loyalty_details = () => {
        let payload = JSON.stringify({
            'Authorization': Authentication,
            "referral_code": this.props.userInfo.partner_referral_code,
            "partner_id": this.props.userInfo.partner_id,
            "loyalty_gettype": "detail",
            "email": this.props.userInfo.partner_email,
            "start_date": "",
            "end_date": ""
        })
        axios({
            method: 'POST',
            url: BackendUrl + '/bng/GetLoyaltyDetails' + '?data=' + payload,
            responseType: 'json'
        })
            .then((response) => {
                if (response.data.success == true) {

                    this.setState({ top_loading: false })

                    if (Object.keys(response.data.loyalty_list).length === 0)
                        this.setState({ no_transactions: true, loading: false })
                    else
                        this.setState({ points_data: response.data, loading: false })
                }
                else
                    alert('Sorry something went wrong, please try again')
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    load_faqs_array_from_server = () => {
        axios({
            method: 'POST',
            url: BookBackendUrl + "/fetch_rewards_faqs_in_mobile_app",
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                "seekom_property_id": this.state.seekom_property_id
            },
            responseType: 'json'
        })
            .then((response) => {
                data = response.data.result
                this.setState({ fetched_faqs_array: data })
            })
    }

    render() {

        if (this.state.loading)
            return (
                <Loading />
            )
        else {

            let bookngogo_available = 0
            let gogo_available = 0

            if (!this.state.no_transactions) {
                bookngogo_available = 0
                gogo_available = this.state.points_data['loyalty_list']['gogo_available']

                if (_.has(this.state.points_data, ['loyalty_list', 'outlet', 'Bookngogo', 'total_gogo'])) {
                    bookngogo_available = this.state.points_data['loyalty_list']['outlet']['Bookngogo']['total_gogo']
                    gogo_available = gogo_available - bookngogo_available
                }
            }

            return (
                <SafeAreaView style={{ flex: 1, backgroundColor: "#FCFCFC" }}>

                    {this.state.top_loading && <Loading />}

                    <Animated.View style={{ width: '100%', paddingHorizontal: wp(5), paddingVertical: hp(0.5) }}>
                        <Animated.View
                            style={[
                                { height: 44, width: '100%' },
                                { alignItems: 'center', justifyContent: 'space-between', flexDirection: "row", }
                            ]}
                        >
                            <TouchableOpacity
                                style={{ width: '33%' }}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'Home',
                                    params: {},
                                })
                                }
                            >
                                <Image
                                    style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                                    source={require('../../../assets/images/category/back.png')}
                                />
                            </TouchableOpacity>
                            <View style={{ width: '34%', alignContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>Rewards</Text>
                            </View>
                            <View style={{ width: '33%', justifyContent: 'flex-end' }} />
                        </Animated.View>
                    </Animated.View>
                    <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 0, width: '100%' }} />

                    <ScrollView style={{ backgroundColor: "#FCFCFC" }}>
                        <View style={{ backgroundColor: "#FCFCFC", marginTop: hp(2), marginBottom: hp(5) }}>

                            {/* Bookngogo $ Points */}
                            <TouchableOpacity
                                style={styles.Category}
                                onPress={() => !this.state.no_transactions && this.props.navigation.navigate('BookngogoPoint', { outlet_data: this.state.no_transactions ? [] : this.state.points_data['loyalty_list']['outlet'] })}
                            >
                                <View style={{ flexDirection: "row", marginRight: 24, justifyContent: 'space-between' }}>
                                    <View style={{ flex: 0.4, flexDirection: "row", alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Image
                                            style={{ height: hp(3.5), resizeMode: 'contain', marginLeft: wp(15) }}
                                            source={require('../../../assets/images/my_point/bookngogo_dollar.png')}
                                        />
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                                        <Text style={{ alignSelf: 'center', width: 50, fontSize: 17, fontFamily: "Open Sans", color: '#515151' }}>{this.state.no_transactions ? '$' + 0 : '$' + bookngogo_available}</Text>
                                        <Image
                                            style={{ alignSelf: 'center', marginLeft: 14, width: 6, height: 10, resizeMode: 'stretch' }}
                                            source={require('../../../assets/images/home/arrow.png')}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Gogo Points */}
                            <TouchableOpacity
                                style={styles.Category}
                                onPress={() => !this.state.no_transactions && this.props.navigation.navigate('GogoPoint', { outlet_data: this.state.no_transactions ? [] : this.state.points_data['loyalty_list']['outlet'] })}
                            >
                                <View style={{ flexDirection: "row", marginRight: 24, justifyContent: 'space-between' }}>
                                    <View style={{ flex: 0.4, flexDirection: "row", alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Image
                                            style={{ height: hp(3.5), resizeMode: 'contain' }}
                                            source={require('../../../assets/images/rewards/gogo$.png')}
                                        />
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                                        <Text style={{ alignSelf: 'center', width: 50, fontSize: 17, fontFamily: "Open Sans", color: '#515151' }}>{this.state.no_transactions ? '$' + 0 : '$' + gogo_available}</Text>
                                        <Image
                                            style={{ alignSelf: 'center', marginLeft: 14, width: 6, height: 10, resizeMode: 'stretch' }}
                                            source={require('../../../assets/images/home/arrow.png')}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Travel Points */}
                            <TouchableOpacity
                                style={styles.Category}
                                onPress={() => !this.state.no_transactions && this.props.navigation.navigate('TravelPoint', { outlet_data: this.state.points_data['loyalty_list']['outlet'], type: 'travel', balance: this.state.points_data['loyalty_list']['travel_available'] })}
                            >
                                <View style={{ flexDirection: "row", marginLeft: 0, marginHorizontal: 24, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                                        <Image
                                            style={{ alignSelf: 'center', marginLeft: 26, resizeMode: 'stretch' }}
                                            source={require('../../../assets/images/rewards/travel.png')}
                                        />
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                                        <Text style={{ alignSelf: 'center', width: 50, fontSize: 17, fontFamily: "Open Sans", color: '#515151' }}>{this.state.no_transactions ? '$' + 0 : '$' + this.state.points_data['loyalty_list']['travel_available']}</Text>
                                        <Image
                                            style={{ alignSelf: 'center', marginLeft: 14, width: 6, height: 10, resizeMode: 'stretch' }}
                                            source={require('../../../assets/images/home/arrow.png')}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Cash Points */}
                            <TouchableOpacity
                                style={styles.Category}
                                onPress={() => !this.state.no_transactions && this.props.navigation.navigate('TravelPoint', { outlet_data: this.state.points_data['loyalty_list']['outlet'], type: 'gogo', balance: this.state.points_data['loyalty_list']['cash_available'] })}
                            >
                                <View style={{ flexDirection: "row", marginLeft: 0, marginHorizontal: 24, justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                                        <Image
                                            style={{ alignSelf: 'center', marginLeft: 26, resizeMode: 'stretch' }}
                                            source={require('../../../assets/images/rewards/gogocard.png')}
                                        />
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                                        <Text style={{ alignSelf: 'center', width: 50, fontSize: 17, fontFamily: "Open Sans", color: '#515151' }}>{this.state.no_transactions ? '$' + 0 : '$' + this.state.points_data['loyalty_list']['cash_available']}</Text>
                                        <Image
                                            style={{ alignSelf: 'center', marginLeft: 14, width: 6, height: 10, resizeMode: 'stretch' }}
                                            source={require('../../../assets/images/home/arrow.png')}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* GiveNGoGo */}
                            <TouchableOpacity
                                style={styles.Category}
                                onPress={() => {
                                    this.props.navigation.navigate({
                                        routeName: 'GivengogoHome',
                                        params: { userInfo: this.props.userInfo },
                                    })
                                }}
                            >
                                <View style={{ flexDirection: "row", marginRight: 24, marginLeft: 15, justifyContent: 'space-between' }}>
                                    <View style={{ flex: 0.5, flexDirection: "row", alignItems: 'flex-start', justifyContent: 'center' }}>
                                        <Image
                                            style={{ height: hp(4), resizeMode: 'contain' }}
                                            source={require('../../../assets/images/rewards/givengogo.png')}
                                        />
                                    </View>
                                    <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                                        <Text style={{ alignSelf: 'center', width: 50, fontSize: 17, fontFamily: fonts.primaryRegular, color: '#515151' }}>{this.state.no_transactions ? '$0' : '$' + this.state.points_data['loyalty_list']['givengogo_available']}</Text>
                                        <Image
                                            style={{ alignSelf: 'center', marginLeft: 14, width: 6, height: 10, resizeMode: 'stretch' }}
                                            source={require('../../../assets/images/home/arrow.png')}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Other Items */}
                            <TouchableOpacity
                                style={styles.Category}
                                onPress={() => ToastAndroid.show('To be DONE', ToastAndroid.SHORT)}
                            >
                                <View style={{ flexDirection: "row", marginLeft: 0, marginHorizontal: 24, justifyContent: 'flex-start' }}>
                                    <Image
                                        style={{ alignSelf: 'center', marginLeft: 26, resizeMode: 'stretch' }}
                                        source={require('../../../assets/images/rewards/subscriptions.png')}
                                    />
                                    <Text style={{ alignSelf: 'center', marginLeft: 9, fontSize: 15, fontFamily: fonts.primaryRegular, color: '#0093DD' }}>Subscriptions</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.Category}
                                onPress={() => {
                                    this.props.navigation.navigate({
                                        routeName: 'GiftCard',
                                        params: { userInfo: this.props.userInfo },
                                    })
                                }}
                            >
                                <View style={{ flexDirection: "row", marginLeft: 0, marginHorizontal: 24, justifyContent: 'flex-start' }}>
                                    <Image
                                        style={{ alignSelf: 'center', marginLeft: 26, resizeMode: 'stretch' }}
                                        source={require('../../../assets/images/rewards/giftcard.png')}
                                    />
                                    <Text style={{ alignSelf: 'center', marginLeft: 9, fontSize: 15, fontFamily: fonts.primaryRegular, color: '#0093DD' }}>Gift Cards</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.Category}
                                onPress={() => ToastAndroid.show('To be DONE', ToastAndroid.SHORT)}
                            >
                                <View style={{ flexDirection: "row", marginLeft: 0, marginHorizontal: 24, justifyContent: 'flex-start' }}>
                                    <Image
                                        style={{ alignSelf: 'center', marginLeft: 26, resizeMode: 'stretch' }}
                                        source={require('../../../assets/images/rewards/services.png')}
                                    />
                                    <Text style={{ alignSelf: 'center', marginLeft: 9, fontSize: 15, fontFamily: fonts.primaryRegular, color: '#0093DD' }}>Services</Text>
                                </View>
                            </TouchableOpacity>


                            {/* FAQ's */}
                            <View style={[{ marginTop: hp(5), marginBottom: 4, width: '100%', marginLeft: wp(3), justifyContent: 'center' }]}>
                                <Text style={{ fontSize: 20, fontFamily: fonts.primarySemiBold, color: "#918888" }}>FAQ's</Text>
                            </View>
                            {this.state.fetched_faqs_array.map((i, index) => {
                                return (
                                    <Faq
                                        key={i.sequence}
                                        question={i.question}
                                        answer={i.answer}
                                    />
                                )
                            })}

                        </View>
                    </ScrollView>
                </SafeAreaView>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    countryView: {
        marginLeft: 6,
        borderRadius: 4,
        height: 27,
        borderColor: '#0093DD',
        borderWidth: 1,
        paddingLeft: 14,
        paddingRight: 14,
        justifyContent: 'center',
        color: '#0093DD'
    },
    countryText: {
        fontSize: 13,
        fontFamily: fonts.primaryRegular,
        color: '#0093DD'
    },
    Category: {
        marginLeft: 12,
        marginTop: 7,
        marginHorizontal: 12,
        justifyContent: 'center',
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        height: 55,
        elevation: 2
    },
    Question: {
        marginLeft: 12,
        marginTop: 4,
        marginHorizontal: 12,
        justifyContent: 'center',
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        borderColor: '#ddd',
        borderWidth: 1,
        paddingHorizontal: wp(5),
        paddingVertical: hp(0.3)
    },
})


function mapStateToProps(state) {
    return {
        'userInfo': state.home.userInfo,
    }
}

export default connect(mapStateToProps)(MyPointScreen)