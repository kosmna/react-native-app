
import React from 'react'
import { Animated, Image, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { Text } from '../../components/StyledText'
import { fonts } from '../../styles'
import { BookAuthentication, BookBackendUrl } from '../backend/constants'
import axios from 'axios'


export default class TripIdeasScreen extends React.Component {
  state = {
    image_unique_value: (new Date()).getMilliseconds()
  };

  get_profile_image = () => {
    let payload = JSON.stringify({
      'Authorization': BookAuthentication,
      'referral_code': this.props.userInfo.partner_referral_code,
      'partner_id': this.props.userInfo.partner_id
    })
    axios({
      method: 'POST',
      url: BookBackendUrl + '/bnggetprofileimage' + '?data=' + payload,
      responseType: 'json'
    })
      .then((response) => {

        const data = response.data

        if (data.success) {
          this.setState({ profile_image_url: data.profile_image_url.replace('http://', 'https://') + '&unique=' + this.state.image_unique_value }, () => console.warn(this.state.profile_image_url))
        }
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  componentDidMount() {
    this.get_profile_image()
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
              style={{ width: '33%' }}
              onPress={() => this.props.navigation.navigate({
                routeName: 'Home',
                params: {},
              })}
            >
              <Image
                style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                source={require('../../../assets/images/category/back.png')}
              />
            </TouchableOpacity>
            <View style={{ width: '34%', alignContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                Trip Idea
                  </Text>
            </View>
            <View style={{ width: '33%', justifyContent: 'flex-end' }} />
          </Animated.View>
        </Animated.View>
        <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12.5, width: '100%' }} />
        <ScrollView style={styles.container}>
          <View style={{ backgroundColor: "#FCFCFC" }}>

            <LinearGradient colors={['#0093DD', '#004A6F']} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

              {this.state.profile_image_url &&
                <Image
                  source={{ uri: this.state.profile_image_url.replace('http://', 'https://') + '&unique=' + this.state.image_unique_value }}
                  style={{ height: wp(20), width: wp(20), borderRadius: wp(20), resizeMode: 'contain', marginTop: hp(4) }}
                />
              }

              <Text style={{ textAlign: 'center', marginTop: hp(1), color: 'white', textTransform: 'uppercase' }}>{this.props.userInfo.partner_name}</Text>

              <TouchableOpacity
                style={{ height: hp(5), width: wp(70), borderRadius: wp(2), backgroundColor: '#FFF', alignItems: 'center', flexDirection: 'row', marginVertical: hp(5) }}
                onPress={() => this.props.navigation.navigate({
                  routeName: 'TripIdeasSearch',
                  params: {},
                })
                }
              >
                <Image
                  style={{ marginLeft: 20, width: 14, height: 14, resizeMode: 'contain' }}
                  source={require('../../../assets/images/category/search.png')}
                  tintColor='#0093DD'
                />
                <View><Text style={{ marginLeft: 14 }}>Where do you want to go?</Text></View>
              </TouchableOpacity>

            </LinearGradient>

            {/* <View style={{ marginTop: 25, marginLeft: 14, marginHorizontal: 25, flexDirection: 'row', height: 23, justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: '#100F0F', fontWeight: '600', fontSize: 16 }}>
                  Suggested For Your Trip
                    </Text>
              </View>
            </View>
            <ScrollView style={{ marginTop: 11, marginLeft: 17, height: 108 }} horizontal>
              <TouchableOpacity
                style={{ alignItems: 'center', marginRight: 17, borderRadius: 4 }}
                onPress={() => this.props.navigation.navigate({
                  routeName: 'TripIdeasDestination',
                  params: { id: "Italy", type: "country" },
                })
                }
              >
                <View style={{ width: 196, justifyContent: 'center', borderRadius: 4, backgroundColor: '#FFFFFF' }}>
                  <Image
                    style={{ width: 196, height: 108, resizeMode: 'stretch', alignSelf: 'center', borderRadius: 4, }}
                    source={require('../../../assets/images/trip_ideas/italy.png')}
                  />
                </View>
                <View style={{ marginTop: -66, height: 28, alignSelf: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Italy</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: 'center', marginRight: 17, borderRadius: 4 }}
                onPress={() => this.props.navigation.navigate({
                  routeName: 'TripIdeasDestination',
                  params: { id: "Australia", type: "country" },
                })
                }
              >
                <View style={{ width: 196, justifyContent: 'center', borderRadius: 4, backgroundColor: '#FFFFFF' }}>
                  <Image
                    style={{ width: 196, height: 108, resizeMode: 'stretch', alignSelf: 'center', borderRadius: 4, }}
                    source={require('../../../assets/images/trip_ideas/italy.png')}
                  />
                </View>
                <View style={{ marginTop: -66, height: 28, alignSelf: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 18 }}>Australia</Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
            <View style={{ marginTop: 28, marginLeft: 18, marginHorizontal: 18, flexDirection: 'row', height: 23, justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: '#515151', fontWeight: '600', fontSize: 16 }}>
                  Your Trips
                    </Text>
              </View>
            </View>
            <TouchableOpacity
              style={{ marginLeft: 17, marginHorizontal: 17, marginTop: 11, width: wp(100) - 34, height: wp(37), borderRadius: 8, borderColor: '#cfcfcf', borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 2 }}
              onPress={() => this.props.navigation.navigate({
                routeName: 'TripIdeasDestination',
                params: { id: "Turkey", type: "country" },
              })
              }
            >
              <ImageBackground
                source={require('../../../assets/images/trip_ideas/trip.png')}
                style={{ width: wp(100) - 34, height: wp(37), borderRadius: 8, backgroundColor: '#BCE9FF', justifyContent: 'center', alignItems: 'center' }}
                imageStyle={{ borderRadius: 8 }}
              >
                <View style={{ width: wp(100) - 34, marginTop: wp(0), alignItems: 'center' }}>
                  <Text style={{ marginLeft: wp(2), color: '#FFFFFF', fontSize: 18 }}>Turkey</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
            <View style={{ height: 30 }} /> */}
          </View>
        </ScrollView>
      </SafeAreaView>
    )
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
})
