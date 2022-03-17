import React from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
    Animated,
    SafeAreaView
} from 'react-native';
import axios from 'axios';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Text } from '../../components/StyledText';
import Loading from '../../components/Loading.js';
import { BookBackendUrl, Authentication, BookAuthentication } from '../../modules/backend/constants'
import AuthView from '../auth/AuthViewContainer'
import { connect } from 'react-redux';
import { stream_client } from "./StreamInit";
import firebase from 'react-native-firebase';
import { fonts } from '../../styles';

class HelpScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    state = {
        loading: true,
        seekom_property_id: 13000,
        chat_initialized: false,
        base_url: this.props.navigation.getParam('base_url') || BookBackendUrl
    }

    static navigationOptions = {
        title: 'Help',
        header: null
    }

    load_data_from_server = () => {
        axios({
            method: 'POST',
            url: this.state.base_url + "/fetch_faqs_in_mobile_app",
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                "seekom_property_id": this.state.seekom_property_id
            },
            responseType: 'json'
        })
            .then((response) => {
                data = response.data.result;
                this.setState({ array_fetched: data }, () => {
                    this.setState({ loading: false })
                })
            })
    }

    get_stream_chat_token = async () => {

        let request_data = JSON.stringify({
            'Authorization': BookAuthentication,
            'partner_id': this.props.userInfo.partner_id,
            'referral_code': this.props.userInfo.partner_referral_code
        })

        axios({
            method: 'POST',
            url: BookBackendUrl + "/getstreamchattoken" + '?data=' + request_data,
            responseType: 'json'
        })
            .then(async (response) => {
                data = response.data

                if (data.success) {
                    this.setState({ 'show_start_chat': data.show_start_chat })

                    let user_data = await stream_client.setUser({
                        id: data.stream_chat_user_id,
                        name: this.props.userInfo.partner_name
                    },
                        data.stream_chat_user_token,
                    )

                    this.update_unread_count_realtime()

                    // Add stream user data to redux and update unread count for the first time
                    this.props.set_stream_user(user_data)
                    this.props.update_unread_count(user_data.me.unread_channels)

                    // Setup stream notifications
                    const fcmToken = await firebase.messaging().getToken()
                    stream_client.addDevice(fcmToken, 'firebase')
                }
                else
                    ToastAndroid.show('Error fetching Stream Chat token', ToastAndroid.SHORT)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    update_unread_count_realtime = () => {
        // Add listner to update chat unread counter in real time
        stream_client.on((event) => {
            if (event.unread_channels !== undefined && this.props.unread_count !== event.unread_channels) {
                this.props.update_unread_count(event.unread_channels)
            }
        });
    }

    componentDidMount() {

        if (!this.props.userInfo)
            return

        this.load_data_from_server();
        if (!this.props.stream_user)
            this.get_stream_chat_token();
    }

    render_faq = () => {
        return_data = []
        this.state.array_fetched.map((item, index) => {
            heading_record_array = this.state.array_fetched[index].heading_record_array;

            return_data.push(
                <EachFAQComponent
                    key={item.heading_id}
                    props_passed={this.props}
                    title={item.heading_title}
                    heading_record_array={heading_record_array}
                />);
        });
        return return_data
    }

    render() {
        if (!this.props.userInfo)
            return <AuthView
                should_navigate={false}
            />

        if (this.state.loading)
            return <Loading />

        return (
            // Contianer
            <SafeAreaView style={{ flex: 1, paddingBottom: hp(5), backgroundColor: '#F5F5F5' }}>
                {/* Header */}
                <Animated.View style={{ paddingTop: 10, width: '100%', marginLeft: 7, marginHorizontal: 7, marginHorizontal: hp(4) }}>
                    <Animated.View
                        style={[
                            { height: 44, width: '100%' },
                            { alignItems: 'center', justifyContent: 'space-between', flexDirection: "row", }
                        ]}
                    >
                        <TouchableOpacity
                            style={{ width: '33%' }}
                            onPress={() => {
                                if (this.props.navigation.getParam('back_route_name'))
                                    this.props.navigation.navigate(this.props.navigation.getParam('back_route_name'))
                                else
                                    this.props.navigation.navigate('Home')
                            }}
                        >
                            <Image
                                style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                                source={require('../../../assets/images/category/back.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ width: '34%', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center", }}>Help</Text>
                        </View>
                        <View style={{ width: '33%', justifyContent: 'flex-end' }} />
                    </Animated.View>
                </Animated.View>
                <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 0, width: '100%' }} />


                <View style={{ paddingHorizontal: wp(5), marginTop: hp(5) }}>

                    {/* first show chat component */}
                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', elevation: 2, paddingHorizontal: wp(5), paddingVertical: hp(2.5), borderRadius: wp(2), marginBottom: hp(1.5) }}
                        onPress={() => {
                            if (!this.props.stream_user)
                                return

                            this.props.navigation.navigate('Chat', { base_url: this.state.base_url, show_start_chat: this.state.show_start_chat })
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={require('../../../assets/images/help/discuss.png')}
                                style={{ width: wp(6), height: wp(5.2) }}
                            />
                            <View style={{ marginLeft: wp(4) }}>
                                <Text style={{ fontSize: wp(4), fontWeight: 'bold' }}>Chat</Text>
                            </View>
                        </View>
                        <View style={{ width: wp(7), borderRadius: wp(3), backgroundColor: this.props.stream_user ? '#0C9A37' : 'white' }}>
                            {this.props.stream_user ? <Text style={{ width: '100%', textAlign: 'center', color: 'white' }}>{this.props.unread_count}</Text> : <ActivityIndicator size="small" color="#0000ff" />}
                        </View>
                    </TouchableOpacity>

                    {/* then show rest components fetched from Odoo-server in JSON-Object. */}
                    {this.render_faq()}
                </View>

            </SafeAreaView>
        );
    }
}

const EachFAQComponent = ({ props_passed, title, heading_record_array }) => {
    return (
        <TouchableOpacity
            style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', elevation: 2, paddingHorizontal: wp(5), paddingVertical: hp(2.5), borderRadius: wp(2), marginBottom: hp(1.5) }}
            onPress={() => props_passed.navigation.navigate('HelpFaqs',
                { heading_record_array: heading_record_array, title: title })}
        >
            <View style={{ flexDirection: 'row' }}>
                <Image
                    source={require('../../../assets/images/help/question_mark.png')}
                    style={{ width: wp(5.5), height: wp(5.5) }}
                />
                <View style={{ marginLeft: wp(4) }}>
                    <Text style={{ fontSize: wp(4), fontWeight: 'bold' }}>{title}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}


function mapStateToProps(state) {
    return {
        'isLogin': state.home.isLogin,
        'userInfo': state.home.userInfo,
        'stream_user': state.help.stream_user,
        'unread_count': state.help.unread_count
    }
}

function mapDispatchToProps(dispatch) {
    return {
        set_stream_user: (payload) => dispatch({ type: 'SET_STREAM_USER', payload: payload }),
        update_unread_count: (payload) => dispatch({ type: 'UPDATE_UNREAD_COUNT', payload: payload })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HelpScreen)
