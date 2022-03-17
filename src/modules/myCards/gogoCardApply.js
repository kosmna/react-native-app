import axios from 'axios'
import React from 'react'
import { Alert, ScrollView, StyleSheet, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import { connect } from 'react-redux'
import Loading from '../../components/Loading'
import { Text } from '../../components/StyledText'
import { Authentication, BackendUrl, BookAuthentication, BookBackendUrl } from '../backend/constants'



const airports_test_data = [
    {
        name: 'Start Typing..',
        id: 0,
        children: [],
    }
]

class GogoCardApply extends React.Component {
    static navigationOptions = {
        title: 'Get your Gogo Card'
    }
    constructor(props) {
        super(props)
        this.state = {
            autofill_data: undefined,
            loading: true,
            referral_code: this.props.referral_code,
            partner_id: this.props.partner_id
        }
        this.update_user_info = this.update_user_info.bind(this)
        this.onStateObjectChange = this.onStateObjectChange.bind(this)
        this.requesrVirtualCard = this.requesrVirtualCard.bind(this)

    }


    get_user_info = () => {
        let request_data = JSON.stringify({
            'Authorization': BookAuthentication,
            "referral_code": this.state.referral_code,
            "partner_id": this.state.partner_id
        })
        axios({
            method: 'POST',
            url: BookBackendUrl + '/bnggetuserdata' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                console.log("Reslt Data:::", data)


                if (!data.success) {
                    Alert.alert('Server Error', 'Error Msg: ' + data.error_info)
                    this.props.navigation.goBack()
                    return
                }

                // Title data
                data['title_data'].unshift({
                    label: 'Select',
                    value: 'Select',
                    color: 'gray'
                })

                // Finally set the User Data and stop Loading
                this.setState({
                    user_info: data['user_info'],
                    country_data: data['country_data'],
                    state_data: data['state_data'],
                    country_code_data: data['country_code_data'],
                    title_data: data['title_data']
                }, () => {
                    this.setState({ loading: false })
                    console.log("State final:: ", this.state)
                })

            })
            .catch((error) => {
                console.warn(error)
            })

    }

    requesrVirtualCard() {
        //requestbngmobilevirtualcard
        console.log("User info::", this.state.user_info)
        let error_text = []
        if (!this.state.user_info.address_line_1 || this.state.user_info.address_line_1 == undefined || this.state.user_info.address_line_1.length == 0) {
            ToastAndroid.show('Please enter Address line 1', ToastAndroid.SHORT)
            error_text.push('Address line 1')
        }
        if (!this.state.user_info.city || this.state.user_info.city == undefined || this.state.user_info.city.length == 0) {
            ToastAndroid.show('Please enter City', ToastAndroid.SHORT)
            error_text.push('City')
        }
        if (!this.state.user_info.state || this.state.user_info.state == undefined || this.state.user_info.state.length == 0) {
            ToastAndroid.show('Please enter State', ToastAndroid.SHORT)
            error_text.push('State')
        }
        if (!this.state.user_info.zip || this.state.user_info.zip == undefined || this.state.user_info.zip.length == 0) {
            ToastAndroid.show('Please enter Zip code', ToastAndroid.SHORT)
            error_text.push('Zip code')
        }
        if (!(!this.state.user_info.phone || this.state.user_info.phone == undefined || this.state.user_info.phone.length == 0) && this.state.user_info.phone.length <= 9) {
            ToastAndroid.show('Please enter valid', ToastAndroid.SHORT)
            error_text.push('a valid phone number')
        }

        user_info = this.state.user_info
        this.setState({
            loading: true
        })

        if (error_text.length == 0) {
            let payload = JSON.stringify({
                "Authorization": Authentication,
                "referral_code": this.props.referral_code,
                "partner_id": this.props.partner_id,
                "name": this.state.user_info.first_name + " " + this.state.user_info.last_name,
                "street": this.state.user_info.address_line_1,
                "street2": this.state.user_info.address_line_2 || " ",
                "city": this.state.user_info.city,
                "state": this.state.user_info.state_name,
                "zip": this.state.user_info.zip,
                "email": this.state.user_info.email,
                "mobile": this.state.user_info.phone || " ",
                "state_sync_id": this.state.user_info.state_sync_id
            })
            axios({
                method: 'POST',
                url: BackendUrl + "/requestbngmobilevirtualcard?data=" + payload,
                responseType: 'json'
            })
                .then((resp) => {
                    this.setState({
                        loading: false
                    })
                    res_data = resp.data
                    data = res_data
                    if (data.success)
                        ToastAndroid.show('Card Successfully Applied', ToastAndroid.SHORT)
                    else
                        ToastAndroid.show('Card Apply Failed', ToastAndroid.SHORT)
                    this.props.navigation.pop()

                })
                .catch((error) => {
                    console.log("Error requisting virtual card: ".error)
                    this.setState({
                        loading: false
                    })
                    alert('Something went wrong!')

                })
        } else {
            let err_text = 'Please enter '
            error_text.forEach(err => {
                err_text = err_text + ' ' + err + ', '
            })
            this.setState({
                loading: false
            })
            ToastAndroid.show(err_text, ToastAndroid.SHORT)
        }

    }

    update_user_info = () => {
        //requestbngmobilevirtualcard
        let error_text = []
        if (this.state.user_info.address_line_1 == undefined || this.state.user_info.address_line_1.length == 0) {
            ToastAndroid.show('Please enter Address line 1', ToastAndroid.SHORT)
            error_text.push('Address line 1')
        }
        if (this.state.user_info.city == undefined || this.state.user_info.city.length == 0) {
            ToastAndroid.show('Please enter City', ToastAndroid.SHORT)
            error_text.push('City')
        }
        if (this.state.user_info.state == undefined || this.state.user_info.state.length == 0) {
            ToastAndroid.show('Please enter State', ToastAndroid.SHORT)
            error_text.push('State')
        }
        if (this.state.user_info.zip == undefined || this.state.user_info.zip.length == 0) {
            ToastAndroid.show('Please enter Zip code', ToastAndroid.SHORT)
            error_text.push('Zip code')
        }
        user_info = this.state.user_info
        let request_data = JSON.stringify({
            'Authorization': BookAuthentication,
            'referral_code': this.props.referral_code,
            'partner_id': this.props.partner_id,
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
            'selected_special_service_request': user_info.selected_special_service_request
        })
        if (error_text.length == 0) {
            axios({
                method: 'POST',
                url: BookBackendUrl + '/bngupdateuserdata' + '?data=' + request_data,
                responseType: 'json'
            })
                .then((response) => {
                    if (response.data.success) {
                        // call for vcard
                    } else {
                        alert('Something went wrong!')
                    }

                })
                .catch((error) => {
                    console.warn(error)
                })
        } else {
            let err_text = 'Please fill the '
            error_text.forEach(err => {
                err_text = err_text + ', ' + err
            })
            ToastAndroid.show(err_text, ToastAndroid.SHORT)
        }
    }

    onStateObjectChange(state) {
        console.log("Selected object::", state)
        this.setState({
            user_info: {
                ...this.state.user_info,
                state_sync_id: state[0].sync_id,
                state_name: state[0].label,
                state: state[0].id

            }

        })
    }



    componentDidMount() {
        //this.get_autofill_data()
        this.get_user_info()
    }

    render() {
        if (this.state.loading)
            return (
                <Loading />
            )

        return (
            // ScrollView Container
            <ScrollView style={{ flex: 1, height: hp(100), backgroundColor: '#FCFCFC', paddingHorizontal: wp(5), paddingVertical: wp(7) }}>

                <Text style={{ fontSize: wp(5), marginBottom: hp(2) }}>Personal and Contact Information</Text>

                {/* Contact Details */}
                <View style={{ marginHorizontal: wp(5) }}>
                    <Text style={{ fontSize: wp(4), fontWeight: 'bold' }}>Contact Details</Text>
                    <View style={styles.each_input_row}>
                        {/* First Name */}
                        <View style={{ width: '45%' }}>
                            <Text style={styles.input_label}>First Name</Text>
                            <TextInput
                                style={styles.input_text}
                                defaultValue={this.state.user_info.first_name}
                                onChangeText={(first_name) => this.setState({ user_info: { ...this.state.user_info, first_name: first_name } })}
                            />
                        </View>

                        {/* Last Name */}
                        <View style={{ width: '45%' }}>
                            <Text style={styles.input_label}>Last Name</Text>
                            <TextInput
                                style={styles.input_text}
                                defaultValue={this.state.user_info.last_name}
                                onChangeText={(last_name) => this.setState({ user_info: { ...this.state.user_info, last_name: last_name } })}
                            />
                        </View>
                    </View>

                    <View style={{ ...styles.each_input_row, justifyContent: 'flex-start' }}>

                        <View style={{ width: '40%' }}>
                            <Text style={styles.input_label}>Country Code</Text>


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
                                keyboardType="number-pad"
                                onChangeText={(phone) => this.setState({ user_info: { ...this.state.user_info, phone: phone } })}
                                defaultValue={this.state.user_info.phone || ''}
                            />
                        </View>

                    </View>
                    {/* <View style={styles.each_input_row}>
                        <View style={{ width: '95%' }}>
                            <Text style={styles.input_label}>Email</Text>
                            <TextInput
                                style={styles.input_text}
                                defaultValue={this.state.user_info.email || ''}
                                onChangeText={(email) => this.setState({ user_info: { ...this.state.user_info, email: email } })}
                                placeholder={'Enter your email'}
                            />
                        </View>
                    </View> */}
                    <View style={{ ...styles.each_input_row, flexDirection: 'column', justifyContent: 'flex-start' }}>
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
                                onChangeText={(city) => {
                                    this.setState({ user_info: { ...this.state.user_info, city: city } })
                                }
                                }
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
                                                "referral_code": this.props.referral_code,
                                                "partner_id": this.props.partner_id,
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

                                    }}
                                    onSelectedItemObjectsChange={this.onStateObjectChange}
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
                </View>

                <TouchableOpacity
                    style={{ width: wp(30), borderRadius: wp(5), backgroundColor: '#FF9B21', height: hp(5), alignSelf: 'center', marginTop: hp(3), marginBottom: hp(8) }}
                    onPress={this.requesrVirtualCard}
                >
                    <Text style={{ width: '100%', height: '100%', textAlign: 'center', textAlignVertical: 'center', fontSize: wp(4.5), color: 'white', fontWeight: 'bold' }}>Submit</Text>
                </TouchableOpacity>

            </ScrollView>
        )

    }

}

const styles = StyleSheet.create({
    text_input: {
        borderRadius: wp(1),
        borderWidth: wp(0.1),
        borderColor: 'gray',
        backgroundColor: 'white',
        marginVertical: wp(1.5),
        marginRight: wp(2),
        textAlign: 'left',
        height: hp(5),
        paddingVertical: 0
    },
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

})


function mapStateToProps(state) {
    return {
        'partner_id': state.home.userInfo.partner_id,
        'referral_code': state.home.userInfo.partner_referral_code
    }
}

export default connect(mapStateToProps)(GogoCardApply)