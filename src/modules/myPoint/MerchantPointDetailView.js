import moment from 'moment'
import React from 'react'
import { Image, ScrollView, StyleSheet, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Text } from '../../components/StyledText'
import { fonts } from '../../styles'


export default class MerchantPointDetailScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: wp(8) }}>
                        <Image
                            style={{ height: wp(10), width: wp(40), resizeMode: 'contain' }}
                            source={{ uri: navigation.getParam('outlet_data').points[0].logo.replace('http://', 'https://') }}
                        />
                    </View>
                )
            }
        }
    }

    state = {
        outlet_data: this.props.navigation.getParam('outlet_data'),
        transaction_list: this.props.navigation.getParam('outlet_data').points.filter(obj => obj.points_type === 'gogo')
    };

    render_transaction_list = () => {
        let return_data = []
        this.state.transaction_list.forEach((transaction) => {

            let transaction_date = moment(transaction.transaction_date)

            return_data.push(
                <View key={transaction.id} style={{ ...styles.Transaction, borderLeftColor: transaction.border }}>
                    <View style={{ flexDirection: "row", marginLeft: 0, marginHorizontal: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flexDirection: "row", alignItems: 'flex-start' }}>
                            <Text style={{ marginLeft: 29, width: 30, marginTop: 0, fontSize: 15, fontFamily: fonts.primaryRegular, color: '#8E8888' }}>{transaction_date.format("Do")}{'\n'}{transaction_date.format("MMM")}</Text>
                            <Text style={{ marginLeft: 23, marginTop: 0, fontSize: 13, width: wp(45), fontFamily: fonts.primaryRegular }}>
                                <Text style={{ color: '#BFBCBC' }}>{transaction.booking_id}</Text>
                                <Text style={{ color: '#040404' }}>{'\n'}{transaction.description}</Text>
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", width: wp(12), height: 54, justifyContent: 'center' }}>
                            <Text style={{ alignSelf: 'center', fontSize: 15, fontFamily: fonts.primarySemiBold, color: '#333131', justifyContent: 'center' }}>{transaction.balance}</Text>
                        </View>
                    </View>
                </View>
            )
        })
        return return_data
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={{ backgroundColor: "#FCFCFC", paddingTop: hp(3) }}>
                    <View style={[{ marginTop: 11, marginBottom: 4, marginLeft: 35, justifyContent: 'center' }]}>
                        <Text style={{ fontSize: 14, fontFamily: fonts.primaryRegular, color: "#7A7C80", }}>Balance</Text>
                    </View>
                    <View style={[{ marginLeft: 20, marginHorizontal: 30, justifyContent: 'space-between', flexDirection: 'row' }]}>
                        <Image
                            style={{ width: 173, height: 48, resizeMode: 'contain' }}
                            source={{ uri: this.state.outlet_data.points[0].logo.replace('http://', 'https://') }}
                        />
                        <Text style={{ fontSize: 20, fontFamily: fonts.primarySemiBold, color: "#7A7C80" }}>{this.state.outlet_data.total_gogo}</Text>
                    </View>
                    <View style={{ backgroundColor: "#C6C6C6", height: 1, marginTop: 4.5, width: '100%' }} />
                    <View style={{ flexDirection: "row", marginLeft: 0, marginTop: 10, height: 25, marginHorizontal: 24, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ marginLeft: 45, width: 35, fontSize: 15, fontFamily: fonts.primaryRegular, color: '#8E8888' }}>Date</Text>
                            <Text style={{ marginLeft: 19, fontSize: 15, fontFamily: fonts.primaryRegular, color: '#8E8888' }}>Booking Reference</Text>
                        </View>
                        <View style={{ flexDirection: "row-reverse", flex: 1 }}>
                            <Text style={{ fontSize: 15, fontFamily: fonts.primaryRegular, color: '#8E8888' }}>$$</Text>
                        </View>
                    </View>

                    {this.render_transaction_list()}

                    <View style={{ height: 10 }} />
                </View>
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    Transaction: {
        marginLeft: 14,
        marginTop: 7,
        marginHorizontal: 14,
        justifyContent: 'center',
        borderLeftColor: '#38DE3D',
        borderLeftWidth: 7,
        borderRightWidth: 1,
        borderBottomWidth: 2,
        borderRightColor: '#ddd',
        borderBottomColor: '#ddd',
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        height: 67,
    },
})
