
import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
    ImageBackground
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Text } from '../../../components/StyledText';
import { fonts } from '../../../styles';

export default class GiftMyCardDetailScreen extends React.Component {
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
                <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center", }}>
                My gift cards: Amazon
                </Text>
              </View>
              <View style={{ width: '10%', justifyContent: 'flex-end' }} />
            </Animated.View>
          </Animated.View>
          <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 2, width: '100%' }} />
          <View style={{ backgroundColor: "#FFF" }}>
            <TouchableOpacity 
              style={{marginLeft: 17, marginHorizontal: 17, marginTop: 16, width: wp(100)-34, height: wp(40), borderRadius: 8, borderColor: '#cfcfcf', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 2}}
              onPress={() => this.props.navigation.navigate({
                                routeName: 'GiftMyCardMoreDetail',
                                params: {},
                            })
                      }
            >
              <View style={{height: wp(16), borderTopRightRadius: 8, borderTopLeftRadius: 8, backgroundColor: '#BCE9FF', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}>
                <View style={{flexDirection: 'row', marginLeft: wp(4), alignItems: 'center'}}>
                  <View style={{width: wp(9), height: wp(9), borderRadius: wp(4.5), backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      style={{ width: wp(3.5), height: wp(3), resizeMode: 'stretch' }}
                      source={require('../../../../assets/images/my_point/my_gift_card/gift-card.png')}
                    />
                  </View>
                  <Text style={{marginLeft: wp(2), color: '#6D6B6B', fontSize: 14, fontWeight: '600'}}>$ 650</Text>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center', marginHorizontal: 10}}>
                  <Image
                    style={{ width: wp(16), height: wp(12), resizeMode: 'stretch' }}
                    source={require('../../../../assets/images/my_point/my_gift_card/Amazon-logo.png')}
                  />
                </View>
              </View>
              <View style={{marginLeft: wp(4), marginHorizontal: wp(4), marginTop: wp(7.5), justifyContent: "space-between", flexDirection: 'row'}}>
                <View style={{justifyContent: 'flex-end'}}>
                  <Text style={{color: '#0193DD', fontSize: 12, }}>Expire</Text>
                  <Text style={{color: '#A2A2A4', fontSize: 12}}>04/11/19</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Text style={{color: '#A2A2A4', fontSize: 12, }}>Balance</Text>
                  <View style={{width: wp(20), borderRadius: wp(1.25), height: wp(1.25), backgroundColor: '#D6D6D6'}}>
                    <View style={{width: wp(9), borderRadius: wp(1.25), height: wp(1.25), backgroundColor: '#0193DD'}} />
                  </View>
                  <Text style={{color: '#0193DD', fontSize: 19, }}>$ 300</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{marginLeft: 17, marginHorizontal: 17, marginTop: 33, width: wp(100)-34, height: wp(40), borderRadius: 8, borderColor: '#cfcfcf', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 2}}
              onPress={() => this.props.navigation.navigate({
                                routeName: 'GiftMyCardMoreDetail',
                                params: {},
                            })
                      }
            >
              <ImageBackground 
                source={require('../../../../assets/images/my_point/bookngogo_gift_confirm/happy-birthday.png')}
                style={{height: wp(16), width: wp(100)-34, borderTopRightRadius: 8, borderTopLeftRadius: 8, backgroundColor: '#BCE9FF', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row'}}
                imageStyle={{ borderTopRightRadius: 8, borderTopLeftRadius: 8 }}
              >
                <View style={{flexDirection: 'row', marginLeft: wp(4), alignItems: 'center'}}>
                  <View style={{width: wp(9), height: wp(9), borderRadius: wp(4.5), backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      style={{ width: wp(3.5), height: wp(3), resizeMode: 'stretch' }}
                      source={require('../../../../assets/images/my_point/my_gift_card/gift-card.png')}
                    />
                  </View>
                  <Text style={{marginLeft: wp(2), color: '#6D6B6B', fontSize: 14, fontWeight: '600'}}>$ 650</Text>
                </View>
                <View style={{alignItems: 'center', justifyContent: 'center', marginHorizontal: 10}}>
                  <Image
                    style={{ width: wp(16), height: wp(12), resizeMode: 'stretch' }}
                    source={require('../../../../assets/images/my_point/my_gift_card/Amazon-logo.png')}
                  />
                </View>
              </ImageBackground>
              <View style={{marginLeft: wp(4), marginHorizontal: wp(4), marginTop: wp(7.5), justifyContent: "space-between", flexDirection: 'row'}}>
                <View style={{justifyContent: 'flex-end'}}>
                  <Text style={{color: '#0193DD', fontSize: 12, }}>Expire</Text>
                  <Text style={{color: '#A2A2A4', fontSize: 12}}>04/11/19</Text>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Text style={{color: '#A2A2A4', fontSize: 12, }}>Balance</Text>
                  <View style={{width: wp(20), borderRadius: wp(1.25), height: wp(1.25), backgroundColor: '#D6D6D6'}}>
                    <View style={{width: wp(20), borderRadius: wp(1.25), height: wp(1.25), backgroundColor: '#0193DD'}} />
                  </View>
                  <Text style={{color: '#A2A2A4', fontSize: 19, }}>$ 0</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
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
