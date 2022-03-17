import axios from 'axios'
import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import Loading from '../../../components/Loading'
import { Text } from '../../../components/StyledText'
import { fonts } from '../../../styles'
import { Authentication, BackendUrl, BookAuthentication } from '../../backend/constants'

const TOP_GIFT_MERCHANT_CNT = 10

export default class GiftCardScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Gift Cards'
        }
    }

    state = {
        tabIndex: 0,
        newTabIndex: -1,
        entries: [1, 2, 3, 4],
        activeSlide: 0,
        userInfo: this.props.navigation.getParam('userInfo'),
        giftCards: [],
        giftMerchants: [],
        sentCards: [],
        myCards: [],
        loadingGiftCards: false,
        loadingMySentCards: false,
        loadingGiftMerchants: false,
        loadingGiftDetails: false
    };

    constructor(props, context) {
        super(props, context)
        this._renderItem = this._renderItem.bind(this)
    }

    tabStyle(index) {
        if (index === this.state.tabIndex)
            return styles.statusItemPrimary
        return {}
    }

    tabTextStyle(index) {
        if (index === this.state.tabIndex)
            return styles.statusTextPrimary
        return {}
    }

    _getGiftBooknGoGoCards = async () => {
        this.setState({ loadingGiftCards: true })
        let request_data = JSON.stringify({
            'Authorization': BookAuthentication,
            'partner_id': this.state.userInfo.partner_id,
            'referral_code': this.state.userInfo.partner_referral_code,
            'code': 'SB00001'
        })

        axios({
            method: 'POST',
            url: 'https://bookngogo.hotelscentric.com' + '/bnggetgiftcardmerchantdetail' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                this.setState({ loadingGiftCards: false })
                if (response.data.success == true) {
                    let detailList = response.data.giftcardmerchantdetail_list
                    const sortedList = []
                    for (let i = 0; i < detailList.length; i++) {
                        var newListItem = detailList[i]
                        let restriction_list = detailList[i].value_restriction_list
                        restriction_list.sort((a, b) => (parseInt(a.value) > parseInt(b.value)) ? 1 : -1)
                        newListItem.restriction_list = restriction_list
                        sortedList.push(newListItem)
                    }

                    this.setState({ giftCards: sortedList })
                }
                else {
                    alert('Sorry something went wrong, please try again')
                }
            })
            .catch((error) => {
                this.setState({ loadingGiftCards: false })
                console.log(error)
            })
    }

    _getSentMyCardsData = () => {
        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'partner_id': this.state.userInfo.partner_id,
            'referral_code': this.state.userInfo.partner_referral_code
        })
        axios({
            method: 'POST',
            url: BackendUrl + '/getpartnergiftcards' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                this.setState({ loadingMySentCards: false })
                if (response.data.success == true) {
                    this.setState({ sentCards: response.data.sentgiftcard_list })
                    this.setState({ myCards: response.data.mygiftcard_list })
                }
                else {
                    alert('Sorry something went wrong, please try again')
                }
            })
            .catch((error) => {
                this.setState({ loadingMySentCards: false })
                console.log(error)
            })
    }

    _getGiftCardMechants = () => {
        this.setState({ loadingGiftMerchants: true })
        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'partner_id': this.state.userInfo.partner_id,
            'referral_code': this.state.userInfo.partner_referral_code
        })
        axios({
            method: 'POST',
            url: BackendUrl + '/bnggetgiftcardmerchants' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                this.setState({ loadingGiftMerchants: false })
                if (response.data.success == true) {
                    this.setState({ giftMerchants: response.data.giftcardmerchantlist })
                }
                else {
                    alert('Sorry something went wrong, please try again')
                }
            })
            .catch((error) => {
                this.setState({ loadingGiftMerchants: false })
                console.log(error)
            })
    }

    _getGiftMerchantDetails = async (giftItemData) => {
        this.setState({ loadingGiftDetails: true })
        let request_data = JSON.stringify({
            // 'Authorization': BookAuthentication,
            'Authorization': (giftItemData.is_own === true) ? BookAuthentication : Authentication,
            'partner_id': this.state.userInfo.partner_id,
            'referral_code': this.state.userInfo.partner_referral_code,
            'code': giftItemData.code
        })

        axios({
            method: 'POST',
            url: ((giftItemData.is_own === true) ? giftItemData.target_url : BackendUrl) + '/bnggetgiftcardmerchantdetail' + '?data=' + request_data,
            // url: giftItemData.target_url + '/bnggetgiftcardmerchantdetail' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                this.setState({ loadingGiftDetails: false })
                if (response.data.success == true) {
                    let detailList = response.data.giftcardmerchantdetail_list
                    const sortedList = []
                    for (let i = 0; i < detailList.length; i++) {
                        var newListItem = detailList[i]
                        let restriction_list = detailList[i].value_restriction_list
                        restriction_list.sort((a, b) => (parseInt(a.value) > parseInt(b.value)) ? 1 : -1)
                        newListItem.restriction_list = restriction_list
                        sortedList.push(newListItem)
                    }

                    this.setState({ newTabIndex: -1 })
                    if (sortedList.length == 1) {
                        this.props.navigation.navigate({
                            routeName: 'OtherGiftCard',
                            params: { giftData: sortedList[0], userInfo: this.state.userInfo }
                        })
                    }
                    else {
                        this.props.navigation.navigate({
                            routeName: 'OtherGiftCardList',
                            params: { merchantList: sortedList, userInfo: this.state.userInfo, headerTitle: giftItemData.brand_name }
                        })
                    }
                }
                else {
                    alert('Sorry something went wrong, please try again')
                }
            })
            .catch((error) => {
                this.setState({ loadingGiftDetails: false })
                console.log(error)
            })
    }

    _giftMerchantItemViewClicked(merchantData) {
        this._getGiftMerchantDetails(merchantData)
    }

    _giftMerchantItemView = (giftMerchantItemData) => {
        return (
            <TouchableOpacity
                style={{ alignItems: 'center', justifyContent: "center", marginRight: 17 }}
                onPress={() => this._giftMerchantItemViewClicked(giftMerchantItemData)}
            >
                <View style={{ height: wp(25), width: wp(25), justifyContent: 'center', borderRadius: 5, backgroundColor: '#FFFFFF' }}>
                    <Image
                        style={{ width: wp(25), height: wp(25), resizeMode: 'stretch', alignSelf: 'center' }}
                        source={{ uri: giftMerchantItemData.logo_url.replace('http://', 'https://') }}
                    />
                </View>
                <Text style={{ marginTop: hp(1), color: '#787473', fontSize: wp(3.3) }}>{giftMerchantItemData.brand_name}</Text>
            </TouchableOpacity>
        )
    }

    _renderGiftMerchantViews = () => {
        let giftMerchantViews = []
        if (this.state.loadingGiftMerchants === true) {
            giftMerchantViews.push(
                <ShimmerPlaceHolder
                    style={{ alignSelf: 'center', width: wp(95), height: hp(15), opacity: 0.5 }}
                    key={'shimmer_placeholder'}
                    autoRun={true} />
            )
        }
        else {
            for (let i = 0; i < this.state.giftMerchants.length; i++) {
                if (i > TOP_GIFT_MERCHANT_CNT) {
                    break
                }

                giftMerchantViews.push(
                    <View key={'giftMerchantView' + i}>
                        {this._giftMerchantItemView(this.state.giftMerchants[i])}
                    </View>
                )
            }
        }

        return giftMerchantViews
    }

    componentDidUpdate() {
        const newTabIndexParam = this.props.navigation.getParam('newTabIndex')
        if ((this.state.newTabIndex === -1) && (newTabIndexParam !== undefined && newTabIndexParam !== -1)) {
            this.setState({ loadingMySentCards: true })
            this._getSentMyCardsData()
            this.setState({ newTabIndex: this.props.navigation.getParam('newTabIndex'), tabIndex: this.props.navigation.getParam('newTabIndex') })
        }
    }

    componentDidMount() {
        this._getGiftCardMechants()
        this._getGiftBooknGoGoCards()
        this._getSentMyCardsData()
    }


    _renderItem({ item, index }) {
        const giftCardData = this.state.giftCards[index]
        return (
            <TouchableOpacity
                style={{ borderRadius: 5, height: 170, flexDirection: 'column' }}
                onPress={() =>
                    this._giftCardItemClicked(index)
                }
            >
                <Image
                    style={{ height: 170, width: wp(90), resizeMode: 'cover', borderRadius: 5, borderBottomWidth: 2, borderColor: '#BFBFBF' }}
                    source={{ uri: giftCardData.logo_url }}
                />
                <View style={{ marginTop: -34, flexDirection: 'row' }}>
                    <View style={{ marginLeft: 100 }}>
                        <Text style={{ color: '#7A7C80', fontSize: 11 }}>{giftCardData.name}</Text>
                    </View>
                    <View style={{}}>
                        <Image
                            style={{ width: 108, resizeMode: 'contain' }}
                            source={{ uri: giftCardData.merchant_url.replace('http://', 'https://') }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _giftCardItemClicked(index) {
        this.setState({ newTabIndex: -1 })
        this.props.navigation.navigate({
            routeName: 'BookngogoGiftCard',  // 
            params: { cardData: this.state.giftCards[index], userInfo: this.state.userInfo },
        })
    }

    _renderMyCards() {
        const myCardViews = []
        if (this.state.myCards.length === 0) {
            myCardViews.push(
                <Text style={{ width: '100%', paddingHorizontal: wp(3), marginTop: wp(8), color: '#043046', textAlign: 'center', fontSize: 16 }}>{'You have not purchased \n any giftcards yet.'}</Text>
            )
        }
        else {
            for (let i = 0; i < this.state.myCards.length; i++) {
                myCardViews.push(
                    <View key={'sentCardView' + i} style={{ marginLeft: 17, marginHorizontal: 17, marginTop: 21, width: wp(100) - 34, height: wp(53), borderRadius: 8, borderColor: '#cfcfcf', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 2 }}>
                        <View style={{ height: wp(16), borderTopRightRadius: 8, borderTopLeftRadius: 8, backgroundColor: '#BCE9FF', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', marginLeft: wp(4), alignItems: 'center' }}>
                                <View style={{ width: wp(9), height: wp(9), borderRadius: wp(4.5), backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={{ width: wp(3.5), height: wp(3), resizeMode: 'stretch' }}
                                        source={require('../../../../assets/images/my_point/my_gift_card/gift-card.png')}
                                    />
                                </View>
                                <Text style={{ marginLeft: wp(2), color: '#6D6B6B', fontSize: 14, fontWeight: '600' }}>{'$ ' + this.state.myCards[i].value}</Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}>
                                <Image
                                    style={{ width: wp(16), height: wp(12), resizeMode: 'stretch' }}
                                    source={{ uri: this.state.myCards[i].valuelogo_url }}
                                />
                            </View>
                        </View>
                        <View style={{ marginLeft: wp(4), marginHorizontal: wp(4), justifyContent: "space-between", flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ color: '#043046', fontSize: 12, }}>Date</Text>
                                <Text style={{ color: '#043046', fontSize: 12 }}> {this.state.myCards[i].expiration_date.split(' ')[0]} </Text>
                                <Text style={{ marginTop: wp(2), color: '#043046', fontSize: 12 }}>Purchased for</Text>
                                <Text style={{ color: '#0193DD', fontSize: 14 }}>{this.state.myCards[i].purchased_for === 'self' ? 'self' : (this.state.myCards[i].recipient_name ?? '')}</Text>
                                <Text style={{ marginTop: wp(2), color: '#043046', fontSize: 12 }}>Benefits</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        style={{ width: wp(20), height: wp(5.5), resizeMode: 'stretch' }}
                                        source={require('../../../../assets/images/my_point/bookngogo_gift_card/gogo.png')}
                                    />
                                    <Text style={{ fontSize: 13, marginLeft: -wp(7), fontFamily: "Open Sans", color: "#6D6B6B", }}>10</Text>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    style={{ width: wp(9), height: wp(9), resizeMode: 'stretch' }}
                                    source={require('../../../../assets/images/my_point/resend.png')}
                                />
                                <Text style={{ color: '#6D6B6B', fontSize: 13, marginTop: 3 }}>Resend</Text>
                            </View>
                        </View>
                    </View>
                )
            }
        }

        return myCardViews
    }

    _renderSentCards() {
        const sentCardViews = []
        if (this.state.sentCards.length === 0) {
            sentCardViews.push(
                <Text style={{ width: '100%', paddingHorizontal: wp(3), marginTop: wp(8), color: '#043046', textAlign: 'center', fontSize: 16 }}>{'You have not purchased \n any giftcards yet.'}</Text>
            )
        }
        else {
            for (let i = 0; i < this.state.sentCards.length; i++) {
                sentCardViews.push(
                    <View key={'sentCardView' + i} style={{ marginLeft: 17, marginHorizontal: 17, marginTop: 21, width: wp(100) - 34, height: wp(53), borderRadius: 8, borderColor: '#cfcfcf', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 2 }}>
                        <View style={{ height: wp(16), borderTopRightRadius: 8, borderTopLeftRadius: 8, backgroundColor: '#BCE9FF', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'row', marginLeft: wp(4), alignItems: 'center' }}>
                                <View style={{ width: wp(9), height: wp(9), borderRadius: wp(4.5), backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        style={{ width: wp(3.5), height: wp(3), resizeMode: 'stretch' }}
                                        source={require('../../../../assets/images/my_point/my_gift_card/gift-card.png')}
                                    />
                                </View>
                                <Text style={{ marginLeft: wp(2), color: '#6D6B6B', fontSize: 14, fontWeight: '600' }}>{'$ ' + this.state.sentCards[i].value}</Text>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}>
                                <Image
                                    style={{ width: wp(16), height: wp(12), resizeMode: 'stretch' }}
                                    source={{ uri: this.state.sentCards[i].valuelogo_url }}
                                />
                            </View>
                        </View>
                        <View style={{ marginLeft: wp(4), marginHorizontal: wp(4), justifyContent: "space-between", flexDirection: 'row' }}>
                            <View style={{ justifyContent: 'center' }}>
                                <Text style={{ color: '#043046', fontSize: 12, }}>Date</Text>
                                <Text style={{ color: '#043046', fontSize: 12 }}> {this.state.sentCards[i].expiration_date.split(' ')[0]} </Text>
                                <Text style={{ marginTop: wp(2), color: '#043046', fontSize: 12 }}>Purchased for</Text>
                                <Text style={{ color: '#0193DD', fontSize: 14 }}>{this.state.sentCards[i].purchased_for === 'self' ? 'self' : (this.state.sentCards[i].recipient_name ?? '')}</Text>
                                <Text style={{ marginTop: wp(2), color: '#043046', fontSize: 12 }}>Benefits</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        style={{ width: wp(20), height: wp(5.5), resizeMode: 'stretch' }}
                                        source={require('../../../../assets/images/my_point/bookngogo_gift_card/gogo.png')}
                                    />
                                    <Text style={{ fontSize: 13, marginLeft: -wp(7), fontFamily: "Open Sans", color: "#6D6B6B", }}>
                                        10
                    </Text>
                                </View>
                            </View>
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Image
                                    style={{ width: wp(9), height: wp(9), resizeMode: 'stretch' }}
                                    source={require('../../../../assets/images/my_point/resend.png')}
                                />
                                <Text style={{ color: '#6D6B6B', fontSize: 13, marginTop: 3 }}>Resend</Text>
                            </View>
                        </View>
                    </View>
                )
            }
        }

        return sentCardViews
    }

    _showCardListScreen() {
        this.setState({ newTabIndex: -1 })
        this.props.navigation.navigate({
            routeName: 'OtherGiftCardList',
            params: { merchantList: this.state.giftMerchants, userInfo: this.state.userInfo },
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}>

                    <View style={[{ marginTop: hp(3), marginHorizontal: wp(7), flexDirection: "row" }]}>
                        <TouchableOpacity
                            style={[styles.statusItem, styles.statusItemFirst, this.tabStyle(0), { marginLeft: 0, flex: 1, borderRightWidth: 0 }]}
                            onPress={() => this.setState({ tabIndex: 0 })}
                        >
                            <Text style={[styles.statusText, this.tabTextStyle(0)]}>Buy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.statusItem, { flex: 1 }, this.tabStyle(1), { borderRightWidth: 0 }]}
                            onPress={() => this.setState({ tabIndex: 1 })}
                        >
                            <Text style={[styles.statusText, this.tabTextStyle(1)]}>My Cards</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.statusItem, styles.statusItemLast, { flex: 1 }, this.tabStyle(2)]}
                            onPress={() => this.setState({ tabIndex: 2 })}
                        >
                            <Text style={[styles.statusText, this.tabTextStyle(2)]}>Sent Cards </Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.tabIndex === 0 && (
                        <View>
                            <View style={{ marginTop: hp(2), marginHorizontal: wp(5), marginBottom: hp(1), flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Image
                                        style={{ alignSelf: 'flex-end', width: 140, resizeMode: 'stretch' }}
                                        source={require('../../../../assets/images/my_point/gift_card/booknGOGO.png')}
                                    />
                                </View>
                                <View style={{ justifyContent: 'center' }}>
                                    <Image
                                        style={{ alignSelf: 'flex-end', width: 13, height: 17, resizeMode: 'stretch' }}
                                        source={require('../../../../assets/images/home/arrow.png')}
                                    />
                                </View>
                            </View>
                            <View style={{ marginHorizontal: wp(5) }}>
                                {
                                    this.state.loadingGiftCards === true ? (
                                        <ShimmerPlaceHolder
                                            style={{ alignSelf: 'center', width: wp(90), height: 170, opacity: 0.5 }}
                                            autoRun={true} />
                                    ) : (
                                            <Carousel
                                                ref={(c) => { this._carousel = c }}
                                                data={this.state.giftCards}
                                                renderItem={this._renderItem}
                                                sliderWidth={wp(90)}
                                                itemWidth={wp(90)}
                                                onSnapToItem={(index) => this.setState({ activeSlide: index })}
                                            />
                                        )
                                }
                            </View>
                            <View style={{ alignItems: 'center', flexDirection: "row", justifyContent: "center", alignSelf: "center", marginTop: 10 }}>
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
                            <View style={{ marginTop: hp(5), marginHorizontal: wp(7), marginVertical: hp(0.5), flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View>
                                    <Text style={{ color: '#100F0F', fontWeight: '600', fontSize: wp(4.5) }}>Explore</Text>
                                </View>
                                <TouchableOpacity
                                    style={{ justifyContent: 'center' }}
                                    onPress={() => this._showCardListScreen()}
                                >
                                    <Text style={{ color: '#0193DD', fontSize: 14 }}>More</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView
                                style={{ flexDirection: "row", marginTop: hp(1), marginLeft: wp(5), paddingVertical: hp(1) }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                            >
                                {this._renderGiftMerchantViews()}
                            </ScrollView>
                        </View>
                    )}
                    {this.state.tabIndex === 1 && this._renderMyCards()}
                    {this.state.tabIndex === 2 && this._renderSentCards()}
                </ScrollView>
                {(this.state.loadingGiftDetails || this.state.loadingMySentCards) && (
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#00000033', alignItems: 'center', justifyContent: 'center' }]}>
                        <Loading />
                    </View>
                )}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    statusItem: {
        marginLeft: 0,
        borderColor: '#0093DD',
        borderWidth: 1,
        justifyContent: 'center',
        color: '#0093DD',
    },
    statusItemFirst: {
        borderBottomLeftRadius: 5,
        borderTopLeftRadius: 5
    },
    statusItemLast: {
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5
    },
    statusItemPrimary: {
        backgroundColor: '#007AFF'
    },
    statusText: {
        fontSize: wp(3.3),
        fontFamily: fonts.primaryRegular,
        color: '#0093DD',
        alignSelf: 'center',
        marginVertical: hp(0.4)
    },
    statusTextPrimary: {
        color: '#FFFFFF'
    },
    Category: {
        marginLeft: 12,
        marginTop: 7,
        marginHorizontal: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        justifyContent: 'center',
        borderTopWidth: 0,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 2,
        borderColor: '#ddd',
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        height: 55
    },
})
