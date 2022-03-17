
import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Text } from '../../../components/StyledText';


export default class LocalOrgListScreen extends React.Component {
    _renderLocalListViews() {
        const listViews = [];
        for (let i = 0; i < 10; i += 1) {
            listViews.push(
                <TouchableOpacity
                    key={i}
                    style={{
                        marginHorizontal: wp(4),
                        marginTop: 25,
                        borderRadius: wp(1),
                        elevation: wp(0.7),
                        backgroundColor: 'white'
                    }}
                    onPress={() => this.props.navigation.navigate('OrgDetail', {})}
                    activeOpacity={0.6}
                >
                    <View style={{ flexDirection: "row", marginLeft: 0, marginHorizontal: 10, paddingBottom: 12, paddingTop: 12 }}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <Image
                                style={{ marginLeft: 13, width: 89, height: 76, borderRadius: 4, alignSelf: "center", resizeMode: 'stretch' }}
                                source={require('../../../../assets/images/category/mc_donald.png')}
                            />
                            <View style={{ flex: 1, marginLeft: 21 }}>
                                <Text style={{ fontSize: 13, fontFamily: "Open Sans", color: '#6D6B6B', fontWeight: "600" }}> California Floods </Text>
                                <Text style={{ fontSize: 12, fontFamily: "Open Sans", color: '#6D6B6B', marginTop: 6 }}> Lorem Ipsum is simply dummy text of the printing and typesetting industry. </Text>
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
            );
        }

        return listViews;
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={[{ paddingTop: 10, width: '100%', marginLeft: 7, marginHorizontal: 7 }]}>
                    <View
                        style={[
                            { height: 40, width: '100%' },
                            { flexDirection: "row", justifyContent: 'space-between', alignItems: 'center' }
                        ]}
                    >
                        <View style={{ width: '15%' }}>
                            <TouchableOpacity
                                style={{ width: '100%' }}
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Image
                                    style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                                    source={require('../../../../assets/images/category/back.png')}
                                />
                            </TouchableOpacity>
                        </View>
                        <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center', paddingTop: 5 }}>
                            <Text style={{ fontSize: 14, fontFamily: "Open Sans", fontWeight: '600', color: "#5E5E5E" }}>Local</Text>
                        </View>
                        <View
                            style={{ width: '15%' }}
                        />
                    </View>
                </View>

                <View style={{ backgroundColor: "#00000036", height: 0.5, marginTop: 0, width: '100%' }} />

                <View style={{ marginHorizontal: 26, marginTop: 15, height: 37, borderRadius: 10, backgroundColor: '#8E8E931A', opacity: 0.4, alignItems: 'center', flexDirection: 'row' }}>
                    <Image
                        style={{ marginLeft: 20, width: 14, height: 14, resizeMode: 'contain' }}
                        source={require('../../../../assets/images/category/search.png')}
                        tintColor='#0093DD'
                    />
                    <TextInput
                        style={{ marginLeft: 14 }}
                    />
                </View>

                <ScrollView
                    style={[styles.container]}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    {this._renderLocalListViews()}
                </ScrollView>
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
});