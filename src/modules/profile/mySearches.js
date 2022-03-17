
import React from 'react';
import {
    StyleSheet,
    Animated,
    View,
    ScrollView,
    TouchableOpacity,
    Image,
    BackHandler,
    ToastAndroid,
    FlatList,
} from 'react-native';
import { WebView } from 'react-native-webview';
import axios from 'axios';

import { Text } from '../../components/StyledText';
import Loading from '../../components/Loading';
import { BookBackendUrl } from '../../modules/backend/constants'

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from 'react-native-popup-menu';
import moment from 'moment'
import FrameScreen from "../frame/FrameViewContainer";

class HotelsSearchView extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        each_record: this.props.each_record,
        id: this.props.id,
    }

    showDate() {
        const start_date_object = moment(this.state.each_record.hotel_checkin, "DD-MM-YYYY");
        const end_date_object = moment(this.state.each_record.hotel_checkout, "DD-MM-YYYY");

        const formatted_start_date = moment(start_date_object).format('DD MMM YYYY');
        const formatted_end_date = moment(end_date_object).format('DD MMM YYYY');

        duration = moment.duration(end_date_object.diff(start_date_object));
        days_diffrence = duration.days();

        data_to_render = formatted_start_date + " - " + formatted_end_date + " | " + days_diffrence + " Days";
        // console.log("data_to_render = ", data_to_render)

        return data_to_render;
    }

    showRooms() {
        const no_of_rooms = this.state.each_record.hotelrooms + " Room";
        // console.log("no_of_rooms = ", no_of_rooms);

        if (no_of_rooms == 1) return no_of_rooms + " &darr;"
        else return no_of_rooms + "(s) >";
    }

    makeSearchRequest = () => {

        // console.log("each_record in hotelsearchview = ", each_record);

        console.log(`makeSearchRequest() clicked, for HotelsSearchView`);
        each_record = this.state.each_record;
        // console.log("each_record = ", each_record)

        route = '/hotel/search_results?';

        expected_url = "https://bookngogo.com/hotel/search_results?ht_destination=Romaldkirk,%20United%20Kingdom&hotel_checkin=23/12/2019&hotel_checkout=29/12/2019&r1_adult=1&r1_child=0&r1_age_ch1=1&individual_hotel=True&travel_type=hotel&hotelrooms=1&hotel_search_radio=hotel"

        // append_params_in_url = "ht_destination=" + each_record.ht_destination + "&hotel_checkin=" + each_record.hotel_checkin + "&hotel_checkout=" + each_record.hotel_checkout + each_record.room_str + "individual_hotel=True" + "&travel_type=hotel" + "&hotelrooms=" + each_record.hotelrooms + "&hotel_search_radio=" + each_record.hotel_search_radio;
        append_params_in_url = "db_record_id=" + each_record.id + "&source=" + "hotel";

        // console.log("append_params_in_url = ", append_params_in_url)

        let final_url = BookBackendUrl + route + encodeURI(append_params_in_url);
        console.log("final_url in /hotel/search_results is = ", final_url)

        this.props.navigation.navigate('SavedSearchWebview', { uri: final_url });
    }

    preSearchRequest = () => {
        console.log(`preSearchRequest() clicked, for HotelsSearchView`);
        each_record = this.state.each_record;
        id = this.state.id;
        let route = '/presearch_request_build_post_data'

        // make pre-request to create dictionary.
        axios({
            method: 'POST',
            url: BookBackendUrl + route,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                "id": this.state.id,
            },
            responseType: 'json'
        }).then(() => console.log("presearch_request_build_post_data() is executed successfully."));
    }

    render() {
        let each_record = this.state.each_record;
        return (
            <View style={styles.hotelSearchViewStyles}>

                <View style={styles.textAndLogoGroupingView}>

                    <View style={styles.flightLogoImageViewContainer}>
                        <Image source={require('../../../assets/images/mySearches/hotels_search_logo_3x.png')}
                            style={styles.hotelsSearchLogoStyles}
                        />
                    </View>

                    <View style={styles.textGroupingView} >
                        <View>

                            <Text style={{ fontWeight: 'bold', fontSize: wp(4), }}>{each_record.ht_destination}</Text>
                        </View>

                        <Text style={{ fontSize: wp(3), color: '#7A7C80' }}>{this.showDate()} </Text>
                    </View>
                </View>


                <View style={styles.HotelSearchButtonView}>
                    <Text onPress={() => this.makeSearchRequest()} style={styles.searchTextStyle}>Search</Text>
                </View>

                <View style={styles.twoRoomsDropDownContainerView}>
                    <Menu renderer={renderers.Popover} rendererProps={{ placement: 'bottom' }} style={{ marginTop: wp(0) }}>
                        <MenuTrigger style={{ marginTop: wp(0), height: wp(6) }} text={this.showRooms()} />
                        <MenuOptions style={{ marginVertical: wp(2), marginHorizontal: wp(4) }}>

                            <MenuOption onSelect={() => alert(`Room One`)} style={{ borderBottomColor: "#d3d3d3", borderBottomWidth: 2 }}>
                                <View>
                                    <Text style={{ color: 'black' }}>1. Room </Text>
                                    <Text style={{ color: 'black' }}>{each_record.r1_child} child, {each_record.r1_adult} Adults</Text>
                                </View>
                            </MenuOption>
                            <MenuOption onSelect={() => alert(`Room  Two`)} style={{ borderBottomColor: "#d3d3d3", borderBottomWidth: 2 }} >
                                <View>
                                    <Text style={{ color: 'black' }}>2. Room</Text>
                                    <Text style={{ color: 'black' }}>All Adults</Text>
                                </View>

                            </MenuOption>
                        </MenuOptions>
                    </Menu>
                </View>

            </View>
        )
    }
}

class FlightsSearchView extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        each_record: this.props.each_record
    }
    makeSearchRequest = () => {
        console.log(`makeSearchRequest() clicked, in FlightsSearchView<>`);

        each_record = this.state.each_record;
        let flight_depart = moment(each_record.destination_list[0].from_date, 'YYYY-MM-DD').format('DD/MM/YYYY');
        let flight_return = moment(each_record.destination_list[0].to_date, 'YYYY-MM-DD').format('DD/MM/YYYY');

        // console.log("flight_depart is changed as = ", flight_depart)
        // console.log("flight_return is changed as = ", flight_return)

        // this needs to be changed.
        route = '/flight/search_results?';

        // append_params_in_url = "flight_depart=" + flight_depart + "&flight_return=" + flight_return + "&flight_from=" + each_record.dest_list[0].Source + "&flight_to=" + each_record.dest_list[0].Destination + "&adult=" + each_record.adult + "&child=" + each_record.child + "&infant=" + each_record.infant + "&trip_type=" + each_record.destination_list[0].trip_type.replace(" ", "").toLowerCase() + "&is_individual_flight=" + "True" + "&travel_type=" + "flight" + "&search_radio_type=" + each_record.search_radio_type + "&travel_class=" + each_record.class + "&flight_fromcode=" + each_record.dest_list[0].from_code + "&flight_tocode=" + each_record.dest_list[0].to_code;
        append_params_in_url = "db_record_id=" + each_record.id + "&source=" + "flight";
        encodedURI = encodeURI(append_params_in_url)
        // console.log("encodedURI = *********", encodedURI)

        let final_url = BookBackendUrl + route + encodedURI;
        console.log("final_url for <FlightsSearchView/> is = ", final_url)

        this.props.navigation.navigate('SavedSearchWebview', { uri: final_url });
        // return (
        //     <FrameScreen
        //         close_webview={false}
        //         url={{ uri: final_url }}
        //         zero_flex={false}
        //     />
        // )
    }

    showEconomyTextInCapitals = value => {
        return value.replace(
            value.split("")["0"], // Split stirng and get the first letter 
            value
                .split("")
            ["0"].toString()
                .toUpperCase() // Split string and get the first letter to replace it with an uppercase value
        );
    };

    showFlightDate() {


        let flight_depart = moment(each_record.destination_list[0].from_date, 'YYYY-MM-DD').format('DD MMM YYYY');
        let flight_return = moment(each_record.destination_list[0].to_date, 'YYYY-MM-DD').format('DD MMM YYYY');

        trip_type = each_record.destination_list[0].trip_type

        if (trip_type != "One Way") {
            // console.log("trip_type == ", trip_type)
            return (<Text style={{ width: wp(40), fontSize: wp(3), color: '#7A7C80', zIndex: -9999 }}>{flight_depart} - {flight_return}</Text>)
        }
        else {
            // console.log("trip_type == ", trip_type)
            return (<Text style={{ width: wp(40), fontSize: wp(3), color: '#7A7C80', zIndex: -9999 }}>{flight_depart}</Text>)

        }

    }


    render() {
        each_record = this.state.each_record;

        return (
            <View style={{ ...styles.flightsSearchComponentStyles, alignSelf: 'center' }} >
                {/* new view started */}

                <View style={{ ...styles.textAndLogoCruiseView }}>

                    <View style={styles.flightLogoImageViewContainer}>
                        <Image source={require('../../../assets/images/mySearches/flight_search_logo_3x.png')}
                            style={styles.hotelsSearchLogoStyles} />
                    </View>

                    <View style={styles.textViewFlightSearchStyles} >
                        <Text style={{ fontWeight: 'bold', fontSize: wp(4), }}>
                            {each_record.destination_list[0].from_airport}
                            &nbsp;to&nbsp;
                            {each_record.destination_list[0].to_airport}
                        </Text>
                    </View>
                </View>
                {/* second view started */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                    <View style={{ alignSelf: 'flex-start', marginTop: wp(0), marginLeft: wp(11), }} >
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: wp(60), marginBottom: wp(1), }}>
                            <Text style={{ fontSize: wp(3), color: '#7A7C80' }}>
                                <Text style={{ fontSize: wp(3), color: '#7A7C80' }}>{each_record.dest_list[0].Source}</Text>
                                <Text style={{ fontSize: wp(3), color: '#0193DD' }}> &lt;---&gt; </Text>
                                <Text style={{ fontSize: wp(3), color: '#7A7C80' }}> {each_record.dest_list[0].Destination}</Text>
                            </Text>
                        </View>
                        <View>{this.showFlightDate()}</View>
                    </View>

                    <View style={{ ...styles.flightSearchButtonView, }}>
                        <Text style={styles.searchTextStyle} onPress={() => this.makeSearchRequest()}>Search</Text>
                    </View>
                </View>
                {/* third view started */}
                <View style={{ marginTop: wp(0), marginLeft: wp(11), width: wp(70), marginBottom: wp(1), }} >
                    <Text style={{ fontSize: wp(3), color: '#7A7C80', }}>
                        {each_record.destination_list[0].trip_type}
                        &nbsp;|&nbsp;{this.showEconomyTextInCapitals(each_record.class)}
                        &nbsp;|&nbsp;{each_record.adult}&nbsp;Adult&nbsp;|&nbsp;{each_record.child}&nbsp;Child&nbsp;|&nbsp;0 Infant
                </Text>
                </View>
            </View >
        )
    }
}

class CruiseSearchView extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        each_record: this.props.each_record
    }

    setCruiseTitle = () => {
        // do this dynamically, currently just return but later change to respective region.
        return "Cruise";
    }

    showTotalNights() {
        const start_date_object = moment(this.state.each_record.from_date, "DD-MM-YYYY");
        const end_date_object = moment(this.state.each_record.to_date, "DD-MM-YYYY");

        duration = moment.duration(end_date_object.diff(start_date_object));
        days_diffrence = duration.days();

        nights_to_render = days_diffrence ? days_diffrence : 0 + " Nights ";
        // console.log("nights_to_render = ", nights_to_render)

        return nights_to_render;
    }

    makeSearchRequest = () => {
        each_record = this.state.each_record;
        console.log(`makeSearchRequest() clicked, in CruiseSearchView Screen.`);

        route = '/cruise/search_results?';

        // append_params_in_url = "r1_adult" + each_record.adult + "&r1_child=" + each_record.child + "&cr_destination=" + each_record.destination_list[0].ht_dest + "&start_date=" + each_record.from_date + "&end_date=" + each_record.to_date + "&cruise_region=" + each_record.cruise_region + "&cruise_ship=" + each_record.ship_id + "&cruise_lines=" + each_record.line_id + "&cruise_days=" + each_record.nights + "&senior_citizen_check=" + each_record.includesenior + "&travel_type=cruise" + "&is_individual_cruise=True" + "&search_radio_type=" + each_record.search_radio_type;
        append_params_in_url = "db_record_id=" + each_record.id + "&source=" + "cruise"      // console.log("append_params_in_url = ", append_params_in_url)
        let final_url = BookBackendUrl + route + encodeURI(append_params_in_url);
        console.log("final_url in makeSerchRequest() in CruiseSearchView is = ", final_url)

        this.props.navigation.navigate('SavedSearchWebview', { uri: final_url });
    }

    render() {
        each_record = this.state.each_record

        // console.log("each_record in cruise-search = ", this.state.each_record);

        return (
            <View style={{ ...styles.cruiseSearchComponentStyles, }}>

                {/* first flex-row */}
                <View style={{ ...styles.textAndLogoCruiseView, }}>

                    <View style={styles.cruiseLogoImageViewContainer}>
                        <Image source={require('../../../assets/images/mySearches/cruise_search_logo_3x.png')}
                            style={styles.hotelsSearchLogoStyles}
                        />
                    </View>

                    <View style={{ ...styles.textViewContainerCruiseSearchStyles, }} >
                        <Text style={{ fontWeight: 'bold', fontSize: wp(4) }}>{this.setCruiseTitle()}</Text>
                    </View>
                </View>

                {/* second flex-row */}
                <View style={{
                    alignSelf: 'flex-start', width: wp(78), marginLeft: wp(2),
                    flexDirection: 'row', marginLeft: wp(10), alignItems: 'center', justifyContent: 'space-between'
                }}>

                    <View style={{ alignSelf: 'flex-start', margintop: wp(1), width: wp(50), marginTop: wp(0), marginLeft: wp(1), color: '#7A7C80', }} >
                        <Text>Region: All </Text>
                        <Text>Ships: All </Text>
                        <Text>Cruise Lines: All</Text>
                    </View>

                    <View style={{ ...styles.cruiseSearchButtonView, alignSelf: 'flex-end', marginBottom: wp(5) }}>
                        <Text style={styles.searchTextStyle} onPress={() => this.makeSearchRequest()}>Search</Text>
                    </View>

                </View>


                <View style={{ marginTop: wp(-2), marginLeft: wp(3), width: wp(70), }}>
                    <Text style={{ fontSize: wp(3), color: '#7A7C80', marginBottom: wp(1) }}>
                        {this.showTotalNights()}
                        | {each_record.adult} Adult
                        | {each_record.child} Child
                        | 0 Infant
                </Text>
                </View>

                {/* third flex-row */}

            </View >
        )
    }

}

class ActivitySearchView extends React.Component {
    constructor(props) {
        super(props)
    }
    state = {
        each_record: this.props.each_record
    }

    showDate() {

        const start_date_object = moment(this.state.each_record.from_date, "YYYY-MM-DD");
        const end_date_object = moment(this.state.each_record.to_date, "YYYY-MM-DD");

        const formatted_start_date = moment(start_date_object).format('DD MMM YYYY');
        const formatted_end_date = moment(end_date_object).format('DD MMM YYYY');

        // console.log("formatted_start_date = ", formatted_start_date)
        // console.log("formatted_end_date = ", formatted_end_date)

        duration = moment.duration(end_date_object.diff(start_date_object));
        days_diffrence = duration.days();

        if (days_diffrence <= 1) days_diffrence += " Day";
        else days_diffrence += " Days";

        // console.log("*********************************days_diffrence = ", days_diffrence)

        data_to_render = formatted_start_date + " - " + formatted_end_date + " | " + days_diffrence;
        // console.log("data_to_render = ", data_to_render)

        return data_to_render;
    }

    makeSearchRequest = () => {

        // console.log("each_record in hotelsearchview = ", each_record);

        console.log(`makeSearchRequest() clicked.`);
        each_record = this.state.each_record;
        // console.log("each_record = ", each_record)

        route = '/activity/search_results?';

        expected_url = "https://bookngogo.com/hotel/search_results?ht_destination=Romaldkirk,%20United%20Kingdom&hotel_checkin=23/12/2019&hotel_checkout=29/12/2019&r1_adult=1&r1_child=0&r1_age_ch1=1&individual_hotel=True&travel_type=hotel&hotelrooms=1&hotel_search_radio=hotel"

        // append_params_in_url = "ht_destination=" + each_record.ht_destination + "&hotel_checkin=" + each_record.hotel_checkin + "&hotel_checkout=" + each_record.hotel_checkout + each_record.room_str + "individual_hotel=True" + "&travel_type=hotel" + "&hotelrooms=" + each_record.hotelrooms + "&hotel_search_radio=" + each_record.hotel_search_radio;
        append_params_in_url = "db_record_id=" + each_record.id + "&source=" + "activity";

        // console.log("append_params_in_url = ", append_params_in_url)

        let final_url = BookBackendUrl + route + encodeURI(append_params_in_url);
        console.log("final_url in /hotel/search_results is = ", final_url)

        this.props.navigation.navigate('SavedSearchWebview', { uri: final_url });
    }

    render() {
        // console.log("this.props.each_record = ", this.props.each_record);
        each_record = this.state.each_record;
        return (
            <View style={styles.hotelSearchViewStyles}>

                <View style={styles.textAndLogoGroupingView}>

                    <View style={styles.flightLogoImageViewContainer}>
                        <Image source={require('../../../assets/images/mySearches/activity_search_ballon_logo.png')}
                            style={styles.hotelsSearchLogoStyles}
                        />
                    </View>

                    <View style={styles.textGroupingView} >
                        <View>
                            <Text style={{ fontWeight: 'bold', fontSize: wp(4), }}>{each_record.destination} </Text>
                        </View>

                        <Text style={{ fontSize: wp(3), color: '#7A7C80' }}>{this.showDate()} </Text>
                    </View>
                </View>


                <View style={styles.HotelSearchButtonView}>
                    <Text onPress={() => this.makeSearchRequest()} style={styles.searchTextStyle}>Search</Text>
                </View>

                <View style={{ marginTop: wp(0), marginLeft: wp(11), width: wp(70), marginBottom: wp(1), }} >
                    <Text style={{ fontSize: wp(3), color: '#7A7C80', }}>
                        &nbsp;{each_record.r1_adult}&nbsp;Adult&nbsp;|&nbsp;{each_record.r1_child}&nbsp;Child&nbsp;|&nbsp;{each_record.infant}&nbsp;Infant
                    </Text>
                </View>

            </View>
        )
    }
}


class TransfersSearchView extends React.Component {

    constructor(props) {
        super(props)
    }
    state = {
        each_record: this.props.each_record,
    }

    makeSearchRequest = () => {

        console.log(`makeSearchRequest() clicked, in FlightsSearchView<>`);

        each_record = this.state.each_record;
        let flight_depart = moment(each_record.destination_list[0].from_date, 'YYYY-MM-DD').format('DD/MM/YYYY');
        let flight_return = moment(each_record.destination_list[0].to_date, 'YYYY-MM-DD').format('DD/MM/YYYY');

        // console.log("flight_depart is changed as = ", flight_depart)
        // console.log("flight_return is changed as = ", flight_return)

        route = '/transfer/search_results?';

        append_params_in_url = "db_record_id=" + each_record.id + "&source=" + "transfer";

        encodedURI = encodeURI(append_params_in_url)
        // console.log("encodedURI = *********", encodedURI)

        let final_url = BookBackendUrl + route + encodedURI;
        console.log("final_url in makeSerchRequest() in TransfersSearchView is = ", final_url)

        this.props.navigation.navigate('SavedSearchWebview', { uri: final_url });
    }

    showTransferDepartureDate = () => {
        // console.log("from_date before converting is = ", each_record.destination_list[0].from_date)

        let transfer_depart_date = moment(this.state.each_record.destination_list[0].from_date, 'YYYY-MM-DD').format('DD MMM YYYY');
        let transfer_arrival_date = moment(this.state.each_record.destination_list[0].to_date, 'YYYY-MM-DD').format('DD MMM YYYY');

        // console.log("transfer_depart_date = ", transfer_depart_date);
        let date = transfer_depart_date + " - " + transfer_arrival_date;
        // console.log("****************date returned in transfers is = ", date)
        return date;
    }

    showTripType() {
        server_returned_trip_type = this.state.each_record.tripType
        // console.log("server_returned_trip_type = ", server_returned_trip_type)
        if (server_returned_trip_type == 'oneway') {
            return "One Way";
        }
        else {
            return server_returned_trip_type;
        }
    }
    showTitleOfTransfer() {
        each_record = this.state.each_record;
        if (each_record.destination_list) {
            // console.log("each_record.destination_list = > ", each_record.destination_list);
            return each_record.destination_list[0].pickup + " to " + each_record.destination_list[0].dropoff;
        }
        else {
            return "no-date-received."
        }
    }
    render() {
        each_record = this.state.each_record;
        // console.log("<TransfersSearchView/> each_record is = ", each_record)

        return (
            <View style={{ ...styles.flightsSearchComponentStyles, alignSelf: 'center' }} >
                {/* new view started */}

                <View style={{ ...styles.textAndLogoCruiseView }}>

                    <View style={styles.flightLogoImageViewContainer}>
                        <Image source={require('../../../assets/images/mySearches/transfers_img_car_logo_transparent.png')}
                            style={styles.hotelsSearchLogoStyles} />
                    </View>

                    <View style={styles.textViewFlightSearchStyles} >
                        <Text style={{ fontWeight: 'bold', fontSize: wp(4), }}>
                            {/* {console.log("each_record")}
                            {each_record.destination_list[0].pickup}
                            &nbsp;to&nbsp;
                            {each_record.destination_list[0].dropoff} */}
                            {this.showTitleOfTransfer()}
                        </Text>
                    </View>
                </View>
                {/* second view started */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', }}>
                    <View style={{ alignSelf: 'flex-start', marginTop: wp(0), marginLeft: wp(11), }} >
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: wp(60), marginBottom: wp(1), }}>
                            <Text style={{ fontSize: wp(3), color: '#7A7C80' }}>
                                <Text style={{ fontSize: wp(3), color: '#7A7C80' }}>{each_record.destination_list[0].from_city}</Text>
                                <Text style={{ fontSize: wp(3), color: '#0193DD' }}> &lt;---&gt; </Text>
                                <Text style={{ fontSize: wp(3), color: '#7A7C80' }}> {each_record.destination_list[0].to_city}</Text>
                            </Text>
                        </View>
                        <View>
                            <Text style={{ width: wp(40), fontSize: wp(3), color: '#7A7C80', zIndex: -9999 }}>
                                {this.showTransferDepartureDate()}
                            </Text>
                        </View>
                        <View ><Text style={{ width: wp(40), fontSize: wp(3), color: '#7A7C80', zIndex: -9999 }}>Departure Time: {each_record.departureTime}</Text></View>
                    </View>

                    <View style={{ ...styles.flightSearchButtonView, }}>
                        <Text style={styles.searchTextStyle} onPress={() => this.makeSearchRequest()}>Search</Text>
                    </View>
                </View>
                {/* third view started */}
                <View style={{ marginTop: wp(0), marginLeft: wp(11), width: wp(70), marginBottom: wp(1), }} >
                    <Text style={{ fontSize: wp(3), color: '#7A7C80', }}>
                        {this.showTripType()}&nbsp;|&nbsp;{each_record.adults}&nbsp;Adult&nbsp;|&nbsp;{each_record.children}&nbsp;Child&nbsp;|&nbsp;{each_record.infants}&nbsp;Infant
                </Text>
                </View>
            </View >
        )
    }
}

export default class MySearches extends React.Component {
    constructor(props) {
        super(props)
        this.handler = this.handler.bind(this)
    }

    handler() {
        console.log("state changed.")
        this.setState({ expand_hotel_room: !this.state.expand_hotel_room })
    }
    static navigationOptions = {
        title: 'My Searches',
    }

    state = {
        loading: true,
        fetched_data: false,
        expand_hotel_room: false,
        array_response: null,
        referral_code: this.props.navigation.getParam('userInfo').partner_referral_code,
        partner_id: this.props.navigation.getParam('userInfo').partner_id,
        partner_email: this.props.navigation.getParam('userInfo').partner_email,
    };

    render_each_search_view = () => {
        let return_data = []
        return_data = searches_array.map((item, index) => {
            return (
                <View key={item.id} style={styles.stylesForEachSearchComponent}>
                    <View style={styles.searchComponent}>

                    </View>
                </View>
            )
        });
        return return_data;
    }

    fetch_data_from_agentscentric_server = () => {
        console.log("fetch_data_from_agentscentric_server() is called, from ComponentDidMount(), state is = ", this.state)
        route = "/fetch_saved_searches_in_mobile_app";

        axios({
            method: 'POST',
            url: BookBackendUrl + route,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                // "al_email": this.state.partner_email,
                // "al_referral_code": this.state.partner_referral_code,
                "partner_id": this.state.partner_id
            },
            responseType: 'json'
        }).then((response) => {
            console.warn(response.data);
            // console.log("response -> ", response.data)
            if (response.data.result) {
                this.setState({
                    array_response: response.data.result,
                    loading: false
                },
                    ()  => console.log("state of each_record is changed after fetching data from server", this.state)
                );
            }
            else{
                this.setState({
                    array_response: false,
                    loading: true
                }); 
            }
        })
            .catch((error) => { console.log("error in functin fetch_data_from_agentscentric_server() ", error) })
    }

    componentDidMount() {
        this.fetch_data_from_agentscentric_server();
    }

    render() {


        // const url = this.props.navigation.getParam('url');
        let uri = "https://bookngogo.hotelscentric.com/saved_searches?hideheader=true&al_email=" + this.props.navigation.getParam('userInfo').partner_email + "&al_referral_code=" + this.props.navigation.getParam('userInfo').partner_referral_code;
        return (

            <View style={styles.container}>
                {
                    !this.state.loading ?
                        // <FlatList
                        //     data={this.state.array_response[0]}
                        //     renderItem={
                        //         () => {

                        //             return <HotelsSearchView each_record={this.state.each_record} />;
                        //         }
                        //     }    
                        // />


                        <ScrollView style={styles.container}>
                            {/* {console.log("state is = ", this.state)} */}
                            {/* 
                            <HotelsSearchView each_record={this.state.each_record} />
                            <CruiseSearchView each_record={this.state.each_record} />
                            <FlightsSearchView each_record={this.state.each_record} /> 
                            */}
                            {
                                this.state.array_response == false ? <Loading /> :
                                    this.state.array_response.map((item, index) => {
                                        key = { index }
                                        if ((item.service_type == 'hotel' || item.service_type == 'activity') && item.individual_hotel == 'True') {
                                            // console.log("index is = ", index);
                                            // console.log("item is = ", item);
                                            // console.log("########## item.individual_hotel == true, item.service_type = ", item.service_type)
                                            return (
                                                <HotelsSearchView
                                                    each_record={item}
                                                    // unique_id={item.ct_session_id}
                                                    navigation={this.props.navigation}
                                                    key={item.id}

                                                />)
                                        }
                                        if (item.service_type == 'flight') {
                                            // console.log("index is = ", index);
                                            // console.log("item is = ", item);
                                            return (
                                                <FlightsSearchView
                                                    each_record={item}
                                                    navigation={this.props.navigation}
                                                    key={item.id}
                                                />
                                            )
                                        }
                                        if (item.service_type == 'cruise') {
                                            // console.log("index is = ", index);
                                            // console.log("item is = ", item);
                                            return (
                                                <CruiseSearchView
                                                    each_record={item}
                                                    navigation={this.props.navigation}
                                                    key={item.id}
                                                />
                                            )
                                        }
                                        if ((item.service_type == 'hotel' || item.service_type == 'activity') && item.is_individual_activity == "True") {
                                            // console.log("******************search-activities is to be rendered, for item.service_type = ", item.service_type);
                                            // console.log("------------------search-activities is to be rendered, for item = ", item);

                                            if (item.destination != null) {
                                                // console.log("ActivitySerachView, item.destination != null, then only looping data, else don't.")
                                                return (
                                                    <ActivitySearchView
                                                        each_record={item}
                                                        navigation={this.props.navigation}
                                                        key={item.id}
                                                    />)
                                            }
                                            else {
                                                // console.log("destination value is empty for this record, please filter these records at serverside, to avoid null-value-errors.");
                                                console.log("<ActivitySerachView/>, value of item, for which destination is empty is = ", item);
                                            }
                                        }
                                        if (item.service_type == 'car') {
                                            if (typeof item.destination_list !== 'undefined' && item.destination_list.length > 0) {

                                                if (item.destination_list[0].from_city !== "" && item.destination_list[0].to_city !== "") {
                                                    // console.log("from city is non-empty, for <TransfersSearchView/>, so return view for item = ", item);

                                                    // console.log("from_city is = ", item.destination_list[0].from_city)
                                                    return (
                                                        <TransfersSearchView
                                                            each_record={item}
                                                            navigation={this.props.navigation}
                                                            key={item.id}
                                                        />)
                                                }
                                                else {
                                                    console.log("from/to city-field is found to be empty, so ignoring those <TransfersViews/> for item = ", item)
                                                }
                                            }
                                            else {
                                                console.log("destination array is empty, or undefined for item = ", item)
                                            }

                                        }
                                        else {
                                            console.log("can't search for service_type = ", item.service_type);
                                            console.log("that item is = ", item);
                                        }
                                    })
                            }
                        </ScrollView>
                        :
                        <Loading />
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flightsSearchComponentStyles: {
        margin: hp(1),
        height: hp(16),
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: wp(2),
        elevation: 2,
        backgroundColor: 'white',
        width: '90%',
        //  position: 'absolute',
        zIndex: -9999
    },
    cruiseSearchComponentStyles: {
        margin: hp(1),
        height: hp(17),
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: wp(2),
        elevation: 2,
        backgroundColor: 'white',
        width: '90%',
        // position: 'absolute',
        zIndex: -9999,
    }
    ,
    stylesForEachSearchComponent: {
        margin: hp(2),
        height: hp(16),
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: wp(2),
        elevation: 2,
        backgroundColor: 'white',
        width: '90%',
        borderRadius: wp(2),
        zIndex: -9999

    },
    hotelSearchViewStyles: {
        margin: hp(2),
        height: hp(13),
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: wp(2),
        elevation: 2,
        backgroundColor: 'white',
        width: '90%',
        // position: 'absolute',
        zIndex: -9999
    },
    TransfersSearchView: {
        margin: hp(1),
        height: hp(18),
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: wp(2),
        elevation: 2,
        backgroundColor: 'white',
        width: '90%',
        //  position: 'absolute',
        zIndex: -9999
    },
    flightLogoImage: {
        height: wp(4),
        width: wp(4),
        backgroundColor: '#0193DD',
        marginTop: wp(2),
        marginLeft: wp(2),
        marginRight: wp(0)
    },
    flightLogoImageViewContainer: {
        // borderWidth: 0,
        // borderColor: 'gray',
        height: wp(4),
        width: wp(4),
        marginTop: wp(1.5),
        marginLeft: wp(1),
        marginRight: wp(0)
    },
    transferCarLogoImageViewContainer:{
        height: wp(4),
        width: wp(4),
        marginTop: wp(1.5),
        marginLeft: wp(1),
        marginRight: wp(0)
    },
    transferSearchLogoStyles: {
        resizeMode: 'contain',
        height: wp(5),
        width: wp(5)
    },
    hotelsSearchLogoStyles: {
        resizeMode: 'contain',
        height: wp(4),
        width: wp(4)
    },
    cruiseLogoImageViewContainer: {
        height: wp(4),
        width: wp(4),
        marginTop: wp(3),
        marginLeft: wp(1.5),
        marginRight: wp(0)
    },
    textAndLogoGroupingView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        // borderColor: 'white',
        // borderWidth: 0,
        zIndex: -9999
    },
    textGroupingView: {
        width: wp(60),
        height: wp(15),
        // borderWidth: 0,
        // borderColor: 'white',
        marginLeft: wp(3),
        marginRight: wp(15),
        marginBottom: wp(0),
        zIndex: -9999
    },
    HotelSearchButtonView: {
        width: wp(15),
        height: hp(4),
        backgroundColor: '#0193DD',
        alignSelf: 'flex-end',
        marginTop: wp(-8),
        marginRight: wp(3),
        borderRadius: 4,
    },
    searchTextStyle: {
        marginHorizontal: wp(1.5),
        marginVertical: wp(1),
        color: "white"
    },

    flightSearchButtonView: {
        width: wp(15),
        height: hp(4),
        backgroundColor: '#0193DD',
        alignSelf: 'flex-end',
        marginTop: wp(0),
        marginBottom: wp(2),
        marginRight: wp(3),
        borderRadius: 4,
        marginLeft: wp(0),
        zIndex: 9999,
        elevation: 3


    },
    cruiseSearchButtonView: {
        width: wp(15),
        height: hp(4),
        backgroundColor: '#0193DD',
        marginTop: wp(0),
        marginRight: wp(1),
        borderRadius: 4,
    },

    twoRoomsDropDownContainerView: {
        marginLeft: wp(8.5),
        width: wp(40),
        backgroundColor: 'white',
        marginTop: wp(3)
    },
    textViewFlightSearchStyles: {
        width: wp(60),
        height: wp(15),
        borderWidth: 0,
        borderColor: 'white',
        marginLeft: wp(2.5),
        marginRight: wp(15),
        marginBottom: wp(1),
    },
    textAndLogoFlightView: {
        flexDirection: 'row',
        height: hp(4),
        justifyContent: 'center',
        alignItems: 'flex-start',
        // borderColor: 'gray',
        // borderWidth: 0,
        marginTop: wp(2),
        marginBottom: wp(-2)

    },
    textAndLogoCruiseView: {
        flexDirection: 'row',
        height: hp(4),
        justifyContent: 'center',
        alignItems: 'flex-start',
        // borderColor: 'gray',
        // borderWidth: 0,
        marginTop: wp(1),
        marginBottom: wp(-2)
    },
    textViewContainerCruiseSearchStyles: {
        width: wp(60),
        height: wp(6),
        marginLeft: wp(2),
        marginRight: wp(15),
        marginBottom: wp(1),
        marginTop: wp(1.5)
    }
});
