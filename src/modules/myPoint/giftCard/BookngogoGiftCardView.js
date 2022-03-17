
import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import CircleCheckBox, { LABEL_POSITION } from 'react-native-circle-checkbox'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { TextInput } from '../../../components'
import { Text } from '../../../components/StyledText'
import { fonts } from '../../../styles'


export default class BookngogoGiftCardScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: () => {
                return (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginRight: wp(18) }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                style={{ alignSelf: 'flex-end', width: 138, height: 38, resizeMode: 'stretch' }}
                                source={require('../../../../assets/images/my_point/gift_card/booknGOGO.png')}
                            />
                            <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center", }}>
                                Gift Card
                          </Text>
                        </View>
                    </View>
                )
            }
        }
    }

    state = {
        tabIndex: 0,
        buyingType: 0,
        recipientName: "",
        recipientMail: "",
        confirmRecipientMail: "",
        to: "",
        cardData: this.props.navigation.getParam('cardData'),
        activeDenominationIndex: 0,
    };

    tabStyle(index) {
        if (index === this.state.tabIndex)
            return styles.statusItemPrimary
        return {}
    }

    tabTextStyle(index) {
        if (index === this.state.tabIndex)
            return styles.statusTextPrimary
        return {}
    }

    _renderDenomination() {
        const denominationViews = []
        for (let i = 0; i < this.state.cardData.value_restriction_list.length; i++) {
            if (i === this.state.activeDenominationIndex) {
                denominationViews.push(
                    <View key={'denominationView' + i} style={{ borderRadius: 4, marginLeft: 22, backgroundColor: '#00A4F6', width: wp(18), height: wp(8), justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: wp(4), color: "#FFFFFF", }}>
                            {this.state.cardData.value_restriction_list[i].value}
                        </Text>
                    </View>
                )
            }
            else {
                denominationViews.push(
                    <TouchableOpacity
                        key={'denominationView' + i}
                        onPress={() => this.setState({ activeDenominationIndex: i })} >
                        <View style={{ borderRadius: 4, marginLeft: 22, backgroundColor: '#FFFFFF', borderColor: '#F2F2F2', borderWidth: 1, width: wp(18), height: wp(8), justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: wp(4), color: "#00A4F6", }}>
                                {this.state.cardData.value_restriction_list[i].value}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        }

        return denominationViews
    }

    _nextButtonClicked() {
        if (this.state.buyingType === 1) {
            if (this.state.recipientName === '') {
                alert('Please enter recipient name')
                return
            }

            if (this.state.recipientMail === '') {
                alert('Please enter recipient email')
                return
            }

            if (this.state.confirmRecipientMail !== this.state.recipientMail) {
                alert('Please confirm recipient email')
                return
            }

            if (this.state.to === '') {
                alert('Please enter message')
                return
            }
        }

        this.props.navigation.navigate({
            routeName: 'BookngogoGiftCardConfirm',
            params: {
                cardData: this.state.cardData,
                activeIndex: this.state.activeDenominationIndex,
                userInfo: this.props.navigation.getParam('userInfo'),
                recipientMail: (this.state.buyingType === 0) ? this.props.navigation.getParam('userInfo').partner_email : this.state.recipientMail,
                recipientName: (this.state.buyingType === 0) ? this.props.navigation.getParam('userInfo').partner_name : this.state.recipientName,
                message: (this.state.buyingType === 0) ? 'Enjoy your giftcard' : this.state.to,
                buyingType: this.state.buyingType
            },
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={{ flex: 1 }}>

                    <View style={{ width: '100%', borderRadius: 4, paddingHorizontal: 22, paddingVertical: 22 }}>
                        <Image
                            style={{ width: '100%', height: 161, resizeMode: 'cover' }}
                            source={{ uri: this.state.cardData.logo_url }}
                        />
                    </View>
                    <View style={{ backgroundColor: "#FFF" }}>
                        <View style={{ marginTop: 14, marginLeft: 22, marginHorizontal: 22, flexDirection: 'row', height: 20 }}>
                            <Text style={{ fontSize: 15, fontFamily: fonts.primaryRegular, color: "#515151", }}>Denomination</Text>
                        </View>
                        <View style={{ marginTop: 9, flexDirection: 'row' }}>
                            {this._renderDenomination()}
                        </View>

                        {(this.state.activeDenominationIndex >= 0 && this.state.cardData !== null) && (
                            <View style={{ marginTop: 13, marginLeft: 22, marginHorizontal: 22 }}>
                                <Text style={{ fontSize: 15, color: "#0193DD", }}>
                                    {'Price: $' + this.state.cardData.value_restriction_list[this.state.activeDenominationIndex].price}
                                </Text>
                            </View>
                        )}

                        {((this.state.cardData.term_condition_name !== '')) && (
                            <View>
                                <View style={{ marginTop: 10, marginLeft: 22, marginHorizontal: 22 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '600', color: "#464646", textDecorationLine: 'underline' }}>Terms & Condition</Text>
                                </View>
                                <View style={{ marginTop: 7, marginLeft: 22, marginHorizontal: 22, flexDirection: 'row' }}>
                                    <View style={{ width: 5, height: 5, marginTop: 6, borderRadius: 2.5, backgroundColor: '#5A5050' }} />
                                    <Text style={{ marginLeft: 2, fontSize: 12, fontFamily: fonts.primaryRegular, color: "#464646", }}>
                                        {this.state.cardData.term_condition_name}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                    <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 18, width: '100%' }} />
                    <View style={{ marginTop: 7, marginLeft: 25, marginHorizontal: 25, flexDirection: 'row' }}>
                        <View style={{ flex: 0.5 }}>
                            <CircleCheckBox
                                checked={this.state.buyingType === 0}
                                outerSize={13}
                                innerSize={6}
                                outerColor='#707070'
                                innerColor='#707070'
                                onToggle={() => { this.setState({ buyingType: 0 }) }}
                                styleCheckboxContainer={{ width: wp(40), height: 16, marginTop: 4, backgroundColor: '#00000000' }}
                                labelPosition={LABEL_POSITION.RIGHT}
                                label="Buying for yourself"
                            />
                        </View>
                        <View style={{ flex: 0.5 }}>
                            <CircleCheckBox
                                checked={this.state.buyingType === 1}
                                outerSize={13}
                                innerSize={6}
                                outerColor='#707070'
                                innerColor='#707070'
                                onToggle={() => { this.setState({ buyingType: 1 }) }}
                                styleCheckboxContainer={{ width: wp(40), height: 16, marginTop: 4, backgroundColor: '#00000000' }}
                                labelPosition={LABEL_POSITION.RIGHT}
                                label="Buying for someone"
                            />
                        </View>
                    </View>
                    {(this.state.buyingType === 1) && (
                        <View>
                            <View style={{ marginTop: 26, marginLeft: 25, marginHorizontal: 25 }}>
                                <Text style={{ fontSize: 13, color: "#515151", }}>Recipient name</Text>
                                <TextInput
                                    placeholder=""
                                    style={[styles.textInput, { width: wp(75) }]}
                                    autoCorrect={false}
                                    placeholderTextColor="#6D6D6D"
                                    value={this.state.recipientName}
                                    onChangeText={(recipientName) => this.setState({ recipientName })}
                                />
                                <View style={{ backgroundColor: "#CACCCF", height: 2, marginTop: 0, width: wp(75) }} />
                            </View>
                            <View style={{ marginTop: 26, marginLeft: 25, marginHorizontal: 25 }}>
                                <Text style={{ fontSize: 13, color: "#515151", }}>Recipient email</Text>
                                <TextInput
                                    placeholder=""
                                    style={[styles.textInput, { width: wp(75) }]}
                                    autoCorrect={false}
                                    placeholderTextColor="#6D6D6D"
                                    value={this.state.recipientMail}
                                    onChangeText={(recipientMail) => this.setState({ recipientMail })}
                                />
                                <View style={{ backgroundColor: "#CACCCF", height: 2, marginTop: 0, width: wp(75) }} />
                            </View>
                            <View style={{ marginTop: 23, marginLeft: 25, marginHorizontal: 25 }}>
                                <Text style={{ fontSize: 13, color: "#515151", }}>Confirm recipient email</Text>
                                <TextInput
                                    placeholder=""
                                    style={[styles.textInput, { width: wp(75) }]}
                                    autoCorrect={false}
                                    placeholderTextColor="#6D6D6D"
                                    value={this.state.confirmRecipientMail}
                                    onChangeText={(confirmRecipientMail) => this.setState({ confirmRecipientMail })}
                                />
                                <View style={{ backgroundColor: "#CACCCF", height: 2, marginTop: 0, width: wp(75) }} />
                            </View>
                            <View style={{ marginTop: 23, marginLeft: 25, marginHorizontal: 25 }}>
                                <Text style={{ fontSize: 13, color: "#515151", }}>Message</Text>
                                <TextInput
                                    placeholder=""
                                    style={[styles.textInput, { width: wp(75), height: hp(15) }]}
                                    autoCorrect={false}
                                    multiline={true}
                                    placeholderTextColor="#6D6D6D"
                                    value={this.state.to}
                                    onChangeText={(to) => this.setState({ to })}
                                />
                                <View style={{ backgroundColor: "#CACCCF", height: 2, marginTop: 0, width: wp(75) }} />
                            </View>
                        </View>
                    )}
                </ScrollView>
                <TouchableOpacity
                    style={{ flex: 0.1, backgroundColor: '#0093DD', width: '100%', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => this._nextButtonClicked()}
                >
                    <Text style={{ fontSize: 18, color: "#FCFEFF", fontWeight: '600' }}>Next</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

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
        fontFamily: fonts.primaryRegular,
        color: '#0093DD',
        alignSelf: 'center'
    },
    statusTextPrimary: {
        color: '#FFFFFF'
    },
    textInput: {
        alignSelf: 'stretch',
        width: '100%',
        marginTop: 2,
        color: '#7A7C80',
        fontSize: wp(4.5)
    },
})
