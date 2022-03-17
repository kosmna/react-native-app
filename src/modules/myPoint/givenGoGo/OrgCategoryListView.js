
import React from 'react'
import {
    StyleSheet,
    View,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    FlatList
} from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Text } from '../../../components/StyledText'


export default class OrgCategoryListScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        let category = navigation.getParam('category_selected', undefined)
        return {
            title: category ? category.category_name : 'Near Me'
        }
    }

    state = {
        userInfo: this.props.navigation.getParam('userInfo'),
        partner_id: this.props.navigation.getParam('userInfo').partner_id,
        partner_referral_code: this.props.navigation.getParam('userInfo').partner_referral_code,
        category_selected: this.props.navigation.getParam('category_selected', undefined),
        merchant_list: JSON.parse(JSON.stringify(this.props.navigation.getParam('merchant_list'))),
        original_merchant_list: JSON.parse(JSON.stringify(this.props.navigation.getParam('merchant_list')))
    }

    render_merchant_list = (item) => {
        let merchant = item.item

        return (
            <TouchableOpacity
                style={{
                    marginHorizontal: wp(4),
                    marginVertical: hp(1),
                    borderRadius: wp(1),
                    elevation: wp(0.7),
                    backgroundColor: 'white'
                }}
                onPress={() => this.props.navigation.navigate('OrgDetail',
                    { userInfo: this.state.userInfo, merchant: merchant }
                )}
                activeOpacity={0.6}
            >
                <View style={{ flexDirection: "row", marginLeft: 0, marginHorizontal: 10, paddingBottom: 12, paddingTop: 12 }}>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                        <Image
                            style={{ marginLeft: 13, width: 89, height: 76, borderRadius: 4, alignSelf: "center", resizeMode: 'stretch' }}
                            source={{ uri: merchant.image_url }}
                        />
                        <View style={{ flex: 1, marginLeft: 21 }}>
                            <Text style={{ fontSize: 13, fontFamily: "Open Sans", color: '#6D6B6B', fontWeight: "600" }}>{merchant.merchant_name}</Text>
                            <Text numberOfLines={4} style={{ fontSize: 12, fontFamily: "Open Sans", color: '#6D6B6B', marginTop: 6 }}>{merchant.description}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', width: 25, flexDirection: 'row', marginLeft: 7 }}>
                        <Image
                            style={{ alignSelf: 'center', width: 5, height: 10, resizeMode: 'stretch' }}
                            source={require('../../../../assets/images/home/arrow.png')}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        )

    }

    render() {
        return (
            <SafeAreaView style={styles.container}>

                <View style={{ marginHorizontal: wp(8), marginVertical: hp(3), height: hp(6), borderRadius: wp(1), backgroundColor: '#8E8E931A', alignItems: 'center', flexDirection: 'row' }}>
                    <Image
                        style={{ flex: 0.1, marginLeft: wp(3), width: wp(4), height: wp(4), resizeMode: 'contain' }}
                        source={require('../../../../assets/images/category/search.png')}
                        tintColor='#0093DD'
                    />
                    <TextInput
                        style={{ flex: 0.9 }}
                        placeholder={'Search for Organizations here'}
                        onChangeText={search_text => this.setState({ merchant_list: this.state.original_merchant_list.filter(item => item.merchant_name.includes(search_text)) }, () => console.warn(this.state))}
                    />
                </View>

                <ScrollView
                    style={{ ...styles.container }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ paddingBottom: hp(2) }}>
                        <FlatList
                            data={this.state.merchant_list}
                            renderItem={this.render_merchant_list}
                            keyExtractor={merchant => merchant.merchant_id.toString()}
                        />
                        {(this.state.merchant_list.length == 0) &&
                            <View key="no-merchant" style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: hp(10) }}>
                                <Text style={{ fontSize: wp(3.5), textAlign: 'center' }}>No Organizations Near You</Text>
                            </View>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
})