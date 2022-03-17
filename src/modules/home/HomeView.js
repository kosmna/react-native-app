import React from 'react'
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
    TouchableHighlight,
    Linking,
    Platform,
    SafeAreaView,
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import { GetBngDeals, GetHomeLinks, GetMerchantList } from '../backend/homeapi'
import { fonts, colors } from '../../styles'
import { Text } from '../../components/StyledText'
import firebase from 'react-native-firebase'
import axios from 'axios'
// import StripeTerminalPay from '../../modules/stripeTerminal/stripeTerminalPay';
import FilterView from '../../components/FilterView'
import FrameScreen from "../frame/FrameViewContainer"
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import { BackendUrl, Authentication } from '../backend/constants'

const MERCHANT_LIST_CNT = 20

SchimmerEffectComponent = () => {
    return (
        <ShimmerPlaceHolder
            style={{ alignSelf: 'center', width: wp(95), height: hp(32), opacity: 0.5 }}
            autoRun={true} />
    )
}

DiscoverDealsLoader = () => {
    return (
        // <View style={{ position: 'absolute', height: hp(20), width: wp(100), justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', zIndex: 999, }}>
        //   <Image
        //     style={{
        //       alignSelf: 'center',
        //       resizeMode: 'contain',
        //     }}
        //     source={require('../../../assets/images/any-loader-image.png')} />
        // </View>

        <ShimmerPlaceHolder
            style={{ alignSelf: 'center', width: wp(95), height: hp(15), opacity: 0.5 }}
            autoRun={true} />
    )
}


DiscoverMerchantsLoader = () => {
    // console.log("DiscoverMerchantsLoader() is called");
    return (
        <ShimmerPlaceHolder
            style={{ alignSelf: 'center', width: wp(100), height: hp(15), marginRight: 10, opacity: 0.5 }}
            autoRun={true} />
    )
}

SchimmerAnimationForNNumberRows = ({ numberOfRows, uniqueKey }) => {
    let shimmerRowsArray = []
    for (let index = 0; index < numberOfRows; index++) {
        shimmerRowsArray.push(
            <ShimmerPlaceHolder
                key={`loading-${index}-${uniqueKey}`}
                autoRun={true}
                style={{ marginBottom: 5, width: wp(95), alignSelf: 'center', opacity: 0.5 }}
            />
        )
    }
    return <View>{shimmerRowsArray}</View>
}

export default class HomeScreen extends React.Component {
    state = {
        entries: [],              /* Deals */
        activeSlide: 0,
        categoryType: 'In-store', /* Explore */
        categoryList: [],
        homeListItems: [],        /* Discover */
        merchantList: [],         /* Offers */
        geoLocInfo: {
            lat: 38.4607396,
            lng: -122.7852973,
            timestamp: 0
        },
        showFilterView: false,
        filterData: null,
        loading_carousel_image: true,
        loading_homelinks_items: true,
        loading_merchants_list: true,
        curMaxDist: 0,
    };

    _openDealDetail(index) {
        this.props.navigation.navigate({
            routeName: 'DealDetail',
            params: { 'data': this.state.entries[index] },
        })
    }

    _renderItem({ item, index }) {
        return (
            <TouchableOpacity
                onPress={() => this._openDealDetail(index)}
            >
                <Image
                    style={styles.imgBanner}
                    source={{ uri: item.icon_url.replace('http://', 'https://') }}
                />
            </TouchableOpacity>
        )
    }

    componentDidMount() {

        this.props.navigation.setParams({ userInfo: this.props.userInfo }) // Do not remove

        this._getDeals()
        this._getHomeLinks()
        this._getCurrentLocation()
        if (this.props.userInfo) {
            this._updatefirebasetoken()
            this._add_notification_listner()
        }

        // Stripe Terminal Pay commented. Have to change the way it is invoked. -Girish
        // this._navigateToStripeTerminalScreen()

        // Will close search webviews when user navigates to other screens through bottom tab navigator
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            (payload) => {
                this.setState({ onclick_open_webview: false, onclick_open_webview_url: undefined })
            }
        )

        this.props.navigation.setParams({
            close_webview: this.close_webview
        })
    }

    componentWillUnmount() {
        this.didBlurSubscription.remove()
    }

    _updatefirebasetoken = async () => {
        const fcmToken = await firebase.messaging().getToken()
        if (!fcmToken)
            return

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.props.userInfo.partner_referral_code,
            'partner_id': this.props.userInfo.partner_id,
            'firebase_token': fcmToken
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/bngupdatemobilefirebasetoken' + '?data=' + request_data,
            responseType: 'json'
        })
            .catch((error) => {
                console.log(error)
            })

    }

    _add_notification_listner = async () => {
        const notificationOpen = await firebase.notifications().getInitialNotification()
        if (notificationOpen) {
            const notification = notificationOpen.notification

            if (notification.data && notification.data.notification_id) {
                let request_data = JSON.stringify({
                    'Authorization': Authentication,
                    'referral_code': this.props.userInfo.partner_referral_code,
                    'partner_id': this.props.userInfo.partner_id,
                    'notification_id': notification.data.notification_id
                })

                axios({
                    method: 'POST',
                    url: BackendUrl + '/bngupdatemobilenotification' + '?data=' + request_data,
                    responseType: 'json'
                })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        }
    }

    _navigateToStripeTerminalScreen() {
        // 1. App is closed, then get initialize url, and no any listner is added.

        Linking.getInitialURL()
            .then((url) => {
                if (url) {
                    this.setState({
                        'opened_from_url': true,
                        'url': url
                    })
                }
                else
                    this.setState({
                        'opened_from_url': false
                    })
            })
            .catch(error => console.error('An error occurred', error))

        // 2.App is in background, and listener is called for it.
        Linking.addEventListener('url', (event) => {
            // console.log("Linking.addEventListener() is called in HomeView file.")
            if (event.url) {
                this.setState({
                    'opened_from_url': true,
                    'url': event.url
                })
            }
            else
                this.setState({
                    'opened_from_url': false
                })
        })
    }

    _getDeals() {
        GetBngDeals('flight').then(result => {
            // console.log("GetBngDeals() is called");

            if (result === null) {

            } else if (result.success) {
                this.setState({ loading_carousel_image: false }, () => {
                    this.setState({ entries: result.promotion_lines, activeSlide: 0 })
                })
            } else {

            }

        }).catch(() => { })
    }

    _getHomeLinks() {
        GetHomeLinks().then(result => {
            // console.log("_getHomeLinks() is executed.");
            if (result === null) {

            } else if (result.success) {
                // console.log("result.success => _getHomeLinks() is executed.");

                this.setState({
                    homeListItems: result.home_link_list,
                    loading_homelinks_items: false
                })
            } else {

            }

        }).catch((err) => {
            // console.log('error = ', err);
        })
    }

    _getMerchantList(dist = 25) {
        const params = {
            "latitude": this.state.geoLocInfo.lat,
            "longitude": this.state.geoLocInfo.lng,
            "radius": dist * 1609,
        }

        GetMerchantList(params).then(result => {
            if (result === null) {

            } else if (result.success) {
                this.setState({ curMaxDist: (params.radius / 1609) })
                let validCategoryList = result.category_list.filter(obj => (obj.category_name != ''))
                this.setState({
                    merchantList: [...result.merchant_list, ...result.avip_merchant_list],
                    categoryList: validCategoryList,
                    loading_merchants_list: false
                })

                this._initFilterDataWith([...result.merchant_list, ...result.avip_merchant_list], validCategoryList)
            } else {

            }
        }).catch((err) => {
            // console.log('error = ', err);
        })
    }

    _initFilterDataWith(merchantListAry, categoryAry) {
        if (this.state.filterData === null) {
            let strCategories = []
            for (let i = 0; i < categoryAry.length; i++) {
                strCategories.push(categoryAry[i].category_name)
            }
            strCategories.sort()

            this.setState({
                filterData:
                {
                    queryString: "",
                    minDistance: 0,
                    maxDistance: 10,
                    lowLimit: 0,
                    highLimit: 100,
                    aryCategory: strCategories,
                    categories: [],
                }
            })
        }
    }

    _locationCaptured(location) {
        let locData = {
            lat: location.coords.latitude, //38.4607396,
            lng: location.coords.longitude, //-122.7852973,
            timestamp: location.timestamp
        }

        this.setState({ geoLocInfo: locData })
        this._getMerchantList()
    }

    _getCurrentLocation() {
        if (Platform.OS === 'ios') {
            this._locationCaptured({ coords: { latitude: 38.4607396, longitude: -122.7852973 }, timestamp: 123456 })
        }
        else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this._locationCaptured(position)
                },
                (error) => {
                    console.log('Get LOC ERR', error)
                },
                { enableHighAccuracy: true, timeout: 30000 }
            )
        }
    }

    _login() {
        let userObj = { 'email': 'emailTest@test.test' }
        this.props.UserLogin(userObj)
    }

    _logOut() {
        this.props.UserLogout()
    }

    _openMerchantDetailPage(merchantItemData) {
        // console.log("_openMerchantDetailPage()")
        if (merchantItemData.type == 'access_vip' || merchantItemData.type == 'cashback') {
            // console.log("merchantItemData.type == 'access_vip'")
            this.props.navigation.navigate({
                routeName: 'VipAccess',
                params: { vipMerchantData: merchantItemData },
            })
        }
        else if (merchantItemData.type == 'merchant') {
            // console.log("merchantItemData.type == 'merchant'")
            this.props.navigation.navigate({
                routeName: 'Merchant',
                params: { merchantData: merchantItemData, tabVisible: false },
            })
        }
        else if (merchantItemData.type === 'own') {
            // console.log("merchantItemData.type == 'merchant'")
            this.props.navigation.navigate({
                routeName: 'Merchant',
                params: { merchantData: merchantItemData, tabVisible: false },
            })
        }
    }

    _filterParamChanged(filterParam) {
        if (filterParam.maxDistance > this.state.curMaxDist) {
            this.setState({ loading_merchants_list: true, merchantList: [] })
            this._getMerchantList(filterParam.maxDistance)
        }
        this.setState({ filterData: filterParam })
    }

    _openFilterView() {
        if (this.state.filterData !== null) {
            this.setState({ showFilterView: true })
        }
    }

    close_webview = () => {
        this.setState({ onclick_open_webview: false, onclick_open_webview_url: undefined })
    }

    search_webviews = () => {
        let return_data = []

        // URL's to preload
        let url_objs = this.state.homeListItems

        url_objs.map((url_obj) => {
            if (this.state.onclick_open_webview && (this.state.onclick_open_webview_url.uri == url_obj.url))
                return_data.push(
                    <FrameScreen
                        key={this.state.onclick_open_webview_url.uri}
                        close_webview={this.close_webview}
                        url={{ uri: this.state.onclick_open_webview_url.uri }}
                        zero_flex={false}
                    />
                )
            else
                return_data.push(
                    <FrameScreen
                        key={url_obj.url}
                        close_webview={this.close_webview}
                        url={{ uri: url_obj.url }}
                        zero_flex={true}
                    />
                )
        })

        return return_data
    }

    render() {

        // For Payments
        if (this.state.opened_from_url)
            return (
                // <StripeTerminalPay
                //   url={this.state.url}
                // />
                <View />
            )

        var activeMerchants = []
        if (this.state.categoryType == 'In-store') {
            activeMerchants = this.state.merchantList.filter(obj => obj.is_brick_mortar)
        }
        else {
            activeMerchants = this.state.merchantList.filter(obj => obj.is_online)
        }

        if (this.state.filterData !== null) {
            const filteredMerchants = []
            for (let i = 0; i < activeMerchants.length; i++) {
                if ((this.state.filterData.categories.length == 0) || ((this.state.filterData.categories.length != 0) && (this.state.filterData.categories.indexOf(activeMerchants[i].category_name) !== -1))) {
                    if (this.state.filterData.queryString !== "") {
                        if (activeMerchants[i].store_name.toLowerCase().includes(this.state.filterData.queryString.toLowerCase())) {
                            filteredMerchants.push(activeMerchants[i])
                        }
                    }
                    else {
                        filteredMerchants.push(activeMerchants[i])
                    }
                }
            }

            activeMerchants = filteredMerchants
        }

        const merchantListItemViews = []
        if (activeMerchants.length != 0) {
            for (let i = 0; i < MERCHANT_LIST_CNT; i++) {
                if (activeMerchants.length > i) {
                    let merchantListItem = activeMerchants[i]
                    merchantListItemViews.push(
                        <TouchableOpacity
                            key={i * 2}
                            style={{ marginLeft: 14, marginTop: 6 }}
                            onPress={() => this._openMerchantDetailPage(merchantListItem)}
                        >
                            <View style={{ flexDirection: "row", marginLeft: 0, marginHorizontal: 27 }}>
                                <View style={{ width: '80%', flexDirection: "row" }}>
                                    <Image
                                        style={{ marginLeft: 4, marginTop: 2, width: 72, height: 61, alignSelf: "center", resizeMode: 'stretch' }}
                                        source={{ uri: merchantListItem.logo_url }}
                                    />
                                    <View style={{ marginLeft: 25, justifyContent: 'space-between', }}>
                                        <Text style={{ fontSize: 15, fontFamily: fonts.primarySemiBold }}>{merchantListItem.store_name}</Text>
                                        <View style={{ flexDirection: 'row', }}>
                                            <Image
                                                style={{ width: 8, height: 12, alignSelf: "center", resizeMode: 'stretch' }}
                                                source={require('../../../assets/images/home/placeholder.png')}
                                            />
                                            <Text style={{ marginLeft: 4, fontSize: 12, fontFamily: fonts.primaryRegular }}> {merchantListItem.distance} </Text>
                                        </View>
                                        <Text style={{ fontSize: 12, fontFamily: fonts.primaryRegular, color: '#0093DD' }}>{merchantListItem.savings + ((merchantListItem.location_count <= 1) ? ('') : (' | ' + merchantListItem.location_count + ' Locations'))}</Text>
                                    </View>
                                </View>
                                <View style={{ justifyContent: 'center', width: '20%', flexDirection: 'row-reverse', marginHorizontal: 27 }}>
                                    <Image
                                        style={{ alignSelf: 'center', width: 13, height: 17, resizeMode: 'stretch' }}
                                        source={require('../../../assets/images/home/arrow.png')}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                    if (i != (MERCHANT_LIST_CNT - 1)) {
                        merchantListItemViews.push(
                            <View
                                key={i * 2 + 1}
                                style={{ backgroundColor: 'rgba(198, 198, 198, 0.14)', height: 1, marginTop: 9.5, width: '100%' }}
                            />
                        )
                    }
                }
            }
        }

        const typeOptions = []
        if (this.state.categoryType == 'In-store') {
            typeOptions.push(
                <View
                    style={{ width: '50%', flexDirection: "row" }}
                    key={'typeView'}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ width: '50%', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.setState({ categoryType: 'In-store' })}
                    >
                        <View style={{ borderRadius: 6, backgroundColor: '#0093DD', width: '100%', height: 38, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: fonts.primaryRegular, color: "#F8F8FF", alignSelf: "center" }}>In-store</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ width: '50%', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.setState({ categoryType: 'Online' })}
                    >
                        <View style={{ borderRadius: 6, backgroundColor: '#FFFFFF', width: '100%', height: 38, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: fonts.primaryRegular, color: "#4A4C63", alignSelf: "center" }}>Online</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }
        else {
            typeOptions.push(
                <View
                    style={{ width: '50%', flexDirection: "row", margin: wp(0) }}
                    key={'typeView'}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ width: '50%', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.setState({ categoryType: 'In-store' })}
                    >
                        <View style={{ borderRadius: 6, backgroundColor: '#FFFFFF', width: '100%', height: 38, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: fonts.primaryRegular, color: "#4A4C63", alignSelf: "center" }}>In-store</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ width: '50%', borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}
                        onPress={() => this.setState({ categoryType: 'Online' })}
                    >
                        <View style={{ borderRadius: 6, backgroundColor: '#0093DD', width: '100%', height: 38, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, fontFamily: fonts.primaryRegular, color: "#F8F8FF", alignSelf: "center" }}>Online</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }

        const categoryItemListViews = []
        for (let i = 0; i < this.state.categoryList.length; i++) {
            let categoryListItem = this.state.categoryList[i]
            let categoryCount = ((this.state.categoryType == 'Online') ? categoryListItem.online_count : categoryListItem.offline_count)

            if (categoryCount == 0) { continue }

            categoryItemListViews.push(
                <TouchableOpacity
                    key={i}
                    style={{ alignItems: 'center', justifyContent: "center", marginRight: 20 }}
                    onPress={() => this.props.navigation.navigate({
                        routeName: 'Category',
                        params: {
                            geoLocation: this.state.geoLocInfo,
                            type: this.state.categoryType,
                            userInfo: this.props.userInfo,
                            categoryData: categoryListItem,
                        },
                    })
                    }
                >
                    <View style={{ alignItems: 'center', justifyContent: "center" }}>
                        <Image
                            style={{ width: wp(28), height: wp(23), alignSelf: "center", borderRadius: hp(1) }}
                            source={categoryListItem.category_image_url == '' ? require('../../../assets/images/home/restaurant.png') : { uri: categoryListItem.category_image_url }}
                        />
                    </View>
                    <Text style={styles.serviceTitle}>{categoryListItem.category_name}</Text>
                    <Text style={styles.serviceText}>{'' + categoryCount + '+ Options'}</Text>
                </TouchableOpacity>
            )
        }

        // Show the preloaded webviews
        if (this.state.onclick_open_webview)
            return (
                <SafeAreaView style={styles.container}>
                    <View style={{ flex: 1 }}>
                        {this.search_webviews()}
                    </View>
                </SafeAreaView >
            )

        return (
            <SafeAreaView style={styles.container}>

                {/* Preloading all search webviews */}
                <View style={{ flex: 0 }}>
                    {this.state.homeListItems && this.search_webviews()}
                </View>

                <Animated.View style={[{ marginTop: hp(0.5), width: '100%' }]}>
                    <View
                        style={[
                            { width: '100%' },
                            { flexDirection: "row", justifyContent: 'center', alignItems: 'center' }
                        ]}
                    >
                        <View>
                            <Image
                                style={{ height: hp(6), resizeMode: 'contain' }}
                                source={require('../../../assets/images/booknGOGO.png')}
                            />
                        </View>
                    </View>
                </Animated.View>

                <View style={{ backgroundColor: "#C6C6C6", height: 1, marginTop: 0, width: '100%', opacity: 0.2 }} />
                <ScrollView
                    style={[styles.container]}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {
                        this.state.loading_carousel_image ? <SchimmerEffectComponent /> :
                            <Carousel
                                ref={(c) => { this._carousel = c }}
                                data={this.state.entries}
                                renderItem={this._renderItem.bind(this)}
                                sliderWidth={wp(100)}
                                itemWidth={wp(100)}
                                onSnapToItem={(index) => this.setState({ activeSlide: index })}
                            />
                    }
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
                    <View style={{ marginLeft: 0, marginTop: 10 }}>
                        <View style={{ height: 30, marginLeft: 14, justifyContent: "center" }}>
                            <Text style={{ fontSize: 22, fontFamily: fonts.primaryBold, color: "black" }}>Discover</Text>
                        </View>
                        {
                            this.state.loading_homelinks_items ? <DiscoverDealsLoader /> :
                                <ScrollView
                                    style={{ flexDirection: "row", marginTop: 16 }}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {
                                        this.state.homeListItems.map((homeListItem, key) => (
                                            <TouchableOpacity
                                                style={styles.categoryItem}
                                                key={key}
                                                onPress={() => {
                                                    // this.props.navigation.navigate({
                                                    //   routeName: 'Frame',
                                                    //   params: { url: { uri: homeListItem.url } },
                                                    // })

                                                    this.setState({ onclick_open_webview: true, onclick_open_webview_url: { uri: homeListItem.url } })
                                                }}
                                            // onPress = {() => this._changePassword()}
                                            >
                                                <View style={{ backgroundColor: '#08C41A', width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: "center" }}>
                                                    <Image
                                                        style={{ width: 52, height: 52, alignSelf: "center" }}
                                                        source={{ uri: homeListItem.icon_url.replace('http://', 'https://') }}
                                                    />
                                                </View>
                                                <Text style={styles.categoryText}>{homeListItem.name}</Text>
                                            </TouchableOpacity>
                                        ))
                                    }
                                </ScrollView>
                        }
                    </View>

                    <View style={{ backgroundColor: "#C6C6C6", height: 1, marginTop: 7.5, width: '100%', opacity: 0.2 }} />
                    <View style={{ marginLeft: 14, marginTop: 12.5 }}>
                        <View style={{ height: 30, flexDirection: "row", }}>
                            <Text style={{ fontSize: 22, fontFamily: fonts.primaryBold, color: "#515151" }}>Explore</Text>
                            <Image
                                style={{ marginLeft: 7, marginTop: 2, width: wp(5), height: wp(5), alignSelf: "center" }}
                                source={require('../../../assets/images/home/explore.png')}
                            />
                        </View>
                        <Text style={{ marginTop: 3, fontSize: 13, fontFamily: fonts.primaryRegular, color: "#AFAFAF" }}>Latest deals &amp; discounts</Text>
                        <View style={{ marginTop: 11, height: 38, flexDirection: "row", marginBottom: hp(0) }}>
                            <View style={{ width: '30%' }}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate({
                                        routeName: 'Search',
                                        params: {
                                            geoLocation: this.state.geoLocInfo,
                                            userInfo: this.props.userInfo,
                                        },
                                    })
                                    }
                                >
                                    <Image
                                        style={{ marginLeft: 4, marginTop: 2, width: '100%', height: hp(5.5), alignSelf: "center", resizeMode: 'stretch' }}
                                        source={require('../../../assets/images/home/search.png')}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate({
                                        routeName: 'Map',
                                        params: { 'curLocation': { 'lat': this.state.geoLocInfo.lat, 'lng': this.state.geoLocInfo.lng } },
                                    })
                                    }
                                >
                                    <Text style={{ fontSize: 14, fontFamily: fonts.primaryRegular, color: "#4A4C63", alignSelf: "center" }}>Map</Text>
                                </TouchableOpacity>
                            </View>
                            {typeOptions}
                        </View>
                    </View>
                    <View style={{ marginLeft: 14, marginTop: 16, width: '100%' }}>
                        {
                            this.state.loading_merchants_list ?
                                // <SchimmerAnimationForNNumberRows
                                //   numberOfRows={6}
                                //   uniqueKey={"3rows"}
                                // />
                                <DiscoverMerchantsLoader />
                                :
                                <ScrollView style={{ flexDirection: "row", marginTop: 0 }}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {categoryItemListViews}
                                </ScrollView>
                        }
                    </View>
                    <View style={{ marginLeft: 14, marginTop: 22 }}>
                        <View style={{ height: 19, justifyContent: "center", flexDirection: "row", }}>
                            <Text style={{ fontSize: 14, fontFamily: fonts.primaryBold, flex: 1 }}>All Offers</Text>
                            <TouchableOpacity
                                style={{ width: 40, marginHorizontal: 6 }}
                                onPress={() => this._openFilterView()}>
                                <Image
                                    style={{ width: 21, height: 17, resizeMode: 'stretch', alignSelf: 'center' }}
                                    source={require('../../../assets/images/category/noun_filter_blue.png')}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ paddingHorizontal: 6, marginHorizontal: 12 }}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'Category',
                                    params: {
                                        geoLocation: this.state.geoLocInfo,
                                        userInfo: this.props.userInfo,
                                        type: this.state.categoryType,
                                    },
                                })
                                }>
                                <Text style={{ fontSize: 13, fontFamily: fonts.primaryRegular, color: '#0093DD', textAlign: 'right' }}> View all </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        {merchantListItemViews}
                    </View>
                </ScrollView>
                {!this.props.isLogin && (
                    <TouchableOpacity style={{ marginLeft: 14, marginTop: 5, marginBottom: 12, marginHorizontal: 17, borderRadius: 4, borderWidth: 1, borderBottomWidth: 2, borderColor: '#ECECEC' }}>
                        <View style={{ marginTop: 8, marginLeft: 16, flexDirection: 'row' }}>
                            <Image
                                style={{ width: 17, height: 20, resizeMode: 'stretch' }}
                                source={require('../../../assets/images/home/surface.png')}
                            />
                            <Text style={{ marginLeft: 8.5, fontSize: 13, fontFamily: fonts.primaryRegular }}>Sign in to unlock secret deal & discounts</Text>
                        </View>
                        <TouchableOpacity style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'center', height: 22, }}>
                            <View style={{ width: '50%', backgroundColor: '#CAD3D4', borderBottomLeftRadius: 4 }}>
                                <Text style={{ marginLeft: 8.5, fontSize: 13, fontFamily: fonts.primaryRegular, color: '#7A7C80', alignSelf: 'center' }}>Not now</Text>
                            </View>
                            <TouchableOpacity
                                style={{ width: '50%', backgroundColor: '#13A9F5', borderBottomRightRadius: 4 }}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'Auth',
                                    params: {},
                                })
                                }
                            >
                                <Text style={{ marginLeft: 8.5, fontSize: 13, fontFamily: fonts.primaryRegular, color: '#FFFFFF', alignSelf: 'center' }}>Sign in</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </TouchableOpacity>
                )}

                {this.state.showFilterView && (
                    <FilterView
                        hideSlider={true}
                        initialFilterParam={this.state.filterData}
                        onTapOutSide={() => this.setState({ showFilterView: false })}
                        onValueChange={(filterParam) => this._filterParamChanged(filterParam)}
                        styles={{
                            positionOffset: { right: 0, top: 200 }
                        }}
                    />
                )}

            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //    alignItems: 'baseline',
        //    justifyContent: 'flex-start',
    },
    imgBanner: {
        marginLeft: 10,
        marginRight: 10,
        marginTop: 10,
        marginBottom: 2,
        borderRadius: 6,
        height: hp(30),
        resizeMode: 'stretch'
    },
    categoryItem: {
        marginLeft: 18,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: "center"
    },
    categoryText: {
        marginTop: 7,
        fontSize: 14,
        fontFamily: fonts.primaryBold,
        color: "#887575",
        alignSelf: "center"
    },
    serviceTitle: {
        marginTop: 7,
        fontSize: 14,
        fontFamily: fonts.primaryRegular,
        fontWeight: "600",
        color: "#7A7C80",
        alignSelf: "flex-start"
    },
    serviceText: {
        marginTop: 2,
        fontSize: 14,
        fontFamily: fonts.primaryRegular,
        color: "#AFAFAF",
        alignSelf: "flex-start"
    },
    bgImage: {
        flex: 1,
        marginHorizontal: -20,
    },
    section: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionLarge: {
        flex: 2,
        justifyContent: 'space-around',
    },
    sectionHeader: {
        marginBottom: 8,
    },
    priceContainer: {
        alignItems: 'center',
    },
    description: {
        padding: 15,
        lineHeight: 25,
    },
    titleDescription: {
        color: colors.introText,
        textAlign: 'center',
        fontFamily: fonts.primaryRegular,
        fontSize: 15,
    },
    title: {
        marginTop: 30,
    },
    price: {
        marginBottom: 5,
    },
    priceLink: {
        borderBottomWidth: 1,
        borderBottomColor: colors.primary,
    },
})
