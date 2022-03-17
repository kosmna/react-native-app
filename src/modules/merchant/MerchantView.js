
import React from 'react'
import { Animated, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { Text } from '../../components/StyledText'
import { fonts } from '../../styles'
import { GetBngMerchantDeals, GetBngMerchantDetails, GetBngMerchantHomeLinks, GetBngMerchantRoomList } from '../backend/minisiteapi'
import FrameScreen from "../frame/FrameViewContainer"


const SchimmerEffectComponent = () => {
  return (
    <ShimmerPlaceHolder
      style={{ alignSelf: 'center', width: wp(95), height: hp(30.5), opacity: 0.5 }}
      autoRun={true} />
  )
}

const DontMissOutCustomView = () => {
  return (
    <ShimmerPlaceHolder
      style={{ alignSelf: 'center', width: wp(95), height: hp(22), opacity: 0.5 }}
      autoRun={true} />
  )
}

const MerchantDescriptionLoadingView = () => {
  return (
    <ShimmerPlaceHolder
      style={{ width: wp(60), height: hp(75), marginLeft: wp(0), marginRight: wp(5), opacity: 0.5 }}
      autoRun={true} />
  )
}

export default class MerchantScreen extends React.Component {
  state = {
    entries: [],
    activeSlide: 0,
    merchantDetail: { description: "" },
    roomList: [],
    promotionLines: [],
    homeLinkList: [],
    loading_carousel_image: true,
    loading_merchant_description: true,
  };

  componentDidMount() {
    this._getBngMerchantDetails()
    this._getBngMerchantDeals()
    this._getBngMerchantRoomList()
    this._getBngMerchantHomeLinks()
  }


  close_webview = () => {
    this.setState({ onclick_open_webview: false })
  }

  _getMerchantItemData() {
    return this.props.navigation.getParam('merchantData')
  }

  _getBngMerchantDetails() {
    const merchant = this._getMerchantItemData()
    GetBngMerchantDetails('flight', merchant).then(result => {
      if (result.success) {
        const entries = result.result_dict.image_gallery_list
        entries.unshift({ "gallery_image_url": result.result_dict.first_image })
        this.setState({
          entries, activeSlide: 0,
          merchantDetail: result.result_dict,
          loading_carousel_image: false,
          loading_merchant_description: false,
        })
      }
    }).catch((error) => { console.warn(error) })
  }

  _getBngMerchantDeals() {
    const merchant = this._getMerchantItemData()
    GetBngMerchantDeals('flight', merchant).then(result => {
      if (result.success) {
        const promotionLines = result.promotion_lines
        this.setState({ promotionLines })
      }
    }).catch(() => { })
  }

  _getBngMerchantRoomList() {
    const merchant = this._getMerchantItemData()
    GetBngMerchantRoomList(merchant).then(result => {
      if (result.success) {
        const roomList = result.room_list
        this.setState({ roomList })
      }
    }).catch(() => { })
  }

  _getBngMerchantHomeLinks() {
    const merchant = this._getMerchantItemData()
    GetBngMerchantHomeLinks(merchant).then(result => {
      if (result.success) {
        const homeLinkList = result.home_link_list
        this.setState({ homeLinkList })
      }
    }).catch(() => { })
  }

  _renderItem({ item, }) {
    return (
      <Image
        style={styles.imgBanner}
        source={{ uri: item.gallery_image_url }}
        onPress={() => this.props.navigation.goBack()}
      />
    )
  }

  _openDealDetail(index) {
    this.props.navigation.navigate({
      routeName: 'DealDetail',
      params: { 'data': this.state.promotionLines[index] },
    })
  }

  render() {
    const merchantData = this._getMerchantItemData()
    const { userInfo } = this.props

    const roomListItemViews = []
    const { roomList } = this.state
    if (roomList.length !== 0) {
      for (let i = 0; i < roomList.length; i += 1) {
        const roomListItem = roomList[i]
        roomListItemViews.push(
          <TouchableOpacity
            key={roomListItem.page_url.replace("http:", "https:")}
            style={{ alignItems: 'center', marginRight: 14 }}
            onPress={() => {
              // this.props.navigation.navigate({
              //   routeName: 'Frame',
              //   params: { url: { uri: roomListItem.page_url.replace("http:", "https:") } },
              // })
              this.setState({ onclick_open_webview: true, onclick_open_webview_url: { uri: roomListItem.page_url.replace("http:", "https:") } })
            }}
          >
            <View style={{ width: 84, borderRadius: 4, alignItems: 'center', justifyContent: "center" }}>
              <Image
                style={{ width: 84, height: 70, alignSelf: "center" }}
                source={{ uri: roomListItem.room_icon_url }}
              />
            </View>
            <Text style={styles.roomTitle}>{roomListItem.name}</Text>
          </TouchableOpacity>
        )
      }
    }

    const promotionLinesItemViews = []
    const { promotionLines } = this.state
    if (promotionLines.length !== 0) {
      for (let i = 0; i < promotionLines.length; i += 1) {
        const promotionLinesItem = promotionLines[i]
        promotionLinesItemViews.push(
          <TouchableOpacity
            key={promotionLinesItem.code}
            style={{ alignItems: 'center', marginRight: 14 }}
            onPress={() => { this._openDealDetail(i) }
            }
          >
            <View style={{ width: 200, borderRadius: 4, alignItems: 'center', justifyContent: "center" }}>
              <Image
                style={{ width: 200, height: 80, alignSelf: "center" }}
                source={{ uri: promotionLinesItem.icon_url.replace("http:", "https:") }}
              />
            </View>
            <View style={{ width: 160, height: 30, marginTop: -15, marginLeft: 8, borderRadius: 4, backgroundColor: '#FFFFFF', borderColor: '#E1E1E1', borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 2 }}>
              <Text style={styles.missTitle}>{promotionLinesItem.name}</Text>
            </View>
          </TouchableOpacity>
        )
      }
    }

    const rootMenuItemViews = []
    const mainMenuItemViews = []
    const { homeLinkList } = this.state
    if (homeLinkList.length !== 0) {
      for (let i = 0; i < homeLinkList.length; i += 1) {
        const homeLinkListItem = homeLinkList[i]
        if (homeLinkListItem.placement_type === "main_menu") {
          mainMenuItemViews.push(
            <TouchableOpacity
              key={homeLinkListItem.url}
              style={{ width: 85, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => {
                // this.props.navigation.navigate({
                //   routeName: 'Frame',
                //   params: { url: { uri: homeLinkListItem.url } },
                // })
                this.setState({ onclick_open_webview: true, onclick_open_webview_url: { uri: homeLinkListItem.url } })
              }}
            >
              <View style={{ width: 58, height: 47, justifyContent: 'center', borderWidth: 1, borderColor: '#CACCCF', borderRadius: 17 }}>
                <Image
                  style={{ width: 32, height: 30, alignSelf: "center", resizeMode: 'stretch' }}
                  source={{ uri: homeLinkListItem.icon_url }}
                />
              </View>
              <View style={{ marginTop: 8, flex: 1, justifyContent: 'center' }}>
                <Text style={{ color: '#100F0F', fontSize: 14, fontFamily: fonts.primaryRegular }}>{homeLinkListItem.name}</Text>
              </View>
            </TouchableOpacity>
          )
        }
        else if (homeLinkListItem.placement_type === "root_menu") {
          rootMenuItemViews.push(
            <TouchableOpacity
              key={homeLinkListItem.url.replace("http:", "https:")}
              style={{ alignItems: 'center' }}
              onPress={() => {
                // this.props.navigation.navigate({
                //   routeName: 'Frame',
                //   params: { url: { uri: homeLinkListItem.url.replace("http:", "https:") } },
                // })
                this.setState({ onclick_open_webview: true, onclick_open_webview_url: { uri: homeLinkListItem.url.replace("http:", "https:") } })
              }}
            >
              <View style={{ height: 25, justifyContent: 'center' }}>
                <Image
                  style={{ alignSelf: "center", width: 28, height: 28, resizeMode: 'stretch' }}
                  source={{ uri: homeLinkListItem.icon_url }}
                />
              </View>
              <Text style={styles.toolTitle}>{homeLinkListItem.name}</Text>
            </TouchableOpacity>
          )
        }
      }
      rootMenuItemViews.push(
        <TouchableOpacity
          key="help"
          style={{ alignItems: 'center' }}
          onPress={() => {
            this.props.navigation.navigate('MerchantHelp', { back_route_name: 'Merchant', base_url: merchantData.tpartner_home_link })
          }}
        >
          <View style={{ height: 25, justifyContent: 'center' }}>
            <Image
              style={{ alignSelf: "center", height: wp(5.5), width: wp(6) }}
              source={require('../../../assets/images/tabbar/merchant_help.png')}
            />
          </View>
          <Text style={styles.toolTitle}>Help</Text>
        </TouchableOpacity>
      )
    }

    let merchantDescription = this.state.merchantDetail.description
    if (merchantDescription.length > 100 && !this.state.descriptionDetail) {
      merchantDescription = `${merchantDescription.substring(0, 100)}...`
    }
    let moreText = "More"
    if (this.state.descriptionDetail) {
      moreText = "Less"
    }

    return (
      <SafeAreaView style={styles.container}>
        {!this.state.onclick_open_webview ? (
          <ScrollView style={styles.container}>
            <Animated.View style={[{ paddingTop: 10, width: '100%', marginLeft: 7, marginHorizontal: 7 }]}>
              <Animated.View
                style={[
                  { height: 44, width: '100%' },
                  { alignItems: 'center', justifyContent: 'space-between', flexDirection: "row", }
                ]}
              >
                <TouchableOpacity
                  style={{ width: '20%' }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Image
                    style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                    source={require('../../../assets/images/category/back.png')}
                  />
                </TouchableOpacity>
                <View style={{ width: '60%', alignContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontFamily: fonts.primaryRegular, color: "#000000", alignSelf: "center" }}>
                    {merchantData.store_name}
                  </Text>
                </View>
                <View style={{ width: '20%', justifyContent: 'flex-end', flexDirection: 'row' }}>
                  <Image
                    style={{ width: 18, height: 18, marginRight: 40, resizeMode: 'stretch', alignSelf: 'flex-end' }}
                    source={require('../../../assets/images/merchant/ring.png')}
                  />
                </View>
              </Animated.View>
            </Animated.View>
            <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 0, width: '100%' }} />
            {
              this.state.loading_carousel_image ? <SchimmerEffectComponent />
                : (
                  <Carousel
                    ref={(c) => { this._carousel = c }}
                    data={this.state.entries}
                    renderItem={this._renderItem}
                    sliderWidth={wp(100)}
                    itemWidth={wp(100)}
                    onSnapToItem={(index) => this.setState({ activeSlide: index })}
                  />
                )}
            <View style={{ alignItems: 'center', flexDirection: "row", justifyContent: "center", alignSelf: "center" }}>
              <Pagination
                dotsLength={this.state.entries.length}
                activeDotIndex={this.state.activeSlide}
                containerStyle={{ backgroundColor: '#FFFFFF', marginTop: 0, paddingTop: 5, paddingBottom: 0 }}
                dotStyle={{
                  width: 5,
                  height: 5,
                  borderRadius: 2.5,
                  marginHorizontal: 4,
                  backgroundColor: '#AFAFAF'
                }}
                inactiveDotStyle={{
                  width: 5,
                  height: 5,
                  borderRadius: 2.5,
                  marginHorizontal: 4,
                  backgroundColor: '#EFE4E4'
                }}
                inactiveDotOpacity={1}
                inactiveDotScale={1}
              />
            </View>
            <View style={[{ marginTop: 14, marginLeft: 18, marginRight: 18, marginBottom: 13 }]}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ height: 108, width: 108, marginTop: -54, justifyContent: 'center', borderRadius: 4, borderTopWidth: 1, borderLeftWidth: 2, borderRightWidth: 2, borderBottomWidth: 3, borderColor: '#CCCCCC', backgroundColor: '#FFFFFF' }}>
                  <Image
                    style={{ width: 89, height: 44, resizeMode: 'stretch', alignSelf: 'center' }}
                    source={{ uri: merchantData.logo_url.replace("http:", "https:") }}
                  />
                </View>
                <View
                  style={[
                    { marginLeft: 12, marginHorizontal: 20, flex: 1 }
                  ]}
                >
                  {
                    this.state.loading_merchant_description ? <MerchantDescriptionLoadingView />
                      : (
                        <Text style={{ fontFamily: fonts.primaryRegular }}>
                          <Text style={{ fontSize: 15, fontFamily: fonts.primarySemiBold, color: '#515151' }}>Welcome {userInfo.partner_name}
                          </Text>
                          <Text style={{ marginTop: 2, color: '#515151', }}>{"\n"}{"\n"}{merchantDescription}
                          </Text>
                        </Text>
                      )}
                </View>
              </View>
              <TouchableOpacity
                style={{ flex: 1, marginTop: 10, flexDirection: 'row-reverse' }}
                onPress={() => {
                  if (this.state.descriptionDetail)
                    this.setState({ descriptionDetail: false })
                  else
                    this.setState({ descriptionDetail: true })
                }
                }
              >
                <Text style={{ fontSize: 15, color: '#0093DD' }}>{moreText}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 0, width: '100%' }} />
            <View style={{ marginLeft: 16, marginTop: 8.5 }}>
              <Text style={{ fontSize: 15, color: '#484848', fontWeight: '600' }}>Don't Miss Out</Text>
            </View>
            <View style={{ marginLeft: 14, marginTop: 8, width: '100%' }}>
              {
                this.state.dont_missout_view_loading ? <DontMissOutCustomView />
                  : (
                    <ScrollView style={{ flexDirection: "row" }} horizontal>
                      {promotionLinesItemViews}
                    </ScrollView>
                  )}
            </View>
            <View style={{ marginLeft: 16, marginTop: 2 }}>
              <Text style={{ fontSize: 15, color: '#484848', fontWeight: '600' }}>Rooms</Text>
            </View>
            <View style={{ marginLeft: 14, marginTop: 8, width: '100%' }}>
              <ScrollView style={{ flexDirection: "row" }} horizontal>
                {roomListItemViews}
              </ScrollView>
            </View>
            <View style={{ marginLeft: 16, marginTop: 2 }}>
              <Text style={{ fontSize: 15, color: '#484848', fontWeight: '600' }}>Explore</Text>
            </View>
            <View style={{ marginLeft: 14, marginTop: 8, width: '100%' }}>
              <ScrollView style={{ flexDirection: "row" }} horizontal>
                {mainMenuItemViews}
              </ScrollView>
            </View>
            <View style={{ height: 10 }} />
          </ScrollView>
        ) :
          (
            <FrameScreen
              close_webview={this.close_webview}
              url={this.state.onclick_open_webview_url}
            />
          )}
        <View style={{ marginLeft: 0, marginTop: 0, marginBottom: 0, marginHorizontal: 0, height: 70, borderWidth: 1, borderTopWidth: 2, borderColor: '#80C3E8', backgroundColor: '#0193DD' }}>
          <View style={{ marginTop: 15, marginLeft: 36, marginHorizontal: 36, flexDirection: 'row', justifyContent: 'space-between' }}>
            {rootMenuItemViews}
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  imgBanner: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 2,
    borderRadius: 6,
    height: hp(30),
    resizeMode: 'stretch'
  },
  missTitle: {
    marginTop: 8,
    fontSize: 10,
    fontFamily: fonts.primarySemiBold,
    color: "#000000",
    alignSelf: "center",
  },
  roomTitle: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: fonts.primaryRegular,
    color: "#7A7C80",
    alignSelf: "flex-start",
    width: 80
  },
  toolTitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: fonts.primaryRegular,
    color: "#FFFFFF",
    alignSelf: "center"
  },
})
