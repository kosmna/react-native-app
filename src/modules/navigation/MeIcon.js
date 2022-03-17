import React from 'react'
import {
    StyleSheet,
    View,
    Image
} from 'react-native'
import { fonts } from '../../styles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import axios from 'axios'
import { Authentication, BackendUrl } from '../backend/constants'
import { connect } from 'react-redux'

const iconMe = require('../../../assets/images/tabbar/me.png')

class MeIcon extends React.Component {

    static navigationOptions = {
        title: 'Notifications'
    }

    componentDidMount() {
        this.load_notifications()
    }

    load_notifications = () => {

        if (!this.props.user_info)
            return

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.props.user_info.partner_referral_code,
            'partner_id': this.props.user_info.partner_id
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/bnggetmobilenotification' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                if (response.data.success) {
                    let notification_list = response.data.notification_list
                    let unread_notification_list = notification_list.filter((obj) => !obj.is_read)

                    this.props.update_notification_unread_count(unread_notification_list.length)
                }
            })
            .catch(function (error) {
                console.log(error)
            })

    }

    render() {

        return (
            <View style={styles.tabBarItemContainer}>
                {(this.props.notification_unread_count > 0) && <View style={{ position: 'absolute', right: wp(0), top: hp(0.7), height: wp(1.2), width: wp(1.2), borderRadius: wp(10), backgroundColor: 'red' }} />}
                <Image
                    resizeMode="contain"
                    source={iconMe}
                    style={[styles.tabBarIcon, this.props.focused && styles.tabBarIconFocused]}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    tabBarItemContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: wp(8)
    },
    tabBarIcon: {
        width: wp(4.4),
        height: wp(4.4),
    },
    tabBarIconFocused: {
        tintColor: '#0093DD',
    },
    tabBarLabel: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        fontSize: wp(3.2)
    },
    tabBarLabelFocused: {
        color: '#0093DD',
    },
    headerContainer: {
        height: hp(9),
        alignItems: 'center',
        justifyContent: 'center',
    },
})


function mapStateToProps(state) {
    return {
        'user_info': state.home.userInfo,
        'notification_unread_count': state.app.notification_unread_count
    }
}

function mapDispatchToProps(dispatch) {
    return {
        update_notification_unread_count: (payload) => dispatch({ type: 'UPDATE_NOTIFICATION_COUNT', payload: payload })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MeIcon)