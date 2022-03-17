import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
    Alert,
    TextInput
} from 'react-native';

import { Text } from '../../components/StyledText';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

export default class GogoCard extends React.Component {
    static navigationOptions = {
        title: 'Gogo Card'
    }

    render() {
        return (
            // ScrollView Container
            <ScrollView style={{ flex: 1, height: hp(100), backgroundColor: '#FCFCFC', paddingHorizontal: wp(5) }}>

                {/* Gogo card is here banner */}
                <View style={{ flex: 1, alignItems: 'center', marginTop: hp(2), borderRadius: wp(1) }}>
                    <Image
                        source={require('../../../assets/images/myCards/gogo_card_banner.png')}
                        style={{ width: wp(90), height: wp(23) }}
                    />
                </View>

                {/* Benefits */}
                <View style={{ marginVertical: hp(3), marginHorizontal: wp(3) }}>

                    <Text style={{ fontSize: wp(5), fontWeight: 'bold', color: '#0093DD', marginVertical: hp(2) }}>Benefits</Text>

                    <Text style={{ fontSize: wp(3.5), fontWeight: 'bold' }}>UNLIMITED REWARDS </Text>
                    <Text> Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs.</Text>

                    <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', marginTop: hp(2) }}>"0" ANNUAL FEE</Text>
                    <Text>The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled</Text>

                    <Text style={{ fontSize: wp(3.5), fontWeight: 'bold', marginTop: hp(2) }}>BONUS OFFER</Text>
                    <Text> parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book</Text>
                </View>

                {/* Get yours */}
                <TouchableOpacity
                    style={{ marginVertical: hp(3), height: hp(8), width: '100%', backgroundColor: 'white', elevation: 2 }}
                    onPress={() => {
                        this.props.navigation.navigate('GogoCardApply');
                    }}
                >
                    <Text style={{ textAlign: 'center', textAlignVertical: 'center', height: '100%', fontSize: wp(4.4), color: '#0093DD', fontWeight: 'bold' }}>Get yours</Text>
                </TouchableOpacity>

            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({

})
