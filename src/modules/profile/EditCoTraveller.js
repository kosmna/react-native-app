import axios from 'axios'
import _ from 'lodash'
import React from 'react'
import { Alert, BackHandler, Image, ScrollView, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import DateTimePicker from "react-native-modal-datetime-picker"
import RNPickerSelect from 'react-native-picker-select'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import Loading from '../../components/Loading'
import { Text } from '../../components/StyledText'
import { BookAuthentication, BookBackendUrl } from '../backend/constants'

const airports_test_data = [
    {
        name: 'Start Typing..',
        id: 0,
        children: [],
    }
]

const domestic_airlines = [
    {
        name: 'Start Typing..',
        id: 0,
        children: [],
    }
]

const international_airlines = [
    {
        name: 'International Airlines',
        id: 0,
        children: [
            {
                name: 'Emrites',
                id: 1,
            },
            {
                name: 'American Airlines',
                id: 17,
            },
            {
                name: 'Global Aviation',
                id: 13,
            },
        ],
    },
]


export default class EditCotraveller extends React.Component {

    static navigationOptions = {
        title: 'Edit Co-Traveller'
    }

    state = {
        title_name: undefined,
        dob_picker_visible: false,
        selected_date_string: undefined,
        show_passport_details: false,
        show_preferences: false,
        profile_image: undefined,
        selected_home_airports: [],
        preferred_domestic_airlines: [],
        preferred_international_airlines: [],
        selected_special_service_request: [],
        preferred_hotels_add_more_count: 1,
        preferred_cruise_add_more_count: 1,
        loyalty_flights_add_more_count: 1,
        loyalty_cruises_add_more_count: 1,
        loyalty_hotels_add_more_count: 1,
        loyalty_cars_add_more_count: 1,
        loading: true,
        selected_home_airport_objs: [],
        loyalty_flight_numbers: [],
        partner_referral_code: this.props.navigation.getParam('userInfo').partner_referral_code,
        partner_id: this.props.navigation.getParam('userInfo').partner_id,
        show_main_traveller_address_checkbox: false
    }

    dob_picked_handle = date => {
        this.setState({ user_info: { ...this.state.user_info, dob: date }, dob_picker_visible: false })
    };

    passport_issue_date_picked_handle = date => {
        this.setState({ user_info: { ...this.state.user_info, valid_from: date }, passport_issue_date_picker_visible: false })
    };

    passport_expiry_date_picked_handle = date => {
        this.setState({ user_info: { ...this.state.user_info, valid_till: date }, passport_expiry_date_picker_visible: false })
    };

    preferences_hotels = () => {
        return_value = []
        for (i = 0; i < this.state.preferred_hotels_add_more_count; i++) {
            return_value.push(
                <View key={i} style={{ paddingHorizontal: wp(3), paddingBottom: hp(3), borderWidth: 1, borderColor: '#e3e3e3', borderRadius: wp(2) }}>
                    <View style={{ ...styles.each_input_row, marginTop: hp(1.5) }}>
                        <View style={{ width: '100%' }}>
                            <Text style={styles.input_label}>Preferred Hotel Chains</Text>

                            <TouchableOpacity
                                style={styles.input_text}
                                onPress={() => {
                                    this.preferred_hotels_multi_select._toggleSelector()
                                }}
                            >
                                <Text style={styles.touchable_opacity_placeholder}>Select preferred hotel chains</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            )
        }
        return return_value
    }

    preferences_cruise_liners = () => {
        return_value = []

        for (let i = 0; i < this.state.user_info.preferred_cruise.length; i++) {

            return_value.push(
                <View key={i} style={{ paddingHorizontal: wp(3), paddingBottom: hp(3), marginTop: hp(1), borderWidth: 1, borderColor: '#e3e3e3', borderRadius: wp(2) }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: hp(1) }}>
                        <View style={{ flexDirection: 'column', width: '50%' }}>
                            <Text style={styles.input_label}>Selected Cruise</Text>
                            <Text style={{ ...styles.input_text, textAlignVertical: 'center', height: hp(4) }}>{this.state.user_info.preferred_cruise[i].selected_preferred_cruise}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', width: '45%' }}>
                            <Text style={styles.input_label}>Loyalty Number</Text>
                            <Text style={{ ...styles.input_text, textAlignVertical: 'center', height: hp(4) }}>{this.state.user_info.preferred_cruise[i].preferred_cruise_travel_number}</Text>
                        </View>
                    </View>
                    <View style={{ marginVertical: hp(1) }}>
                        <Text style={styles.input_label}>Regions</Text>
                        <Text style={{ ...styles.input_text, textAlignVertical: 'center', height: hp(4) }}>{this.state.user_info.preferred_cruise[i].selected_preferred_cruise_destination.join(', ')}</Text>
                    </View>
                    <View style={{ marginVertical: hp(1) }}>
                        <Text style={styles.input_label}>Preferred Ships</Text>
                        <Text style={{ ...styles.input_text, textAlignVertical: 'center', height: hp(4) }}>{this.state.user_info.preferred_cruise[i].selected_preferred_cruise_ships.join(', ')}</Text>
                    </View>
                    <View style={{ marginVertical: hp(1) }}>
                        <Text style={styles.input_label}>Preferred Cabin</Text>
                        <Text style={{ ...styles.input_text, textAlignVertical: 'center', height: hp(4) }}>{this.state.user_info.preferred_cruise[i].preferred_cruise_cabin ? this.state.user_info.preferred_cruise[i].preferred_cruise_cabin[0].toUpperCase() + this.state.user_info.preferred_cruise[i].preferred_cruise_cabin.substring(1) : ''}</Text>
                    </View>
                    <View style={styles.each_input_row}>
                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={{ borderRadius: wp(3), backgroundColor: '#ff0000' }}
                                onPress={() => {
                                    let preferred_cruise = this.state.user_info.preferred_cruise
                                    preferred_cruise = preferred_cruise.filter((each_item) => each_item.id !== preferred_cruise[i].id)
                                    this.setState({ user_info: { ...this.state.user_info, preferred_cruise: preferred_cruise } })
                                }}
                            >
                                <Text style={{ fontSize: wp(3), paddingHorizontal: wp(3), paddingVertical: hp(0.7), color: 'white' }}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
        }
        return return_value
    }

    set_loyalty_flight_numbers = (loyalty_flight_numbers) => {
        this.setState({ user_info: { ...this.state.user_info, loyalty_flight_numbers: loyalty_flight_numbers } })
    }

    set_loyalty_cruise_numbers = (loyalty_cruise_numbers) => {
        this.setState({ user_info: { ...this.state.user_info, loyalty_cruise_numbers: loyalty_cruise_numbers } })
    }

    componentDidMount() {
        // Backhandler
        this.back_handler = BackHandler.addEventListener('hardwareBackPress', () => {
            this.save_data_popup()
            return true
        })

        let request_data = JSON.stringify({
            'Authorization': BookAuthentication,
            "referral_code": this.state.partner_referral_code,
            "partner_id": this.state.partner_id,
            "cotraveller": true,
            "edit_user": true,
            'cotraveller_id': this.props.navigation.getParam('id')
        })

        axios({
            method: 'POST',
            url: BookBackendUrl + '/bnggetuserdata' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data

                if (!data.success) {
                    Alert.alert('Server Error', 'Error Msg: ' + data.error_info)
                    return
                }

                // Title data
                data['title_data'].unshift({
                    label: 'Select',
                    value: 'Select',
                    color: 'gray'
                })
                this.setState({ title_data: data['title_data'] })

                // Country data
                this.setState({ country_data: data['country_data'] })

                // State data
                this.setState({ state_data: data['state_data'] })

                // Country code data
                this.setState({ country_code_data: data['country_code_data'] })

                // Parse date objects
                data['user_info'].dob = data['user_info'].dob ? new Date(data['user_info'].dob) : null
                data['user_info'].valid_from = data['user_info'].valid_from ? new Date(data['user_info'].valid_from) : null
                data['user_info'].valid_till = data['user_info'].valid_till ? new Date(data['user_info'].valid_till) : null

                // Home airport
                selected_home_airports = []
                if (data['user_info'].home_airport_1_id)
                    selected_home_airports.push(data['user_info'].home_airport_1_id)
                if (data['user_info'].home_airport_2_id)
                    selected_home_airports.push(data['user_info'].home_airport_2_id)
                if (data['user_info'].home_airport_3_id)
                    selected_home_airports.push(data['user_info'].home_airport_3_id)

                this.setState({ selected_home_airports: selected_home_airports, airport_data: data['airport_data'] })

                // Meal Preference
                data['meal_pref_data'].unshift({
                    label: 'Select',
                    value: 'Select',
                    color: 'gray'
                })
                this.setState({ meal_pref_data: data['meal_pref_data'] })

                // Special Service Request Data
                this.setState({ special_service_request_data: data['special_service_request_data'] })

                // Airlines Data
                this.setState({ airlines_data: data['airlines_data'] })

                // Preferred Hotel Data
                this.setState({ preferred_hotel_data: data['preferred_hotel_data'], selected_preferred_hotel_objs: data['preferred_hotel_data'].children })

                // Preferred Cruises
                this.setState({ preferred_cruise: data['preferred_cruise'] })

                // Cruises Data
                this.setState({ cruises_data: data['cruises_data'] })

                // Preferred Data
                this.setState({ user_info: { ...this.state.user_info, preferred_domestic_airlines_data: data['preferred_domestic_airlines_data'] } })
                this.setState({ user_info: { ...this.state.user_info, preferred_international_airlines_data: data['preferred_international_airlines_data'] } })
                this.setState({ user_info: { ...this.state.user_info, selected_preferred_hotels_data: data['selected_preferred_hotels_data'] } })

                // Copy Address, Copy Preferences, Relation
                this.setState({ copy_checkbox_clicked: data['user_info'].copy_checkbox_clicked, copy_address_checkbox: data['user_info'].copy_address_checkbox, relation_to_user: data['user_info'].relation_with_primary_contact })

                let relation_with_primary_contact = data['user_info'].relation_with_primary_contact
                let show_main_traveller_address_checkbox = false

                if (relation_with_primary_contact == 'spouse' || relation_with_primary_contact == 'son' || relation_with_primary_contact == 'daughter')
                    show_main_traveller_address_checkbox = true

                this.setState({ show_main_traveller_address_checkbox: show_main_traveller_address_checkbox })

                // Finally set the User Data and stop Loading
                this.setState({ user_info: data['user_info'], original_user_info: data['user_info'] }, () => {
                    this.setState({ loading: false })
                })
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    componentWillUnmount() {
        // Remove back handler when component is unmounted
        this.back_handler.remove()
    }

    get_airport_data = (query_string) => {
        if (query_string == '' || query_string == this.state.airport_data_query_string || query_string.length < 3)
            return

        this.setState({ airport_data_query_string: query_string }, () => {

            let request_data = JSON.stringify({
                'Authorization': BookAuthentication,
                "referral_code": this.state.partner_referral_code,
                "partner_id": this.state.partner_id,
                "query_string": query_string,
                "selected_airports": this.state.selected_home_airports
            })

            axios({
                method: 'POST',
                url: BookBackendUrl + '/bnggetairportdata' + '?data=' + request_data,
                responseType: 'json'
            })
                .then((response) => {
                    let data = response.data

                    this.state.selected_home_airport_objs.forEach((selected_home_airport_obj) => {
                        found = false
                        data['children'].forEach((item) => {
                            if (selected_home_airport_obj.id == item.id)
                                found = true
                        })
                        if (!found)
                            data['children'].push(selected_home_airport_obj)
                    })

                    this.setState({ airport_data: data })
                })
                .catch((error) => {
                    console.warn(error)
                })
        })

    }

    get_hotel_related_data = (query_string) => {

        if (query_string == '' || query_string == this.state.hotel_data_query_string || query_string.length < 3)
            return

        this.setState({ hotel_data_query_string: query_string }, () => {

            let request_data = JSON.stringify({
                'Authorization': BookAuthentication,
                "referral_code": this.state.partner_referral_code,
                "partner_id": this.state.partner_id,
                'query_string': query_string
            })

            axios({
                method: 'POST',
                url: BookBackendUrl + '/bnggethoteldata' + '?data=' + request_data,
                responseType: 'json'
            })
                .then((response) => {
                    let data = response.data
                    this.setState({ preferred_hotel_data: data })
                })
                .catch((error) => {
                    console.warn(error)
                })
        })
    }

    update_data = () => {
        user_info = this.state.user_info
        if (!user_info.email || user_info.email == '') {
            ToastAndroid.show('Please enter email ID', ToastAndroid.SHORT)
            return
        }

        let request_data = JSON.stringify({
            'Authorization': BookAuthentication,
            "cotraveller": true,
            "edit_user": true,
            'cotraveller_id': this.props.navigation.getParam('id'),
            "referral_code": this.state.partner_referral_code,
            "partner_id": this.state.partner_id,
            'title': user_info.title,
            "first_name": user_info.first_name,
            "last_name": user_info.last_name,
            "gender": user_info.gender,
            'nationality': user_info.nationality,
            'dob': user_info.dob,
            'email': user_info.email,
            'country_id': user_info.country_id,
            'city': user_info.city,
            'zip': user_info.zip,
            'marital_status': user_info.marital_status,
            'country_code': user_info.country_code,
            'phone': user_info.phone,
            'address_line_1': user_info.address_line_1,
            'address_line_2': user_info.address_line_2,
            'state': user_info.state,
            'passport_no': user_info.passport_no,
            'valid_from': user_info.valid_from,
            'valid_till': user_info.valid_till,
            'place_issue': user_info.place_issue,
            'home_airport_1_id': user_info.home_airport_1_id,
            'home_airport_2_id': user_info.home_airport_2_id,
            'home_airport_3_id': user_info.home_airport_3_id,
            'pref_seat': user_info.pref_seat,
            'meal_pref': user_info.meal_pref,
            'preferred_domestic_airlines': user_info.preferred_domestic_airlines_data,
            'preferred_international_airlines': user_info.preferred_international_airlines_data,
            'domestic_travel_class': user_info.domestic_travel_class,
            'international_travel_class': user_info.international_travel_class,
            'selected_preferred_hotels': user_info.selected_preferred_hotels,
            'loyalty_flight_numbers': user_info.loyalty_flight_numbers,
            'loyalty_cruise_numbers': user_info.loyalty_cruise_numbers,
            'preferred_cruises': user_info.preferred_cruise,
            'selected_special_service_request': user_info.selected_special_service_request,
            'copy_from_parent': this.state.copy_checkbox_clicked || false,
            'copy_address_checkbox': this.state.copy_address_checkbox || false,
            'relation_with_primary_contact': this.state.relation_to_user
        })

        axios({
            method: 'POST',
            url: BookBackendUrl + '/bngupdateuserdata' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {

                this.setState({ top_loading: false })

                if (response.data.success) {
                    this.props.navigation.goBack()
                    ToastAndroid.show('Data saved successfully', ToastAndroid.SHORT)
                }
                else
                    ToastAndroid.show('Error in saving data, Please try again.', ToastAndroid.SHORT)
            })
            .catch((error) => {
                console.warn(error)
                ToastAndroid.show('Could not save data! Please try again', ToastAndroid.SHORT)
            })
    }

    save_data_popup = () => {

        if (_.isEqual(this.state.user_info, this.state.original_user_info)) {
            this.props.navigation.pop()
            return
        }

        Alert.alert(
            'Save Changes',
            'Do you want to save any changes?',
            [
                { text: 'No', onPress: () => this.props.navigation.pop() },
                {
                    text: 'Save', onPress: () => {
                        this.update_data()
                        this.props.navigation.pop()
                    }
                }
            ]
        )
    }

    render() {
        if (this.state.loading)
            return <Loading />

        return (
            <ScrollView style={{ backgroundColor: '#F5F5F5', paddingBottom: hp(5) }}>

                {/* Top Loading */}
                {this.state.top_loading && <Loading />}

                {/* General Details */}
                <View style={{ marginVertical: hp(4), marginHorizontal: wp(5) }}>
                    <Text style={{ fontSize: wp(4), fontWeight: 'bold' }}>General Details</Text>

                    {/* Input Row 1 */}
                    <View style={styles.each_input_row}>

                        {/* Name Title */}
                        <View style={{ width: '15%' }}>
                            <Text style={styles.input_label}>Title</Text>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    if (value != 'Select')
                                        this.setState({ user_info: { ...this.state.user_info, title: value } })
                                }}
                                placeholder={{}}
                                useNativeAndroidPickerStyle={false}
                                items={this.state.title_data}
                                value={this.state.user_info.title || 'Select'}
                                style={{ inputAndroid: { ...pickerSelectStyles.inputAndroid, color: this.state.user_info.title ? 'black' : 'gray' } }}
                                Icon={() => <View />}
                            />
                        </View>

                        {/* First Name */}
                        <View style={{ width: '35%' }}>
                            <Text style={styles.input_label}>First Name</Text>
                            <TextInput
                                style={styles.input_text}
                                defaultValue={this.state.user_info.first_name}
                                onChangeText={(first_name) => this.setState({ user_info: { ...this.state.user_info, first_name: first_name } })}
                            />
                        </View>

                        {/* Last Name */}
                        <View style={{ width: '35%' }}>
                            <Text style={styles.input_label}>Last Name</Text>
                            <TextInput
                                style={styles.input_text}
                                defaultValue={this.state.user_info.last_name}
                                onChangeText={(last_name) => this.setState({ user_info: { ...this.state.user_info, last_name: last_name } })}
                            />
                        </View>

                    </View>

                    <View style={styles.each_input_row}>
                        <View style={{ width: '95%' }}>
                            <Text style={styles.input_label}>Email</Text>
                            <TextInput
                                style={styles.input_text}
                                defaultValue={this.state.user_info.email || ''}
                                onChangeText={(email) => this.setState({ user_info: { ...this.state.user_info, email: email } })}
                                placeholder={'Enter mail of co-traveller'}
                                editable={false}
                            />
                        </View>
                    </View>

                    {/* Input Row 2 */}
                    <View style={styles.each_input_row}>

                        {/* Gender */}
                        <View style={{ width: '20%' }}>
                            <Text style={styles.input_label}>Gender</Text>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    if (value != 'Select')
                                        this.setState({ user_info: { ...this.state.user_info, gender: value } })
                                }}
                                placeholder={{}}
                                useNativeAndroidPickerStyle={false}
                                items={[
                                    { label: 'Select', value: 'Select', color: 'gray' },
                                    { label: 'Male', value: 'male' },
                                    { label: 'Female', value: 'female' },
                                    { label: 'Other', value: 'other' }
                                ]}
                                value={this.state.user_info.gender || 'Select'}
                                style={{ inputAndroid: { ...pickerSelectStyles.inputAndroid, color: this.state.user_info.gender ? 'black' : 'gray' } }}
                                Icon={() => <View />}
                            />
                        </View>

                        {/* Marital Status */}
                        <View style={{ width: '30%' }}>
                            <Text style={styles.input_label}>Marital Status</Text>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    if (value != 'Select')
                                        this.setState({ user_info: { ...this.state.user_info, marital_status: value } })
                                }}
                                placeholder={{}}
                                useNativeAndroidPickerStyle={false}
                                items={[
                                    { label: 'Select', value: 'Select', color: 'gray' },
                                    { label: 'Married', value: 'married' },
                                    { label: 'Unmarried', value: 'unmarried' }
                                ]}
                                value={this.state.user_info.marital_status || 'Select'}
                                style={{ inputAndroid: { ...pickerSelectStyles.inputAndroid, color: this.state.user_info.marital_status ? 'black' : 'gray' } }}
                                Icon={() => <View />}
                            />
                        </View>

                        {/* Date of Birth */}
                        <View style={{ width: '40%' }}>
                            <Text style={styles.input_label}>Date of Birth</Text>
                            <TouchableOpacity
                                onPress={() => this.setState({ dob_picker_visible: true })}
                            >
                                <Text style={{ ...styles.input_text, color: this.state.user_info.dob ? 'black' : 'gray', textAlignVertical: 'center', fontSize: wp(3.5) }}>{this.state.user_info.dob ? this.state.user_info.dob.toDateString() : 'Select'}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.dob_picker_visible}
                                onConfirm={this.dob_picked_handle}
                                onCancel={() => this.setState({ dob_picker_visible: false })}
                                maximumDate={new Date()}
                                datePickerModeAndroid={'spinner'}
                            />
                        </View>

                    </View>

                    {/* Input Row 3 - Nationality */}
                    <View style={styles.each_input_row}>
                        <View style={{ width: '45%' }}>
                            <Text style={styles.input_label}>Nationality</Text>
                            {!this.state.user_info.nationality &&
                                <TouchableOpacity
                                    style={styles.input_text}
                                    onPress={() => {
                                        this.nationality_selector._toggleSelector()
                                    }}
                                >
                                    <Text style={styles.touchable_opacity_placeholder}>Select your Nationality</Text>
                                </TouchableOpacity>}
                            <View style={{ marginTop: this.state.user_info.nationality ? 0 : hp(1) }}>
                                <SectionedMultiSelect
                                    confirmText='Close'
                                    items={this.state.country_data ? [this.state.country_data] : airports_test_data}
                                    uniqueKey="id"
                                    subKey="children"
                                    selectText="Select Nationality"
                                    showDropDowns={false}
                                    readOnlyHeadings={true}
                                    onSelectedItemsChange={(nationality) => {
                                        this.nationality_selector._closeSelector()
                                        this.setState({ user_info: { ...this.state.user_info, nationality: nationality[0] ? nationality[0] : undefined } })
                                    }}
                                    selectedItems={this.state.user_info.nationality ? [this.state.user_info.nationality] : []}
                                    hideSelect={true}
                                    ref={nationality_selector => (this.nationality_selector = nationality_selector)}
                                    searchPlaceholderText='Search for Countries'
                                />
                            </View>
                        </View>
                        <View style={{ width: '45%' }}>
                            <Text>Relation to You</Text>
                            <RNPickerSelect
                                onValueChange={(value) => {
                                    if (value != 'Select') {
                                        let show_main_traveller_address_checkbox = false
                                        let copy_address_checkbox = this.state.copy_address_checkbox

                                        if (value == 'Spouse' || value == 'Son' || value == 'Daughter')
                                            show_main_traveller_address_checkbox = true
                                        else
                                            copy_address_checkbox = false

                                        this.setState({ relation_to_user: value, show_main_traveller_address_checkbox: show_main_traveller_address_checkbox, copy_address_checkbox: copy_address_checkbox })
                                    }
                                }}
                                placeholder={{}}
                                useNativeAndroidPickerStyle={false}
                                items={[
                                    { label: 'Select', value: 'Select', color: 'gray' },
                                    { label: 'Spouse', value: 'spouse' },
                                    { label: 'Partner', value: 'partner' },
                                    { label: 'Son', value: 'son' },
                                    { label: 'Daughter', value: 'daughter' },
                                    { label: 'Friend', value: 'friend' },
                                    { label: 'Work', value: 'work' },
                                    { label: 'Relative', value: 'relative' }
                                ]}
                                value={this.state.relation_to_user || 'Select'}
                                style={{ inputAndroid: { ...pickerSelectStyles.inputAndroid, color: this.state.relation_to_user ? 'black' : 'gray' } }}
                                Icon={() => <View />}
                            />
                        </View>
                    </View>

                </View>

                {/* Contact Details */}
                <View style={{ marginHorizontal: wp(5) }}>
                    <Text style={{ fontSize: wp(4), fontWeight: 'bold' }}>Contact Details</Text>
                    <View style={{ ...styles.each_input_row, justifyContent: 'flex-start' }}>
                        <View style={{ width: '40%' }}>
                            <Text style={styles.input_label}>Country Code</Text>
                            {/*<RNPickerSelect
                                onValueChange={(value) => {
                                    if (value != 'Select')
                                        this.setState({ user_info: { ...this.state.user_info, country_code: value } })
                                }}
                                placeholder={{}}
                                useNativeAndroidPickerStyle={false}
                                items={this.state.country_code_data}
                                value={this.state.user_info.country_code || 'Select'}
                                style={{ inputAndroid: { ...pickerSelectStyles.inputAndroid, color: this.state.user_info.marital_status ? 'black' : 'gray' } }}
                                Icon={() => <View />}
                            /> */}

                            {!this.state.user_info.country_code &&
                                <TouchableOpacity
                                    style={styles.input_text}
                                    onPress={() => {
                                        this.country_code_selector._toggleSelector()
                                    }}
                                >
                                    <Text style={styles.touchable_opacity_placeholder}>Code</Text>
                                </TouchableOpacity>}
                            <View style={{ marginTop: this.state.user_info.country_code ? 0 : hp(1) }}>
                                <SectionedMultiSelect
                                    confirmText='Close'
                                    items={this.state.country_code_data ? [this.state.country_code_data] : airports_test_data}
                                    uniqueKey="id"
                                    subKey="children"
                                    selectText="Select country_code"
                                    showDropDowns={false}
                                    readOnlyHeadings={true}
                                    onSelectedItemsChange={(country_code) => {
                                        this.country_code_selector._closeSelector()
                                        this.setState({ user_info: { ...this.state.user_info, country_code: country_code[0] ? country_code[0] : undefined } })
                                    }}
                                    selectedItems={this.state.user_info.country_code ? [this.state.user_info.country_code] : []}
                                    hideSelect={true}
                                    ref={country_code_selector => (this.country_code_selector = country_code_selector)}
                                    searchPlaceholderText='Search for Country Codes'
                                />
                            </View>
                        </View>
                        <View style={{ width: '50%', marginLeft: wp(5) }}>
                            <Text style={styles.input_label}>Phone Number</Text>
                            <TextInput
                                style={styles.input_text}
                                onChangeText={(phone) => this.setState({ user_info: { ...this.state.user_info, phone: phone } })}
                                defaultValue={this.state.user_info.phone || ''}
                            />
                        </View>

                    </View>

                    {this.state.show_main_traveller_address_checkbox &&
                        <TouchableOpacity
                            style={{ marginTop: hp(3), marginBottom: hp(2), flexDirection: 'row' }}
                            onPress={() => this.setState({ copy_address_checkbox: !this.state.copy_address_checkbox })}
                        >
                            <View
                                style={{ width: wp(4.5), height: wp(4.5), backgroundColor: this.state.copy_address_checkbox ? '#0093DD' : 'white', borderColor: 'gray', borderWidth: this.state.copy_checkbox_clicked ? 1 : 2, borderRadius: 2, marginRight: wp(4) }}
                            />
                            <View>
                                <Text style={{ fontSize: wp(3.5) }}>Use Main Traveller Address</Text>
                            </View>
                        </TouchableOpacity>
                    }

                    {!this.state.copy_address_checkbox &&
                        <>
                            <View style={{ ...styles.each_input_row, flexDirection: 'column', justifyContent: 'flex-start', marginTop: 0 }}>
                                <View style={{ width: '95%' }}>
                                    <Text style={styles.input_label}>Address Line 1</Text>
                                    <TextInput
                                        style={styles.input_text}
                                        placeholder='Door Number, Street, Main'
                                        onChangeText={(text) => this.setState({ user_info: { ...this.state.user_info, address_line_1: text } })}
                                        defaultValue={this.state.user_info.address_line_1 || ''}
                                    />
                                </View>
                                <View style={{ width: '95%', marginTop: hp(2) }}>
                                    <Text style={styles.input_label}>Address Line 2</Text>
                                    <TextInput
                                        style={styles.input_text}
                                        placeholder='Area'
                                        onChangeText={(text) => this.setState({ user_info: { ...this.state.user_info, address_line_2: text } })}
                                        defaultValue={this.state.user_info.address_line_2 || ''}
                                    />
                                </View>
                            </View>
                            <View style={styles.each_input_row}>
                                <View style={{ width: '45%' }}>
                                    <Text style={styles.input_label}>City</Text>
                                    <TextInput
                                        style={styles.input_text}
                                        placeholder='City'
                                        onChangeText={(city) => this.setState({ user_info: { ...this.state.user_info, city: city } })}
                                        defaultValue={this.state.user_info.city || ''}
                                    />
                                </View>
                                <View style={{ width: '45%' }}>
                                    <Text style={styles.input_label}>Country</Text>
                                    {!this.state.user_info.country_id &&
                                        <TouchableOpacity
                                            style={styles.input_text}
                                            onPress={() => {
                                                this.country_id_selector._toggleSelector()
                                            }}
                                        >
                                            <Text style={styles.touchable_opacity_placeholder}>Select Country</Text>
                                        </TouchableOpacity>}
                                    <View style={{ marginTop: this.state.user_info_country_id ? 0 : hp(1) }}>
                                        <SectionedMultiSelect
                                            confirmText='Close'
                                            items={this.state.country_data ? [this.state.country_data] : airports_test_data}
                                            uniqueKey="id"
                                            subKey="children"
                                            selectText="Select Country"
                                            showDropDowns={false}
                                            readOnlyHeadings={true}
                                            onSelectedItemsChange={(country_id) => {
                                                this.country_id_selector._closeSelector()
                                                if (country_id[0]) {
                                                    // Api call to get state data on selecting country

                                                    let request_data = JSON.stringify({
                                                        'Authorization': BookAuthentication,
                                                        "referral_code": this.state.partner_referral_code,
                                                        "partner_id": this.state.partner_id,
                                                        "country_id": country_id[0]
                                                    })

                                                    axios({
                                                        method: 'POST',
                                                        url: BookBackendUrl + '/bnggetstatedata' + '?data=' + request_data,
                                                        responseType: 'json'
                                                    })
                                                        .then((response) => {
                                                            let data = response.data
                                                            this.setState({ state_data: data })
                                                        })
                                                        .catch((error) => {
                                                            console.warn(error)
                                                        })
                                                }
                                                this.setState({ user_info: { ...this.state.user_info, country_id: country_id[0] ? country_id[0] : undefined } })
                                            }}
                                            selectedItems={this.state.user_info.country_id ? [this.state.user_info.country_id] : []}
                                            hideSelect={true}
                                            ref={country_id_selector => (this.country_id_selector = country_id_selector)}
                                            searchPlaceholderText='Search for Countries'
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={styles.each_input_row}>
                                <View style={{ width: '45%' }}>
                                    <Text style={styles.input_label}>State</Text>
                                    {!this.state.user_info.state &&
                                        <TouchableOpacity
                                            style={styles.input_text}
                                            onPress={() => {
                                                if (this.state.user_info.country_id)
                                                    this.address_state_selector._toggleSelector()
                                                else
                                                    ToastAndroid.show('Please select country first', ToastAndroid.SHORT)
                                            }}
                                        >
                                            <Text style={styles.touchable_opacity_placeholder}>Select State</Text>
                                        </TouchableOpacity>}
                                    <View style={{ marginTop: this.state.user_info.state ? 0 : hp(1) }}>
                                        <SectionedMultiSelect
                                            confirmText='Close'
                                            items={this.state.state_data ? [this.state.state_data] : airports_test_data}
                                            uniqueKey="id"
                                            subKey="children"
                                            selectText="Select State"
                                            showDropDowns={false}
                                            readOnlyHeadings={true}
                                            onSelectedItemsChange={(state) => {
                                                this.address_state_selector._closeSelector()
                                                this.setState({ user_info: { ...this.state.user_info, state: state[0] ? state[0] : undefined } })
                                            }}
                                            selectedItems={this.state.user_info.state ? [this.state.user_info.state] : []}
                                            hideSelect={true}
                                            ref={address_state_selector => (this.address_state_selector = address_state_selector)}
                                            searchPlaceholderText='Search for States'
                                        />
                                    </View>
                                </View>
                                <View style={{ width: '45%' }}>
                                    <Text style={styles.input_label}>Zip Code</Text>
                                    <TextInput
                                        style={styles.input_text}
                                        placeholder='Zip Code'
                                        textContentType='postalCode'
                                        onChangeText={(zip) => this.setState({ user_info: { ...this.state.user_info, zip: zip } })}
                                        defaultValue={this.state.user_info.zip || ''}
                                    />
                                </View>
                            </View>
                        </>
                    }
                </View>

                {/* Optional Details */}
                <View style={{ marginVertical: hp(4), marginHorizontal: wp(3) }}>
                    <Text style={{ fontSize: wp(4), fontWeight: 'bold', marginHorizontal: wp(2) }}>Optional Fields <Text style={{ fontSize: wp(3), fontWeight: 'normal' }}> Will help you book faster</Text></Text>

                    {/* Passport Details */}
                    <View style={{ marginTop: hp(2) }}>

                        {/* Dropdown */}
                        <TouchableOpacity
                            style={styles.sub_heading_touch}
                            onPress={() => this.setState({ show_passport_details: !this.state.show_passport_details })}
                        >
                            <Text style={styles.sub_heading}>Passport Details</Text>
                            <Image
                                source={this.state.show_passport_details ? require('../../../assets/images/profile/arrow_up.png') : require('../../../assets/images/profile/arrow_down.png')}
                                style={{ height: wp(3.5), width: wp(3.5), marginRight: wp(5) }}
                            />
                        </TouchableOpacity>

                        {/* Dropdown Content */}
                        {this.state.show_passport_details && (
                            <View style={{ marginHorizontal: wp(3), marginBottom: hp(3) }}>
                                <View style={styles.each_input_row}>
                                    <View style={{ width: '45%' }}>
                                        <Text style={styles.input_label}>Passport Number</Text>
                                        <TextInput
                                            style={styles.input_text}
                                            defaultValue={this.state.user_info.passport_no}
                                            onChangeText={(number) => this.setState({ user_info: { ...this.state.user_info, passport_no: number } })}
                                        />
                                    </View>
                                    <View style={{ width: '45%' }}>
                                        <Text style={styles.input_label}>Passport Issue Date</Text>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ passport_issue_date_picker_visible: true })}
                                        >
                                            <Text style={{ ...styles.input_text, color: this.state.user_info.valid_from ? 'black' : 'gray', textAlignVertical: 'center', fontSize: wp(3.5) }}>{this.state.user_info.valid_from ? this.state.user_info.valid_from.toDateString() : 'Select'}</Text>
                                        </TouchableOpacity>
                                        <DateTimePicker
                                            isVisible={this.state.passport_issue_date_picker_visible}
                                            onConfirm={this.passport_issue_date_picked_handle}
                                            onCancel={() => this.setState({ passport_issue_date_picker_visible: false })}
                                            maximumDate={new Date()}
                                            datePickerModeAndroid={'spinner'}
                                        />
                                    </View>
                                </View>
                                <View style={styles.each_input_row}>
                                    <View style={{ width: '45%' }}>
                                        <Text style={styles.input_label}>Passport Expiry Date</Text>
                                        <TouchableOpacity
                                            onPress={() => this.setState({ passport_expiry_date_picker_visible: true })}
                                        >
                                            <Text style={{ ...styles.input_text, color: this.state.user_info.valid_till ? 'black' : 'gray', textAlignVertical: 'center', fontSize: wp(3.5) }}>{this.state.user_info.valid_till ? this.state.user_info.valid_till.toDateString() : 'Select'}</Text>
                                        </TouchableOpacity>
                                        <DateTimePicker
                                            isVisible={this.state.passport_expiry_date_picker_visible}
                                            onConfirm={this.passport_expiry_date_picked_handle}
                                            onCancel={() => this.setState({ passport_expiry_date_picker_visible: false })}
                                            minimumDate={new Date()}
                                            datePickerModeAndroid={'spinner'}
                                        />
                                    </View>
                                    <View style={{ width: '45%' }}>
                                        <Text style={styles.input_label}>Passport Issued Country</Text>
                                        {!this.state.user_info.place_issue &&
                                            <TouchableOpacity
                                                style={styles.input_text}
                                                onPress={() => {
                                                    this.place_issue_selector._toggleSelector()
                                                }}
                                            >
                                                <Text style={styles.touchable_opacity_placeholder}>Select Country</Text>
                                            </TouchableOpacity>}
                                        <View style={{ marginTop: this.state.user_info.place_issue ? 0 : hp(1) }}>
                                            <SectionedMultiSelect
                                                confirmText='Close'
                                                items={this.state.country_data ? [this.state.country_data] : airports_test_data}
                                                uniqueKey="id"
                                                subKey="children"
                                                selectText="Select Country"
                                                showDropDowns={false}
                                                readOnlyHeadings={true}
                                                onSelectedItemsChange={(place_issue) => {
                                                    this.place_issue_selector._closeSelector()
                                                    this.setState({ user_info: { ...this.state.user_info, place_issue: place_issue[0] ? place_issue[0] : undefined } })
                                                }}
                                                selectedItems={this.state.user_info.place_issue ? [this.state.user_info.place_issue] : []}
                                                hideSelect={true}
                                                ref={place_issue_selector => (this.place_issue_selector = place_issue_selector)}
                                                searchPlaceholderText='Search for Countries'
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Preferences */}
                    <View style={{ marginTop: hp(1) }}>

                        {/* Dropdown */}
                        <TouchableOpacity
                            style={styles.sub_heading_touch}
                            onPress={() => this.setState({ show_preferences: !this.state.show_preferences })}
                        >
                            <Text style={styles.sub_heading}>Preferences</Text>
                            <Image
                                source={this.state.show_preferences ? require('../../../assets/images/profile/arrow_up.png') : require('../../../assets/images/profile/arrow_down.png')}
                                style={{ height: wp(3.5), width: wp(3.5), marginRight: wp(5) }}
                            />
                        </TouchableOpacity>

                        {this.state.show_preferences && (
                            <TouchableOpacity
                                style={{ marginVertical: hp(2), flexDirection: 'row', marginHorizontal: wp(3) }}
                                onPress={() => this.setState({ copy_checkbox_clicked: !this.state.copy_checkbox_clicked })}
                            >
                                <View
                                    style={{ width: wp(4.5), height: wp(4.5), backgroundColor: this.state.copy_checkbox_clicked ? '#0093DD' : 'white', borderColor: 'gray', borderWidth: this.state.copy_checkbox_clicked ? 1 : 2, borderRadius: 2, marginRight: wp(4) }}
                                />
                                <View>
                                    <Text style={{ fontSize: wp(3.5) }}>Use Main Traveller Preferences</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {/* Dropdown Content */}
                        {(this.state.show_preferences && !this.state.copy_checkbox_clicked) && (
                            <View>
                                {/* Flights */}
                                <View style={{ marginHorizontal: wp(2), marginBottom: hp(2) }}>
                                    <Text style={{ ...styles.sub_heading, marginTop: hp(2) }}>Flights</Text>
                                    <View style={{ ...styles.each_input_row, marginTop: hp(1) }}>
                                        <View style={{ width: '100%' }}>
                                            <Text style={styles.input_label}>Home Airport</Text>
                                            <TouchableOpacity
                                                style={styles.input_text}
                                                onPress={() => {
                                                    this.home_airport_multi_select._toggleSelector()
                                                }}
                                            >
                                                <Text style={styles.touchable_opacity_placeholder}>Select one or more Airports</Text>
                                            </TouchableOpacity>
                                            <View style={{ marginTop: this.state.selected_home_airports.length == 0 ? 0 : hp(1) }}>
                                                <SectionedMultiSelect
                                                    confirmText='Close'
                                                    items={this.state.airport_data ? [this.state.airport_data] : airports_test_data}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Select Airports/Cities"
                                                    showDropDowns={false}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={(selected_home_airports) => {

                                                        if (selected_home_airports.length > 3) {
                                                            ToastAndroid.show('You can select maximum 3 home airports', ToastAndroid.SHORT)
                                                            this.home_airport_multi_select._closeSelector()
                                                            return
                                                        }

                                                        home_airport_1_id = selected_home_airports[0] ? selected_home_airports[0] : null
                                                        home_airport_2_id = selected_home_airports[1] ? selected_home_airports[1] : null
                                                        home_airport_3_id = selected_home_airports[2] ? selected_home_airports[2] : null

                                                        this.setState({ user_info: { ...this.state.user_info, home_airport_1_id: home_airport_1_id, home_airport_2_id: home_airport_2_id, home_airport_3_id: home_airport_3_id }, selected_home_airports: selected_home_airports })
                                                    }}
                                                    onSelectedItemObjectsChange={(selected_home_airport_objs) => {
                                                        this.setState({ selected_home_airport_objs: selected_home_airport_objs })
                                                    }}
                                                    selectedItems={this.state.selected_home_airports}
                                                    hideSelect={true}
                                                    ref={home_airport_multi_select => (this.home_airport_multi_select = home_airport_multi_select)}
                                                    searchPlaceholderText='Search for Airports/Cities'
                                                    searchAdornment={(search_text) => this.get_airport_data(search_text)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.each_input_row}>
                                        <View style={{ width: '45%' }}>
                                            <Text style={styles.input_label}>Preferred Seat</Text>
                                            <RNPickerSelect
                                                onValueChange={(value) => {
                                                    if (value != 'Select')
                                                        this.setState({ user_info: { ...this.state.user_info, pref_seat: value } })
                                                }}
                                                placeholder={{}}
                                                useNativeAndroidPickerStyle={false}
                                                items={[
                                                    { label: 'Select', value: 'Select', color: 'gray' },
                                                    { label: 'Aisle', value: 'aisle' },
                                                    { label: 'Window', value: 'window' },
                                                    { label: 'Middle', value: 'middle' }
                                                ]}
                                                value={this.state.user_info.pref_seat || 'Select'}
                                                style={{ inputAndroid: { ...pickerSelectStyles.inputAndroid, color: this.state.user_info.pref_seat ? 'black' : 'gray' } }}
                                                Icon={() => <View />}
                                            />
                                        </View>
                                        <View style={{ width: '45%' }}>
                                            <Text style={styles.input_label}>Meal Preference</Text>
                                            <RNPickerSelect
                                                onValueChange={(value) => {
                                                    if (value != 'Select')
                                                        this.setState({ user_info: { ...this.state.user_info, meal_pref: value } })
                                                }}
                                                placeholder={{}}
                                                useNativeAndroidPickerStyle={false}
                                                items={this.state.meal_pref_data}
                                                value={this.state.user_info.meal_pref || 'Select'}
                                                style={{ inputAndroid: { ...pickerSelectStyles.inputAndroid, color: this.state.user_info.meal_pref ? 'black' : 'gray' } }}
                                                Icon={() => <View />}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.each_input_row}>
                                        <View style={{ width: '100%' }}>
                                            <Text style={styles.input_label}>Preferred Domestic Airlines</Text>
                                            <TouchableOpacity
                                                style={styles.input_text}
                                                onPress={() => {
                                                    this.preferred_domestic_airlines_multi_select._toggleSelector()
                                                }}
                                            >
                                                <Text style={styles.touchable_opacity_placeholder}>Select your preferred domestic airlines</Text>
                                            </TouchableOpacity>
                                            <View style={{ marginTop: this.state.preferred_domestic_airlines.length == 0 ? 0 : hp(1) }}>
                                                <SectionedMultiSelect
                                                    confirmText='Close'
                                                    items={this.state.airlines_data ? [this.state.airlines_data] : domestic_airlines}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Select your preferred domestic airlines"
                                                    showDropDowns={false}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={(preferred_domestic_airlines) => {

                                                        let preferred_domestic_airlines_data = this.state.user_info.preferred_domestic_airlines_data

                                                        let new_array = []
                                                        preferred_domestic_airlines.map((item) => {

                                                            let found = false
                                                            preferred_domestic_airlines_data.map((dom_item) => {
                                                                if (dom_item.id == item) {
                                                                    new_array.push(dom_item)
                                                                    found = true
                                                                }
                                                            })

                                                            if (!found)
                                                                new_array.push({
                                                                    id: item
                                                                })
                                                        })

                                                        this.setState({ user_info: { ...this.state.user_info, preferred_domestic_airlines: preferred_domestic_airlines, preferred_domestic_airlines_data: new_array } })
                                                    }}
                                                    selectedItems={this.state.user_info.preferred_domestic_airlines || []}
                                                    hideSelect={true}
                                                    ref={preferred_domestic_airlines_multi_select => (this.preferred_domestic_airlines_multi_select = preferred_domestic_airlines_multi_select)}
                                                    searchPlaceholderText='Search'
                                                    customChipsRenderer={(params) => {
                                                        return_data = []
                                                        params.items[0].children.forEach((each_item) => {

                                                            if (!params.selectedItems.includes(each_item.id))
                                                                return

                                                            let default_loyalty_flight_number = ''
                                                            let preferred_domestic_airlines_data = this.state.user_info.preferred_domestic_airlines_data
                                                            preferred_domestic_airlines_data.map((item, index) => {
                                                                if (item.id == each_item.id) {
                                                                    default_loyalty_flight_number = preferred_domestic_airlines_data[index].airline_loyalty_number
                                                                }
                                                            })

                                                            return_data.push(
                                                                <View key={each_item.id} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: hp(0.5), paddingHorizontal: wp(3) }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                                                                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: wp(3.5) }}>{each_item.name}</Text>
                                                                        <TextInput
                                                                            style={{ ...styles.input_text }}
                                                                            placeholder='Enter Loyalty Number'
                                                                            onChangeText={(number) => {
                                                                                let preferred_domestic_airlines_data = this.state.user_info.preferred_domestic_airlines_data
                                                                                preferred_domestic_airlines_data.map((item, index) => {
                                                                                    if (item.id == each_item.id) {
                                                                                        preferred_domestic_airlines_data[index].airline_loyalty_number = number
                                                                                    }
                                                                                })
                                                                                this.setState({ user_info: { ...this.state.user_info, preferred_domestic_airlines_data: preferred_domestic_airlines_data } })
                                                                            }}
                                                                            defaultValue={default_loyalty_flight_number}
                                                                        />
                                                                    </View>
                                                                    <TouchableOpacity
                                                                        style={{ marginLeft: wp(5) }}
                                                                        onPress={() => {
                                                                            let preferred_domestic_airlines_data = this.state.user_info.preferred_domestic_airlines_data
                                                                            let preferred_domestic_airlines = this.state.user_info.preferred_domestic_airlines

                                                                            preferred_domestic_airlines_data = preferred_domestic_airlines_data.filter(arr_item => arr_item.id !== each_item.id)
                                                                            preferred_domestic_airlines = preferred_domestic_airlines.filter(arr_item => arr_item !== each_item.id)
                                                                            this.setState({ user_info: { ...this.state.user_info, preferred_domestic_airlines: preferred_domestic_airlines, preferred_domestic_airlines_data: preferred_domestic_airlines_data } })
                                                                        }}
                                                                    >
                                                                        <Image
                                                                            source={require('../../../assets/images/help/close.png')}
                                                                            style={{ height: wp(3), width: wp(3) }}
                                                                        />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            )
                                                        })
                                                        return return_data
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.each_input_row}>
                                        <View style={{ width: '100%' }}>
                                            <Text style={styles.input_label}>Preferred international Airlines</Text>
                                            <TouchableOpacity
                                                style={styles.input_text}
                                                onPress={() => {
                                                    this.preferred_international_airlines_multi_select._toggleSelector()
                                                }}
                                            >
                                                <Text style={styles.touchable_opacity_placeholder}>Select your preferred international airlines</Text>
                                            </TouchableOpacity>
                                            <View style={{ marginTop: this.state.preferred_international_airlines.length == 0 ? 0 : hp(1) }}>
                                                <SectionedMultiSelect
                                                    confirmText='Close'
                                                    items={this.state.airlines_data ? [this.state.airlines_data] : international_airlines}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Select your preferred international airlines"
                                                    showDropDowns={false}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={(preferred_international_airlines) => {

                                                        let preferred_international_airlines_data = this.state.user_info.preferred_international_airlines_data

                                                        let new_array = []
                                                        preferred_international_airlines.map((item) => {

                                                            let found = false
                                                            preferred_international_airlines_data.map((dom_item) => {
                                                                if (dom_item.id == item) {
                                                                    new_array.push(dom_item)
                                                                    found = true
                                                                }
                                                            })

                                                            if (!found)
                                                                new_array.push({
                                                                    id: item
                                                                })
                                                        })

                                                        this.setState({ user_info: { ...this.state.user_info, preferred_international_airlines: preferred_international_airlines, preferred_international_airlines_data: new_array } })
                                                    }}
                                                    selectedItems={this.state.user_info.preferred_international_airlines || []}
                                                    hideSelect={true}
                                                    ref={preferred_international_airlines_multi_select => (this.preferred_international_airlines_multi_select = preferred_international_airlines_multi_select)}
                                                    searchPlaceholderText='Search'
                                                    customChipsRenderer={(params) => {
                                                        return_data = []
                                                        params.items[0].children.forEach((each_item) => {

                                                            if (!params.selectedItems.includes(each_item.id))
                                                                return

                                                            let default_loyalty_flight_number = ''
                                                            let preferred_international_airlines_data = this.state.user_info.preferred_international_airlines_data
                                                            preferred_international_airlines_data.map((item, index) => {
                                                                if (item.id == each_item.id) {
                                                                    default_loyalty_flight_number = preferred_international_airlines_data[index].airline_loyalty_number
                                                                }
                                                            })

                                                            return_data.push(
                                                                <View key={each_item.id} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: hp(0.5), paddingHorizontal: wp(3) }}>
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%' }}>
                                                                        <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: wp(3.5) }}>{each_item.name}</Text>                                                                        <TextInput
                                                                            style={{ ...styles.input_text }}
                                                                            placeholder='Enter Loyalty Number'
                                                                            onChangeText={(number) => {
                                                                                let preferred_international_airlines_data = this.state.user_info.preferred_international_airlines_data
                                                                                preferred_international_airlines_data.map((item, index) => {
                                                                                    if (item.id == each_item.id) {
                                                                                        preferred_international_airlines_data[index].airline_loyalty_number = number
                                                                                    }
                                                                                })
                                                                                this.setState({ user_info: { ...this.state.user_info, preferred_international_airlines_data: preferred_international_airlines_data } })
                                                                            }}
                                                                            defaultValue={default_loyalty_flight_number}
                                                                        />
                                                                    </View>
                                                                    <TouchableOpacity
                                                                        style={{ marginLeft: wp(5) }}
                                                                        onPress={() => {
                                                                            let preferred_international_airlines_data = this.state.user_info.preferred_international_airlines_data
                                                                            let preferred_international_airlines = this.state.user_info.preferred_international_airlines

                                                                            preferred_international_airlines_data = preferred_international_airlines_data.filter(arr_item => arr_item.id !== each_item.id)
                                                                            preferred_international_airlines = preferred_international_airlines.filter(arr_item => arr_item !== each_item.id)
                                                                            this.setState({ user_info: { ...this.state.user_info, preferred_international_airlines: preferred_international_airlines, preferred_international_airlines_data: preferred_international_airlines_data } })
                                                                        }}
                                                                    >
                                                                        <Image
                                                                            source={require('../../../assets/images/help/close.png')}
                                                                            style={{ height: wp(3), width: wp(3) }}
                                                                        />
                                                                    </TouchableOpacity>
                                                                </View>
                                                            )
                                                        })
                                                        return return_data
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                    <View style={styles.each_input_row}>
                                        <View style={{ width: '100%' }}>
                                            <Text style={styles.input_label}>Special Service Request</Text>
                                            <View style={{ marginTop: this.state.user_info.selected_special_service_request.length == 0 ? 0 : hp(1) }}>
                                                <SectionedMultiSelect
                                                    confirmText='Close'
                                                    items={this.state.special_service_request_data ? [this.state.special_service_request_data] : domestic_airlines}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Select any Special Services that you will need"
                                                    showDropDowns={false}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={(selected_special_service_request) => {
                                                        this.setState({ user_info: { ...this.state.user_info, selected_special_service_request: selected_special_service_request } })
                                                    }}
                                                    selectedItems={this.state.user_info.selected_special_service_request ? this.state.user_info.selected_special_service_request : []}
                                                    hideSelect={true}
                                                    ref={special_servie_request_multi_select => (this.special_servie_request_multi_select = special_servie_request_multi_select)}
                                                    searchPlaceholderText='Search'
                                                    showRemoveAll={true}
                                                />
                                            </View>
                                            <TouchableOpacity
                                                style={{ ...styles.input_text, marginBottom: hp(0.5) }}
                                                onPress={() => {
                                                    this.special_servie_request_multi_select._toggleSelector()
                                                }}
                                            >
                                                <Text style={styles.touchable_opacity_placeholder}>Select any Special Services that you will need</Text>
                                            </TouchableOpacity>

                                        </View>
                                    </View>


                                    <Text style={{ ...styles.input_label, marginTop: hp(2) }}>Class of Travel</Text>
                                    <View style={{ ...styles.each_input_row, marginTop: hp(1) }}>
                                        <View style={{ width: '48%' }}>
                                            <Text style={styles.input_label}>Domestic</Text>
                                            <RNPickerSelect
                                                onValueChange={(value) => {
                                                    if (value != 'Select')
                                                        this.setState({ user_info: { ...this.state.user_info, domestic_travel_class: value } })
                                                }}
                                                placeholder={{}}
                                                useNativeAndroidPickerStyle={false}
                                                items={[
                                                    { label: 'Select', value: 'Select', color: 'gray' },
                                                    { label: 'Economy', value: 'economy' },
                                                    { label: 'Premium Economy', value: 'premium_economy' },
                                                    { label: 'Business', value: 'business' },
                                                    { label: 'First Class', value: 'first_class' },
                                                ]}
                                                value={this.state.user_info.domestic_travel_class || 'Select'}
                                                style={{ inputAndroid: { ...pickerSelectStyles.inputAndroid, color: this.state.user_info.domestic_travel_class ? 'black' : 'gray' } }}
                                                Icon={() => <View />}
                                            />
                                        </View>
                                        <View style={{ width: '50%' }}>
                                            <Text style={styles.input_label}>International</Text>
                                            <RNPickerSelect
                                                onValueChange={(value) => {
                                                    if (value != 'Select')
                                                        this.setState({ user_info: { ...this.state.user_info, international_travel_class: value } })
                                                }}
                                                placeholder={{}}
                                                useNativeAndroidPickerStyle={false}
                                                items={[
                                                    { label: 'Select', value: 'Select', color: 'gray' },
                                                    { label: 'Economy', value: 'economy' },
                                                    { label: 'Premium Economy', value: 'premium_economy' },
                                                    { label: 'Business', value: 'business' },
                                                    { label: 'First Class', value: 'first_class' },
                                                ]}
                                                value={this.state.user_info.international_travel_class || 'Select'}
                                                style={{ inputAndroid: { ...pickerSelectStyles.inputAndroid, color: this.state.user_info.international_travel_class ? 'black' : 'gray' } }}
                                                Icon={() => <View />}
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Preferred Hotels */}
                                <View style={{ marginBottom: hp(2) }}>
                                    <Text style={{ ...styles.sub_heading, marginTop: hp(2), marginHorizontal: wp(2) }}>Preferred Hotel Chains</Text>

                                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginVertical: hp(1), marginLeft: wp(2) }}>
                                        <SectionedMultiSelect
                                            confirmText='Close'
                                            items={this.state.preferred_hotel_data ? this.state.preferred_hotel_data : airports_test_data}
                                            uniqueKey="id"
                                            subKey="children"
                                            selectText="Select Airports/Cities"
                                            showDropDowns={false}
                                            readOnlyHeadings={true}
                                            onSelectedItemsChange={(selected_preferred_hotels) => {
                                                this.setState({ user_info: { ...this.state.user_info, selected_preferred_hotels: selected_preferred_hotels } })
                                            }}
                                            onSelectedItemObjectsChange={(selected_preferred_hotel_objs) => {
                                                this.setState({ selected_preferred_hotel_objs: selected_preferred_hotel_objs })
                                            }}
                                            selectedItems={this.state.user_info.selected_preferred_hotels || []}
                                            hideSelect={true}
                                            ref={preferred_hotels_multi_select => (this.preferred_hotels_multi_select = preferred_hotels_multi_select)}
                                            searchPlaceholderText='Search for Hotels'
                                            searchAdornment={(search_text) => this.get_hotel_related_data(search_text)}
                                            customChipsRenderer={(params) => {
                                                let return_data = []
                                                params.selectedItems.forEach((selected_item) => {

                                                    let found = false
                                                    let each_item = {}
                                                    let found_item_chain = false
                                                    params.items[0].children.forEach((item) => {
                                                        if (selected_item == item.id) {
                                                            found = true
                                                            each_item = item
                                                        }
                                                    })

                                                    params.items[1].children.forEach((item) => {
                                                        if (selected_item == item.id) {
                                                            found = true
                                                            each_item = item
                                                            found_item_chain = true
                                                        }
                                                    })

                                                    if (found)
                                                        return_data.push(
                                                            <View key={each_item.id} style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                                                                <Text style={{ textAlign: 'center', textAlignVertical: 'center', fontSize: wp(3.5), marginRight: wp(2) }}>{each_item.name}</Text>
                                                                <TextInput
                                                                    style={{ ...styles.input_text, marginHorizontal: wp(1) }}
                                                                    placeholder='Enter Loyalty Number'
                                                                />
                                                                {found_item_chain &&
                                                                    <View style={{ marginHorizontal: wp(1), marginTop: hp(0.7) }}>
                                                                        {!this.state.user_info.temp_country &&
                                                                            <TouchableOpacity
                                                                                style={styles.input_text}
                                                                                onPress={() => {
                                                                                    this.preferred_hotel_chain_country_selector._toggleSelector()
                                                                                }}
                                                                            >
                                                                                <Text style={styles.touchable_opacity_placeholder}>Select Country</Text>
                                                                            </TouchableOpacity>}
                                                                        <View style={{ marginTop: this.state.user_info.temp_country ? 0 : hp(1) }}>
                                                                            <SectionedMultiSelect
                                                                                confirmText='Close'
                                                                                items={this.state.country_data ? [this.state.country_data] : airports_test_data}
                                                                                uniqueKey="id"
                                                                                subKey="children"
                                                                                selectText="Select Country"
                                                                                showDropDowns={false}
                                                                                readOnlyHeadings={true}
                                                                                onSelectedItemsChange={(temp_country) => {
                                                                                    this.preferred_hotel_chain_country_selector._closeSelector()
                                                                                    this.setState({ user_info: { ...this.state.user_info, temp_country: temp_country } })
                                                                                }}
                                                                                selectedItems={this.state.user_info.temp_country ? this.state.user_info.temp_country : []}
                                                                                hideSelect={true}
                                                                                ref={preferred_hotel_chain_country_selector => (this.preferred_hotel_chain_country_selector = preferred_hotel_chain_country_selector)}
                                                                                searchPlaceholderText='Search for Countries'
                                                                            />
                                                                        </View>
                                                                    </View>
                                                                }
                                                            </View>
                                                        )
                                                })

                                                return return_data
                                            }}
                                        />
                                    </View>
                                    {this.preferences_hotels()}

                                </View>

                                {/* Preferred Cruise Liners */}
                                <View style={{ marginBottom: hp(2) }}>
                                    <Text style={{ ...styles.sub_heading, marginTop: hp(2), marginHorizontal: wp(2) }}>Preferred Cruise Lines</Text>

                                    {this.preferences_cruise_liners()}

                                    <View style={{ paddingHorizontal: wp(3), paddingBottom: hp(3), marginTop: hp(1), borderWidth: 1, borderColor: '#e3e3e3', borderRadius: wp(2) }}>
                                        <View style={{ ...styles.each_input_row, marginTop: hp(1.5) }}>
                                            <View style={{ width: '45%' }}>
                                                <Text style={styles.input_label}>Cruise Line</Text>
                                                {(this.state.user_info.selected_preferred_cruise ? (this.state.user_info.selected_preferred_cruise.length == 0) : true) &&
                                                    <TouchableOpacity
                                                        style={styles.input_text}
                                                        onPress={() => this.preferred_cruise_line_selector._toggleSelector()}
                                                    >
                                                        <Text style={styles.touchable_opacity_placeholder}>Select Cruise Line</Text>
                                                    </TouchableOpacity>}
                                                <SectionedMultiSelect
                                                    confirmText='Close'
                                                    items={this.state.cruises_data ? [this.state.cruises_data] : domestic_airlines}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Select Cruises"
                                                    showDropDowns={false}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={(selected_preferred_cruise) => {
                                                        this.preferred_cruise_line_selector._closeSelector()

                                                        this.setState({ user_info: { ...this.state.user_info, selected_preferred_cruise: selected_preferred_cruise } }, () => {

                                                            let request_data = JSON.stringify({
                                                                'Authorization': BookAuthentication,
                                                                "referral_code": this.state.partner_referral_code,
                                                                "partner_id": this.state.partner_id,
                                                                "cruise_line_id": this.state.user_info.selected_preferred_cruise ? this.state.user_info.selected_preferred_cruise[0] : 0
                                                            })

                                                            axios({
                                                                method: 'POST',
                                                                url: BookBackendUrl + '/bnggetcruiserelateddata' + '?data=' + request_data,
                                                                responseType: 'json'
                                                            })
                                                                .then((response) => {
                                                                    let data = response.data
                                                                    this.setState({ preferred_cruise_destinations: data['destinations'], preferred_cruise_ships: data['cruise_line_ships'] })
                                                                })
                                                                .catch((error) => {
                                                                    console.warn(error)
                                                                })
                                                        })
                                                    }}
                                                    selectedItems={this.state.user_info.selected_preferred_cruise ? this.state.user_info.selected_preferred_cruise : []}
                                                    hideSelect={true}
                                                    ref={preferred_cruise_line_selector => {
                                                        this.preferred_cruise_line_selector = preferred_cruise_line_selector
                                                    }}
                                                    searchPlaceholderText='Search for Cruises'
                                                />
                                            </View>
                                            <View style={{ width: '45%' }}>
                                                <Text style={styles.input_label}>Loyalty Number</Text>
                                                <TextInput
                                                    style={styles.input_text}
                                                    placeholder="Enter Number"
                                                    onChangeText={(number) => this.setState({ user_info: { ...this.state.user_info, preferred_cruise_travel_number: number } })}
                                                    value={this.state.user_info.preferred_cruise_travel_number}
                                                />
                                            </View>
                                        </View>
                                        <View style={{ ...styles.each_input_row, marginTop: hp(1.5) }}>
                                            <View style={{ width: '100%' }}>
                                                <Text style={styles.input_label}>Regions</Text>
                                                {(this.state.user_info.selected_preferred_cruise_destination ? (this.state.user_info.selected_preferred_cruise_destination.length == 0) : true) &&
                                                    <TouchableOpacity
                                                        style={styles.input_text}
                                                        onPress={() => this.preferred_cruise_line_destination_selector._toggleSelector()}
                                                    >
                                                        <Text style={styles.touchable_opacity_placeholder}>Select Regions</Text>
                                                    </TouchableOpacity>}
                                                <SectionedMultiSelect
                                                    confirmText='Close'
                                                    items={this.state.preferred_cruise_destinations ? [this.state.preferred_cruise_destinations] : domestic_airlines}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Select Cruises"
                                                    showDropDowns={false}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={(selected_preferred_cruise_destination) => {
                                                        this.setState({ user_info: { ...this.state.user_info, selected_preferred_cruise_destination: selected_preferred_cruise_destination } })
                                                    }}
                                                    selectedItems={this.state.user_info.selected_preferred_cruise_destination || []}
                                                    hideSelect={true}
                                                    ref={preferred_cruise_line_destination_selector => {
                                                        this.preferred_cruise_line_destination_selector = preferred_cruise_line_destination_selector
                                                    }}
                                                    searchPlaceholderText='Search for Cruises'
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.each_input_row}>
                                            <View style={{ width: '100%' }}>
                                                <Text style={styles.input_label}>Preferred Ships</Text>
                                                {(this.state.user_info.selected_preferred_cruise_ships ? (this.state.user_info.selected_preferred_cruise_ships.length == 0) : true) &&
                                                    <TouchableOpacity
                                                        style={styles.input_text}
                                                        onPress={() => this.preferred_cruise_line_ships_selector._toggleSelector()}
                                                    >
                                                        <Text style={styles.touchable_opacity_placeholder}>Select one or more of your ships</Text>
                                                    </TouchableOpacity>}
                                                <SectionedMultiSelect
                                                    confirmText='Close'
                                                    items={this.state.preferred_cruise_ships ? [this.state.preferred_cruise_ships] : domestic_airlines}
                                                    uniqueKey="id"
                                                    subKey="children"
                                                    selectText="Select Cruises"
                                                    showDropDowns={false}
                                                    readOnlyHeadings={true}
                                                    onSelectedItemsChange={(selected_preferred_cruise_ships) => {
                                                        this.setState({ user_info: { ...this.state.user_info, selected_preferred_cruise_ships: selected_preferred_cruise_ships } })
                                                    }}
                                                    selectedItems={this.state.user_info.selected_preferred_cruise_ships}
                                                    hideSelect={true}
                                                    ref={preferred_cruise_line_ships_selector => {
                                                        this.preferred_cruise_line_ships_selector = preferred_cruise_line_ships_selector
                                                    }}
                                                    searchPlaceholderText='Search for Cruises'
                                                />
                                            </View>
                                        </View>
                                        <View style={{ ...styles.each_input_row, marginTop: hp(1.5) }}>
                                            <View style={{ width: '45%' }}>
                                                <Text style={styles.input_label}>Preferred Cabin</Text>
                                                <RNPickerSelect
                                                    onValueChange={(value) => {
                                                        if (value != 'Select')
                                                            this.setState({ user_info: { ...this.state.user_info, preferred_cruise_cabin: value } })
                                                    }}
                                                    placeholder={{}}
                                                    useNativeAndroidPickerStyle={false}
                                                    items={[
                                                        { label: 'Select', value: 'Select', color: 'gray' },
                                                        { label: 'Inside', value: 'inside' },
                                                        { label: 'Outside', value: 'outside' },
                                                        { label: 'Balcony', value: 'balcony' },
                                                        { label: 'Suite', value: 'suite' }
                                                    ]}
                                                    value={this.state.user_info.preferred_cruise_cabin || 'Select'}
                                                    style={{ inputAndroid: { ...pickerSelectStyles.inputAndroid, color: this.state.user_info.preferred_cruise_cabin ? 'black' : 'gray' } }}
                                                    Icon={() => <View />}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.each_input_row}>
                                            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                                <TouchableOpacity
                                                    style={{ borderRadius: wp(3), backgroundColor: '#0093DD' }}
                                                    onPress={() => {
                                                        let selected_preferred_cruise = this.state.user_info.selected_preferred_cruise ? (this.state.user_info.selected_preferred_cruise[0] || 0) : 0
                                                        let selected_preferred_cruise_destination = this.state.user_info.selected_preferred_cruise_destination || []
                                                        let selected_preferred_cruise_ships = this.state.user_info.selected_preferred_cruise_ships || []
                                                        let preferred_cruise_cabin = this.state.user_info.preferred_cruise_cabin || 'Select'
                                                        let preferred_cruise_travel_number = this.state.user_info.preferred_cruise_travel_number || ''

                                                        if (selected_preferred_cruise == 0 || selected_preferred_cruise_destination.length == 0 || selected_preferred_cruise_ships.length == 0 || preferred_cruise_cabin == 'Select') {
                                                            ToastAndroid.show('Please select all required fields', ToastAndroid.SHORT)
                                                            return
                                                        }

                                                        let cruise_data = {
                                                            'cruise_line_id': selected_preferred_cruise,
                                                            'region_ids': selected_preferred_cruise_destination,
                                                            'preferred_ship_ids': selected_preferred_cruise_ships,
                                                            'preferred_cabin': preferred_cruise_cabin,
                                                            'cruise_travel_number': preferred_cruise_travel_number
                                                        }

                                                        let request_data = JSON.stringify({
                                                            'Authorization': BookAuthentication,
                                                            "referral_code": this.state.partner_referral_code,
                                                            "partner_id": this.state.partner_id,
                                                            'preferred_cruise': cruise_data
                                                        })

                                                        axios({
                                                            method: 'POST',
                                                            url: BookBackendUrl + '/bngupdateusercruisedata' + '?data=' + request_data,
                                                            responseType: 'json'
                                                        })
                                                            .then((response) => {
                                                                this.setState({ user_info: { ...this.state.user_info, preferred_cruise: response.data.preferred_cruise } })

                                                                this.setState({
                                                                    user_info: {
                                                                        ...this.state.user_info,
                                                                        selected_preferred_cruise: [],
                                                                        selected_preferred_cruise_destination: [],
                                                                        selected_preferred_cruise_ships: [],
                                                                        preferred_cruise_cabin: 'Select',
                                                                        preferred_cruise_travel_number: ''
                                                                    }
                                                                })
                                                            })
                                                            .catch((error) => {
                                                                console.warn(error)
                                                            })
                                                    }}
                                                >
                                                    <Text style={{ fontSize: wp(3), paddingHorizontal: wp(3), paddingVertical: hp(0.7), color: 'white' }}>Add Cruise Line</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        )}
                    </View>

                </View >

                <TouchableOpacity
                    style={{ justifyContent: 'center', alignItems: 'center', marginTop: hp(3), marginBottom: hp(5) }}
                    onPress={() => this.update_data()}
                >
                    <Text style={{ width: '80%', borderRadius: wp(6), fontSize: wp(4.5), color: 'white', height: hp(5), backgroundColor: '#0093DD', textAlign: 'center', textAlignVertical: 'center' }}>Save Changes</Text>
                </TouchableOpacity>

            </ScrollView >
        )
    }
}

const pickerSelectStyles = StyleSheet.create({
    inputAndroid: {
        fontSize: wp(3.5),
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        color: 'black',
        height: hp(4.5),
        paddingVertical: 0,
        marginVertical: 0
    },
})

const styles = StyleSheet.create({
    input_label: {
        color: 'gray',
        fontSize: wp(3.5)
    },
    input_text: {
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        height: hp(4.5),
        fontSize: wp(3.5),
        paddingVertical: 0,
        marginVertical: 0
    },
    sub_heading: {
        fontSize: wp(3.5),
        fontWeight: 'bold'
    },
    sub_heading_touch: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 1,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: wp(3),
        paddingVertical: hp(1),
        borderRadius: wp(2),
        backgroundColor: 'white'
    },
    each_input_row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(2.5)
    },
    touchable_opacity_placeholder: {
        width: '100%',
        height: '100%',
        textAlignVertical: 'center',
        marginLeft: wp(1),
        fontSize: wp(3.5),
        color: '#939599'
    },
    loyalty_outer_box: {
        paddingBottom: hp(2),
        marginTop: hp(1),
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: wp(2)
    }
})