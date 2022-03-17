/* eslint-disable linebreak-style */
import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
    TextInput,
    SafeAreaView
} from 'react-native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

import { GetObjectForKey } from '../../components/AsyncStore';
import { GetTriposoSearchLocationByKey } from '../backend/triposo';

import { Text } from '../../components/StyledText';
import { fonts } from '../../styles';

const LoadingView = () => (
  <ShimmerPlaceHolder
    style={{ width: wp(90), height: hp(75), marginLeft: 14, marginTop: 6, marginRight: wp(5), opacity: 0.5 }}
    autoRun
  />
  )

export default class SearchScreen extends React.Component {
    state = {
      userData: null,
      keyword: "",
      destinations: [],
      loadingList: false
    };
    
    componentDidMount() {
      GetObjectForKey('userData').then(userData => {
        this.setState({userData});
      }).catch(()=>{ 

      });
    }
  
    _keywordChanged(keyword) {
      this.setState({ keyword }, this._getTriposoSearchLocationByKey);
      if (keyword === "") {
        this.setState({ destinations: [] })
      }
      else {
        // this._getTriposoSearchLocationByKey(keyword);
      }
    }
  
    _getTriposoSearchLocationByKey() {
      const {userData} = this.state;
      const {keyword} = this.state;
      if (keyword === "") {
        this.setState({ destinations: [] })
        return;
      }
      this.setState({loadingList: true});
      GetTriposoSearchLocationByKey(userData.partner_id, userData.partner_referral_code, keyword, 1).then(result => {
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
              style={{flexDirection: 'row', marginTop: 6}}
              onPress={() => this.props.navigation.navigate({
                routeName: 'TripIdeasDestination',
                params: { id: destination.id, type: destination.type },
              })
            }
            >
              <View style={{ justifyContent: 'center', backgroundColor: '#FFFFFF'}}>
                <Image
                  style={{width: 95, height: 86, resizeMode: 'stretch', alignSelf: 'center', }}
                  source={{ uri: image }}
                />
              </View>
              <View style={{marginLeft: 9, }}>
                <Text style={{color: '#515151', fontSize: 13, fontWeight: '600'}}>{destination.name}</Text>
                <Text style={{color: '#707070', fontSize: 12, width: wp(100)-130 }}>{destination.snippet}</Text>
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
                  style={{ width: '33%' }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Image
                    style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                    source={require('../../../assets/images/category/back.png')}
                  />
                </TouchableOpacity>
                <View style={{ width: '34%', alignContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center"}}>
                  Trip Idea
                  </Text>
                </View>
                <View style={{ width: '33%', justifyContent: 'flex-end' }} />
              </Animated.View>
            </Animated.View>
            <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12.5, width: '100%' }} />
            <ScrollView style={styles.container}>              
              <View style={{ backgroundColor: "#FCFCFC" }}>
                <View style={{marginHorizontal: 26, marginTop: 15, height: 37, borderRadius: 10, backgroundColor: '#8E8E931A', opacity: 0.4, alignItems: 'center', flexDirection: 'row'}}>
                  <Image
                    style={{ marginLeft: 20, width: 14, height: 14, resizeMode: 'contain' }}                                
                    source={require('../../../assets/images/category/search.png')}
                    tintColor='#0093DD'
                  />                            
                  <TextInput
                    style={{marginLeft: 14}}
                    placeholder="Where do you want to go?" 
                    value={this.state.keyword}
                    onChangeText={(keyword) =>  this._keywordChanged(keyword)}
                    autoFocus={true}
                    // onEndEditing={() =>  this._getTriposoSearchLocationByKey()}
                  />
                </View>
                <View style={{marginTop: 25, marginLeft: 14, marginHorizontal: 25, flexDirection: 'row', height: 23, justifyContent: 'space-between'}}>
                  <View>
                    <Text style={{color: '#515151', fontWeight: '600', fontSize: 13}}>
                    Top Destination
                    </Text>
                  </View>
                </View>
                <View style={{marginLeft: 13, marginTop: 5, marginHorizontal: 20}}>
                  {
                    this.state.loadingList ? <LoadingView />
                      : destinationItemViews
                  }
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
