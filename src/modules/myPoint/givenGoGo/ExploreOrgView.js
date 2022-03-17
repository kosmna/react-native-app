

import React from 'react'
import {
    StyleSheet,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    ToastAndroid
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Text } from '../../../components/StyledText'
import { RadioGroup } from '../../../components'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { google_places_search_key } from '../../../modules/backend/constants'
import Loading from '../../../components/Loading'
import { BackendUrl, Authentication } from '../../backend/constants'
import axios from 'axios'
import _ from 'lodash'


export default class ExploreOrgScreen extends React.Component {

    static navigationOptions = {
        title: 'Explore Organizations'
    }

    state = {
        userInfo: this.props.navigation.getParam('userInfo'),
        partner_id: this.props.navigation.getParam('userInfo').partner_id,
        partner_referral_code: this.props.navigation.getParam('userInfo').partner_referral_code,
        select_category_index: 0, // 0: online, 1: offline, 2: Near Me
        show_invite_organization_popup: false,
        loading: true
    }

    componentDidMount() {
        this.get_merchant_list()
    }

    get_merchant_list = async () => {

        navigator.geolocation.getCurrentPosition((position) => {


            let request_data = JSON.stringify({
                'Authorization': Authentication,
                'referral_code': this.state.partner_referral_code,
                'partner_id': this.state.partner_id,
                'latitude': position.coords.latitude,
                'longitude': position.coords.longitude
            })

            axios({
                method: 'POST',
                url: BackendUrl + '/getbnggivengogomerchantlist' + '?data=' + request_data,
                responseType: 'json'
            })
                .then((response) => {
                    let data = response.data
                    if (data.success) {
                        this.setState({ givengocategory_list: data.givengocategory_list, merchant_list: _.concat(data.givengogmerchant_list, data.ownmerchant_list), loading: false })
                    }
                    else
                        ToastAndroid.show('API Error', ToastAndroid.SHORT)
                })
                .catch(function (error) {
                    ToastAndroid.show('API Error' + error, ToastAndroid.SHORT)
                })
        },
            (error) => {
                console.log('Getting Location Error', error)
            },
            { enableHighAccuracy: true, timeout: 30000 })

    }

    invite_org = () => {

        if (!this.state.google_place_org_details && !this.state.invite_org_url) {
            ToastAndroid.show('Enter necessary details', ToastAndroid.SHORT)
            return
        }

        this.setState({ show_invite_organization_popup: false })

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.state.partner_referral_code,
            'partner_id': this.state.partner_id,
            'api_response': this.state.google_place_org_details ? this.state.google_place_org_details : {},
            'url': this.state.invite_org_url ? this.state.invite_org_url : ''
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/addbnggivengogorequest' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                if (data.success) {
                    ToastAndroid.show('Thanks for letting us know', ToastAndroid.SHORT)
                }
                else
                    ToastAndroid.show('API Error', ToastAndroid.SHORT)
            })
            .catch(function (error) {
                ToastAndroid.show('API Error' + error, ToastAndroid.SHORT)
            })
    }

    render_category = () => {
        let return_data = []
        this.state.givengocategory_list.forEach((category, index) => {
            if (this.state.select_category_index == 0 && category.is_online != true)
                return
            if (this.state.select_category_index == 1 && category.is_brick_mortar != true)
                return

            return_data.push(
                <TouchableOpacity
                    key={index}
                    style={{ width: '30%', marginVertical: hp(1), alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => this.props.navigation.navigate('OrgCategoryList',
                        { userInfo: this.state.userInfo, category_selected: category, merchant_list: this.state.merchant_list.filter(obj => obj.category_name == category.category_name) }
                    )}
                >
                    <View style={{ alignItems: 'center' }}>
                        <Image
                            style={{ width: wp(20), height: wp(20), resizeMode: 'stretch' }}
                            source={{ uri: category.category_image_url }}
                        />

                        <Text style={{ fontSize: wp(3), fontFamily: "Open Sans", fontWeight: '200', color: "#6D6B6B", marginTop: hp(1) }}>{category.category_name}</Text>
                    </View>
                </TouchableOpacity>
            )
        })
        return return_data
    }

    render() {

        if (this.state.loading)
            return <Loading />

        let invite_organization_modal = (
            <Modal
                transparent={true}
                visible={this.state.show_invite_organization_popup}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0,0.3)' }}>
                    <View style={{ flex: 0.7, justifyContent: 'center', paddingBottom: hp(2), width: wp(90), marginHorizontal: wp(5), backgroundColor: 'white', elevation: 4 }}>

                        <TouchableOpacity
                            onPress={() => this.setState({ show_invite_organization_popup: !this.state.show_invite_organization_popup })}
                            style={{ position: 'absolute', top: 0, right: 0, margin: wp(2) }}
                        >
                            <Image
                                style={{ width: wp(6), height: wp(6), padding: 5 }}
                                source={require('../../../../assets/images/my_point/modal_close.png')}
                            />
                        </TouchableOpacity>

                        <Text style={{ fontSize: wp(4), fontWeight: 'bold', color: '#0193DD', textAlign: 'center' }}>Organization Details</Text>

                        <View style={{ marginHorizontal: wp(6), marginTop: hp(4) }}>
                            <Text style={{ fontSize: wp(3.5) }}>URL of the Website</Text>
                            <TextInput
                                style={{ borderBottomWidth: 1, borderBottomColor: 'gray', paddingVertical: 0, marginVertical: 0 }}
                                onChangeText={(url) => this.setState({ invite_org_url: url })}
                                textContentType={'URL'}
                            />
                        </View>

                        <View style={{ width: '100%', marginVertical: hp(3) }}>
                            <Text style={{ fontSize: wp(3.5), textAlign: 'center' }}>OR</Text>
                        </View>

                        <View style={{ marginHorizontal: wp(5), marginBottom: hp(3) }}>
                            <GooglePlacesAutocomplete
                                ref={(instance) => { this.GooglePlacesRef = instance }}
                                placeholder='Search for organizations'
                                minLength={2} // minimum length of text to search
                                autoFocus={true}
                                returnKeyType={'search'} // Can be left out for default return key 
                                listViewDisplayed={false}    // true/false/undefined
                                fetchDetails={true}
                                suppressDefaultStyles={true}
                                enablePoweredByContainer={false}
                                onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                    this.setState({ google_place_org_details: details })
                                }}
                                renderLeftButton={() => {
                                    return (
                                        <View style={{ paddingLeft: 10, alignSelf: "center" }}>
                                            <Image
                                                style={{ width: wp(4), height: wp(4), alignSelf: "center", justifyContent: "center" }}
                                                source={require('../../../../assets/images/category/search.png')}
                                            />
                                        </View>
                                    )
                                }}
                                styles={{
                                    textInputContainer: {
                                        backgroundColor: '#00000000',
                                        flexDirection: 'row',
                                        width: '100%'
                                    },
                                    textInput: {
                                        backgroundColor: '#FFFFFF',
                                        flex: 1,
                                    },
                                    container: {
                                        width: '100%',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: 8,
                                    },
                                    row: {
                                        padding: 10,
                                        height: hp(5),
                                        flexDirection: 'row',
                                    },
                                    separator: {
                                        height: 0.5,
                                        backgroundColor: '#c8c7cc',
                                    },
                                }}
                                query={{
                                    key: google_places_search_key,
                                    language: 'en',
                                    types: 'establishment'
                                }}
                                nearbyPlacesAPI='GooglePlacesSearch'
                                debounce={300}
                            />
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{ width: wp(20), height: hp(4.5), backgroundColor: '#0093DD', justifyContent: 'center', alignItems: 'center', borderRadius: wp(1) }}
                                onPress={this.invite_org}
                            >
                                <Text style={{ color: 'white', fontSize: wp(4), textAlign: 'center' }}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )

        return (
            <SafeAreaView style={styles.container}>
                <ScrollView
                    style={[styles.container]}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={{ fontSize: wp(5), fontFamily: "Open Sans", fontWeight: '600', color: "#0093DD", marginTop: 17, paddingHorizontal: 20 }}>Discover</Text>
                    <Text style={{ fontSize: wp(3.3), fontFamily: "Open Sans", color: "#A2A2A4", marginTop: 3, paddingHorizontal: 20 }}>Your preferred organisation to donate</Text>

                    <RadioGroup
                        style={{ marginHorizontal: 20, height: hp(3.5), marginVertical: hp(3) }}
                        items={['Online', 'Offline', 'Near Me']}
                        selectedIndex={this.state.select_category_index}
                        onChange={index => {
                            if (index < 2)
                                this.setState({ select_category_index: index })
                            else
                                this.props.navigation.navigate('OrgCategoryList',
                                    { userInfo: this.state.userInfo, merchant_list: this.state.merchant_list.filter(obj => obj.is_near_me) }
                                )
                        }}
                        bgColor='blue'
                    />

                    {false &&
                        <View style={{ paddingHorizontal: 15, height: 30, width: '100%', marginTop: 9, flexDirection: 'row' }}>
                            <TouchableOpacity
                                style={styles.activeTypeContainer}
                                onPress={() => console.log('online clicked')}
                            >
                                <Text style={styles.activeTypeText}>Online</Text>
                            </TouchableOpacity>
                            <View style={{ width: 13, height: '100%' }} />
                            <TouchableOpacity
                                style={styles.normalTypeContainer}
                                onPress={() => this.props.navigation.navigate({
                                    routeName: 'LocalOrgList',
                                    params: {},
                                })
                                }
                            >
                                <Text style={styles.normalTypeText}>Local</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    <View style={{ paddingHorizontal: 20, width: '100%', height: 29, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ fontSize: wp(3.5), fontFamily: "Open Sans", fontWeight: '600', color: "#5E5E5E" }}>Select Category</Text>
                    </View>

                    <View style={{ paddingHorizontal: 24, marginTop: 8, width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
                        {this.render_category()}
                    </View>

                </ScrollView>

                <View style={{ backgroundColor: "#A2A2A4", height: 1, width: '100%', opacity: 0.21 }} />
                <TouchableOpacity
                    style={{ paddingLeft: 37, paddingRight: 15, width: '100%', flexDirection: 'row-reverse', alignItems: 'center', marginVertical: hp(2.5) }}
                    onPress={() => this.setState({ show_invite_organization_popup: true })}
                >
                    <View style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ alignSelf: 'center', marginLeft: 14, width: 5, height: 10, resizeMode: 'stretch' }}
                            source={require('../../../../assets/images/home/arrow.png')}
                        />
                    </View>
                    <Text
                        style={{ flex: 1, lineHeight: 17, letterSpacing: 0.12, fontSize: wp(3.3), fontFamily: "Open Sans", fontWeight: '200', color: "#6D6B6B" }}
                    >Didn't find the organisation that you were looking for ? {"\n"}Let us know</Text>
                </TouchableOpacity>

                {invite_organization_modal}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    activeTypeContainer: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0093DD',
        borderRadius: 6
    },
    normalTypeContainer: {
        flex: 1,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
    },
    activeTypeText: {
        fontSize: 14,
        fontFamily: "Open Sans",
        fontWeight: '600',
        color: "#FFFFFF",
    },
    normalTypeText: {
        fontSize: 14,
        fontFamily: "Open Sans",
        fontWeight: '600',
        color: "#4A4C63"
    }
})