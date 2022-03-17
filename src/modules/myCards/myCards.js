import axios from 'axios'
import _ from 'lodash'
import React from 'react'
import { Image, ScrollView, ToastAndroid, TouchableOpacity, View } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import Loading from '../../components/Loading'
import { Text } from '../../components/StyledText'
import { Authentication, BackendUrl } from '../../modules/backend/constants'
import styles from './myCard.style'

const payment_preference_sequence_data = [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
]

const default_payment_preference_sequence = [
    { "sequence": 4, "payment_preference_type": "bank_acount" },
    { "sequence": 3, "payment_preference_type": "saved_card" },
    { "sequence": 2, "payment_preference_type": "gogo_card" },
    { "sequence": 1, "payment_preference_type": "gogo_points" }
]

class MyCards extends React.Component {

    static navigationOptions = {
        title: 'Payment Options'
    }

    constructor(props) {
        super(props)

        this.state = {
            visible_gogo: false,
            visible_other: false,
            gogo_card_status: undefined,
            gogo_card_data: [],
            other_card_data: [],
            gogo_card_status_loading: true,
            card_data_loading: true,
            bank_accounts: [],
            is_dwolla_customer: false,
            acc_details_opned: false,
            acc_details_opned_index: 0,
            dwolla_customer_status: ''
        }
        this.is_dwolla_customer_created = this.is_dwolla_customer_created.bind(this)
        this.get_bank_accounts = this.get_bank_accounts.bind(this)
        this.remove_bank_account = this.remove_bank_account.bind(this)

    }
    is_dwolla_customer_created() {
        let request_data = JSON.stringify({
            'referral_code': this.props.referral_code,
            'partner_id': this.props.partner_id,
            'Authorization': Authentication
        })
        axios({
            method: 'POST',
            url: BackendUrl + "/bng/is_bank_customer?data=" + request_data,
            responseType: 'json'
        })
            .then((resp) => {
                this.setState({
                    loading: false
                })
                res_data = resp.data
                data = res_data
                if (data.success) {
                    this.setState({
                        is_dwolla_customer: data.is_dwolla_customer_created,
                        dwolla_customer_status: data.dwolla_customer_status

                    })
                }

            })
            .catch((error) => {
                console.log("Error creating customer account: ", error)
                this.setState({
                    loading: false
                })
                alert('Something went wrong!')

            })
    }

    get_bank_accounts() {
        let request_data = JSON.stringify({
            'referral_code': this.props.referral_code,
            'partner_id': this.props.partner_id,
            'Authorization': Authentication
        })
        axios({
            method: 'POST',
            url: BackendUrl + "/bng/get/bank_accounts?data=" + request_data,
            responseType: 'json'
        })
            .then((resp) => {
                this.setState({
                    loading: false
                })
                res_data = resp.data
                data = res_data
                if (data.success) {
                    this.setState({
                        bank_accounts: data.bank_accounts
                    })
                }

            })
            .catch((error) => {
                console.log("Error getting customer account: ", error)
                this.setState({
                    loading: false
                })
                alert('Something went wrong!')

            })
    }

    remove_bank_account(bank_id) {
        let request_data = JSON.stringify({
            'referral_code': this.props.referral_code,
            'partner_id': this.props.partner_id,
            'Authorization': Authentication,
            'bank_id': bank_id
        })
        axios({
            method: 'POST',
            url: BackendUrl + "/bng/remove/bank_account?data=" + request_data,
            responseType: 'json'
        })
            .then((resp) => {
                this.setState({
                    loading: false
                })
                res_data = resp.data
                data = res_data
                if (data.success) {
                    this.get_bank_accounts()
                }

            })
            .catch((error) => {
                console.log("Error removing customer account: ", error)
                this.setState({
                    loading: false
                })
                alert('Something went wrong!')

            })
    }


    fetch_cards_data = async () => {
        let payload = JSON.stringify({
            'referral_code': this.props.referral_code,
            'partner_id': this.props.partner_id,
            'Authorization': Authentication
        })
        axios({
            method: 'POST',
            url: BackendUrl + '/getbngmobilesavedcards?data=' + payload,

            responseType: 'json'
        })
            .then((response) => {
                console.log("Get saved cards:::", response.data.result_data)
                other_card_data = []
                gogo_card_data = []
                response.data.result_data.forEach((card) => {
                    if (card.type == 'credit_card')
                        other_card_data.push(card)
                    else
                        gogo_card_data.push(card)
                })
                this.setState({ other_card_data: other_card_data, gogo_card_data: gogo_card_data }, () => {
                    this.setState({ card_data_loading: false })
                })
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    fetch_gogo_card_status = async () => {
        let payload = JSON.stringify({
            'referral_code': this.props.referral_code,
            'partner_id': this.props.partner_id,
            'Authorization': Authentication
        })
        axios({
            method: 'POST',
            url: BackendUrl + '/getbngmobilevirtualcardstatus?data=' + payload,
            responseType: 'json'
        })
            .then((response) => {
                this.setState({ gogo_card_status: response.data.result_data }, () => {
                    this.setState({ gogo_card_status_loading: false })
                })
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    gogo_card_status_ui = () => {
        if (!this.state.gogo_card_status)
            return
        if (this.state.gogo_card_status.bhn_is_card_active)
            return
        else if (this.state.gogo_card_status.bhn_is_card_delivered)
            return (
                <View style={{ display: 'flex', width: '90%', marginTop: hp(3), alignItems: 'center', flexDirection: 'row', borderRadius: wp(1), marginHorizontal: wp(5), elevation: 2, borderRadius: 3, height: hp(12), backgroundColor: '#ECECEC' }}>
                    <Text style={{ marginHorizontal: wp(5), fontSize: wp(5) }}>Gogo Card</Text>
                    <View style={{ flexDirection: 'column', marginLeft: wp(7), justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../../../assets/images/profile/delivered.png')}
                            style={{ width: wp(6), height: wp(6), marginBottom: hp(1) }}
                        />
                        <Text style={{ fontSize: wp(3.5) }}>Delivered</Text>
                        <View style={{ flexDirection: 'row', marginTop: hp(0.6) }}>
                            <View style={{ marginHorizontal: wp(1), height: wp(1), width: wp(1), borderRadius: wp(1), backgroundColor: 'gray' }} />
                            <View style={{ marginHorizontal: wp(1), height: wp(1), width: wp(1), borderRadius: wp(1), backgroundColor: 'gray' }} />
                            <View style={{ marginHorizontal: wp(1), height: wp(1), width: wp(1), borderRadius: wp(1), backgroundColor: 'black' }} />
                        </View>
                    </View>
                </View>
            )
        else if (this.state.gogo_card_status.bhn_is_card_shipped)
            return (
                <View style={{ display: 'flex', width: '90%', marginTop: hp(3), alignItems: 'center', flexDirection: 'row', borderRadius: wp(1), marginHorizontal: wp(5), elevation: 2, borderRadius: 3, height: hp(12), backgroundColor: '#ECECEC' }}>
                    <Text style={{ marginHorizontal: wp(5), fontSize: wp(5) }}>Gogo Card</Text>
                    <View style={{ flexDirection: 'column', marginLeft: wp(7), justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../../../assets/images/profile/on_the_way.png')}
                            style={{ width: wp(6), height: wp(6), marginBottom: hp(1) }}
                        />
                        <Text style={{ fontSize: wp(3.5) }}>On The Way</Text>
                        <View style={{ flexDirection: 'row', marginTop: hp(0.6) }}>
                            <View style={{ marginHorizontal: wp(1), height: wp(1), width: wp(1), borderRadius: wp(1), backgroundColor: 'gray' }} />
                            <View style={{ marginHorizontal: wp(1), height: wp(1), width: wp(1), borderRadius: wp(1), backgroundColor: 'black' }} />
                            <View style={{ marginHorizontal: wp(1), height: wp(1), width: wp(1), borderRadius: wp(1), backgroundColor: 'gray' }} />
                        </View>
                    </View>
                </View>
            )
        else if (this.state.gogo_card_status.isVirtualCardApplied)
            return (
                <View style={{ display: 'flex', width: '90%', marginTop: hp(3), alignItems: 'center', flexDirection: 'row', borderRadius: wp(1), marginHorizontal: wp(5), elevation: 2, borderRadius: 3, height: hp(12), backgroundColor: '#ECECEC' }}>
                    <Text style={{ marginHorizontal: wp(5), fontSize: wp(5) }}>Gogo Card</Text>
                    <View style={{ flexDirection: 'column', marginLeft: wp(7), justifyContent: 'center', alignItems: 'center' }}>
                        <Image
                            source={require('../../../assets/images/profile/applied.png')}
                            style={{ width: wp(6), height: wp(6), marginBottom: hp(1) }}
                        />
                        <Text style={{ fontSize: wp(3.5) }}>Applied</Text>
                        <View style={{ flexDirection: 'row', marginTop: hp(0.6) }}>
                            <View style={{ marginHorizontal: wp(1), height: wp(1), width: wp(1), borderRadius: wp(1), backgroundColor: 'black' }} />
                            <View style={{ marginHorizontal: wp(1), height: wp(1), width: wp(1), borderRadius: wp(1), backgroundColor: 'gray' }} />
                            <View style={{ marginHorizontal: wp(1), height: wp(1), width: wp(1), borderRadius: wp(1), backgroundColor: 'gray' }} />
                        </View>
                    </View>
                </View>
            )
        else
            return (
                <View style={{ flex: 1, marginTop: hp(3), alignItems: 'center', borderRadius: wp(1) }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('GogoCardApply')} >
                        <Image
                            source={require('../../../assets/images/myCards/gogo_card_banner_2.png')}
                            style={{ width: wp(95), height: wp(25) }}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ position: 'absolute', top: hp(8), left: wp(48) }}
                        onPress={() => this.props.navigation.navigate('GogoCard')}
                    ><Text style={{ textDecorationLine: 'underline', fontSize: wp(3.1) }}>View Benefits</Text></TouchableOpacity>
                    <TouchableOpacity
                        style={{ position: 'absolute', top: hp(8), left: wp(70), borderRadius: wp(2), backgroundColor: '#FF9B21', width: wp(22) }}
                        onPress={() => this.props.navigation.navigate('GogoCardApply')}
                    >
                        <Text style={{ width: '100%', height: '100%', textAlign: 'center', textAlignVertical: 'center', color: 'white', fontWeight: 'bold', fontSize: wp(3.3) }}>Get yours</Text>
                    </TouchableOpacity>
                </View>
            )
    }

    gogo_card_ui = () => {
        if (this.state.gogo_card_data.length != 0)
            return (
                //Gogo card contianer
                <View style={{
                    backgroundColor: "white",
                    elevation: 2,
                    borderRadius: 3,
                    paddingHorizontal: wp(6),
                    paddingVertical: hp(1.5),
                    marginTop: hp(3)
                }}>
                    {this.state.visible_gogo &&
                        <View style={{ position: 'absolute', top: hp(2), right: wp(5), }}>
                            <Menu>
                                <MenuTrigger children={(
                                    <Image
                                        source={require('../../../assets/images/myCards/three_dots.png')}
                                        style={{ width: wp(4.5), height: wp(4.5) }}
                                    />
                                )}
                                    customStyles={{
                                        triggerOuterWrapper: {
                                            padding: wp(1),
                                            flex: 1,
                                            zIndex: 100
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
                                <MenuOptions>
                                    <MenuOption onSelect={() => this.props.navigation.navigate('ActivateCard', { cc_name: this.state.gogo_card_data[0].cc_name, cc_no: this.state.gogo_card_data[0].cc_no, cc_expdate: this.state.gogo_card_data[0].cc_expdate })} text='Activate' />
                                    <MenuOption onSelect={() => this.props.navigation.navigate('SuspendCard')} text='Suspend' />
                                </MenuOptions>
                            </Menu>
                        </View>
                    }
                    <TouchableOpacity
                        onPress={() => { this.setState({ visible_gogo: !this.state.visible_gogo }) }}
                    >
                        <Text style={{ fontSize: wp(3.5), color: '#918585', marginBottom: hp(1) }}>Gogo Card</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: wp(3.5), color: '#918585' }}>{this.state.gogo_card_data[0].cc_no}</Text>
                            <Image
                                source={require('../../../assets/images/myCards/visa.png')}
                                style={{ height: wp(3.25), width: wp(10), marginLeft: 30 }}
                            />
                        </View>
                    </TouchableOpacity>
                    {this.state.visible_gogo && (
                        <View>
                            <View style={{ marginTop: hp(3), flexDirection: 'row' }}>
                                <View style={{ flexDirection: 'column', width: '50%' }}>
                                    <Text style={{ color: '#918888', fontSize: wp(3.5) }}>Name on the Card</Text>
                                    <Text style={{ color: '#787474', fontSize: wp(3.5) }}>{this.state.gogo_card_data[0].cc_name}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', width: '50%' }}>
                                    <Text style={{ color: '#918888', fontSize: wp(3.5) }}>Expire</Text>
                                    <Text style={{ color: '#787474', fontSize: wp(3.5) }}>{this.state.gogo_card_data[0].cc_expdate}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </View>
            )
        else
            return (
                <View key={'nogogocard'} style={{ marginHorizontal: wp(5), marginVertical: hp(1) }}>
                    <Text style={{ marginLeft: wp(5), textAlignVertical: 'center', fontSize: wp(3.5) }}>Apply for Gogo Card now</Text>
                </View>
            )
    }

    other_card_ui = () => {
        return_data = []
        this.state.other_card_data.forEach((card) => {
            return_data.push(
                <View key={card.proxy_no || card.cc_no} style={{
                    backgroundColor: "white",
                    elevation: 2,
                    borderRadius: 3,
                    paddingHorizontal: wp(6),
                    paddingVertical: hp(1.5),
                    marginTop: hp(3)
                }}>
                    {this.state.visible_other &&
                        <View style={{ position: 'absolute', top: hp(2), right: wp(5), }}>
                            <Menu>
                                {
                                    !card.is_default ?
                                        <MenuTrigger children={(
                                            <Image
                                                source={require('../../../assets/images/myCards/three_dots.png')}
                                                style={{ width: wp(4.5), height: wp(4.5) }}
                                            />
                                        )}
                                            customStyles={{
                                                triggerOuterWrapper: {
                                                    padding: wp(1),
                                                    flex: 1,
                                                    zIndex: 100
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
                                        :
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: wp(3), paddingRight: wp(1) }} >Default </Text><Icon name="ios-checkmark" size={28} color="#0066ff" />
                                        </View>
                                }

                                <MenuOptions>
                                    {
                                        !card.is_default && <MenuOption
                                            onSelect={() => { this.update_card_status('set_default', card.id) }}
                                            text='Make Default' />
                                    }
                                    {
                                        !card.is_default && <MenuOption
                                            onSelect={() => this.update_card_status('delete', card.id)} >
                                            <Text style={{ color: 'red' }}>Delete</Text>
                                        </MenuOption>
                                    }

                                </MenuOptions>
                            </Menu>
                        </View>
                    }
                    <TouchableOpacity
                        onPress={() => { this.setState({ visible_other: !this.state.visible_other }) }}
                    >
                        <Text style={{ fontSize: wp(3.5), color: '#918585', marginBottom: hp(1) }}>{card.nickname || card.cc_name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: wp(3.5), color: '#918585' }}>{card.cc_no}</Text>
                            <Image
                                source={require('../../../assets/images/myCards/visa.png')}
                                style={{ height: wp(3.25), width: wp(10), marginLeft: 30 }}
                            />
                        </View>
                    </TouchableOpacity>
                    {this.state.visible_other && (
                        <View style={{ marginTop: hp(3), flexDirection: 'row' }}>
                            <View style={{ flexDirection: 'column', width: '50%' }}>
                                <Text style={{ color: '#918888', fontSize: wp(3.5) }}>Name on the Card</Text>
                                <Text style={{ color: '#787474', fontSize: wp(3.5) }}>{card.cc_name}</Text>
                            </View>
                            <View style={{ flexDirection: 'column', width: '50%' }}>
                                <Text style={{ color: '#918888', fontSize: wp(3.5) }}>Expire</Text>
                                <Text style={{ color: '#787474', fontSize: wp(3.5) }}>{card.cc_expdate}</Text>
                            </View>
                        </View>
                    )}
                </View>
            )
        })

        if (this.state.other_card_data.length == 0)
            return_data.push(
                <View key={'noothercard'} style={{ marginHorizontal: wp(5), marginVertical: hp(1) }}>
                    <Text style={{ marginLeft: wp(5), textAlignVertical: 'center', fontSize: wp(3.5) }}>No cards saved yet</Text>
                </View>
            )
        return return_data
    }

    update_card_status = (action, card_id) => {

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.props.referral_code,
            'partner_id': this.props.partner_id,
            'card_id': card_id,
            'action': action
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/updatebngothercardstatus' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                if (response.data.success)
                    ToastAndroid('Action Successfull', ToastAndroid.SHORT)
                else
                    ToastAndroid('Something went wrong! Please try again', ToastAndroid.SHORT)

                this.fetch_cards_data()
                this.fetch_gogo_card_status()
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    fetch_payment_preference = () => {

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.props.referral_code,
            'partner_id': this.props.partner_id,
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/getbngpartnerpreferredpayments' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {

                let data = response.data

                if (data.success) {

                    if (data.partner_payment_preference_list.length === 0)
                        this.setState({ partner_payment_preference_list: _.sortBy(default_payment_preference_sequence, ['sequence']) })
                    else
                        this.setState({ partner_payment_preference_list: _.sortBy(data.partner_payment_preference_list, ['sequence']) })
                }
                else
                    ToastAndroid('Api Error', ToastAndroid.SHORT)

            })
            .catch((error) => {
                console.warn(error)
            })
    }

    update_payment_preference = () => {

    }

    componentDidMount() {
        this.fetch_cards_data()
        this.fetch_gogo_card_status()
        this.fetch_payment_preference()

        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            () => {
                this.fetch_cards_data()
                this.fetch_gogo_card_status()
                this.is_dwolla_customer_created()
                this.get_bank_accounts()
            }
        )
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove()
    }

    render_sequence_list = () => {
        let return_data = []
        this.state.partner_payment_preference_list.forEach((obj, index) => {

            let obj_name = obj.name
                .replace(/[0-9]/g, '')
                .replace(/[^a-zA-Z_]/g, "")
                .replace(/[_]/g, ' ')
                .toLowerCase()
                .split(' ')
                .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')


            return_data.push(
                <View key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: wp(40), marginBottom: hp(1.5) }}>
                    <Text style={{ fontSize: wp(3.5) }}>{obj_name}</Text>
                    <View style={{ width: wp(10), borderWidth: 1, borderColor: 'gray', borderRadius: wp(1), alignItems: 'center', justifyContent: 'center' }}>
                        <RNPickerSelect
                            onValueChange={(value) => this.handle_sequence_change(obj.payment_preference_type, value)}
                            placeholder={{}}
                            useNativeAndroidPickerStyle={false}
                            items={payment_preference_sequence_data}
                            value={obj.sequence.toString()}
                            Icon={() => <View />}
                            style={{ inputAndroid: { color: 'black', fontSize: wp(4), margin: 0, padding: 0, textAlign: 'center' } }}
                        />
                    </View>
                </View>
            )
        })
        return return_data
    }

    handle_sequence_change = (type, value) => {

        let partner_payment_preference_list = JSON.parse(JSON.stringify(this.state.partner_payment_preference_list))
        let new_partner_payment_preference_list = JSON.parse(JSON.stringify(this.state.partner_payment_preference_list))

        let current_seq = partner_payment_preference_list[_.findIndex(partner_payment_preference_list, { 'payment_preference_type': type })]
        let old_seq = partner_payment_preference_list[_.findIndex(partner_payment_preference_list, { 'sequence': parseInt(value) })]

        new_partner_payment_preference_list[_.findIndex(partner_payment_preference_list, { 'payment_preference_type': type })] = {
            ...current_seq,
            'sequence': old_seq.sequence
        }

        new_partner_payment_preference_list[_.findIndex(partner_payment_preference_list, { 'sequence': parseInt(value) })] = {
            ...old_seq,
            'sequence': current_seq.sequence
        }

        this.setState({ partner_payment_preference_list: new_partner_payment_preference_list })

        let request_data = JSON.stringify({
            'Authorization': Authentication,
            'referral_code': this.props.referral_code,
            'partner_id': this.props.partner_id,
            'partner_payment_preference_list': new_partner_payment_preference_list
        })

        axios({
            method: 'POST',
            url: BackendUrl + '/updatebngpartnerpreferredpayments' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {

                let data = response.data

                if (data.success) {
                    ToastAndroid.show('Saved', ToastAndroid.SHORT)
                }
                else
                    ToastAndroid('Api Error', ToastAndroid.SHORT)

            })
            .catch((error) => {
                console.warn(error)
            })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {(this.state.card_data_loading && this.state.gogo_card_status_loading) && <Loading />}

                <ScrollView style={{ backgroundColor: '#FCFCFC', paddingBottom: hp(5) }}>

                    <View style={{ display: 'flex', alignItems: 'center', width: '100%' }}>

                        {/* Cards container */}
                        {(this.state.gogo_card_data.length != 0) &&
                            <View style={{ width: wp(95), marginHorizontal: wp(2.5) }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image
                                        style={{ height: wp(8), width: wp(8) }}
                                        source={require('../../../assets/images/myCards/credit_card.png')} />
                                    <Text style={styles.card_text}>Gogo Card</Text>
                                </View>

                                {this.gogo_card_status_ui()}
                                {this.gogo_card_ui()}

                            </View>
                        }

                        {/* Other cards container */}
                        <View style={{ width: wp(95), marginHorizontal: wp(2.5), marginTop: hp(3.5) }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ height: wp(8), width: wp(8) }}
                                    source={require('../../../assets/images/myCards/credit_card_1.png')} />
                                <Text style={styles.card_text}>Credit/Debit card</Text>
                            </View>
                            {this.other_card_ui()}
                        </View>

                        {/* Add Cards */}
                        <View style={{ width: wp(95), marginHorizontal: wp(2.5), marginTop: hp(2) }}>
                            <View style={{
                                backgroundColor: "white",
                                elevation: 2,
                                borderRadius: 3,
                                padding: wp(4),
                                marginTop: wp(4)
                            }}>
                                <TouchableOpacity
                                    onPress={() => { this.props.navigation.navigate('AddCard') }}
                                    style={{ flexDirection: 'row', alignItems: 'center', }}
                                >
                                    <Text style={{ width: '90%', fontSize: wp(3.5), color: '#918585' }}>Add Debit/Credit Card</Text>
                                    <View style={{}}>
                                        <Image
                                            source={require('../../../assets/images/myCards/next.png')}
                                            style={{ width: wp(2), height: wp(4) }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Bank container */}
                        <View style={{ width: wp(95), marginHorizontal: wp(2.5), marginTop: hp(3.5) }}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ height: wp(6), width: wp(8), resizeMode: 'contain' }}
                                    source={require('../../../assets/images/myCards/add_bank_account.png')} />
                                <Text style={styles.card_text}>Bank Accounts</Text>
                            </View>
                            <View style={{ paddingHorizontal: wp(3), marginVertical: hp(2) }}>
                                {this.state.is_dwolla_customer && this.state.dwolla_customer_status == 'unverified' && <Text>We will take a while to verify your account. We will let you as soon as we are done. Meanwhile, you can add a bank account. However, you will not be able to send money till your account is fully verified.</Text>}
                            </View>
                            {
                                this.state.bank_accounts.length == 0 ?
                                    <View key={'noothercard'} style={{ marginHorizontal: wp(5), marginBottom: hp(1) }}>
                                        <Text style={{ marginLeft: wp(5), textAlignVertical: 'center', fontSize: wp(3.5) }}>You haven't added a account yet</Text>
                                    </View>
                                    :
                                    this.state.bank_accounts.map((acc, index) => {
                                        return (
                                            <View
                                                key={index}
                                                style={{
                                                    backgroundColor: "white",
                                                    elevation: 2,
                                                    borderRadius: 3,
                                                    paddingHorizontal: wp(6),
                                                    paddingVertical: hp(1.5),
                                                    marginTop: hp(3)
                                                }}>
                                                {this.state.acc_details_opned && !acc.removed &&
                                                    <View style={{ position: 'absolute', top: hp(2), right: wp(5), }}>
                                                        <Menu>
                                                            <MenuTrigger children={(
                                                                <Image
                                                                    source={require('../../../assets/images/myCards/three_dots.png')}
                                                                    style={{ width: wp(4.5), height: wp(4.5) }}
                                                                />
                                                            )}
                                                                customStyles={{
                                                                    triggerOuterWrapper: {
                                                                        padding: wp(1),
                                                                        flex: 1,
                                                                        zIndex: 100
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

                                                            <MenuOptions>
                                                                {
                                                                    !acc.removed && <MenuOption
                                                                        onSelect={() => this.remove_bank_account(acc.id)} >
                                                                        <Text style={{ color: 'red' }}>Delete</Text>
                                                                    </MenuOption>
                                                                }

                                                            </MenuOptions>
                                                        </Menu>
                                                    </View>
                                                }
                                                <TouchableOpacity
                                                    onPress={() => { this.setState({ acc_details_opned_index: index, acc_details_opned: !this.state.acc_details_opned }) }}
                                                >
                                                    <Text style={{ fontSize: wp(3.5), color: '#918585', marginBottom: hp(1) }}>Bank Account</Text>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                        <Text style={{ fontSize: wp(3.5), color: '#918585' }}>{acc.name}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                {this.state.acc_details_opned && this.state.acc_details_opned_index == index && (
                                                    <View style={{ marginTop: hp(3), flexDirection: 'row' }}>
                                                        <View style={{ flexDirection: 'column', width: '50%' }}>
                                                            <Text style={{ color: '#918888', fontSize: wp(3.5) }}>Name of the Bank</Text>
                                                            <Text style={{ color: '#787474', fontSize: wp(3.5) }}>{acc.bankName}</Text>
                                                        </View>
                                                        <View style={{ flexDirection: 'column', width: '50%' }}>
                                                            <Text style={{ color: '#918888', fontSize: wp(3.5) }}>Account Type</Text>
                                                            <Text style={{ color: '#787474', fontSize: wp(3.5) }}>{acc.bankAccountType}</Text>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>)
                                    })
                            }
                        </View>

                        {/* Add Bank Account */}
                        <View style={{ width: wp(95), marginHorizontal: wp(2.5), marginTop: hp(2) }}>
                            <View style={{
                                backgroundColor: "white",
                                elevation: 2,
                                borderRadius: 3,
                                padding: wp(4),
                                marginTop: wp(4)
                            }}>
                                <TouchableOpacity
                                    onPress={() => { this.props.navigation.navigate(this.state.is_dwolla_customer ? 'AddBankAccount' : 'BankCustomerCreate') }}
                                    style={{ flexDirection: 'row', alignItems: 'center', }}
                                >
                                    <Text style={{ width: '90%', fontSize: wp(3.5), color: '#918585' }}>Add Bank Account</Text>
                                    <View style={{}}>
                                        <Image
                                            source={require('../../../assets/images/myCards/next.png')}
                                            style={{ width: wp(2), height: wp(4) }}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ width: wp(95), marginHorizontal: wp(2.5), marginVertical: hp(3.5) }}>
                            <Text style={{ fontSize: wp(4), marginLeft: wp(4), color: '#787474', fontWeight: 'bold' }}>Payment Preferences</Text>
                            <Text style={{ fontSize: wp(3.5), marginLeft: wp(4), marginTop: hp(1) }}>Select your preferred Payment Sequence</Text>

                            <View style={{ paddingHorizontal: wp(4), marginVertical: hp(2.5), flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                {this.state.partner_payment_preference_list && this.render_sequence_list()}
                            </View>
                        </View>

                    </View>
                </ScrollView >
            </View>
        )
    }
}


function mapStateToProps(state) {
    return {
        'partner_id': state.home.userInfo.partner_id,
        'referral_code': state.home.userInfo.partner_referral_code
    }
}

export default connect(mapStateToProps)(MyCards)