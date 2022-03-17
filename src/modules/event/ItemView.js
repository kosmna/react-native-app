
import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Text } from '../../components/StyledText';
import { fonts } from '../../styles';

export default class ItemScreen extends React.Component {
    state = {
    };

    componentDidMount(){
    }
    
    render() {
        return (
          <SafeAreaView style={styles.container}>
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
                    source={require('../../../assets/images/category/back.png')}
                  />
                </TouchableOpacity>
                <View style={{ width: '80%', alignContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                  Universal Studio
                  </Text>
                </View>
                <View style={{ width: '10%', justifyContent: 'flex-end' }} />
              </Animated.View>
            </Animated.View>
            <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12.5, width: '100%' }} />
            <ScrollView style={styles.container}>
              <View style={{ backgroundColor: "#FCFCFC" }}>
                <Image
                  style={{ width: wp(95), height: wp(42), marginLeft: wp(2.5), marginTop: wp(2.5), marginHorizontal: wp(2.5), resizeMode: 'stretch', borderRadius: wp(1) }}
                  source={require('../../../assets/images/event/event_banner.png')}
                />
                <View style={{ marginLeft: wp(2.5), marginHorizontal: wp(2.5), marginTop: wp(1.5), width: '100%' }}>
                  <ScrollView style={{ flexDirection: "row" }} horizontal>
                    <Image
                      style={{ width: wp(22), height: wp(17), }}
                      source={require('../../../assets/images/event/event_icon1.png')}
                    />
                    <Image
                      style={{ width: wp(22), height: wp(17), marginLeft: wp(2)}}
                      source={require('../../../assets/images/event/event_icon2.png')}
                    />
                    <Image
                      style={{ width: wp(22), height: wp(17), marginLeft: wp(2)}}
                      source={require('../../../assets/images/event/event_icon3.png')}
                    />
                    <Image
                      style={{ width: wp(22), height: wp(17), marginLeft: wp(2)}}
                      source={require('../../../assets/images/event/event_icon4.png')}
                    />
                  </ScrollView>
                </View>
                <View style={{marginLeft: wp(3), marginHorizontal: wp(5), marginTop: wp(5), justifyContent: "space-between", flexDirection: 'row'}}>
                  <View>
                    <Text style={{color: '#5E5E5E', fontSize: wp(4), fontWeight: '600'}}>Universal Studio</Text>
                  </View>
                  <View style={{justifyContent: "space-between", flexDirection: 'row'}}>
                    <Image
                      style={{ width: wp(5), height: wp(6), resizeMode: 'stretch' }}
                      source={require('../../../assets/images/event/share.png')}
                    />
                    <Image
                      style={{ width: wp(5), height: wp(6), marginLeft: wp(7), resizeMode: 'stretch' }}
                      source={require('../../../assets/images/event/like1.png')}
                    />
                  </View>
                </View>
                <View style={{marginLeft: wp(3), marginHorizontal: wp(5), marginTop: wp(1.5), }}>
                  <Text style={{color: '#5E5E5E', fontSize: wp(4), }}>Florida, CA</Text>
                </View>
                <View style={{marginLeft: wp(3.5), marginHorizontal: wp(5), marginTop: wp(9), }}>
                  <Text style={{color: '#5E5E5E', fontSize: wp(4), fontWeight: '600'}}>$80 - $150</Text>
                </View>
                <View style={{marginLeft: wp(3), marginHorizontal: wp(5), marginTop: wp(5), flexDirection: 'row'}}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{ width: wp(12), height: wp(6), resizeMode: 'stretch' }}
                      source={require('../../../assets/images/event/gogo.png')}
                    />
                    <Text style={{marginLeft: wp(3.5), color: '#515455', fontSize: wp(3.5)}}>5</Text>
                  </View>
                  <View style={{marginLeft: wp(15), flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{ width: wp(6), height: wp(6), resizeMode: 'stretch' }}
                      source={require('../../../assets/images/event/heart.png')}
                    />
                    <Text style={{marginLeft: wp(1), color: '#0193DD', fontSize: wp(3.5)}}>given</Text>
                    <Image
                      style={{ marginLeft: wp(1), marginTop: wp(2), width: wp(12), height: wp(6), resizeMode: 'stretch' }}
                      source={require('../../../assets/images/event/gogo.png')}
                    />
                    <Text style={{marginLeft: wp(3), marginTop: wp(1), color: '#0193DD', fontSize: wp(3.5)}}>2</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: "#C6C6C6", height: 1, marginTop: wp(4), width: '100%' }} />
                <View style={[{ marginTop: wp(2.5), marginLeft: wp(3.5), marginHorizontal: wp(3.5), }]}>
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <Text style={{ fontFamily: fonts.primaryRegular }}>
                        <Text style={{color: '#5E5E5E', }}>World Famous Studio Tour. The Simpsons Ride. Online Exclusive Savings. Fast & Furious. Despicable Me Ride. Revenge of the Mummy℠. Walking Dead Attraction. Ticket Deals. Transformers 3-D Ride. World Famous Studio Tour. The Simpsons Ride. Online Exclusive Savings. Fast & Furious. Despicable Me Ride. Revenge of the Mummy℠. Walking Dead Attraction. Ticket Deals. Transformers 3-D Ride.
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    style={{flex:1, marginTop: wp(2.5), flexDirection: 'row-reverse'}}
                    onPress={() => {}}
                  >
                    <Text style={{fontSize: wp(3.5), color: '#5E5E5E'}}>Read more</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ backgroundColor: "#C6C6C6", height: 1, marginTop: wp(2.5), marginBottom: wp(2.5), width: '100%' }} />
                <View style={{marginLeft: wp(5), marginHorizontal: wp(5), flexDirection: 'row'}}>
                  <View>
                    <Text style={{color: '#5E5E5E', fontSize: wp(4), fontWeight: '600'}}>Tickets</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={{marginLeft: wp(5), marginHorizontal: wp(8), marginTop: wp(5), justifyContent: "space-between", flexDirection: 'row'}}
                  onPress={() => this.props.navigation.navigate({
                                      routeName: 'EventTicket',
                                      params: { id: "Turkey", type: "country" },
                                  })
                            }
                >
                  <View style={{}}>
                    <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>One full day adventure</Text>
                    <Text style={{color: '#5E5E5E', fontSize: wp(3), fontWeight: '600'}}>$80</Text>
                  </View>
                  <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    <Image
                      style={{ width: wp(3), height: wp(4), resizeMode: 'stretch' }}
                      source={require('../../../assets/images/event/right-chevron.png')}
                    />
                  </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: "#C6C6C6", height: 1, marginTop: wp(2.5), marginBottom: wp(2.5), width: '100%' }} />
                <TouchableOpacity 
                  style={{marginLeft: wp(5), marginHorizontal: wp(8), marginTop: wp(5), justifyContent: "space-between", flexDirection: 'row'}}
                  onPress={() => this.props.navigation.navigate({
                                      routeName: 'EventTicket',
                                      params: { id: "Turkey", type: "country" },
                                  })
                            }
                >
                  <View style={{}}>
                    <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>Two full day adventure</Text>
                    <Text style={{color: '#5E5E5E', fontSize: wp(3), fontWeight: '600'}}>$120</Text>
                  </View>
                  <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    <Image
                      style={{ width: wp(3), height: wp(4), resizeMode: 'stretch' }}
                      source={require('../../../assets/images/event/right-chevron.png')}
                    />
                  </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: "#C6C6C6", height: 1, marginTop: wp(2.5), marginBottom: wp(2.5), width: '100%' }} />
                <TouchableOpacity 
                  style={{marginLeft: wp(5), marginHorizontal: wp(8), marginTop: wp(5), justifyContent: "space-between", flexDirection: 'row'}}
                  onPress={() => this.props.navigation.navigate({
                                      routeName: 'EventTicket',
                                      params: { id: "Turkey", type: "country" },
                                  })
                            }
                >
                  <View style={{}}>
                    <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>VIP -Skip the queue- full day adventure</Text>
                    <Text style={{color: '#5E5E5E', fontSize: wp(3), fontWeight: '600'}}>$150</Text>
                  </View>
                  <View style={{alignItems: 'center', flexDirection: 'row'}}>
                    <Image
                      style={{ width: wp(3), height: wp(4), resizeMode: 'stretch' }}
                      source={require('../../../assets/images/event/right-chevron.png')}
                    />
                  </View>
                </TouchableOpacity>
                <View style={{ backgroundColor: "#C6C6C6", height: 1, marginTop: wp(2.5), marginBottom: wp(2.5), width: '100%' }} />
                <View style={{ height: 30 }} />
              </View>
            </ScrollView>
          </SafeAreaView>
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
});
