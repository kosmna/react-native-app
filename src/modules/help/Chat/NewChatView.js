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
    ToastAndroid,
    SafeAreaView
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Faq from '../Faq';
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
} from "stream-chat-react-native";
import Loading from '../../../components/Loading';
import { BookAuthentication } from '../../backend/constants';


class NewChatView extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', 'Chat')
        };
    };

    state = {
        loading: true,
        base_url: this.props.navigation.getParam('base_url')
    }

    componentDidMount() {

        let channel = this.props.navigation.getParam('channel')
        let stream_user = this.props.navigation.getParam('stream_user')
        if (channel) {
            // Open the existing chat
            channel.watch()
            this.setState({ channel: channel, loading: false })
        }
        else {
            // Create a new chat

            let request_data = JSON.stringify({
                'Authorization': BookAuthentication,
                'partner_id': this.props.userInfo.partner_id,
                'referral_code': this.props.userInfo.partner_referral_code,
                'department_id': this.props.navigation.getParam('department_id'),
                'stream_chat_user_id': stream_user.me.id,
                'partner_name': this.props.userInfo.partner_name
            })

            axios({
                method: 'POST',
                url: this.state.base_url + "/createnewstreamchat" + '?data=' + request_data,
                responseType: 'json'
            })
                .then((response) => {
                    let data = response.data
                    if (data.success) {
                        this.set_new_channel(data.channel_id)
                        this.props.navigation.setParams({ 'title': data.channel_name })
                    }
                    else
                        ToastAndroid.show('Error creating new chat channel', ToastAndroid.SHORT)
                })
        }
    }

    set_new_channel = async (channel_id) => {

        const filter = { id: channel_id };
        const sort = { last_message_at: -1 };

        const channels = await stream_client.queryChannels(filter, sort);

        this.setState({ channel: channels[0], loading: false })
    }

    end_chat = () => {

        this.props.navigation.goBack()
        // End Chat

        let request_data = JSON.stringify({
            'Authorization': BookAuthentication,
            'partner_id': this.props.userInfo.partner_id,
            'referral_code': this.props.userInfo.partner_referral_code,
            'channel_id': this.state.channel.data.id,
            'channel_name': this.state.channel.data.name,
            'channel_image': 'https://images.unsplash.com/photo-1517976547714-720226b864c1'
        })

        axios({
            method: 'POST',
            url: this.state.base_url + "/bngendchat" + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                if (data.success) {
                    ToastAndroid.show('Chat has successfully Ended', ToastAndroid.SHORT)
                }
                else
                    ToastAndroid.show('Error ending chat', ToastAndroid.SHORT)
            })
    }

    render() {

        if (this.state.loading)
            return <Loading />

        return (
            <SafeAreaView style={{ flex: 1, paddingVertical: hp(2) }}>
                {
                    !this.state.channel.data.frozen &&
                    <View style={{ flex: 0.1, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={{ backgroundColor: '#ff0000', borderRadius: wp(3) }}
                            onPress={() => this.end_chat()}
                        >
                            <Text style={{ color: 'white', fontSize: wp(3.2), paddingVertical: hp(0.8), paddingHorizontal: wp(5) }}>End Chat</Text>
                        </TouchableOpacity>
                    </View>
                }
                <View style={{ flex: this.state.channel.data.frozen ? 1 : 0.9 }}>
                    <Chat client={stream_client}>
                        <Channel channel={this.state.channel}>
                            <View style={{ display: "flex", height: "100%" }}>
                                <MessageList />
                                {!this.state.channel.data.frozen ?
                                    <MessageInput
                                        hasImagePicker={false}
                                    /> :
                                    <View style={{ width: '100%', marginVertical: hp(3) }}>
                                        <Text style={{ fontSize: wp(3.5), textAlign: 'center' }}>Chat has ended.</Text>
                                        <Text style={{ fontSize: wp(3.5), textAlign: 'center' }}>You can no longer send messages here.</Text>
                                    </View>
                                }
                            </View>
                        </Channel>
                    </Chat>
                </View>
            </SafeAreaView>
        );
    }
}


function mapStateToProps(state) {
    return {
        'isLogin': state.home.isLogin,
        'userInfo': state.home.userInfo,
        'stream_user': state.help.stream_user
    }
}


export default connect(mapStateToProps)(NewChatView)
