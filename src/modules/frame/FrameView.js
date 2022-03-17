import React from 'react'
import { BackHandler, ToastAndroid, View } from 'react-native'
import { WebView } from 'react-native-webview'
import Loading from '../../components/Loading'

export default class FrameScreen extends React.Component {
  state = {
    loading: true
  };

  register_back_handler = () => {
    // Do nothing when hardware back button is pressed
    this.back_handler = BackHandler.addEventListener('hardwareBackPress', () => {
      ToastAndroid.show('Use the button on top to go back', ToastAndroid.SHORT)
      return true
    })
  }

  unregister_back_handler = () => {
    // Remove back handler when component is unmounted
    if (this.back_handler)
      this.back_handler.remove()
  }

  componentDidMount() {
    // Register backhandler for webviews where flex is not zero
    if (!this.props.zero_flex)
      this.register_back_handler()
  }

  componentWillUnmount() {
    this.unregister_back_handler()
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.back_handler && this.props.zero_flex) {
      this.unregister_back_handler()
    }
    else if (!this.back_handler && !this.props.zero_flex) {
      this.register_back_handler()
    }
  }

  hideSpinner = () => {
    this.setState({
      loading: false
    })
  }

  // Close webview when back button is pressed in webview
  onMessage = (event) => {
    let post_data = JSON.parse(event.nativeEvent.data)
    if (post_data.close_webview)
      this.props.close_webview()
  }

  render() {
    const { userInfo } = this.props
    const url = this.props.url || this.props.navigation.getParam('url')
    let { uri } = url
    if (userInfo !== null) {
      if (uri.indexOf("?") === -1)
        uri += "?hideheader=true"
      else
        uri += "&hideheader=true"
      uri += `&al_email=${userInfo.partner_email}`
      uri += `&al_referral_code=${userInfo.partner_referral_code}`
    }
    return (
      <View style={{ flex: this.props.zero_flex ? 0 : 1 }}>
        {(this.state.loading && !this.props.zero_flex) && <Loading />}
        <WebView
          source={{ uri }}
          onLoad={this.hideSpinner}
          onMessage={this.onMessage}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }
}
