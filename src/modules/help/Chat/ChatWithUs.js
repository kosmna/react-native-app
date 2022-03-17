import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    TouchableHighlight,
    Dimensions,
    ToastAndroid,
    Modal,
    SafeAreaView
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import Faq from '../Faq';
import { connect } from 'react-redux';

import { fonts, colors } from '../../../styles';
import { Text } from '../../../components/StyledText';
import Loading from '../../../components/Loading';
import _ from 'lodash'
import axios from 'axios'
import { BookAuthentication } from '../../backend/constants';

class ChatWithUs extends React.Component {

    static navigationOptions = {
        title: 'Chat With Us'
    }

    state = {
        loading: true,
        base_url: this.props.navigation.getParam('base_url')
    }

    componentDidMount() {

        let request_data = JSON.stringify({
            'Authorization': BookAuthentication,
            'partner_id': this.props.userInfo.partner_id,
            'referral_code': this.props.userInfo.partner_referral_code,
            'department_id': this.props.navigation.getParam('dept_id')
        })

        axios({
            method: 'POST',
            url: this.state.base_url + "/bnggetchatdepartmentfaqs" + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                if (data.success)
                    this.setState({ faq_data: data.faq_data, loading: false })
                else
                    ToastAndroid.show("Error fetching FAQ's", ToastAndroid.SHORT)
            })

    }

    render() {
        if (this.state.loading)
            return <Loading />

        let faqs = []
        let faq_data = this.state.faq_data

        // Sort by sqequence
        faq_data = _.sortBy(faq_data, 'sequence')

        faqs = faq_data.map((item, index) => {
            return (
                <Faq
                    key={index}
                    question={item.question}
                    answer={item.answer}
                />
            )
        })

        if (faq_data.length == 0)
            faqs.push(
                <View style={{ marginHorizontal: wp(20), marginVertical: hp(3) }}>
                    <Text style={{ fontSize: wp(3.5), textAlign: 'center' }}>No FAQ's</Text>
                </View>
            )

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <Text style={{ marginVertical: hp(1.5), marginHorizontal: wp(5), fontSize: wp(4.5) }}>{this.props.navigation.getParam('dept_name')} related common issues</Text>

                {/* FAQ's */}
                {faqs}

                <TouchableOpacity
                    style={{ position: 'absolute', bottom: hp(4), elevation: 2, width: wp(50), marginHorizontal: wp(25), height: hp(6), backgroundColor: '#0093DD', borderRadius: wp(1) }}
                    onPress={() => this.props.navigation.navigate('NewChatView', { department_id: this.props.navigation.getParam('dept_id'), base_url: this.state.base_url, stream_user: this.props.stream_user })}
                >
                    <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: 'white', width: '100%', height: '100%', textAlign: 'center', textAlignVertical: 'center' }}>Chat with Staff</Text>
                </TouchableOpacity>

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


export default connect(mapStateToProps)(ChatWithUs)
