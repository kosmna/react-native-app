/* eslint-disable linebreak-style */
import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
    ImageBackground,
    SafeAreaView
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Text } from '../../components/StyledText';
import { fonts } from '../../styles';

export default class CafeItemScreen extends React.Component {
    state = {
    };
    
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
                  style={{ width: '25%' }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Image
                    style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                    source={require('../../../assets/images/category/back.png')}
                  />
                </TouchableOpacity>
                <View style={{ width: '50%', alignContent: 'center', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', }}>
                  <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                  Regency Cafe
                  </Text>
                </View>
                <View style={{ width: '25%', justifyContent: 'center', flexDirection: 'row' }}>
                  <Image
                    style={{ marginLeft: 0, width: 20, height: 20, resizeMode: 'contain' }}                                
                    source={require('../../../assets/images/trip_ideas/location-pin.png')}
                    tintColor='#0093DD'
                  />                            
                  <Image
                    style={{ marginLeft: 15, width: 20, height: 20, resizeMode: 'contain' }}                                
                    source={require('../../../assets/images/trip_ideas/star1.png')}
                    tintColor='#0093DD'
                  />                            
                </View>
              </Animated.View>
            </Animated.View>
            <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12.5, width: '100%' }} />
            <ScrollView style={styles.container}>              
              <View style={{ backgroundColor: "#FCFCFC" }}>
                <TouchableOpacity 
                  style={{width: wp(100), height: wp(50), }}
                  onPress={() => this.props.navigation.navigate({
                                    routeName: '',
                                    params: {},
                                })
                          }
                >
                  <ImageBackground 
                    source={require('../../../assets/images/trip_ideas/merchant/london.png')}
                    style={{width: wp(100), height: wp(50), backgroundColor: '#BCE9FF', justifyContent: 'center', alignItems: 'center'}}
                  >
                    <View style={{width: wp(100), marginTop: wp(32), alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
                      <View style={{alignItems: 'center'}}>
                        <Image
                          style={{ width: wp(5), height: wp(5), resizeMode: 'stretch' }}
                          source={require('../../../assets/images/trip_ideas/star.png')}
                        />
                        <View style={{marginTop:wp(1)}}>
                          <Text style={{marginLeft: wp(1), color: '#FFFFFF', fontSize: 11}}>Saved</Text>
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
                <View style={{marginTop: wp(2), paddingLeft: wp(9), paddingRight: wp(9), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <View style={{justifyContent:'center', alignItems: 'center'}}>
                    <View style={{width: wp(5), height: wp(5), justifyContent:'center', alignItems: 'center'}}>
                      <Image
                        style={{ width: wp(5), height: wp(5), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/star1.png')}
                      />
                    </View>
                    <Text style={{color: '#717171', fontSize: wp(3.25)}}>
                    Save
                    </Text>
                  </View>
                  <View style={{justifyContent:'center', alignItems: 'center'}}>
                    <View style={{width: wp(5), height: wp(5), justifyContent:'center', alignItems: 'center'}}>
                      <Image
                        style={{ width: wp(5), height: wp(5), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/navigation.png')}
                      />
                    </View>
                    <Text style={{color: '#717171', fontSize: wp(3.25)}}>
                    Direction
                    </Text>
                  </View>
                  <View style={{justifyContent:'center', alignItems: 'center'}}>
                    <View style={{width: wp(5), height: wp(5), justifyContent:'center', alignItems: 'center'}}>
                      <Image
                        style={{ width: wp(5), height: wp(5), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/call.png')}
                      />
                    </View>
                    <Text style={{color: '#717171', fontSize: wp(3.25)}}>
                    Contact
                    </Text>
                  </View>
                  <View style={{justifyContent:'center', alignItems: 'center'}}>
                    <View style={{width: wp(5), height: wp(5), justifyContent:'center', alignItems: 'center'}}>
                      <Image
                        style={{ width: wp(5), height: wp(5), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/share.png')}
                      />
                    </View>
                    <Text style={{color: '#717171', fontSize: wp(3.25)}}>
                    Share
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: wp(2), width: wp(100), height: wp(0.25), borderWidth: wp(0.25), borderColor: '#BEBEBE', opacity: 0.3}} />
                <View style={{height: wp(11), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: wp(7), paddingRight: wp(7) }}>
                  <Text style={{color: '#717171', fontSize: wp(3.25)}}>
                  More Places
                  </Text>
                  <Text style={{color: '#717171', fontSize: wp(3.25)}}>
                  www.cafe.com
                  </Text>
                </View>
                <View style={{width: wp(100), height: wp(0.25), borderWidth: wp(0.25), borderColor: '#BEBEBE', opacity: 0.3}} />
                <View style={{height: wp(11), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: wp(7), paddingRight: wp(7) }}>
                  <Text style={{color: '#717171', fontSize: wp(3.25)}}>
                  Hours
                  </Text>
                  <Text style={{color: '#717171', fontSize: wp(3.25)}}>
                  Mon-Fri 07:00 -12:00
                  </Text>
                </View>
                <ImageBackground 
                  source={require('../../../assets/images/trip_ideas/map.png')}
                  style={{marginTop: wp(5), width: wp(100), height: wp(55), backgroundColor: '#BCE9FF', justifyContent: 'center', alignItems: 'center'}}
                />
                <View style={{marginTop: wp(3), marginLeft: wp(5), }}>
                  <View>
                    <Text style={{color: '#4D4D4D', fontSize: wp(4), fontWeight: '600'}}>
                    Overview
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: wp(1), width: wp(90), marginLeft: wp(5), marginHorizontal: wp(5), }}>
                  <Text style={{color: '#4D4D4D', fontSize: wp(3.25)}}>
                  Constructed from 1887 to 1889 as the entrance to the 1889 Worlds Fair, it was initially criticised by some of France's leading artists and intellectuals for its design, but it has become a global cultural icon of France and one of the most recognisable structures in the world.[3] The Eiffel Tower is the most-visited paid monument in the world; 6.91 million people ascended it in 2015.
                  </Text>
                </View>
                <View style={{marginTop: wp(1), width: wp(100), paddingRight: wp(5), justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                  <Text style={{color: '#0093DD', fontSize: wp(3.25), }}>
                  Continue Reading
                  </Text>
                </View>
                <View style={{marginTop: wp(2.5), width: wp(100), height: wp(0.25), borderWidth: wp(0.25), borderColor: '#BEBEBE', opacity: 0.3}} />
                <View style={{marginTop: wp(2), marginLeft: wp(3.5), }}>
                  <View>
                    <Text style={{color: '#4D4D4D', fontSize: wp(4), fontWeight: '600'}}>
                    You might also like
                    </Text>
                  </View>
                </View>
                <View style={{marginLeft: wp(3.25), marginTop: wp(2), height: wp(22), justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={{ width: wp(24), height: wp(22), resizeMode: 'stretch' }}
                      source={require('../../../assets/images/trip_ideas/merchant/night.png')}
                    />
                    <View style={{marginLeft:wp(2), paddingTop: wp(1), width: wp(50)}}>
                      <Text style={{color: '#515151', fontWeight: '600', fontSize: wp(3.25)}}>
                      America 1
                      </Text>
                      <Text style={{color: '#515151', fontSize: wp(3)}}>
                      Best breakfast in the town
                      </Text>
                      <View style={{marginTop: wp(6), flexDirection: 'row'}}>
                        <View style={{borderRadius: 6, borderColor: '#BEBEBE', borderWidth: 1, width: wp(18.5), justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{color: '#BEBEBE', fontSize: wp(2.75)}}>
                          Kids friendly
                          </Text>
                        </View>
                        <View style={{marginLeft: wp(1), width: wp(15), borderRadius: 6, borderColor: '#9F9F9F', borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{color: '#BEBEBE', fontSize: wp(2.75)}}>
                          Breakfast
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={{marginLeft: wp(8), marginTop: wp(1), width: wp(10), marginHorizontal: wp(6)}} />
                  </View>
                </View>
                <View style={{marginLeft: wp(3.25), marginTop: wp(2), height: wp(22), justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Image
                      style={{ width: wp(24), height: wp(22), resizeMode: 'stretch' }}
                      source={require('../../../assets/images/trip_ideas/merchant/night.png')}
                    />
                    <View style={{marginLeft:wp(2), paddingTop: wp(1), width: wp(50)}}>
                      <Text style={{color: '#515151', fontWeight: '600', fontSize: wp(3.25)}}>
                      America 1
                      </Text>
                      <Text style={{color: '#515151', fontSize: wp(3)}}>
                      Best breakfast in the town
                      </Text>
                      <View style={{marginTop: wp(6), flexDirection: 'row'}}>
                        <View style={{borderRadius: 6, borderColor: '#BEBEBE', borderWidth: 1, width: wp(18.5), justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{color: '#BEBEBE', fontSize: wp(2.75)}}>
                          Kids friendly
                          </Text>
                        </View>
                        <View style={{marginLeft: wp(1), width: wp(15), borderRadius: 6, borderColor: '#9F9F9F', borderWidth: 1, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{color: '#BEBEBE', fontSize: wp(2.75)}}>
                          Breakfast
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={{marginLeft: wp(8), marginTop: wp(1), width: wp(10), marginHorizontal: wp(6)}} />
                  </View>
                </View>
                <View style={{marginTop: wp(3), height: wp(11), justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF'}}>
                  <Text style={{color: '#9F9F9F', fontSize: wp(3.25)}}>
                  More Places
                  </Text>
                </View>
                <View style={{marginTop: wp(6.5), marginLeft: wp(5), }}>
                  <View>
                    <Text style={{color: '#676565', fontSize: wp(4), fontWeight: '600'}}>
                    Tips & Review
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: wp(3), width: wp(100), height: wp(40), backgroundColor: '#F9F9F9', paddingTop: wp(2.5), paddingLeft: wp(2.5), paddingRight: wp(3), flexDirection: 'row'}}>
                  <Image
                    style={{ width: wp(16), height: wp(16), borderRadius: wp(8), resizeMode: 'stretch' }}
                    source={require('../../../assets/images/trip_ideas/merchant/photo.png')}
                  />
                  <View style={{marginLeft: wp(3), width: wp(75)}}>
                    <Text style={{color: '#9F9F9F', fontSize: wp(4), fontWeight: '600'}}>
                    Joy MIck
                    </Text>
                    <Text style={{color: '#9F9F9F', fontSize: wp(4), }}>
                    Absolutely gorgeous!! Should be on the top of your bucket list of Paris visit. This is really one of the most magnificent structures in the world. I highly recommend going at night so you can see the glittering lights. It's really.
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: wp(2.5), marginLeft: wp(5), width: wp(90), height: wp(12), borderColor: '#0093DD', borderWidth: wp(0.25), alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={{color: '#0093DD', fontSize: wp(4), fontWeight: '600'}}>
                  Write a review
                  </Text>
                </View>
                <View style={{marginTop: wp(3), height: wp(11), justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF'}}>
                  <Text style={{color: '#9F9F9F', fontSize: wp(3.25)}}>
                  More reviews
                  </Text>
                </View>
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
