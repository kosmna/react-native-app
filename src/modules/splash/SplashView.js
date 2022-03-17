import React from 'react'
import { Animated, Image, Platform, StyleSheet, Text, View } from 'react-native'

export default class SplashScreen extends React.Component {
    state = {
        anim: new Animated.Value(100),
    }

    async componentDidMount() {
        Animated.timing(this.state.anim, { toValue: 3000, duration: 500 }).start()
        const data = await this.performTimeConsumingTask()
        if (data !== null) {
            if (this.props.userInfo == null) {
                this.props.navigation.navigate('InitialAuth')
            }
            else {
                this.props.navigation.navigate('App')
            }
        }
    }

    performTimeConsumingTask = async () => {
        return new Promise((resolve) =>
            setTimeout(
                () => { resolve('result') },
                1000
            )
        )
    }

    fadeIn(delay, from = 0) {
        const { anim } = this.state
        return {
            opacity: anim.interpolate({
                inputRange: [delay, Math.min(delay + 500, 3000)],
                outputRange: [0, 1],
                extrapolate: 'clamp',
            }),
            transform: [
                {
                    translateY: anim.interpolate({
                        inputRange: [delay, Math.min(delay + 500, 3000)],
                        outputRange: [from, 0],
                        extrapolate: 'clamp',
                    }),
                },
            ],
        }
    }

    render() {
        return (
            <View
                style={styles.background}
                resizeMode="cover"
            >
                <View style={styles.container}>
                    <View style={[styles.section, { paddingTop: 60 }]}>
                        <Animated.Image
                            resizeMode="contain"
                            style={[
                                { height: 72 },
                                this.fadeIn(0),
                            ]}
                            source={require('../../../assets/images/booknGOGO.png')}
                        />
                    </View>

                    <Animated.View
                        style={[styles.section, styles.bottom, this.fadeIn(700, -20)]}
                    >
                        <Animated.View
                            style={[styles.section, styles.middle, this.fadeIn(700, -20)]}
                        >
                            <View style={styles.socialLoginContainer}>
                                <View style={styles.socialButtonCenter}>
                                    <Image
                                        style={styles.rewardsButton}
                                        source={require('../../../assets/images/book_trips.png')}
                                    />
                                    <Text style={styles.itemText}>Book</Text>
                                    <Text style={styles.itemTextNext}>Trip</Text>
                                </View>
                                <View style={styles.socialButtonCenter}>
                                    <Image
                                        style={styles.rewardsButton}
                                        source={require('../../../assets/images/earn_rewards.png')}
                                    />
                                    <Text style={styles.itemText}>Earn Instant</Text>
                                    <Text style={styles.itemTextNext}>Rewards</Text>
                                </View>
                                <View style={styles.socialButtonCenter}>
                                    <Image
                                        style={styles.rewardsButton}
                                        source={require('../../../assets/images/redeem_into_cash.png')}
                                    />
                                    <Text style={styles.itemText}>Redeem or</Text>
                                    <Text style={styles.itemTextNext}>Convert to Cash</Text>
                                </View>
                            </View>
                        </Animated.View>
                    </Animated.View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 40,
    },
    background: {
        flex: 1,
    },
    section: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    middle: {
        flex: 2,
        justifyContent: 'flex-start',
        alignSelf: 'stretch',
    },
    bottom: {
        flex: 1,
        alignSelf: 'stretch',
        paddingBottom: Platform.OS === 'android' ? 30 : 0,
    },
    socialLoginContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    socialButton: {
        flex: 1,
    },
    rewardsButton: {
        width: 40,
        height: 40,
        resizeMode: 'stretch'
    },
    socialButtonCenter: {
        width: '30%',
        alignItems: 'center',
        textAlign: 'center'
    },
    itemText: {
        color: "#7A7C80",
        marginTop: 15,
        fontSize: 14,
        textAlign: "center"
    },
    itemTextNext: {
        color: "#7A7C80",
        marginTop: 2,
        fontSize: 14,
        textAlign: "center"
    }
})
