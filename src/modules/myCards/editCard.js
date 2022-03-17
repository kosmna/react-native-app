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
import { fonts } from '../../styles';

export default class EditCard extends React.Component {
    static navigationOptions = {
        title: 'Edit Card'
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, height: wp(100), backgroundColor: '#FCFCFC' }}>
                <View style={styles.container}>
                    <View style={{}}>
                        <Text style={styles.label_text}>Name on Card</Text>
                        <TextInput
                            style={styles.name_input}
                            placeholder={'Enter name on the Card'}
                            fontStyle={styles.font_style}
                            autoCapitalize={'characters'}
                            keyboardType={'default'}
                            defaultValue={this.props.navigation.getParam('card_name')}
                        />
                    </View>
                    <View style={{ marginTop: hp(3) }}>
                        <Text style={styles.label_text}>Enter Card number</Text>
                        <TextInput
                            style={styles.name_input}
                            placeholder={'Enter Card number'}
                            autoCapitalize={'characters'}
                            keyboardType={'numeric'}
                            defaultValue={this.props.navigation.getParam('card_number')}
                        />
                    </View>
                    <View style={{ marginTop: hp(3) }}>
                        <Text style={styles.label_text}>Expire/Validity</Text>
                        <TextInput
                            style={{ ...styles.name_input, width: '50%' }}
                            placeholder={'MM/YY'}
                            autoCapitalize={'characters'}
                            keyboardType={'numeric'}
                            maxLength={5}
                            defaultValue={this.props.navigation.getParam('expiry')}
                        />
                    </View>
                    <LinearGradient colors={['#0093DD', '#005f8f']} style={styles.add_button}>
                        <TouchableOpacity>
                            <Text style={styles.save_card_text}>Save this Card</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: wp(10),
        paddingVertical: hp(3),
    },
    name_input: {
        width: '100%',
        height: hp(5),
        backgroundColor: 'white',
        fontFamily: fonts.primaryRegular,
        paddingHorizontal: wp(4),
    },
    label_text: {
        fontSize: wp(4),
        marginBottom: hp(1),
        color: '#515151',
        fontFamily: fonts.primaryRegular
    },
    add_button: {
        width: '100%',
        height: hp(5),
        marginTop: hp(10),
        borderRadius: hp(0.5)
    },
    save_card_text: {
        width: '100%',
        height: '100%',
        fontSize: wp(4),
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    }
})
