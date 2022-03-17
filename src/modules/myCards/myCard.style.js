import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default StyleSheet.create({
    card_text: {
        fontSize: wp(4),
        marginLeft: wp(4),
        textAlignVertical: 'bottom',
        color: '#787474',
        marginBottom: hp(1),
        fontWeight: 'bold'
    },
    gogo_card_number_container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "white",
        elevation: 3,
        paddingHorizontal: wp(6),
        paddingVertical: hp(3),
        marginTop: hp(2)
    }
});
