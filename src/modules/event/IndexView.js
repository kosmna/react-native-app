
import axios from 'axios'
import React from 'react'
import { Animated, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View, FlatList } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Text } from '../../components/StyledText'
import { fonts } from '../../styles'
import { Authentication, BackendUrl } from '../backend/constants'
import Loading from '../../components/Loading'

export default class IndexScreen extends React.Component {

    static navigationOptions = {
        header: null
    }

    state = {
        loading: true
    }

    get_events_data = () => {

        navigator.geolocation.getCurrentPosition((position) => {
            const request_data = JSON.stringify({
                'Authorization': Authentication,
                'partner_id': this.props.userInfo.partner_id,
                'referral_code': this.props.userInfo.partner_referral_code,
                'latitude': position.coords.latitude,
                'longitude': position.coords.longitude,
                'radius': 5 * 1.60934 * 1000
                // 'artistids': [],
                // 'categoryids': [],
                // 'from_date': '',
                // 'end_date': ''
            })
            axios({
                method: 'POST',
                url: BackendUrl + '/getbnggoldstarevents' + '?data=' + request_data,
                responseType: 'json'
            })
                .then((response) => {
                    const data = response.data
                    console.warn(data)

                    if (data.success) {
                        this.setState({
                            goldstar_event_list: data.goldstar_event_list,
                            goldstar_artist_list: data.unique_goldstar_artist_list,
                            goldstar_category_list: data.unique_goldstar_category_list,
                            goldstar_price_list: data.unique_goldstar_price_list,
                            loading: false
                        })
                    }
                })
                .catch((error) => {
                    console.warn(error)
                })
        },
            (error) => {
                console.log('Getting Location Error', error)
            },
            { enableHighAccuracy: true, timeout: 30000 })

    }

    componentDidMount() {
        this.get_events_data()
    }

    render_event = ({ item }) => {
        return (
            <TouchableOpacity
                style={{ width: wp(44), height: hp(30), borderRadius: wp(1), elevation: 2, backgroundColor: '#fff', marginHorizontal: wp(2), marginVertical: hp(2) }}
                onPress={() => this.props.navigation.navigate('EventItem', { data: item })}
            >
                <ImageBackground
                    source={{ uri: item.image_url }}
                    style={{ width: wp(44), height: wp(26), borderTopLeftRadius: wp(1), borderTopRightRadius: wp(1) }}
                    imageStyle={{ borderTopLeftRadius: wp(1), borderTopRightRadius: wp(1) }}
                />

                <View style={{ marginHorizontal: wp(2), marginTop: hp(2) }}>
                    <Text style={{ color: '#707070', fontSize: wp(3), fontWeight: '600' }}>{item.headline_text}</Text>
                </View>

                <View style={{ marginHorizontal: wp(2), marginTop: hp(1) }}>
                    <Text style={{ color: '#707070', fontSize: wp(3) }}>{item.venue_name}</Text>
                </View>

                <View style={{ position: 'absolute', bottom: hp(1.5), left: wp(4) }}>
                    <Text style={{ color: '#707070', fontSize: wp(3), fontWeight: '600' }}>{item.full_price_range}</Text>
                </View>

            </TouchableOpacity>
        )
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>

                <Animated.View style={[{ width: '100%', marginHorizontal: 7, marginTop: 10 }]}>
                    <Animated.View
                        style={[
                            { height: 44, width: '100%' },
                            { alignItems: 'center', justifyContent: 'space-between', flexDirection: "row", }
                        ]}
                    >
                        <TouchableOpacity
                            style={{ width: '33%' }}
                            onPress={() => this.props.navigation.navigate({
                                routeName: 'Home',
                                params: {},
                            })}
                        >
                            <Image
                                style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                                source={require('../../../assets/images/category/back.png')}
                            />
                        </TouchableOpacity>
                        <View style={{ width: '34%', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>Events</Text>
                        </View>
                        <View style={{ width: '33%', justifyContent: 'flex-end' }} />
                    </Animated.View>
                </Animated.View>
                <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12.5, width: '100%' }} />

                {/* Scrollview */}
                <ScrollView style={{ paddingTop: hp(2), paddingBottom: hp(10) }}>

                    <LinearGradient colors={['#5DC9FF', '#2F6580']} style={{ borderRadius: wp(1), width: wp(94), height: hp(25), marginHorizontal: wp(3), flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ marginHorizontal: wp(6), width: wp(47) }}>
                            <Text style={{ fontSize: wp(5.5), color: 'white', }}>Find amazing events happening around you</Text>
                        </View>
                    </LinearGradient>

                    <View style={{ marginHorizontal: wp(3), marginTop: hp(2), flexDirection: 'row', }}>
                        <View style={{ height: hp(6), borderRadius: wp(1), backgroundColor: '#8E8E931A', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                            <TextInput
                                style={{ marginLeft: wp(3.5) }}
                                placeholder="Search for an event"
                            />
                            <Image
                                style={{ width: wp(4.5), height: wp(4.5), resizeMode: 'contain', marginRight: wp(7) }}
                                source={require('../../../assets/images/category/search.png')}
                                tintColor='#0093DD'
                            />
                        </View>
                        <View style={{ height: hp(6), justifyContent: 'center', alignItems: 'center', marginHorizontal: wp(4) }}>
                            <Image
                                style={{ width: wp(4.5), height: wp(4.5), resizeMode: 'contain' }}
                                source={require('../../../assets/images/event/noun_filter.png')}
                                tintColor='#0093DD'
                            />
                        </View>
                    </View>

                    <View style={{ marginVertical: hp(2), marginHorizontal: wp(2), justifyContent: 'space-evenly' }}>
                        {this.state.loading &&
                            <View style={{ marginTop: hp(10) }}>
                                <Loading />
                            </View>
                        }
                        <FlatList
                            data={this.state.goldstar_event_list}
                            renderItem={this.render_event}
                            keyExtractor={item => item.link}
                            numColumns={2}
                        />
                    </View>

                </ScrollView>
            </SafeAreaView>
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
        height: 27,
        borderColor: '#0093DD',
        borderWidth: 1,
        justifyContent: 'center',
        color: '#0093DD'
    },
    statusItemFirst: {
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4
    },
    statusItemLast: {
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4
    },
    statusItemPrimary: {
        backgroundColor: '#007AFF'
    },
    statusText: {
        fontSize: 13,
        fontFamily: fonts.primaryRegular,
        color: '#0093DD',
        alignSelf: 'center'
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
