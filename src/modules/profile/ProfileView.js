import axios from 'axios'
import React from 'react'
import { Image, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, ToastAndroid } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers } from 'react-native-popup-menu'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { SaveObjectWithKey } from '../../components/AsyncStore'
import Loading from '../../components/Loading'
import { Text } from '../../components/StyledText'
import { Authentication, BackendUrl, BookAuthentication, BookBackendUrl } from '../backend/constants'
import { stream_client } from "../help/StreamInit"

const { Popover } = renderers

export default class ProfileScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            membership_level: {},
            loading: true,
            membership_logo: {},
            next_level_membership_logo: {},
            isData: false,
            image_unique_value: (new Date()).getMilliseconds()
        }
        this.get_membership_level = this.get_membership_level.bind(this)
    }
    static navigationOptions = {
        header: null
    }

    menuitem_on_click = (nav_screen_name) => {
        if (nav_screen_name == 'Logout') {
            SaveObjectWithKey('userData', null)
            this.props.UserLogout()
            stream_client.disconnect() // Stream Chat user logout
            this.props.navigation.navigate('InitialAuth')
        }
        else
            this.props.navigation.navigate(nav_screen_name, { userInfo: this.props.userInfo })
    }

    get_membership_level() {
        let partner_id = this.props.userInfo.partner_id
        let ref_code = this.props.userInfo.partner_referral_code
        let payload = JSON.stringify({
            'referral_code': ref_code,
            'partner_id': partner_id,
            'Authorization': Authentication
        })
        axios({
            method: 'POST',
            url: BackendUrl + '/get/bngmobile/partner/membership_level?data=' + payload,

            responseType: 'json'
        })
            .then((response) => {
                if (response.data.success) {
                    membership_level = response.data.result_data.membership_level
                    this.setState({
                        membership_level: membership_level,
                        membership_logo: { uri: membership_level.logo_url.replace('http:', 'https:') },
                        next_level_membership_logo: { uri: membership_level.next_level_logo_url.replace('http:', 'https:') },
                        isData: true
                    }, () => {
                        this.setState({ loading: false })
                    })
                }
                else {
                    this.setState({
                        loading: false,
                        isData: false
                    })
                }

            })
            .catch((error) => {
                console.warn(error)
                this.setState({ loading: false })
            })
    }

    get_profile_image = () => {
        let payload = JSON.stringify({
            'Authorization': BookAuthentication,
            'referral_code': this.props.userInfo.partner_referral_code,
            'partner_id': this.props.userInfo.partner_id
        })
        axios({
            method: 'POST',
            url: BookBackendUrl + '/bnggetprofileimage' + '?data=' + payload,
            responseType: 'json'
        })
            .then((response) => {

                const data = response.data

                if (data.success) {
                    this.setState({ profile_image_url: data.profile_image_url.replace('http://', 'https://') + '&unique=' + this.state.image_unique_value }, () => console.warn(this.state.profile_image_url))
                }
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    componentDidMount() {

        this.props.navigation.setParams({ userInfo: this.props.userInfo }) // Do not remove

        if (!this.props.userInfo)
            return

        this.get_profile_image()
        this.get_membership_level()
    }

    render() {

        if (this.state.loading) {
            return (
                <Loading />
            )
        }

        return (
            <ScrollView style={{ backgroundColor: '#F5F5F5' }}>

                {/* Status Bar */}
                <StatusBar backgroundColor="#0093DD" barStyle="light-content" />

                {/* Profile top View */}
                <LinearGradient colors={['#0093DD', '#004A6F']} style={{ borderBottomLeftRadius: wp(6), borderBottomRightRadius: wp(6), backgroundColor: '#F5F5F5', }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: wp(10), marginTop: hp(9), marginBottom: hp(3) }}>
                        {this.state.profile_image_url &&
                            <Image
                                source={{ uri: 'https://6dfc6235.ngrok.io/web/image?model=res.partner&id=137&field=image&unique=198' }}
                                style={{ height: wp(20), width: wp(20), borderRadius: wp(20), resizeMode: 'contain' }}
                            />
                        }
                        <View style={{ marginLeft: wp(5), width: wp(45) }}>
                            <View style={{ padding: '2%' }}>
                                <Text style={{ color: '#FFFFFF', fontSize: wp(4), textTransform: 'uppercase' }}> {this.props.userInfo.partner_name} </Text>
                            </View>
                            <Menu
                                renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}
                            >
                                <MenuTrigger children={(
                                    <View style={{ width: '100%', flexDirection: "row" }}>
                                        <View style={styles.membershipContainer}>
                                            <View style={styles.alignCenter}>
                                                <Image
                                                    source={this.state.isData ? this.state.membership_logo : require('../../../assets/images/gogo_beginner.png')}
                                                    style={{ width: '90%', height: '90%' }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                        </View>
                                        <View style={{ width: '20%' }}>
                                            <View style={styles.alignCenter}>

                                                <Image
                                                    source={require('../../../assets/images/right-arrow.png')}
                                                    resizeMode="contain"
                                                />

                                            </View>
                                        </View>

                                    </View>
                                )}
                                    customStyles={{
                                        triggerOuterWrapper: {
                                            padding: wp(1),
                                            flex: 1,
                                            zIndex: 100,
                                        },
                                        triggerWrapper: {
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: 1,
                                        },
                                        triggerTouchable: {
                                            activeOpacity: 70,
                                            style: {
                                                flex: 1,
                                            },
                                        }
                                    }}
                                >

                                </MenuTrigger>

                                {this.state.next_level_membership_logo &&
                                    <MenuOptions
                                        customStyles={{
                                            optionsContainer: {
                                                width: wp(80),
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: 0
                                            },
                                            optionWrapper: {
                                                padding: 0,
                                                borderRadius: 5
                                            }
                                        }}

                                    >
                                        <MenuOption>
                                            <View style={{ width: '100%' }}>
                                                <View style={[styles.w100, styles.alignCenter, { marginVertical: hp(1) }]}>
                                                    <Text style={{ textAlign: 'center' }}>Spend ${this.state.membership_level && this.state.membership_level.to_reach_next} to reach </Text>
                                                    <Image
                                                        source={this.state.next_level_membership_logo}
                                                        style={{ width: wp(20), height: wp(5) }}
                                                        resizeMode="contain"
                                                    />
                                                </View>
                                                <View style={[styles.w100, styles.nextLevelInfo, styles.alignCenter]}>
                                                    <Text style={{ color: '#FFFFFF', textAlign: 'center', marginVertical: hp(1), marginHorizontal: wp(3) }}>Can't wait to enjoy more benefits of {(this.state.membership_level && this.state.membership_level.next_level) && this.state.membership_level.next_level.toUpperCase()}, upgrade with just $50</Text>
                                                </View>
                                            </View>
                                        </MenuOption>
                                    </MenuOptions>
                                }


                            </Menu>

                            {/* <Text style={{ color: 'white' }}> {this.props.userInfo === null ? '' : this.props.userInfo.partner_email} </Text>
                                        <Text style={{ color: '#F2E200', fontSize: wp(5) }}> {this.props.userInfo === null ? '' : this.props.userInfo.partner_name} </Text> */}
                        </View>
                    </View>
                </LinearGradient>

                {/* List of My Profile Items */}
                <View style={{ backgroundColor: '#F5F5F5', paddingTop: hp(2), paddingBottom: hp(5) }}>
                    <MenuItem
                        on_click={this.menuitem_on_click}
                        nav_screen_name={'TripsScreen'}
                        title={'My Trips'}
                        icon={require('../../../assets/images/profile/wallet.png')}
                    />
                    <MenuItem
                        on_click={this.menuitem_on_click}
                        nav_screen_name={'MyDeals'}
                        title={'My Deals'}
                        icon={require('../../../assets/images/profile/my_deals.png')}
                    />
                    <MenuItem
                        on_click={this.menuitem_on_click}
                        nav_screen_name={'UserProfile'}
                        title={'My Profile'}
                        icon={require('../../../assets/images/profile/user_logo.png')}
                    />
                    <MenuItem
                        on_click={this.menuitem_on_click}
                        nav_screen_name={'CoTraveller'}
                        title={'Co-Travellers'}
                        icon={require('../../../assets/images/profile/users_2.png')}
                    />
                    <MenuItem
                        on_click={this.menuitem_on_click}
                        nav_screen_name={'MyCards'}
                        title={'Payment Options'}
                        icon={require('../../../assets/images/profile/wallet.png')}
                    />
                    <MenuItem
                        on_click={this.menuitem_on_click}
                        nav_screen_name={'Notifications'}
                        title={'Notifications'}
                        icon={require('../../../assets/images/profile/notification_icon.png')}
                        notification_unread_count={this.props.notification_unread_count}
                    />
                    <MenuItem
                        on_click={this.menuitem_on_click}
                        nav_screen_name={'MyCards'}
                        title={'Bucket List'}
                        icon={require('../../../assets/images/profile/list.png')}
                    />
                    <MenuItem
                        on_click={this.menuitem_on_click}
                        nav_screen_name={'MySearches'}
                        title={'My Searches'}
                        icon={require('../../../assets/images/profile/search_icon.png')}
                    />
                    <MenuItem
                        on_click={this.menuitem_on_click}
                        nav_screen_name={'ReferEarn'}
                        title={'Refer & Earn'}
                        icon={require('../../../assets/images/profile/refer_earn.png')}
                    />
                    {(this.props.userInfo.partner_sso_type !== 'google' && this.props.userInfo.partner_sso_type !== 'facebook') && (
                        <MenuItem
                            on_click={this.menuitem_on_click}
                            nav_screen_name={'ChangePassword'}
                            title={'Change Password'}
                            icon={require('../../../assets/images/profile/change_password.png')}
                        />
                    )}
                    <MenuItem
                        on_click={this.menuitem_on_click}
                        nav_screen_name={'Logout'}
                        title={'Logout'}
                        icon={require('../../../assets/images/profile/logout.png')}
                    />
                </View>
            </ScrollView>
        )
    }
}

class MenuItem extends React.Component {
    render() {
        return (
            <TouchableOpacity
                onPress={() => { this.props.on_click(this.props.nav_screen_name) }}
                style={{ flex: 1, flexDirection: 'row', alignItems: 'center', height: hp(7), elevation: 2, backgroundColor: 'white', paddingLeft: wp(8), marginVertical: hp(0.5) }}>
                <Image
                    source={this.props.icon}
                    style={{ width: wp(4.5), height: wp(4.5), marginRight: wp(5) }}
                />
                <Text style={{ fontSize: wp(3.5) }}>{this.props.title}</Text>
                {((this.props.title === 'Notifications') && (this.props.notification_unread_count > 0)) &&
                    <View style={{ marginLeft: wp(2.5), height: wp(1.4), width: wp(1.4), borderRadius: wp(10), backgroundColor: 'red' }} />
                    // <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: wp(3), backgroundColor: 'red', width: wp(4), borderRadius: wp(10) }}>
                    //     <Text style={{ fontSize: wp(3), color: 'white' }}>{this.props.notification_unread_count}</Text>
                    // </View>
                }
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    w100: {
        width: '100%',
        padding: 0,
        margin: 0,
        flex: 1,
        flexDirection: 'row'
    },
    alignCenter: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    membershipContainer: {
        width: '100%',
        height: hp(4),
        borderRadius: 15,
        backgroundColor: '#F2E200'
    },
    rightArrow: {
        marginLeft: wp(2)
    },
    nextLevelInfo: {
        backgroundColor: '#0093DD',
        color: '#FFFFFF'
    }
})