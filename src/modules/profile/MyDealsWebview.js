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
import AutoHeightWebView from 'react-native-autoheight-webview'
import moment from "moment";


export default class MyDeals extends React.Component {

    static navigationOptions = {
        title: 'My Deals'
    }

    state = {
        loading: true,
        data: this.props.navigation.getParam('data')
    }

    componentDidMount() {
        let links = this.state.data.links || []
        let instore, instore_print, other_link, final_instore

        links.forEach((link) => {
            if (link.type == 'instore_print')
                instore_print = link
            else if (link.type == 'instore')
                instore = link
            else if (link.type == 'link')
                other_link = link
        })

        if ((instore && instore_print) || instore)
            final_instore = instore
        else if (instore_print)
            final_instore = instore_print

        this.setState({ final_instore: final_instore, other_link: other_link }, () => {
            if (this.state.final_instore && this.state.other_link)
                this.setState({ deal_view: 'webview' })
            else if (this.state.final_instore)
                this.setState({ just_show_webview: true })
            else if (this.state.other_link)
                this.setState({ just_show_other_link: true })

            this.setState({ loading: false })
        })
    }

    render() {

        if (this.state.loading)
            return <Loading />

        return (
            <View style={{ flex: 1 }}>

                {/* Deal type switcher */}
                {
                    (this.state.final_instore && this.state.other_link) &&
                    < View style={{ flexDirection: 'row', borderRadius: 3, borderWidth: 2, borderColor: '#0093DD', width: wp(60), height: hp(3.5), marginHorizontal: wp(20), marginVertical: hp(1.5) }}>
                        <TouchableOpacity
                            style={{ flex: 0.5, backgroundColor: this.state.deal_view == 'webview' ? '#0093DD' : 'white', justifyContent: 'center', alignSelf: 'center', height: '100%' }}
                            onPress={() => this.setState({ deal_view: 'webview' })}
                        >
                            <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: wp(3.5), color: this.state.deal_view == 'webview' ? 'white' : 'black', fontWeight: this.state.deal_view == 'webview' ? 'bold' : 'normal' }}>{this.state.final_instore.type == 'instore' ? 'Instore' : 'Instore Print'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 0.5, justifyContent: 'center', alignSelf: 'center', height: '100%', backgroundColor: this.state.deal_view == 'other' ? '#0093DD' : 'white' }}
                            onPress={() => this.setState({ deal_view: 'other' })}
                        >
                            <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: wp(3.5), color: this.state.deal_view == 'other' ? 'white' : 'black', fontWeight: this.state.deal_view == 'other' ? 'bold' : 'normal' }}>Other</Text>
                        </TouchableOpacity>
                    </View>
                }

                {/* Webview to show instore or instore_links pages */}
                {
                    (this.state.deal_view == 'webview' || this.state.just_show_webview) &&
                    <WebView
                        source={{ uri: this.state.final_instore.link }}
                    />
                }

                {/* Webview to show other links or text */}
                {
                    (this.state.deal_view == 'other' || this.state.just_show_other_link) &&
                    <View style={{ height: '100%', marginVertical: hp(3), marginHorizontal: wp(10) }}>
                        <AutoHeightWebView
                            source={{ html: '<p style="font-size:16;color:#A2A2A4;">' + this.state.other_link.display + '</p>' }}
                        />
                    </View>
                }
            </View >
        )

    }
}