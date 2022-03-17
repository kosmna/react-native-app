/* eslint-disable linebreak-style */
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

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

import { GetObjectForKey } from '../../components/AsyncStore';
import { GetTriposoLocationByCountry } from '../backend/triposo';
import { Text } from '../../components/StyledText';
import { fonts } from '../../styles';

const LoadingView = () => (
  <ShimmerPlaceHolder
    style={{ width: wp(90), height: hp(75), marginLeft: 14, marginTop: 6, marginRight: wp(5), opacity: 0.5 }}
    autoRun
  />
  )

export default class RegionListScreen extends React.Component {
    state = {
      title: "Cities",
      userData: null,
      location_id: "",
      tag_labels: "",
      destinations: [],
      loadingList: false
    };
    
    componentDidMount() {
      const location_id = this.props.navigation.getParam('location_id');
      const tag_labels = this.props.navigation.getParam('tag_labels');
      const title = this.props.navigation.getParam('title');
      this.setState({location_id});
      this.setState({tag_labels});
      this.setState({title});
      GetObjectForKey('userData').then(userData => {
        this.setState({userData});
        this._getTriposoLocationByCountry();
      }).catch(()=>{ 

      });
    }

    _getTriposoLocationByCountry() {
      const {userData} = this.state;
      this.setState({loadingList: true});
      GetTriposoLocationByCountry(userData.partner_id, userData.partner_referral_code, this.state.location_id, this.state.tag_labels, 1).then(result => {
        if (result.success) {
          this.setState({
            destinations: result.result,
          })
        }
      }).catch(() => { }).finally(() => { 
        this.setState({
          loadingList: false,
        })
      });
    }

    render() {
      const destinationItemViews = [];
      const {destinations} = this.state;
      if (destinations.length !== 0) {
        for (let i = 0; i < destinations.length; i+=1) {
          const destination = destinations[i];
          let image = "";
          try {
            image = destination.images[0].sizes.thumbnail.url.replace("http:", "https:");
          }
          catch (e) {}

          destinationItemViews.push(
            <TouchableOpacity 
              style={{marginLeft: wp(3.25), marginTop: wp(2), height: wp(22), justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF'}}
              onPress={() => { 
                    this.props.navigation.push(
                      'TripIdeasDestination',
                      { id: destination.id, type: destination.type },
                    );
                  }
                }
            >
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={{ width: wp(24), height: wp(22), resizeMode: 'stretch' }}
                  source={{uri: image}}
                />
                <View style={{marginLeft:wp(2), paddingTop: wp(1), width: wp(50)}}>
                  <Text style={{color: '#515151', fontWeight: '600', fontSize: wp(3.25)}}>
                    {destination.name}
                  </Text>
                  <Text style={{color: '#515151', fontSize: wp(3)}}>
                    {destination.snippet}
                  </Text>
                </View>
                <View style={{marginLeft: wp(8), marginTop: wp(1), width: wp(10), marginHorizontal: wp(6)}} />
              </View>
            </TouchableOpacity>
          );
        }
      }
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
                <View style={{ width: '80%', alignContent: 'center', alignItems: 'center', }}>
                  <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center", }}>
                    {this.state.title}
                  </Text>
                </View>
                <View style={{ width: '10%', justifyContent: 'center', flexDirection: 'row' }} />
                {/* <Image
                  style={{ marginLeft: 0, width: 20, height: 20, resizeMode: 'contain' }}                                
                  source={require('../../../assets/images/trip_ideas/location-pin.png')}
                  tintColor='#0093DD'
                />                            
                <Image
                  style={{ marginLeft: 25, width: 20, height: 20, resizeMode: 'contain' }}                                
                  source={require('../../../assets/images/trip_ideas/star1.png')}
                  tintColor='#0093DD'
                />                             */}
              </Animated.View>
            </Animated.View>
            <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12.5, width: '100%' }} />
            <ScrollView style={styles.container}>              
              <View style={{ backgroundColor: "#FCFCFC" }}>
                {
                  this.state.loadingList ? <LoadingView />
                    : destinationItemViews
                }
                <View style={{marginTop: wp(1.5), height: wp(11), justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF'}}>
                  <Text style={{color: '#9F9F9F', fontSize: wp(3.25)}}>
                  See all options
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
