import React from 'react'
import { Animated, Image, Keyboard, LayoutAnimation, Platform, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { AccessToken, LoginManager } from "react-native-fbsdk"
import firebase from 'react-native-firebase'
import { GoogleSignin, statusCodes } from 'react-native-google-signin'
import URI from 'urijs'
import { Button, TextInput } from '../../components'
import { SaveObjectWithKey } from '../../components/AsyncStore'
import Loading from '../../components/Loading'
import { fonts } from '../../styles'
import { UserSignIn, UserSignUp } from '../backend/authentication'

const FORM_STATES = {
  LOGIN: 0,
  REGISTER: 1,
}

export default class AuthScreen extends React.Component {
  state = {
    anim: new Animated.Value(0),

    // Current visible form
    formState: this.props.navigation.getParam('form_state') == 'signup' ? FORM_STATES.REGISTER : FORM_STATES.LOGIN,
    isKeyboardVisible: false,
    name: '',
    email: 'ludal1@hotmail.com',
    password: 'admin',
    sso_type: '',
    firebase_token: '',
    loading: false,
  };

  componentWillMount() {
    if ((this.props.navigation.state.routeName === 'InitialAuth') && (this.props.isLogin)) {
      this.props.navigation.navigate('App')
    }

    // Refer and Earn - Get url the app was initiated from, if any and set referred_partner_id
    firebase.links().getInitialLink()
      .then(link => {
        if (link) {
          let url = URI.parse(link)
          let search_params = URI.parseQuery(url.query)
          let referred_partner_id = search_params.referred_partner_id

          this.setState({ referred_partner_id: referred_partner_id })
        }
      })

    // Keyboard Listners
    this.keyboardDidShowListener = Keyboard.addListener(
      Platform.select({ android: 'keyboardDidShow', ios: 'keyboardWillShow' }),
      this._keyboardDidShow.bind(this),
    )
    this.keyboardDidHideListener = Keyboard.addListener(
      Platform.select({ android: 'keyboardDidHide', ios: 'keyboardWillHide' }),
      this._keyboardDidHide.bind(this),
    )
  }

  componentDidMount() {
    Animated.timing(this.state.anim, { toValue: 3000, duration: 3000 }).start()
    GoogleSignin.configure({
      webClientId: '744053116568-2uev850h6nlm7mng11s4ih0r03ipej0l.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      // androidClientId: '744053116568-lsbe8k53oeouivhuu2ctsc1tis6eb8jp.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      androidClientId: '744053116568-9iuq5simj0vmommbhqllh6k7ijfi6e90.apps.googleusercontent.com', // release
      offlineAccess: false,
      // iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    })
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }

  onLogin() {

    this.setState({ sso_type: '', firebase_token: '' })
    if (this.state.formState === FORM_STATES.LOGIN) {
      this._login()
    } else if (this.state.formState === FORM_STATES.REGISTER) {
      this._register()
    }
  }

  initUser(token) {
    fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
      .then((response) => response.json())
      .then((json) => {
        // Some user object has been set up somewhere, build that user here
        this.setState({ sso_type: 'facebook', firebase_token: token, email: json.email, name: json.name }, this._login)
      })
      .catch(() => {
        reject('ERROR GETTING DATA FROM FACEBOOK')
      })
  }

  onFBSignin() {
    this.setState({ loading: true })
    LoginManager.logInWithPermissions(["email", "public_profile"]).then(result => {
      if (result.isCancelled) {
        this.setState({ loading: false })
      }
      else {
        AccessToken.getCurrentAccessToken().then((data) => {
          this.setState({ loading: false })
          const { accessToken } = data
          this.initUser(accessToken)
        })
          .catch(() => {
            this.setState({ loading: false })
            reject('ERROR GETTING DATA FROM FACEBOOK')
          })
      }
    }).catch(error => {
      this.setState({ loading: false })
      console.warn(`Login fail with error: ${error}`)
    }
    )
  }

  onGoogleSignin() {
    this.setState({ loading: true })
    GoogleSignin.hasPlayServices()
    GoogleSignin.signIn().then(userInfo => {
      this.setState({ sso_type: 'google', firebase_token: userInfo.idToken, email: userInfo.user.email, name: userInfo.user.name }, this._login)
    }).catch(error => {
      this.setState({ loading: false })

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }

    })
  }

  _login = async () => {

    this.setState({ loading: true })

    let firebase_token = await firebase.messaging().getToken()
    firebase_token = firebase_token ? firebase_token : ''

    // TODO - Google and Facebook login tokens not being passed for server side validation

    UserSignIn(this.state.email, this.state.password, this.state.sso_type, firebase_token, this.state.name, this.state.referred_partner_id)
      .then(result => {
        if (result.success) {
          SaveObjectWithKey('userData', result.result_data)
          this.props.UserLogin(result.result_data)

          this.setState({ loading: false })

          // Load fresh instance of App, so that all API calls are relative to the user
          // Initial Auth will automatically redirect to App.
          // this.props.navigation.navigate('InitialAuth')

          if (this.props.navigation.state.routeName === 'InitialAuth') {
            this.props.navigation.navigate('App')
          }
          else {
            this.props.navigation.navigate('InitialAuth')
          }
        } else {
          this.setState({ loading })
        }

      }).catch((error) => {
        console.warn(error)
        this.setState({ loading: false })
        ToastAndroid.show('Login API error', ToastAndroid.SHORT)
      })
  }

  _register() {

    this.setState({ loading: true })

    UserSignUp(this.state.name, this.state.email, this.state.password, this.state.referred_partner_id).then(result => {

      if (result.success)
        this._login()
      else {
        ToastAndroid.show('Registration Failed - API error', ToastAndroid.SHORT)
        this.setState({ loading: false })
      }

    }).catch(() => {
      this.setState({ loading: false })
      ToastAndroid.show('Register API error', ToastAndroid.SHORT)
    })
  }

  _keyboardDidShow() {
    LayoutAnimation.easeInEaseOut()
    this.setState({ isKeyboardVisible: true })
  }

  _keyboardDidHide() {
    LayoutAnimation.easeInEaseOut()
    this.setState({ isKeyboardVisible: false })
  }

  fadeIn(delay, from = 0) {
    const { anim } = this.state
    return {
      opacity: anim.interpolate({
        inputRange: [delay, Math.min(delay + 500, 3000)],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      }),
      transform: [
        {
          translateY: anim.interpolate({
            inputRange: [delay, Math.min(delay + 500, 3000)],
            outputRange: [from, 0],
            extrapolate: 'clamp',
          }),
        },
      ],
    }
  }

  render() {
    const isRegister = this.state.formState === FORM_STATES.REGISTER

    return (
      <View style={{ flex: 1 }}>
        {this.state.loading && <Loading />}
        <Animated.View style={styles.container}>
          <Animated.View style={[styles.title, { paddingTop: 20, width: '100%' }, this.fadeIn(700, -20)]}>
            <Animated.View
              style={[
                { height: 64 },
                { alignItems: 'center', justifyContent: 'center' }
              ]}
            >
              <Text style={{ fontSize: 18, fontFamily: fonts.primaryRegular, color: "#5C5A5A", alignSelf: "center" }}>
                {
                  this.state.formState === FORM_STATES.LOGIN
                    ? 'Login'
                    : 'Sign Up'
                }
              </Text>
            </Animated.View>
          </Animated.View>
          <Animated.View style={[styles.section, { paddingTop: 0, width: '100%' }, this.fadeIn(700, -20)]}>
            {this.state.formState === FORM_STATES.REGISTER && (
              <TextInput
                placeholder="Name"
                placeholderTextColor="#6D6D6D"
                style={[styles.textInput, {}]}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
              />
            )}

            <TextInput
              placeholder="Email"
              style={[styles.textInput]}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholderTextColor="#6D6D6D"
              onChangeText={(email) => this.setState({ email })}
              value={this.state.email}
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#6D6D6D"
              secureTextEntry
              style={[styles.textInput]}
              onChangeText={(password) => this.setState({ password })}
              value={this.state.password}
            />

            {!this.state.isKeyboardVisible && (
              <View style={{ marginTop: 48, height: 58, width: '100%' }}>
                <Button
                  bgColor="#2295DA"
                  textColor="#FFFFFF"
                  secondary
                  rounded
                  style={{ alignSelf: 'stretch', marginBottom: 10, width: '100%' }}
                  caption={
                    this.state.formState === FORM_STATES.LOGIN
                      ? 'Login'
                      : 'Sign Up'
                  }
                  onPress={() => this.onLogin()
                  }
                />
              </View>
            )}

            {!this.state.isKeyboardVisible && (
              <View style={styles.socialLoginContainer}>
                <View style={{ backgroundColor: "#C6C6C6", height: 1, marginTop: 9.5, width: 40 }} />
                <Text style={{ marginLeft: 5, fontSize: 16, fontFamily: "Open Sans", color: '#C6C6C6' }}>OR</Text>
                <View style={{ marginLeft: 5, backgroundColor: "#C6C6C6", height: 1, marginTop: 9.5, width: 40 }} />
              </View>
            )}

            {!this.state.isKeyboardVisible && (
              <View
                style={styles.socialLoginContainer}
              >
                <TouchableOpacity
                  onPress={() => this.onFBSignin()}
                >
                  <Image
                    style={{ width: 45, height: 45 }}
                    source={require('../../../assets/images/facebook.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[{ marginLeft: 26 }]}
                  onPress={() => this.onGoogleSignin()}
                >
                  <Image
                    style={{ width: 45, height: 45 }}
                    source={require('../../../assets/images/google-plus.png')}
                  />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>

          <Animated.View
            style={[styles.section, styles.middle, this.fadeIn(700, -20)]}
          >

            <Animated.View
              style={[styles.section, styles.bottom, this.fadeIn(700, -20)]}
            >

              <View
                style={[{ flexDirection: "column", marginBottom: 10 }]}
              >

                {!this.state.isKeyboardVisible && (
                  <TouchableOpacity
                    onPress={() => {
                      LayoutAnimation.spring()
                      this.setState({
                        formState: isRegister
                          ? FORM_STATES.LOGIN
                          : FORM_STATES.REGISTER,
                      })
                    }}
                    style={{ paddingTop: 30, flexDirection: 'row' }}
                  >
                    <Text
                      style={{
                        color: '#949494',
                        fontFamily: fonts.primaryRegular,
                      }}
                    >
                      {isRegister
                        ? 'Already Registered?'
                        : "Not Registered?"}
                    </Text>
                    <Text
                      style={{
                        color: '#0093DD',
                        fontFamily: fonts.primaryBold,
                        marginLeft: 5,
                      }}
                    >
                      {isRegister ? 'Log in' : 'Sign Up'}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {

                    if (this.props.navigation.state.routeName === 'InitialAuth') {
                      this.props.navigation.navigate('App')
                    }
                    else if (this.props.navigation.getParam('from_gogoster', false)) {
                      this.props.navigation.navigate({
                        routeName: 'Gogoster',
                        params: {},
                      })
                    }
                    else {
                      this.props.navigation.navigate({
                        routeName: 'Home',
                        params: {},
                      })
                    }

                  }}

                  style={{ marginTop: 20, fontSize: 16, height: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}
                >
                  <Text
                    style={{
                      color: '#90C5EC',
                      fontFamily: fonts.primaryRegular,
                    }}
                  > Skip for now </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 27,
    marginHorizontal: 27
  },
  title: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    flex: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  middle: {
    flex: 1,
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
  },
  bottom: {
    flex: 1,
    alignSelf: 'stretch',
    paddingBottom: Platform.OS === 'android' ? 30 : 0,
  },
  last: {
    justifyContent: 'flex-end',
  },
  textInput: {
    alignSelf: 'stretch',
    marginTop: 42,
    borderBottomColor: "#707070",
    borderBottomWidth: 1,
    width: '100%',
    color: '#000000'
  },
  logo: {
    height: 150,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 15,
    justifyContent: 'center',
  },
  socialButtonCenter: {
    marginLeft: 10,
    marginRight: 10,
  },
})
