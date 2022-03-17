import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
    Alert,
    TextInput
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Text } from '../../components/StyledText';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import FrameScreen from "../frame/FrameViewContainer";
import {BookBackendUrl} from "../backend/constants"
import { fonts } from '../../styles';

export default class AddCard extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            displayWebView: true,
            url: {uri: BookBackendUrl + "/card_add_mobile"}
        }
        this.close_webview = this.close_webview.bind(this);
    }
    static navigationOptions = {
        title: 'Add Credit/Debit Card'
    }
    close_webview = () => {
        this.setState({ onclick_open_webview: false })
        this.props.navigation.pop()
    }

    render() {
        return (
            
            <View style={styles.container}>
                {this.state.displayWebView && <FrameScreen 
                    close_webview={this.close_webview}
                    url={this.state.url}
                />}
                
            </View>
            
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    name_input: {
        width: '100%',
        height: hp(5),
        backgroundColor: 'white',
        fontFamily: fonts.primaryRegular,
        paddingHorizontal: wp(4),
    },
    label_text: {
        fontSize: wp(4),
        marginBottom: hp(1),
        color: '#515151',
        fontFamily: fonts.primaryRegular
    },
    add_button: {
        width: '100%',
        height: hp(5),
        marginTop: hp(10),
        borderRadius: hp(0.5)
    },
    save_card_text: {
        width: '100%',
        height: '100%',
        fontSize: wp(4),
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
})
