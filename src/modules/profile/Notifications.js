import React from 'react'
import {
    ScrollView,
    View,
    TouchableOpacity,
    Image,
} from 'react-native'

import { Text } from '../../components/StyledText'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import axios from 'axios'
import Loading from '../../components/Loading'
import { Authentication, BackendUrl } from '../backend/constants'
import { connect } from 'react-redux'

class Notifications extends React.Component {

    static navigationOptions = {
        title: 'Notifications'
    }

    state = {
        notification_list: undefined,
        loading: true
    }

    componentDidMount() {
        this.load_notifications()
    }

    load_notifications = () => {

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.props.referral_code,
            'partner_id': this.props.partner_id
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/bnggetmobilenotification' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                if (response.data.success)
                    this.setState({ notification_list: response.data.notification_list }, () => {
                        this.setState({ loading: false })
                        this.props.update_notification_unread_count(0)
                    })
                else
                    this.setState({ api_error: true })
            })
            .catch(function (error) {
                console.log(error)
            })

    }

    render() {

        if (this.state.api_error)
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: wp(4) }}>No Notifications to Display</Text>
                </View>
            )

        if (this.state.loading)
            return <Loading />

        return_data = []
        previous_date = ''
        this.state.notification_list.forEach((notification, index) => {
            if (notification.notification_date != previous_date)
                return_data.push(
                    <Text key={notification.id + 'date'} style={{ paddingHorizontal: wp(5), marginTop: hp(2), marginBottom: hp(1), fontSize: wp(3.5), fontWeight: 'bold' }}>{notification.notification_date}</Text>
                )
            return_data.push(
                <TouchableOpacity
                    key={notification.id}
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: this.state.notification_list[index].is_read ? 'white' : '#edffff', height: hp(14), paddingHorizontal: wp(3), borderBottomColor: '#CACCCF', borderBottomWidth: 1 }}
                    onPress={() => {

                        let request_data = JSON.stringify({
                            'Authorization': Authentication,
                            'referral_code': this.props.referral_code,
                            'partner_id': this.props.partner_id,
                            'notification_id': notification.id
                        })

                        axios({
                            method: 'POST',
                            url: BackendUrl + '/bngupdatemobilenotification' + '?data=' + request_data,
                            responseType: 'json'
                        })
                            .then((response) => {
                                this.load_notifications()
                            })
                            .catch(function (error) {
                                console.log(error)
                            })

                        this.load_notifications()
                    }}
                >
                    <View style={{ flex: (this.state.notification_list[index].image_url && this.state.notification_list[index].image_url != '') ? 0.8 : 1 }}>
                        <Text style={{ fontSize: wp(3.5), fontWeight: 'bold' }}>{notification.notification_title}</Text>
                        <Text style={{ color: '#7A7C80', fontSize: wp(3.2), marginTop: hp(0.5) }}>{notification.notification_description}</Text>
                        <Text style={{ fontSize: wp(3), fontWeight: 'bold', marginTop: hp(1.5) }}>{notification.notification_time}</Text>
                    </View>
                    {(this.state.notification_list[index].image_url && this.state.notification_list[index].image_url != '') ?
                        <View style={{ flex: 0.2 }}>
                            <Image
                                source={{ uri: this.state.notification_list[index].image_url }}
                                style={{ height: wp(13), width: wp(13), backgroundColor: '#edffff' }}
                            />
                        </View> : null}
                </TouchableOpacity>
            )
            previous_date = notification.notification_date
        })

        return (
            <View style={{ flex: 1 }}>
                <ScrollView>
                    {return_data}
                </ScrollView>
            </View>
        )


    }
}

function mapStateToProps(state) {
    return {
        'partner_id': state.home.userInfo.partner_id,
        'referral_code': state.home.userInfo.partner_referral_code,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        update_notification_unread_count: (payload) => dispatch({ type: 'UPDATE_NOTIFICATION_COUNT', payload: payload })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)