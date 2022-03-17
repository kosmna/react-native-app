
import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Text } from '../../../components/StyledText';
import { fonts } from '../../../styles';

export default class GiftMyCardMoreDetailScreen extends React.Component {
    state = {
    };

    render() {
      return (
        <ScrollView style={styles.container}>
          <Animated.View style={[{ paddingTop: 10, width: '100%', marginLeft: 7, marginHorizontal: 7 }]}>
            <Animated.View
              style={[
                          { height: 44, width: '100%' },
                          { alignItems: 'center', justifyContent: 'space-between', flexDirection: "row", }
                      ]}
            >
              <TouchableOpacity
                style={{ width: '10%' }}
                onPress={() => this.props.navigation.goBack()}
              >
                <Image
                  style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                  source={require('../../../../assets/images/category/back.png')}
                />
              </TouchableOpacity>
              <View style={{ width: '80%', alignContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                Amazon
                </Text>
              </View>
              <View style={{ width: '10%', justifyContent: 'flex-end' }} />
            </Animated.View>
          </Animated.View>
          <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 2, width: '100%' }} />
          <View style={{ backgroundColor: "#FFF" }}>
            <View style={{backgroundColor: '#23B6FF', borderBottomLeftRadius: 4, borderBottomRightRadius: 4, height: 227}}>
              <View style={{marginTop: 30, flexDirection: "row", marginLeft: 13, marginHorizontal: 13, justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: 36, height: 36, borderRadius: 18, backgroundColor: '#94D5FE', alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      style={{ width: wp(3.5), height: wp(3), resizeMode: 'stretch' }}
                      source={require('../../../../assets/images/my_point/my_gift_card/gift-card.png')}
                    />
                  </View>
                  <View style={{marginLeft: 12}}>
                    <Text style={{fontSize: 12, color: '#043046'}}>Received from</Text>
                    <Text style={{fontSize: 13, color: '#FFFFFF'}}>James</Text>
                    <Text style={{marginTop: 7, fontSize: 12, color: '#043046'}}>Message</Text>
                    <Text style={{fontSize: 13, color: '#FFFFFF'}}>Enjoy your gift</Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <Text style={{fontSize: 12, color: '#043046'}}>Issued</Text>
                    <Text style={{fontSize: 13, color: '#FFFFFF'}}>02/03/19</Text>
                    <Text style={{marginTop: 7, fontSize: 12, color: '#043046'}}>Value</Text>
                    <Text style={{fontSize: 15, fontWeight: '600', color: '#FFFFFF'}}>$ 650</Text>
                    <Text style={{marginTop: 7, fontSize: 12, color: '#043046'}}>Balance</Text>
                    <Text style={{fontSize: 19, color: '#FFFFFF'}}>$ 300</Text>
                  </View>
                  <View style={{marginLeft: 12}}>
                    <Text style={{fontSize: 12, color: '#043046'}}>Expire</Text>
                    <Text style={{fontSize: 13, color: '#FFFFFF'}}>04/11/19</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{marginTop: -43, borderRadius: 8, justifyContent: 'center', marginLeft: 14, marginHorizontal: 14, width: wp(100)-28, height: 145, backgroundColor: '#FFFFFF', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 2, borderColor: '#C5C5C5'}}>
              <View style={{marginLeft: 40, marginHorizontal: 40, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <Image
                    style={{ width: 100, height: 100, resizeMode: 'stretch' }}
                    source={require('../../../../assets/images/my_point/gift_card/drupal-project-barcodes.png')}
                  />
                </View>
                <View style={{justifyContent: 'center'}}>
                  <Text style={{fontSize: 13, color: '#6D6B6B'}}>Serial No.</Text>
                  <Text style={{fontSize: 16, color: '#0193DD'}}>4785dhf8de</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ backgroundColor: "#C6C6C6", height: 3, marginTop: 26, width: '100%', borderRadius: 1.5}} />
          <View style={{marginLeft: 27, marginTop: 14}}>
            <Text style={{fontSize: 12, fontWeight: '600', color: '#6D6B6B'}}>
            Transaction
            </Text>
          </View>
          <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 8, width: '100%', borderRadius: 1}} />
          <View style={{marginTop: 14.5, marginLeft: 22.5, flexDirection: 'row', justifyContent:'space-between', marginHorizontal: 40, height: 70}}>
            <View>
              <Text style={{fontSize: 12, color: '#6D6B6B'}}>12 Nov 2019</Text>
              <Text style={{marginTop: 7, fontSize: 12, color: '#6D6B6B'}}>Reference Order No.</Text>
              <Text style={{fontSize: 12, color: '#6D6B6B'}}>1245677.</Text>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#6D6B6B', fontWeight: '600'}}>- $50</Text>
            </View>
          </View>
          <View style={{marginTop: 12.5, borderWidth: 1, borderColor: '#CACCCF', width: '100%'}} />
          <View style={{marginTop: 14.5, marginLeft: 22.5, flexDirection: 'row', justifyContent:'space-between', marginHorizontal: 40, height: 70}}>
            <View>
              <Text style={{fontSize: 12, color: '#6D6B6B'}}>12 Nov 2019</Text>
              <Text style={{marginTop: 7, fontSize: 12, color: '#6D6B6B'}}>Reference Order No.</Text>
              <Text style={{fontSize: 12, color: '#6D6B6B'}}>1245677.</Text>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#6D6B6B', fontWeight: '600'}}>- $50</Text>
            </View>
          </View>
          <View style={{marginTop: 12.5, borderWidth: 1, borderColor: '#CACCCF', width: '100%'}} />
          <View style={{marginTop: 14.5, marginLeft: 22.5, flexDirection: 'row', justifyContent:'space-between', marginHorizontal: 40, height: 70}}>
            <View>
              <Text style={{fontSize: 12, color: '#6D6B6B'}}>12 Nov 2019</Text>
              <Text style={{marginTop: 7, fontSize: 12, color: '#6D6B6B'}}>Reference Order No.</Text>
              <Text style={{fontSize: 12, color: '#6D6B6B'}}>1245677.</Text>
            </View>
            <View>
              <Text style={{fontSize: 12, color: '#6D6B6B', fontWeight: '600'}}>- $50</Text>
            </View>
          </View>
          <View style={{marginTop: 12.5, borderWidth: 1, borderColor: '#CACCCF', width: '100%'}} />
          <View style={{marginTop: 30}} />
        </ScrollView>
      );
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
});
