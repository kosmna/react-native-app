import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
    Alert,
    TextInput,
    StatusBar,
    ToastAndroid,
    Clipboard
} from 'react-native';

import { Text } from '../../components/StyledText';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import Share from 'react-native-share';
import axios from 'axios';
import Loading from '../../components/Loading';
import { BackendUrl } from '../backend/constants';
import WebView from 'react-native-webview'

import { connect } from 'react-redux';
import FrameScreen from "../frame/FrameViewContainer";

export default class SavedSearchWebview extends React.Component {

    static navigationOptions = {
        header: null
    }

    close_webview = () => {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <FrameScreen
                    close_webview={this.close_webview}
                    url={{ uri: this.props.navigation.getParam('uri') }}
                    zero_flex={false}
                />
            </View>
        )
    }
}