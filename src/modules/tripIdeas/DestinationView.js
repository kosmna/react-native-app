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
import Carousel, { Pagination } from 'react-native-snap-carousel'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

import { GetObjectForKey } from '../../components/AsyncStore';
import { GetTriposoLocationById } from '../backend/triposo';
import { Text } from '../../components/StyledText';
import { fonts } from '../../styles';

const LoadingView = () => (
  <ShimmerPlaceHolder
    style={{ width: wp(100), height: wp(50), marginLeft: 0, marginTop: 0, marginRight: wp(0), opacity: 0.5 }}
    autoRun
  />
)

export default class DestinationScreen extends React.Component {
    state = {
      userData: null,
      location: null,
      id: null,
      type: null,
      loadingList: false,
      images: [],
      activeSlide: 0,
    };

    componentDidMount() {
      const id = this.props.navigation.getParam('id');
      const type = this.props.navigation.getParam('type');
      this.setState({id});
      this.setState({type});
      GetObjectForKey('userData').then(userData => {
        this.setState({userData});
        this._getTriposoLocationById();
      }).catch(()=>{ 

      });
    }
    
    load() {
        this.componentDidMount();
    }

    _getTriposoLocationById() {
      const {userData} = this.state;
      this.setState({loadingList: true});
      GetTriposoLocationById(userData.partner_id, userData.partner_referral_code, this.state.id).then(result => {
        if (result.success) {
          const images = [];
          const location = result.result;
          for (let i=0; i<location.images.length; i += 1)
          {
            try {
              images.push(location.images[i].sizes.medium.url.replace("http:", "https:"));
            } 
            catch (e) {
              console.error(e.message);
            }
          }
          this.setState({
            location,
            images,
            activeSlide: 0,
          })
        }
      }).catch(() => { }).finally(() => { 
        this.setState({
          loadingList: false,
        })
      });
    }

    _renderItem({ item, }) {
      return (
        <Image
          style={styles.imgBanner}
          source={{ uri: item }}
          onPress={() => this.props.navigation.goBack()}
        />
      )
    }
  
    render() {
      const {location} = this.state;
      const introItemViews = [];
      const carouselViews = [];
      let destinationName = "Location";
      if (location !== null)
      {
        destinationName = location.name;
        const image = location.images[0].sizes.medium.url.replace("http:", "https:");
        carouselViews.push(
          <Carousel
            ref={(c) => { this._carousel = c }}
            data={this.state.images}
            renderItem={this._renderItem}
            sliderWidth={wp(100)}
            itemWidth={wp(100)}
            onSnapToItem={(index) => this.setState({ activeSlide: index })}
          />
        );
        carouselViews.push(
          <View style={{ alignItems: 'center', flexDirection: "row", justifyContent: "center", alignSelf: "center" }}>
            <Pagination
              dotsLength={this.state.images.length}
              activeDotIndex={this.state.activeSlide}
              containerStyle={{ backgroundColor: '#FFFFFF', marginTop: 0, paddingTop: 5, paddingBottom: 0 }}
              dotStyle={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                marginHorizontal: 4,
                backgroundColor: '#AFAFAF'
              }}
              inactiveDotStyle={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                marginHorizontal: 4,
                backgroundColor: '#EFE4E4'
              }}
              inactiveDotOpacity={1}
              inactiveDotScale={1}
            />
          </View>
        );
        introItemViews.push(
          <TouchableOpacity 
            style={{width: wp(100), height: wp(50), }}
            onPress={() => this.props.navigation.navigate({
                              routeName: '',
                              params: {},
                          })
                    }
          >
            <ImageBackground 
              source={{uri: image}}
              style={{width: wp(100), height: wp(50), backgroundColor: '#BCE9FF', justifyContent: 'center', alignItems: 'center'}}
            >
              <View style={{width: wp(100), marginTop: wp(0), alignItems: 'center'}}>
                <Text style={{color: '#FFFFFF', fontWeight: '600', fontSize: wp(5)}}>{location.name}</Text>
              </View>
              <View style={{width: wp(100), marginTop: wp(1), alignItems: 'center'}}>
                <Text style={{color: '#FFFFFF', fontSize: wp(3.5)}}>Things you need to know</Text>
              </View>
              {/* <View style={{width: wp(100), marginTop: wp(3.5), alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between'}}> 
                <View style={{marginLeft: wp(12), alignItems: 'center'}}>
                  <Image
                    style={{ width: wp(5), height: wp(5), resizeMode: 'stretch' }}
                    source={require('../../../assets/images/trip_ideas/star.png')}
                  />
                  <View style={{marginTop:wp(1)}}>
                    <Text style={{marginLeft: wp(1), color: '#FFFFFF', fontSize: 11}}>Saved</Text>
                  </View>
                </View>
                <View style={{alignItems: 'center'}}>
                  <Image
                    style={{ width: wp(5), height: wp(5), resizeMode: 'stretch' }}
                    source={require('../../../assets/images/trip_ideas/cloud-computing.png')}
                  />
                  <View style={{marginTop:wp(1)}}>
                    <Text style={{marginLeft: wp(1), color: '#FFFFFF', fontSize: 11}}>Download</Text>
                  </View>
                </View>
                <View style={{marginLeft: 0, marginHorizontal: wp(12), alignItems: 'center'}}>
                  <Image
                    style={{ width: wp(5), height: wp(5), resizeMode: 'stretch' }}
                    source={require('../../../assets/images/trip_ideas/calendar-page-empty.png')}
                  />
                  <View style={{marginTop:wp(1)}}>
                    <Text style={{marginLeft: wp(1), color: '#FFFFFF', fontSize: 11}}>Set Dates</Text>
                  </View>
                </View>
              </View> */}
            </ImageBackground>
          </TouchableOpacity>
        );
      }

      const countryItemViews = [];
      if (this.state.type === "country")
      {
        countryItemViews.push(
          <View style={{marginLeft: wp(4), marginHorizontal: wp(4), marginTop: wp(2), flexDirection: 'row'}}>
            <TouchableOpacity 
              style={{alignItems: 'center', flexDirection: 'row', width: wp(45), height: wp(13), justifyContent: 'center', borderWidth: 1, borderColor: '#E1E1E1'}}
              onPress={() => this.props.navigation.push('TripIdeasRegionList',
                              {location_id: this.state.id, tag_labels: "city", title: "Cities"},
                          )
                    }
            >
              <View style={{alignItems: 'center', flexDirection: 'row',}}>
                <Image
                  style={{ width: wp(4), height: wp(4), resizeMode: 'stretch' }}
                  source={require('../../../assets/images/trip_ideas/merchant/see_do.png')}
                />
                <View style={{marginLeft:wp(4)}}>
                  <Text style={{color: '#707070', fontSize: wp(3)}}>Cities</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{alignItems: 'center', flexDirection: 'row', width: wp(45), height: wp(13), justifyContent: 'center', marginLeft: wp(2), borderWidth: 1, borderColor: '#E1E1E1'}}
              onPress={() => this.props.navigation.push(
                              'TripIdeasRegionList',
                              {location_id: this.state.id, tag_labels: "national_park", title: "National park"},
                          )
                    }
            >
              <View style={{alignItems: 'center', flexDirection: 'row',}}>
                <Image
                  style={{ width: wp(4), height: wp(4), resizeMode: 'stretch' }}
                  source={require('../../../assets/images/trip_ideas/merchant/activities.png')}
                />
                <View style={{marginLeft:wp(4)}}>
                  <Text style={{color: '#707070', fontSize: wp(3)}}>National park</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );

        countryItemViews.push(
          <View style={{marginLeft: wp(4), marginHorizontal: wp(4), marginTop: wp(2), flexDirection: 'row'}}>
            <TouchableOpacity 
              style={{alignItems: 'center', flexDirection: 'row', width: wp(45), height: wp(13), justifyContent: 'center', borderWidth: 1, borderColor: '#E1E1E1'}}
              onPress={() => this.props.navigation.push(
                            'TripIdeasRegionList',
                            {location_id: this.state.id, tag_labels: "region", title: "Regions"},
                          )
                    }
            >
              <View style={{alignItems: 'center', flexDirection: 'row',}}>
                <Image
                  style={{ width: wp(4), height: wp(4), resizeMode: 'stretch' }}
                  source={require('../../../assets/images/trip_ideas/merchant/eat_drink.png')}
                />
                <View style={{marginLeft:wp(4)}}>
                  <Text style={{color: '#707070', fontSize: wp(3)}}>Regions</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={{alignItems: 'center', flexDirection: 'row', width: wp(45), height: wp(13), justifyContent: 'center', marginLeft: wp(2), borderWidth: 1, borderColor: '#E1E1E1'}}
              onPress={() => this.props.navigation.push(
                            'TripIdeasRegionList',
                            {location_id: this.state.id, tag_labels: "island", title: "Islands"},
                          )
                    }
            >
              <View style={{alignItems: 'center', flexDirection: 'row',}}>
                <Image
                  style={{ width: wp(4), height: wp(4), resizeMode: 'stretch' }}
                  source={require('../../../assets/images/trip_ideas/merchant/night_life.png')}
                />
                <View style={{marginLeft:wp(4)}}>
                  <Text style={{color: '#707070', fontSize: wp(3)}}>Islands</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );

        countryItemViews.push(
          <View style={{marginTop: wp(3.5), marginLeft: wp(8), }}>
            <View>
              <Text style={{color: '#5E5E5E', fontWeight: '600', fontSize: wp(4)}}>
              OUTSIDE OF THE CITIES
              </Text>
            </View>
          </View>
        );
      } 
      else if (this.state.type !== "city") {
        countryItemViews.push(
          <View style={{marginLeft: wp(4), marginHorizontal: wp(4), marginTop: wp(2), flexDirection: 'row'}}>
            <TouchableOpacity 
              style={{alignItems: 'center', flexDirection: 'row', width: wp(45), height: wp(13), justifyContent: 'center', borderWidth: 1, borderColor: '#E1E1E1'}}
              onPress={() => this.props.navigation.push('TripIdeasRegionList',
                              {location_id: this.state.id, tag_labels: "city", title: "Cities"},
                          )
                    }
            >
              <View style={{alignItems: 'center', flexDirection: 'row',}}>
                <Image
                  style={{ width: wp(4), height: wp(4), resizeMode: 'stretch' }}
                  source={require('../../../assets/images/trip_ideas/merchant/see_do.png')}
                />
                <View style={{marginLeft:wp(4)}}>
                  <Text style={{color: '#707070', fontSize: wp(3)}}>Cities</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        );

        countryItemViews.push(
          <View style={{marginTop: wp(3.5), marginLeft: wp(8), }}>
            <View>
              <Text style={{color: '#5E5E5E', fontWeight: '600', fontSize: wp(4)}}>
              OUTSIDE OF THE CITIES
              </Text>
            </View>
          </View>
        );
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
                  <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                    {destinationName}
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
                /> */}
              </Animated.View>
            </Animated.View>
            <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12.5, width: '100%' }} />
            <ScrollView style={styles.container}>
              <View style={{ backgroundColor: "#FCFCFC" }}>
                {
                  this.state.loadingList ? <LoadingView />
                    : carouselViews  //introItemViews
                }
                {countryItemViews}
                <View style={{marginLeft: wp(4), marginHorizontal: wp(4), marginTop: wp(2), flexDirection: 'row'}}>
                  <TouchableOpacity 
                    style={{alignItems: 'center', flexDirection: 'row', width: wp(45), height: wp(13), justifyContent: 'center', borderWidth: 1, borderColor: '#E1E1E1'}}
                    onPress={() => this.props.navigation.push(
                                    'TripIdeasSeeDo',
                                    {location_id: this.state.id, tag_labels: "sightseeing", title: "See and Do"},
                                )
                          }
                  >
                    <View style={{alignItems: 'center', flexDirection: 'row',}}>
                      <Image
                        style={{ width: wp(4), height: wp(4), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/merchant/see_do.png')}
                      />
                      <View style={{marginLeft:wp(4)}}>
                        <Text style={{color: '#707070', fontSize: wp(3)}}>See and Do</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{alignItems: 'center', flexDirection: 'row', width: wp(45), height: wp(13), justifyContent: 'center', marginLeft: wp(2), borderWidth: 1, borderColor: '#E1E1E1'}}
                    onPress={() => this.props.navigation.push('TripIdeasSeeDo',
                                    {location_id: this.state.id, tag_labels: "do", title: "Activities"},
                                )
                          }
                  >
                    <View style={{alignItems: 'center', flexDirection: 'row',}}>
                      <Image
                        style={{ width: wp(4), height: wp(4), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/merchant/activities.png')}
                      />
                      <View style={{marginLeft:wp(4)}}>
                        <Text style={{color: '#707070', fontSize: wp(3)}}>Activities</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{marginLeft: wp(4), marginHorizontal: wp(4), marginTop: wp(2), flexDirection: 'row'}}>
                  <TouchableOpacity 
                    style={{alignItems: 'center', flexDirection: 'row', width: wp(45), height: wp(13), justifyContent: 'center', borderWidth: 1, borderColor: '#E1E1E1'}}
                    onPress={() => this.props.navigation.push(
                                  'TripIdeasSeeDo',
                                  {location_id: this.state.id, tag_labels: "eatingout", title: "Eat and Drink"},
                                )
                          }
                  >
                    <View style={{alignItems: 'center', flexDirection: 'row',}}>
                      <Image
                        style={{ width: wp(4), height: wp(4), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/merchant/eat_drink.png')}
                      />
                      <View style={{marginLeft:wp(4)}}>
                        <Text style={{color: '#707070', fontSize: wp(3)}}>Eat and Drink</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={{alignItems: 'center', flexDirection: 'row', width: wp(45), height: wp(13), justifyContent: 'center', marginLeft: wp(2), borderWidth: 1, borderColor: '#E1E1E1'}}
                    onPress={() => this.props.navigation.push(
                                  'TripIdeasSeeDo',
                                  {location_id: this.state.id, tag_labels: "nightlife", title: "Night Life"},
                                )
                          }
                  >
                    <View style={{alignItems: 'center', flexDirection: 'row',}}>
                      <Image
                        style={{ width: wp(4), height: wp(4), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/merchant/night_life.png')}
                      />
                      <View style={{marginLeft:wp(4)}}>
                        <Text style={{color: '#707070', fontSize: wp(3)}}>Night Life</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{marginLeft: wp(4), marginHorizontal: wp(4), marginTop: wp(2), flexDirection: 'row'}}>
                  <TouchableOpacity 
                    style={{alignItems: 'center', flexDirection: 'row', width: wp(45), height: wp(13), justifyContent: 'center', borderWidth: 1, borderColor: '#E1E1E1'}}
                    onPress={() => this.props.navigation.push(
                                  'TripIdeasSeeDo',
                                  {location_id: this.state.id, tag_labels: "transport", title: "Transport"},
                                )
                          }
                  >
                    <View style={{alignItems: 'center', flexDirection: 'row',}}>
                      <Image
                        style={{ width: wp(4), height: wp(4), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/merchant/bus.png')}
                      />
                      <View style={{marginLeft:wp(4)}}>
                        <Text style={{color: '#707070', fontSize: wp(3)}}>Transport</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{marginTop: wp(3.5), marginLeft: wp(8), }}>
                  <View>
                    <Text style={{color: '#5E5E5E', fontWeight: '600', fontSize: wp(4)}}>
                    Practical Information
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: wp(3), height: wp(13), justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#D1D1D1'}}>
                  <TouchableOpacity 
                    style={{flexDirection: 'row', paddingLeft: wp(9)}}
                    onPress={() => this.props.navigation.navigate({
                                    routeName: 'TripIdeasGetKnow',
                                    params: {location: this.state.location},
                                })
                          }
                  >
                    <Image
                      style={{ width: wp(4), height: wp(4), resizeMode: 'stretch' }}
                      source={require('../../../assets/images/trip_ideas/merchant/surface1.png')}
                    />
                    <View style={{marginLeft:wp(6)}}>
                      <Text style={{color: '#707070', fontSize: wp(3)}}>Get to know {destinationName}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* <View style={{marginTop: wp(4), marginLeft: wp(8), }}>
                  <View>
                    <Text style={{color: '#5E5E5E', fontWeight: '600', fontSize: wp(4)}}>
                    Travel Tools
                    </Text>
                  </View>
                </View>
                <ScrollView style={{marginTop: wp(3), height: wp(13), flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#D1D1D1'}} horizontal>
                  <View style={{marginTop: wp(1)}}>
                    <View style={{marginLeft: wp(8)}}>
                      <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>Today</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: wp(1), paddingLeft: wp(8)}}>
                      <Image
                        style={{ width: wp(3.5), height: wp(3.5), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/merchant/storm.png')}
                      />
                      <View style={{marginLeft:wp(1), flexDirection: 'row'}}>
                        <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>10</Text>
                        <View style={{width: wp(1), height: wp(1), borderRadius: wp(0.5), borderWidth: wp(0.125), borderColor: '#707070'}} />
                        <Text style={{marginLeft: wp(1), color: '#5E5E5E', fontSize: wp(3)}}>8</Text>
                        <View style={{width: wp(1), height: wp(1), borderRadius: wp(0.5), borderWidth: wp(0.125), borderColor: '#707070'}} />
                      </View>
                    </View>
                  </View>
                  <View style={{marginLeft: wp(6), marginTop: wp(2.5), height: wp(8), width: wp(0.125), borderColor: '#D1D1D1', borderWidth: wp(0.125)}} />
                  <View style={{marginTop: wp(1)}}>
                    <View style={{marginLeft: wp(8)}}>
                      <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>Tomorrow</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: wp(1), paddingLeft: wp(8)}}>
                      <Image
                        style={{ width: wp(3.5), height: wp(3.5), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/merchant/cloudy.png')}
                      />
                      <View style={{marginLeft:wp(1), flexDirection: 'row'}}>
                        <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>10</Text>
                        <View style={{width: wp(1), height: wp(1), borderRadius: wp(0.5), borderWidth: wp(0.125), borderColor: '#707070'}} />
                        <Text style={{marginLeft: wp(1), color: '#5E5E5E', fontSize: wp(3)}}>8</Text>
                        <View style={{width: wp(1), height: wp(1), borderRadius: wp(0.5), borderWidth: wp(0.125), borderColor: '#707070'}} />
                      </View>
                    </View>
                  </View>
                  <View style={{marginLeft: wp(6), marginTop: wp(2.5), height: wp(8), width: wp(0.125), borderColor: '#D1D1D1', borderWidth: wp(0.125)}} />
                  <View style={{marginTop: wp(1)}}>
                    <View style={{marginLeft: wp(8)}}>
                      <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>Sun,20 Dec</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: wp(1), paddingLeft: wp(8)}}>
                      <Image
                        style={{ width: wp(3.5), height: wp(3.5), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/merchant/cloudy.png')}
                      />
                      <View style={{marginLeft:wp(1), flexDirection: 'row'}}>
                        <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>10</Text>
                        <View style={{width: wp(1), height: wp(1), borderRadius: wp(0.5), borderWidth: wp(0.125), borderColor: '#707070'}} />
                        <Text style={{marginLeft: wp(1), color: '#5E5E5E', fontSize: wp(3)}}>8</Text>
                        <View style={{width: wp(1), height: wp(1), borderRadius: wp(0.5), borderWidth: wp(0.125), borderColor: '#707070'}} />
                      </View>
                    </View>
                  </View>
                  <View style={{marginLeft: wp(6), marginTop: wp(2.5), height: wp(8), width: wp(0.125), borderColor: '#D1D1D1', borderWidth: wp(0.125)}} />
                  <View style={{marginTop: wp(1)}}>
                    <View style={{marginLeft: wp(8)}}>
                      <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>Sun,21 Dec</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: wp(1), paddingLeft: wp(8)}}>
                      <Image
                        style={{ width: wp(3.5), height: wp(3.5), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/merchant/cloudy.png')}
                      />
                      <View style={{marginLeft:wp(1), flexDirection: 'row'}}>
                        <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>10</Text>
                        <View style={{width: wp(1), height: wp(1), borderRadius: wp(0.5), borderWidth: wp(0.125), borderColor: '#707070'}} />
                        <Text style={{marginLeft: wp(1), color: '#5E5E5E', fontSize: wp(3)}}>8</Text>
                        <View style={{width: wp(1), height: wp(1), borderRadius: wp(0.5), borderWidth: wp(0.125), borderColor: '#707070'}} />
                      </View>
                    </View>
                  </View>
                  <View style={{marginLeft: wp(6), marginTop: wp(2.5), height: wp(8), width: wp(0.125), borderColor: '#D1D1D1', borderWidth: wp(0.125)}} />
                </ScrollView>
                <View style={{height: wp(13), flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#D1D1D1'}} horizontal>
                  <View style={{marginTop: wp(1)}}>
                    <View style={{marginLeft: wp(8)}}>
                      <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>Currency</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: wp(1), paddingLeft: wp(8), paddingHorizontal: wp(4)}}>
                      <View style={{marginLeft:wp(1), width: wp(39), flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>INR</Text>
                        <Text style={{marginLeft: wp(1), color: '#5E5E5E', fontSize: wp(3)}}>1.00</Text>
                      </View>
                      <Image
                        style={{ marginLeft: wp(2), width: wp(3.5), height: wp(3.5), resizeMode: 'stretch' }}
                        source={require('../../../assets/images/trip_ideas/merchant/return.png')}
                      />
                      <View style={{marginLeft:wp(2), width: wp(39), flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>0.01</Text>
                        <Text style={{marginLeft: wp(1), color: '#5E5E5E', fontSize: wp(3), paddingLeft: wp(4)}}>GBP</Text>
                      </View>
                    </View>
                  </View>
                </View> */}
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
    imgBanner: {
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 2,
      height: wp(50),
      resizeMode: 'stretch'
    },
  });
