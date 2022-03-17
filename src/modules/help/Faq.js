import React from 'react'
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Text } from '../../components/StyledText'

export default class Faq extends React.Component {

    state = {
        expand: false
    }

    render() {
        return (
            <SafeAreaView style={{ width: '100%', paddingHorizontal: '5%', marginTop: hp(1), borderBottomWidth: 1, borderBottomColor: '#A2A2A4' }}>
                <TouchableOpacity
                    style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: hp(1) }}
                    onPress={() => {
                        this.setState({ expand: !this.state.expand })
                    }}>
                    <Text style={{ fontSize: wp(3.5) }}>{this.props.question}</Text>
                    <Image
                        source={this.state.expand ? require('../../../assets/images/profile/arrow_up.png') : require('../../../assets/images/profile/arrow_down.png')}
                        style={{ width: wp(3.5), height: wp(3.5), marginRight: wp(0) }}
                    />
                </TouchableOpacity>
                {this.state.expand && (
                    <View>
                        <Text style={{ fontSize: wp(3.5), marginVertical: hp(1), color: '#A2A2A4' }}>{this.props.answer}</Text>
                    </View>
                )}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({

})