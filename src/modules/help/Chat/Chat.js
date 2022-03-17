import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    Modal,
    SafeAreaView,
    ActivityIndicator,
    ToastAndroid
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { connect } from 'react-redux';

import { fonts, colors } from '../../../styles';
import { Text } from '../../../components/StyledText';
import axios from 'axios'

import { stream_client } from "../StreamInit";
import {
    Chat,
    Channel,
    MessageList,
    MessageInput,
    ChannelPreviewMessenger,
    ChannelList,
} from 'stream-chat-react-native';
import Loading from '../../../components/Loading';
import { Authentication, BookAuthentication } from '../../backend/constants';


class ChatScreen extends React.Component {

    static navigationOptions = {
        title: 'Chats',
    }

    state = {
        chat_view: 'ongoing',
        department_type_modal_visible: false,
        base_url: this.props.navigation.getParam('base_url'),
        show_start_chat: this.props.navigation.getParam('show_start_chat')
    }

    constructor(props) {
        super(props);
        this.handle_department_click = this.handle_department_click.bind(this);
    }

    handle_department_click = (dept_name, dept_id) => {
        this.setState({ department_type_modal_visible: false }, () => {
            this.props.navigation.navigate('ChatWithUs', { dept_name: dept_name, dept_id: dept_id, base_url: this.state.base_url });
        });
    }

    get_department_data = () => {

        let request_data = JSON.stringify({
            'Authorization': BookAuthentication,
            'partner_id': this.props.userInfo.partner_id,
            'referral_code': this.props.userInfo.partner_referral_code
        })

        axios({
            method: 'POST',
            url: this.state.base_url + "/bnggetsupportdepartments" + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data

                if (data.success)
                    this.setState({ department_data: data.departments })
                else
                    ToastAndroid.show('Error fetching Departments', ToastAndroid.SHORT)
            })
    }

    render() {

        let departments = []
        if (this.state.department_data)
            departments = this.state.department_data.map((item, index) => {
                return (
                    <TouchableOpacity key={index} onPress={() => this.handle_department_click(item.name, item.id)} style={styles.modal_each_item}><Text>{item.name}</Text></TouchableOpacity>
                )
            })
        else
            departments.push(
                <ActivityIndicator key={'loading'} size="small" color="#0000ff" />
            )

        return (
            <SafeAreaView style={{ flex: 1 }}>

                {/* Ongoing or past chat switcher */}
                <View style={{ flexDirection: 'row', borderRadius: 3, borderWidth: 2, borderColor: '#0093DD', width: wp(60), height: hp(3.5), marginHorizontal: wp(20), marginVertical: hp(3.5) }}>
                    <TouchableOpacity
                        style={{ flex: 0.5, backgroundColor: this.state.chat_view == 'ongoing' ? '#0093DD' : 'white', justifyContent: 'center', alignSelf: 'center', height: '100%' }}
                        onPress={() => this.setState({ chat_view: 'ongoing' })}
                    >
                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: wp(3.5), color: this.state.chat_view == 'ongoing' ? 'white' : 'black', fontWeight: this.state.chat_view == 'ongoing' ? 'bold' : 'normal' }}>Ongoing</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ flex: 0.5, justifyContent: 'center', alignSelf: 'center', height: '100%', backgroundColor: this.state.chat_view == 'past' ? '#0093DD' : 'white' }}
                        onPress={() => this.setState({ chat_view: 'past' })}
                    >
                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: wp(3.5), color: this.state.chat_view == 'past' ? 'white' : 'black', fontWeight: this.state.chat_view == 'past' ? 'bold' : 'normal' }}>Past</Text>
                    </TouchableOpacity>
                </View>

                {/* Join an existing user initiated chat */}
                {this.state.show_start_chat &&
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: wp(10) }}>
                        <Text>A user has initiated a new Chat</Text>
                        <TouchableOpacity
                            style={{ backgroundColor: '#0093DD', borderRadius: wp(1), marginRight: wp(5) }}
                            onPress={() => {

                                let request_data = JSON.stringify({
                                    'Authorization': BookAuthentication,
                                    'partner_id': this.props.userInfo.partner_id,
                                    'referral_code': this.props.userInfo.partner_referral_code,
                                    'stream_chat_user_id': this.props.stream_user.me.id,
                                    'partner_name': this.props.userInfo.partner_name
                                })

                                axios({
                                    method: 'POST',
                                    url: this.state.base_url + "/bngsupportjoinchat" + '?data=' + request_data,
                                    responseType: 'json'
                                })
                                    .then((response) => {
                                        let data = response.data

                                        if (data.success) {
                                            this.setState({ show_start_chat: false })
                                            ToastAndroid.show('Joined Chat', ToastAndroid.SHORT)
                                        }
                                        else
                                            ToastAndroid.show('Error joining channel', ToastAndroid.SHORT)
                                    })
                            }}
                        >
                            <Text style={{ marginHorizontal: wp(3), marginVertical: hp(1), color: 'white' }}>Join Chat</Text>
                        </TouchableOpacity>
                    </View>}

                {/* List of Chat Channels - Stream Chat Components */}
                <View style={{ flex: 1 }}>
                    <Chat key={this.state.chat_view === 'past'} client={stream_client}>
                        <View style={{ flex: 1, height: '100%', padding: 10 }}>
                            <ChannelList
                                filters={{ type: 'messaging', members: { $in: [this.props.stream_user.me.id] }, 'chat_ended': { $eq: (this.state.chat_view === 'past') } }}
                                sort={{ last_message_at: -1 }}
                                Preview={ChannelPreviewMessenger}
                                onSelect={(channel) => {
                                    this.props.navigation.navigate('NewChatView', { channel, title: channel.data.name, base_url: this.state.base_url })
                                }}
                                EmptyStateIndicator={() => (
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ marginVertical: hp(2), marginHorizontal: wp(10), textAlign: 'center' }}>No chats to show. Please start a new chat.</Text>
                                    </View>
                                )}
                                LoadingIndicator={() => <ActivityIndicator size="small" color="#0000ff" />}
                            />
                        </View>
                    </Chat>
                </View>


                <TouchableOpacity
                    style={{ position: 'absolute', bottom: hp(4), elevation: 2, width: wp(50), marginHorizontal: wp(25), height: hp(6), backgroundColor: '#0093DD', borderRadius: wp(1) }}
                    onPress={() => {
                        this.setState({ department_type_modal_visible: true }, () => {
                            this.get_department_data()
                        })
                    }}
                >
                    <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: 'white', width: '100%', height: '100%', textAlign: 'center', textAlignVertical: 'center' }}>Start a new Chat</Text>
                </TouchableOpacity>

                {/* Modal when 'Start a new Chat' is clicked */}
                <Modal
                    transparent={true}
                    visible={this.state.department_type_modal_visible}
                    animationType='fade'
                    onRequestClose={() => this.setState({ department_type_modal_visible: false })}
                >
                    <TouchableOpacity
                        style={{ height: '55%', width: '100%', opacity: 0.5, backgroundColor: 'gray' }}
                        onPress={() => this.setState({ department_type_modal_visible: false })}
                    />
                    <View style={{ flex: 1, paddingHorizontal: wp(5), backgroundColor: 'white', alignItems: 'center', paddingTop: hp(2) }}>
                        <Text style={{ fontSize: wp(3.5), textAlign: 'center' }}>In order to assist you, please select the department you would need help with</Text>
                        <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly', marginTop: hp(3) }}>
                            {departments}
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    modal_each_item: {
        paddingHorizontal: wp(5),
        paddingVertical: hp(1),
        borderWidth: 2,
        borderColor: '#0093DD',
        borderRadius: wp(5),
        fontSize: wp(3.5),
        color: '#0093DD',
        marginBottom: hp(0.5)
    }
})


function mapStateToProps(state) {
    return {
        'isLogin': state.home.isLogin,
        'userInfo': state.home.userInfo,
        'stream_user': state.help.stream_user
    }
}


export default connect(mapStateToProps)(ChatScreen)
