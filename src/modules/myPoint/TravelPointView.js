import moment from 'moment'
import React from 'react'
import { ScrollView, StyleSheet, View, Image } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Text } from '../../components/StyledText'
import { fonts } from '../../styles'

export default class TravelPointScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('type') === 'gogo' ? 'GoGoCard $' : 'Travel $'
        }
    }

    state = {
        outlet_data: this.props.navigation.getParam('outlet_data'),
        type: this.props.navigation.getParam('type')
    };

    render() {

        let transaction_list = []
        for (const key in this.state.outlet_data) {

            this.state.outlet_data[key].points.forEach((transaction) => {

                if (this.state.type != transaction.points_type)
                    return

                let transaction_date = moment(transaction.transaction_date)
                transaction_list.push(
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
        }

        if (transaction_list.length === 0)
            transaction_list.push(
                <View key="no-transactions" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: hp(10) }}>
                    <Text style={{ fontSize: wp(3.5), textAlign: 'center' }}>No Transactions yet</Text>
                </View>
            )

        return (
            <ScrollView style={styles.container}>
                <View style={{ paddingTop: hp(3) }}>

                    <View style={{ display: 'flex', flexDirection: 'row', marginBottom: hp(3), marginHorizontal: wp(10) }}>
                        <Text style={{ fontSize: wp(4.5), fontWeight: 'bold' }}>Balance</Text>
                        <Text style={{ fontSize: wp(4.5), fontWeight: 'bold', marginLeft: wp(10) }}>{'$' + this.props.navigation.getParam('balance', 0)}</Text>
                    </View>

                    <View style={{ backgroundColor: "#C6C6C6", height: 1, width: '100%' }} />


                    <View style={{ flexDirection: "row", marginLeft: 0, marginTop: 10, height: 25, marginHorizontal: 24, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ marginLeft: 45, width: 35, fontSize: 15, fontFamily: fonts.primaryRegular, color: '#8E8888' }}>Date</Text>
                            <Text style={{ marginLeft: 19, fontSize: 15, fontFamily: fonts.primaryRegular, color: '#8E8888' }}>Booking Reference</Text>
                        </View>
                        <View style={{ flexDirection: "row-reverse", flex: 1 }}>
                            <Text style={{ fontSize: 15, fontFamily: fonts.primaryRegular, color: '#8E8888', marginRight: wp(3) }}>$$</Text>
                        </View>
                    </View>

                    {transaction_list}

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
