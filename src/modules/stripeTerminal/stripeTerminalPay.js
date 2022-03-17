import React from 'react';
import StripeTerminal from 'react-native-stripe-terminal';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SystemSetting from 'react-native-system-setting'

import {
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StyleSheet,
    Linking,
    Modal,
    PermissionsAndroid
} from 'react-native';

export default class StripeTerminalPay extends React.Component {

    static navigationOptions = {
        title: 'Stripe Terminal Implementation',
    }

    constructor(props) {
        super(props);
        // this._fetch_params_from_odoo_server= this._fetch_params_from_odoo_server.bind(this);
        // this._start_stripe_terminal_payment_process= this._start_stripe_terminal_payment_process.bind(this);
    }

    state = {
        sdk_init: false,
        vpay_id: null,
        amount: null,
        name: null,
        currency: "usd",
        status: "reader_not_connected",
        request_route: "/connection_token",
        server_callback_url: "",
        browser_update_url: "",
        displayText: "Stripe-Terminal is started.",
        error: "No Error till yet."
    }


    // 1. first this is run, after CDM.
    getLocationPermission = () => {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        )
            .then(
                (granted) => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        console.log('1. Perminssion Granted for Location.');

                        // turnon Bluetooth and gps first
                        //  turning on bluetooth isn't working, so directly executing next-function. 
                        // todo:- enable bluetooth, if it's off.
                        this.navigateToGetCurrentPosition();
                    }
                    else {
                        this.setState({ error: "1. error in granting permission" });
                        console.log("error in granting permission");
                    }
                })
            .catch((e) =>
                console.log("1. Location-Permission Error ", e));
    }

    // 2. 
    navigateToGetCurrentPosition = () => {
        console.log("2. navigateToGetCurrentPosition() is called.")
        console.log("2. URL params received = ", this.props.url);

        this.getURLParamsAndSetState(this.props.url);

    }

    // 3. 
    getURLParamsAndSetState = (urlReceivedValues) => {
        console.log("3. getURLParamsAndSetState(), params_received  from Server = ", urlReceivedValues);
        // reference for below approach from "https://www.jskap.com/blog/React-Native-parse-url-query-params/"

        // let url = "stripegd://this_will_check_status_of_payment/?amount=90&name=Mister%20Ravinder%20%20Narayanan&vpay_id=31&server_callback_url=http://bng.hotelscentric.com&backend_url=web%23id%3D31%26action%3D698%26model%3Dhc.vpay%26view_type%3Dform%26menu_id%3D279";
        // let url = stripegd://this_will_check_status_of_payment/?amount=79&name=check%20calc&vpay_id=94&server_callback_url=https://9cfb9eb5.ngrok.io&browser_update_url%3Dweb%23vpay_id%3D94%26action%3D508
        let url = urlReceivedValues
        let regex = /[?&]([^=#]+)=([^&#]*)/g,
            params = {},
            match;
        while ((match = regex.exec(url))) {
            params[match[1]] = match[2]
            console.log(match[1] + " = " + match[2]);
        }

        // change url http=> https, as base URL is http only, which isn't supported for stripe-sdk initialization.
        https_url = params.server_callback_url.replace(/^http:\/\//i, 'https://');
        console.log("new https_url is = ", https_url);

        // if name contains space then it encodes it as %20, and manually replacing it by space
        spaces_trimmed_name = decodeURI(params.name.trim())
        console.log("spaces_trimmed_name = ", spaces_trimmed_name);

        browser_update_url = decodeURIComponent(params.browser_update_url);

        console.log("------------ params.backend_url = ", params.browser_update_url)
        console.log("************ browser_update_url = ", browser_update_url)

        // now params-Object contains all params received, Now assign them to state.
        this.setState({
            vpay_id: parseInt(params.vpay_id),
            amount: parseInt(params.amount),
            currency: params.currency,
            name: spaces_trimmed_name,
            server_callback_url: https_url,
            browser_update_url: browser_update_url
        },
            // Callback of this.setState()
            () => {
                console.log("3. getURLParamsAndSetState() executed and paramsObject = ", params);
                if (this.state.status == "reader_not_connected") {
                    console.log("if(this.state.status == reader_not_connected) == true, then initializeSDK()");

                    this.initializeStripeTerminalSDK();
                }
                else {
                    console.log("3. reader is already initialized, only URL-state is changed, directly starting PaymentProcess.");

                    if (this.state.status == "payment_completed") {

                        console.log("3. current state is = payment_completed, again it will start transaction.");

                        this.setState({ status: "reader_connected" },
                            () => {
                                console.log("Payment is initiated for new user, status = reader_connected");
                                console.log("now running startPaymentProcess()")
                                this.startPaymentProcess();

                            });
                    }

                }
            });

        // Once you received server-url parameter, then only initialize SDK, 
        // because we have to get key from server for initilization

    }

    // 4. 
    initializeStripeTerminalSDK = () => {
        console.log("4. initializeStripeTerminalSDK() is started");

        StripeTerminal.initialize({
            fetchConnectionToken: () => {
                // this.setState({ displayText: "SDK initialized." });
                console.log("4. fetchConnectionToken() is running.");

                server_url = this.state.server_callback_url;
                let route = "/connection_token"
                let URL = server_url + route
                console.log("axios URL for connection_token-", URL);

                // odoo-request, don't forget to do JSON.stringify({data:body/params})
                return axios({
                    method: 'POST',
                    url: URL,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    data: "{}",
                    responseType: 'json'
                })
                    .then((response) => {
                        console.log("response returning after connection-token is = ", response.data.result.secret)
                        return response.data.result.secret
                    })
                    .catch((error) => console.log("error in axios connection_token()  request = ", error))
            }
        })
            .then(() => {
                this.discoverReadersDevices();

                // if (this.state.status != 'reader_not_connected') {
                //     this.discoverReadersDevices();
                //     console.log("4.if(this.state.status != 'reader_not_connected) is true, so executing discoverReadersDevices()");
                // }
                // else {
                //     console.log("4. status != reader_not_connected, in else part");
                // }
            })
            .catch((error) => {
                this.setState({ error: error });
                console.log('4. Error in final-SDK init', error);
            });
    }

    // 5. 
    discoverReadersDevices = () => {
        console.log("5.started discoverReadersDevices()")

        StripeTerminal.discoverReaders(
            StripeTerminal.DeviceTypeChipper2X,
            StripeTerminal.DiscoveryMethodBluetoothProximity, 0)
            .then(() => {
                this.setState({ status: "readers_discovered" })
                console.log("5. discoverReaders() executed.")
            })
            .catch((error) => {
                this.setState({ error: error });
                console.log("5. error in discoverReaders() = ", error);
            });
        this.addClickListenerForDiscoverdReaders();
    }


    // 7. 
    addClickListenerForDiscoverdReaders = () => {
        console.log("7. addClickListenerForDiscoverdReaders() is running.");

        StripeTerminal.addReadersDiscoveredListener(readers => {
            console.log("Array of readers [] discovered = ", readers);

            this.setState({ readers_array: readers, }, () => {
                console.log("this.state.readers_array [] = ", this.state.readers_array);
            });

            if (readers.length == 1) {
                console.log("7.Now connecting-directly to device as reader[0], as array-length is == 1 ");
                StripeTerminal.connectReader(readers[0].serialNumber)
                    .then(() => {
                        console.log("7. connected successfully to reader[0], now starting payment-process");
                        this.setState({ status: "reader_connected" },
                            () => {
                                console.log("Payment is initiated for new user, status = reader_connected");
                                console.log("now running startPaymentProcess()")
                                this.startPaymentProcess();

                            });

                    }) // after connecting devices, start paymentPr5ocess.
                    .catch((error) => {
                        console.log("7. Error in connectReader() to single-reader of readers[0]", error)
                    });
            }
            else if (readers.length > 1) {
                console.log('7. more readers discovered in addReadersDiscoveredListener \n')
                console.log("readers.length >= 1");
            }
            else {
                console.log("7.readers-array is empty, please check your bluetooth");
            }
        });
    }

    // 8. 
    startPaymentProcess = () => {

        StripeTerminal.createPayment({ amount: this.state.amount, currency: "usd" })
            .then(intent => {
                // this.setState({ displayText: this.state.displayText + "\n" + "Payment process is done on ClientSide" })
                console.log('8. Payment process is Created on ClientSide', intent);

                console.log("8. Now capturing PaymentIntent on Serverside.");
                // this.setState({ displayText: this.state.displayText + "\n" + "Capturing payment now, on ServerSide." })
                // status_of_payment = StripeTerminal.PaymentIntentStatusSucceeded(intent)
                // console.log("status_of_payment = ",status_of_payment);
                intent_id_for_capture_payment = intent.stripeId;
                console.log("8. intent_id_for_capture_payment = ", intent_id_for_capture_payment);

                // Now Capture payments at server-side.
                server_url_for_capturing_paymt = this.state.server_callback_url;
                console.log("8.*********** server_url_for_capturing_paymt = ", server_url_for_capturing_paymt);

                this.capturePaymentAtServer();
            })
            .catch((error) => {
                this.setState({ error: error }, () => {
                    console.log("8. Error in createPayment()", error);
                });
            });
    }

    // 8.
    capturePaymentAtServer = () => {

        let route = "/capture_payment"
        let URL = this.state.server_callback_url + route
        console.log("POST-request made to url in axios = ", URL);

        axios({
            method: 'POST',
            url: URL,
            headers: {
                'Content-Type': 'application/json',
            },
            data: {
                id: intent_id_for_capture_payment,
                vpay_id: this.state.vpay_id,
                amount: this.state.amount
            },
            responseType: 'json'
        })
            .then((response) => {
                console.log("axios() called for capture_payments ", response)
                response_data = response.data.result;
                console.log("typeof(response_data) = ", typeof (response_data));
                console.log("response_data = ", response_data);
                console.log("response_data.charges = ", response_data.charges);
                console.log("response_data.charges.data = ", response_data.charges.data);
                console.log("response_data.charges.data[0] = ", response_data.charges.data[0]);
                console.log("response_data.charges.data[0].captured = ", response_data.charges.data[0].captured);

                // need to check response.capture=="true" or not then only change state to completed else failed-state.
                let payment_result = response_data.charges.data[0].captured
                console.log("***************this.state = ", this.state);

                if (payment_result == true) {
                    this.setState({ status: "payment_completed" }, () => {

                        console.log("state.status = payment_completed");
                        console.log("8. payment processed at clientside, payment_result = ", payment_result);

                        console.log("opening url in browser now.");

                        setTimeout(() => {
                            let open_url_in_browser = this.state.server_callback_url + "/" + this.state.browser_update_url
                            Linking.openURL(open_url_in_browser).catch((error) => console.error('Can\'t open URL in browser due to error = ' + error + "\n" + browser_update_url));
                        }, 3000);
                    });
                }
                else {
                    this.setState({ status: "payment_failed" }, () => {
                        console.log("8. payment processed at clientside, payment_result = ", payment_result);
                        console.log("state.status = payment_failed");
                    });
                }
            })
            .catch((error) => {
                this.setState({ error: error })
                console.log("error in axios, capture_payment()x = ", error)
            })
    }


    componentDidMount() {
        console.log('component did mount called, for current state.status = ', this.state.status);
        // 2. Run after fetching params from server
        // TODO_1: put async-await, for clean-code, and better readablility.
        // TODO_2: first check if bluetooth and location are turned on or not, else it won't tell itself to turn it on automatically.
        this.getLocationPermission();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.url != this.props.url) {
            console.log('component did update, if condition')
            this.getURLParamsAndSetState(this.props.url);
        }
    }

    componentWillUnmount() {
        // Make sure you remove the listeners when you're done
        // (e.g. in componentWillUnmount).
        this.waitingListener.remove();
        this.inputListener.remove();
        console.log("9. componentWillUnmount() is executed.");


    }

    // following are handler-function.
    readers_list = () => {
        let return_data = [];
        return_data = this.state.readers_array.map((item, index) => {
            return (
                <TouchableOpacity style={styles.buttonContainer}
                    onPress={this.radioClick.bind(this, item, index)}
                >
                    {/* <Text style={styles.each_reader_item_text}> Reader {item}</Text> */}
                    <View style={styles.circle}>
                        {this.state.value == item && (<View style={styles.checkedCircle} />)}
                    </View>

                    {/* todo- later,pass uniqueKeyId for updation. */}
                </TouchableOpacity>
            )
        })
        return return_data;
    }

    // this function is invoked when reader-is-choosen, from list-of-readers.
    radioClick = (item, index) => {
        console.log("radioClick() button is clicked, for index = ", index);

        // remove "this-keyword", by "this.props", but pass state to access it here as props.connect-function()
        this.setState({ value: item }, () => {
            console.log("reader choosed is = ", item);
            // call-function-connectToReader();
            StripeTerminal.connectReader(readers[index].serialNumber)
                .then(() => {
                    this.setState({ status: "reader_connected" }, () => {
                        // after connecting devices, start paymentProcess.
                        this.startPaymentProcess();
                    });


                });
        })
    }

    retryRedirectToMainScreen = () => {
        this.setState({ status: "reader_connected" },
            () => {
                console.log("Retry link is clicked, start again, and see the error first.");

                console.log("this.startPaymentProcess() is called again")

                this.startPaymentProcess();

                
            });
    }

    render() {
        return (
            <Modal>
                <View style={styles.mainContainer}>
                    {/* Container is main-outer layout-component. */}

                    {/* 1. Vpay-Background Image */}
                    <View style={styles.vpayView}>
                        <Image source={require('./images/vpay.png')}
                            style={styles.vpayImageStyling}
                        />
                    </View>

                    {/* 2. Connect-To-Reader Screen */}
                    <View style={{ ...styles.connectToReaderRowView }}>
                        {/* This is for green checkmark to show or not, based on status of reader-connection. */}
                        {
                            (this.state.status == 'reader_not_connected')
                                ?
                                // not-connected then show blank-view
                                <View style={styles.connectToReaderImagesInRow} />
                                :
                                // else, show green-tick checkmark, that router-connected.
                                <Image style={styles.connectToReaderImagesInRow}
                                    source={require('./images/right_checkmark.png')} />
                        }

                        <Image style={styles.connectToReaderImagesInRow}
                            source={require('./images/wifi_network_logo.png')} />

                        <View style={styles.connectedReaderTextContainer}>
                            <Text style={styles.connectedReaderMainText}>Connected to a Reader.</Text>
                            <Text style={styles.connectedReaderSubText}>Reader 2.</Text>
                        </View>

                        <Image style={styles.connectToReaderImagesInRow}
                            source={require('./images/list_routers_button.png')} />
                    </View>


                    {/* 3. CardView for Transaction Status */}
                    <View style={styles.transactionStatusCardElevationTwo}>

                        {(this.state.status == 'reader_not_connected') &&
                            <Reader_Not_Connected_View
                                status={this.state.status}
                            />
                        }

                        {this.state.status == 'readers_discovered' && (this.state.readers_array.length > 1) && (
                            <View
                                style={styles.readersListContainer}
                            >
                                <Text style={styles.availableReadersHeader}>Available Readers</Text>
                                {this.readers_list()}

                            </View>
                        )}

                        {(this.state.status == 'reader_connected') &&
                            <ReadyToSwipeView
                                value={this.state}
                            />
                        }

                        {(this.state.status == 'payment_completed') &&
                            <Payment_Status_SuccessView
                                status={this.state.status}
                            />
                        }

                        {(this.state.status == 'payment_failed') &&
                            <Payment_Status_FailedView
                                status={this.state.status}
                                func_name={this.retryRedirectToMainScreen}
                            />
                        }
                    </View>

                    <View style={styles.emptyViewForSpacingCardNLogo}>

                    </View>

                    {/* 4.last row of FlexBox, Logo- Powered By Stripe */}
                    <View style={styles.poweredByStripeRowContainer}>
                        {/* <Image source={require('./images/poweredByStripe.jpg')} /> */}
                        <Text style={styles.textPoweredBy}>Powered By</Text>
                        <Image
                            source={require('./images/stripeLogoImage.png')}
                            style={styles.stripeLogoImage}></Image>
                    </View>
                </View>
            </Modal>

        )
    }
}


// custom views are as follows, outside of class, where "this-keyword" can't be used.

// Custom Views changing based on this.state.status
Reader_Not_Connected_View = (props) => {
    return (
        <View style={styles.readerNotConnected}>
            <Text style={styles.readerNotConnectedText}>Please Connect to Reader</Text>
            <Text style={styles.readerNotConnectedText}>check Your Bluetooth.</Text>

        </View>
    )
}

ReadyToSwipeView = (props) => {
    return (
        <View style={styles.readyToSwipeViewStyles}>
            <View style={styles.amountToBeCollected}>
                <Text style={styles.blueTextPayment}>{props.value.amount / 100} $ to be charged to </Text>
                <Text style={styles.blueTextPayment}>{props.value.name}</Text>
            </View>
            <View>
                <Text style={styles.readyToSwipeText}>Ready to swipe.</Text>
            </View>
        </View>
    )
}


Payment_Status_SuccessView = (props) => {
    return (
        <View style={styles.paymentStatusSuccessView}>
            <Image style={styles.transactionStatusLogoImage}
                // <Image style={styles.connectToReaderImagesInRow}
                source={require('./images/transaction_successful_logo.png')} />

            <Text style={styles.transactionSuccessfulText}>Transaction Successful.</Text>

        </View>
    )
}

Payment_Status_FailedView = (props) => {
    return (
        <View style={styles.paymentFailedContainer} >
            <View style={styles.paymentStatusFailedView}>
                <Image style={styles.transactionFailedLogoImage}
                    source={require('./images/transaction_failed_logo.png')} />

                <Text style={styles.transactionFailedText}>Transaction Failed.</Text>

            </View>
            <TouchableOpacity
                onPress={() => props.func_name()}
            >
                <Text
                    style={styles.retryTransactionLink}
                >Retry</Text></TouchableOpacity>
        </View>

    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white"
    },

    vpayView: {
        flex: 0.3,
        // height:'100%',
        // width:'100%',
    },
    vpayImageStyling: {
        width: wp(100),
        height: wp(58)
    },

    connectToReaderRowView: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        height: '100%',
        // borderWidth: 2,
        // borderColor: 'gray',
        flexDirection: "row",
    },
    connectToReaderImagesInRow: {
        flex: 1,
        resizeMode: 'contain',
        paddingHorizontal: hp(1),
        marginBottom: hp(1.8),
        height: '12%',
        width: '12%',
    },
    connectedReaderTextContainer: {
        flex: 7,
        justifyContent: "space-around",
        height: '30%',
        width: '30%',
        marginLeft: 10,
        marginVertical: 10
    },
    connectedReaderMainText: {
        fontSize: wp(3.5),
        color: "#5E5E5E"
    },
    connectedReaderSubText: {
        fontSize: wp(3),
        color: "#0193DD"

    },
    readerNotConnectedText: {
        fontSize: wp(3.5),
        color: "#0193DD",
    },

    // Ready To Swipe, Collect $100 from James
    readyToSwipeViewStyles: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    amountToBeCollected: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    blueTextPayment: {
        fontSize: wp(4),
        color: "#0193DD",
    },

    readyToSwipeText: {
        fontSize: wp(3.5),
        color: "#919291",
        marginTop: hp(2)
    },

    // for listview of readers-array-items

    readersListContainer: {
        flexDirection: 'column',
        height: '100%',
        width: "100%",
    },
    availableReadersHeader: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        fontSize: wp(3.5),
        color: '#0193DD',
        borderBottomColor: "gray"
    },



    // for list-of-readers, with readio-buttons.
    buttonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginBottom: 30,
    },
    circle: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#A2A2A4',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCircle: {
        width: 10,
        height: 10,
        borderRadius: 7,
        backgroundColor: '#A2A2A4',
    },

    // for transaction-status-successful-view
    transactionStatusCardElevationTwo: {
        flex: 0.3,
        marginTop: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: wp(2),
        elevation: 2,
        backgroundColor: 'white',
        width: '70%'
    },

    paymentStatusSuccessView: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        width: '70%',
        height: '100%',
    },
    transactionSuccessfulText: {
        fontSize: wp(3.5),
        color: "#0193DD",
        paddingLeft: wp(1.5)
    },

    // for transaction-status-failed-view

    paymentFailedContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'

    },
    paymentStatusFailedView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    transactionFailedText: {
        fontSize: wp(4),
        color: "#E24C4B",
        paddingLeft: wp(1.5)
    },

    transactionFailedLogoImage: {
        resizeMode: 'contain',
        height: wp(6),
        width: wp(6)
    },

    transactionStatusLogoImage: {
        flex: 1,
        resizeMode: 'contain',
        paddingHorizontal: hp(1),
        height: '12%',
        width: '12%',
    },

    retryTransactionLink: {
        fontSize: wp(3.5),
        color: "#5E5E5E",
        textDecorationLine: 'underline',
        paddingTop: wp(2),
        paddingBottom: wp(1),
    },
    emptyViewForSpacingCardNLogo: {
        flex: 0.2
    },
    poweredByStripeRowContainer: {
        flex: 0.1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: wp(5),
    },
    textPoweredBy: {
        color: "#A2A2A4",
        fontSize: wp(2.8),
        // borderColor:"gray",
        // borderWidth:1
    },
    stripeLogoImage: {
        resizeMode: "contain",
        width: wp(15),
        height: wp(5),
        // borderColor:"gray",
        // borderWidth:1
    }

});

