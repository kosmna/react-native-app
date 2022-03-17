import axios from 'axios'
import React from 'react'
import { Alert, Image, RefreshControl, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { WebView } from 'react-native-webview'
import { connect } from 'react-redux'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import { Text } from '../../components/StyledText'
import AuthView from '../auth/AuthViewContainer'
import { Authentication, BackendUrl } from '../backend/constants'


class UserNotLoggedInScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            request_to_login: false,
            redirect_to_signup_or_login: "login",
        }
    }

    navigateToLoginScreen(redirect_to_signup_or_login) {
        this.props.initial_auth(redirect_to_signup_or_login)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <View style={styles.gogoSterLogoImageViewContainer}>
                        <Image source={require('../../../assets/images/gogosterLogo.png')}
                            style={styles.gogosterBrandingLogoStyles} />
                    </View>

                    <View style={styles.salesPitchSentenceViewContainer}>
                        <View style={styles.sentencesContainer} >
                            <Text style={styles.salesEachSentenceStyle}>Social is Our Game</Text>
                            <Text style={styles.salesEachSentenceStyle}>Data freedom is Our Aim</Text>
                            <Text style={styles.salesEachSentenceStyle}>Advertising Free - Earn Rewards</Text>
                        </View>
                    </View>

                    <View style={styles.gogosterCartoonsImageContainer}>
                        <Image source={require('../../../assets/images/gogoster_cartoons_image.png')}
                            style={styles.gogosterCartoonsImageStyles} />
                    </View>

                    <View style={styles.buttonContainerAtBottom}>

                        <Button
                            bgColor="#2295DA"
                            textColor="#FFFFFF"
                            secondary
                            rounded
                            style={{ alignSelf: 'stretch', marginTop: hp(5), width: '35%', marginLeft: wp(6) }}
                            caption={'SIGN UP'}
                            onPress={() => this.navigateToLoginScreen(redirect_to_signup_or_login = "signup")
                            }
                        />

                        <Button
                            bgColor="#4cd137"
                            textColor="#FFFFFF"
                            secondary
                            rounded
                            style={{ alignSelf: 'stretch', marginTop: hp(5), width: '35%', marginRight: wp(6) }}
                            caption={'LOGIN'}
                            onPress={() => this.navigateToLoginScreen(redirect_to_signup_or_login = "login")
                            }
                        />


                    </View>
                </View>
            </View>
        )
    }
}


class GogosterScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            refreshing: false
        }
        this.onRefresh = this.onRefresh.bind(this)
    }

    componentDidMount() {

        if (!this.props.userInfo)
            return

        this.props.navigation.setParams({
            tapOnTabNavigator: this.tapOnTabNavigator
        })

        this.props.navigation.setParams({ userInfo: this.props.userInfo })
        this.get_access_token()
    }

    // Call on tab bar tap
    tapOnTabNavigator = () => {
        this.onRefresh()
    }

    get_access_token = () => {
        let payload = JSON.stringify({
            "referral_code": this.props.userInfo.partner_referral_code,
            "partner_id": this.props.userInfo.partner_id,
            "Authorization": Authentication
        })
        axios({
            method: 'POST',
            url: BackendUrl + '/getbngcreategogosteruser?data=' + payload,
            responseType: 'json'
        })
            .then((response) => {
                if (response.data.success)
                    this.setState({ access_token: response.data.access_token })
                else
                    Alert.alert('Server Error', 'Error Msg: ' + response.data.error_info)
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    onRefresh = () => {
        this.setState({
            refreshing: true
        })
        this.WebViewRef.reload()
        this.setState({
            refreshing: false
        })
    }

    initial_auth = (redirect_to_signup_or_login) => this.props.navigation.navigate('Auth', { form_state: redirect_to_signup_or_login, from_gogoster: true })

    render() {

        if (this.props.userInfo && this.state.access_token)
            return (
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView
                        contentContainerStyle={{ flex: 1 }}
                        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
                    >
                        <View style={{ flex: 1 }}>

                            <WebView
                                source={{ uri: 'https://www.gogoster.com?access_token=' + this.state.access_token }}
                                onLoad={() => this.setState({ loading: false })}
                                ref={WebViewRef => (this.WebViewRef = WebViewRef)}
                            />
                        </View>
                    </ScrollView>
                </SafeAreaView>
            )

        else if (!this.props.userInfo) {
            return <UserNotLoggedInScreen initial_auth={this.initial_auth} />
        }

        return <Loading />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    gogoSterLogoImageViewContainer: {
        flex: 0.2,
        // backgroundColor: 'yellow',
    },
    gogosterBrandingLogoStyles: {
        resizeMode: 'contain',
        height: hp(12),
        width: wp(60),
        marginTop: hp(5),
        marginLeft: wp(0)
    },
    salesPitchSentenceViewContainer: {
        flex: 0.20,
    },
    sentencesContainer: {
        marginLeft: wp(5),
        marginTop: hp(0),
        width: wp(80),
        // borderColor: 'gray',
        // borderWidth: wp(2)
    },
    salesEachSentenceStyle: {
        fontSize: wp(5),
        marginVertical: wp(1),
        color: "#0997FF"
    },
    gogosterCartoonsImageContainer: {
        flex: 0.45,
        // backgroundColor: 'red'
    },
    gogosterCartoonsImageStyles: {
        resizeMode: 'contain',
        height: hp(35),
        width: wp(90),
        marginRight: wp(10),
        marginBottom: hp(5)
    },
    buttonContainerAtBottom: {
        flex: 0.15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: 'blue'
    },
    signUpButtonContainer: {
        height: hp(8),
        width: wp(40),
        marginHorizontal: wp(5),
        backgroundColor: '#24a0ed',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: wp(6)
    },
    loginButtonContainer: {
        height: hp(8),
        width: wp(40),
        marginHorizontal: wp(5),
        backgroundColor: '#4cd137',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: wp(6)
    },
    loginButtonTextStyles: {
        fontSize: wp(5, 5),
        marginHorizontal: wp(1),
        marginVertical: hp(1),
        alignSelf: 'center',
        color: 'white'
    }



})

function mapStateToProps(state) {
    return {
        'userInfo': state.home.userInfo,
    }
}

export default connect(mapStateToProps)(GogosterScreen)