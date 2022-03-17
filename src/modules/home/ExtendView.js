
import React from 'react'
import { Animated, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import { Text } from '../../components/StyledText'


class ExtendScreen extends React.Component {
    state = {
    };

    componentDidMount() {
        this.props.navigation.setParams({ userInfo: this.props.userInfo }) // Do not remove
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.container}>
                    <Animated.View style={[{ paddingTop: 10, width: '100%', marginLeft: 7, marginHorizontal: 7 }]}>
                        <Animated.View
                            style={[
                                { height: 33, width: '100%' },
                                { alignItems: 'center', justifyContent: 'space-between', flexDirection: "row", }
                            ]}
                        >
                            <TouchableOpacity
                                style={{ width: '20%' }}
                                onPress={() => this.props.navigation.goBack()}
                            >
                                <Image
                                    style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                                    source={require('../../../assets/images/category/back.png')}
                                />
                            </TouchableOpacity>
                            <View style={{ width: '60%', alignContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: wp(4), fontFamily: "Open Sans", color: "#000000", alignSelf: "center", fontWeight: "600", }}>
                                    More on Bookngogo
                    </Text>
                            </View>
                            <View style={{ width: '20%', justifyContent: 'flex-end' }} />
                        </Animated.View>
                    </Animated.View>
                    <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12.5, width: '100%' }} />
                    <View style={{ backgroundColor: "#FFFFFF" }}>
                        <TouchableOpacity
                            style={{ marginTop: 30, height: 22, marginBottom: 17, flexDirection: "row", marginLeft: 27 }}
                            onPress={() => this.props.navigation.navigate({
                                routeName: 'TripIdeas',
                                params: {},
                            })
                            }
                        >
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                    style={{ alignSelf: 'center', width: 21, height: 22, resizeMode: 'stretch' }}
                                    source={require('../../../assets/images/tabbar/trip_ideas.png')}
                                />
                            </View>
                            <View style={{ marginLeft: 47, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, color: '#5E5E5E' }}>Trip Ideas</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ width: '100%', height: 1, backgroundColor: '#CACCCF', opacity: 20 }} />
                        <TouchableOpacity
                            style={{ marginTop: 30, height: 22, marginBottom: 17, flexDirection: "row", marginLeft: 27 }}
                            onPress={() => this.props.navigation.navigate({
                                routeName: 'Event',
                                params: {},
                            })
                            }
                        >
                            <View style={{ justifyContent: 'center', width: 21, height: 19, alignItems: 'center' }}>
                                <Image
                                    style={{ alignSelf: 'center', width: 19, height: 19, resizeMode: 'stretch' }}
                                    source={require('../../../assets/images/event/calendar.png')}
                                />
                            </View>
                            <View style={{ marginLeft: 47, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 12, color: '#5E5E5E' }}>Event</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ width: '100%', height: 1, backgroundColor: '#CACCCF', opacity: 20 }} />
                        <TouchableOpacity
                            style={{ marginTop: 30, height: 22, marginBottom: 17, flexDirection: "row", marginLeft: 27 }}
                            onPress={() => this.props.navigation.navigate({
                                routeName: 'Help',
                                params: {},
                            })
                            }
                        >
                            <View style={{ justifyContent: 'center', width: 21, height: 19, alignItems: 'center' }}>
                                <Image
                                    style={{ alignSelf: 'center', width: 19, height: 19, resizeMode: 'stretch' }}
                                    source={require('../../../assets/images/tabbar/help.png')}
                                />
                            </View>
                            <View style={{ marginLeft: 47, justifyContent: 'center' }}>
                                <Text style={{ fontSize: wp(4), color: '#5E5E5E' }}>Help</Text>
                            </View>
                        </TouchableOpacity>
                        <View style={{ width: '100%', height: 1, marginTop: 20 }} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}


function mapStateToProps(state) {
    return {
        'userInfo': state.home.userInfo,
    }
}

export default connect(mapStateToProps)(ExtendScreen)


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    statusItem: {
        marginLeft: 0,
        height: 27,
        borderColor: '#0093DD',
        borderWidth: 1,
        justifyContent: 'center',
        color: '#0093DD'
    },
    statusItemFirst: {
        borderBottomLeftRadius: 4,
        borderTopLeftRadius: 4
    },
    statusItemLast: {
        borderBottomRightRadius: 4,
        borderTopRightRadius: 4
    },
    statusItemPrimary: {
        backgroundColor: '#007AFF'
    },
    statusText: {
        fontSize: 13,
        fontFamily: "Open Sans",
        color: '#0093DD',
        alignSelf: 'center'
    },
    statusTextPrimary: {
        color: '#FFFFFF'
    },
    Category: {
        marginLeft: 12,
        marginTop: 7,
        marginHorizontal: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        justifyContent: 'center',
        borderTopWidth: 0,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 2,
        borderColor: '#ddd',
        backgroundColor: "#FFFFFF",
        borderRadius: 4,
        height: 55
    },
})
