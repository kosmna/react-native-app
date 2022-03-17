import React from 'react'
import {
    View,
    SafeAreaView
} from 'react-native'

import FrameView from '../../modules/frame/FrameViewContainer'
import { bookngogo_url } from '../backend/constants'

export default class MyTrips extends React.Component {

    static navigationOptions = {
        header: null
    }

    render() {

        close_webview = () => this.props.navigation.goBack()

        return (
            <SafeAreaView style={{ flex: 1 }}>
                <FrameView
                    close_webview={this.close_webview}
                    url={{ uri: bookngogo_url + '/booking_details' }}
                />
            </SafeAreaView>
        )
    }
}