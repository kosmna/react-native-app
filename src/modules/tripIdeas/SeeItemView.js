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
import AutoResizeHeightWebView from 'react-native-autoheight-webview';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Carousel, { Pagination } from 'react-native-snap-carousel'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

import { GetObjectForKey } from '../../components/AsyncStore';
import { GetTriposoPoiById } from '../backend/triposo';
import { Text } from '../../components/StyledText';
import { fonts } from '../../styles';

const LoadingView = () => (
  <ShimmerPlaceHolder
    style={{ width: wp(100), height: wp(50), marginLeft: 0, marginTop: 0, marginRight: wp(0), opacity: 0.5 }}
    autoRun
  />
)

export default class SeeItemScreen extends React.Component {
    state = {
      userData: null,
      location: null,
      id: null,
      descriptionDetail: false,
      loadingList: true,
      images: [],
      activeSlide: 0,
      features: [],
      Height: wp(25),
    };
    
    componentDidMount() {
      const id = this.props.navigation.getParam('id');
      this.setState({id});
      GetObjectForKey('userData').then(userData => {
        this.setState({userData});
        this._getTriposoPoiById();
      }).catch(()=>{ 

      });
    }
    
    onNavigationChange(event) {
      if (event.title) {
          const htmlHeight = Number(event.title) 
          this.setState({Height:htmlHeight});
      }
   }

    _getTriposoPoiById() {
      const {userData} = this.state;
      GetTriposoPoiById(userData.partner_id, userData.partner_referral_code, this.state.id).then(result => {
        if (result.success) {
          const images = [];
          const location = result.result;
          this.setState({loadingList: true});
          for (let i=0; i<location.images.length; i += 1)
          {
            try {
              images.push(location.images[i].sizes.medium.url.replace("http:", "https:"));
            } 
            catch (e) {
              console.error(e.message);
            }
          }
          const features = [];
          for (let j=0; j<location.tag_labels.length; j+=1) {
            const tag_label = location.tag_labels[j];
            if (tag_label.startsWith("poitype-")) {
              features.push(tag_label.substring(8).toLowerCase());
            }
            if (tag_label.startsWith("subtype-")) {
              features.push(tag_label.substring(8).toLowerCase().replace("_", " | "));
            }
          }
          this.setState({
            location,
            images,
            activeSlide: 0,
            features,
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
      const {location, features} = this.state;
      let destinationName = "Loading...";
      let introduction = "";
      const carouselViews = [];
      const featureItemViews = [];
      if (location !== null)
      {
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

        destinationName = location.name;
        if (destinationName.length > 40)
          destinationName = `${destinationName.substring(0, 40)  }...`;

        introduction = location.intro;
        if (introduction.length > 256 && !this.state.descriptionDetail) {
          introduction = `${introduction.substring(0, 256)  }...`;
        }

        for (let j=0; j<features.length; j+=1) {
          featureItemViews.push(
            <View style={{marginRight: wp(1), borderRadius: 6, borderColor: '#BEBEBE', borderWidth: 1, justifyContent: 'center', alignItems: 'center', padding: wp(0.5)}}>
              <Text style={{color: '#BEBEBE', fontSize: wp(2.75)}}>
                {features[j]}
              </Text>
            </View>
          );
        }

        carouselViews.push(
          <View style={{marginTop: wp(2), paddingLeft: wp(5), flexDirection: 'row'}}>
            {featureItemViews}
          </View>
        );
        carouselViews.push(
          <View style={{marginTop: wp(2.5), width: wp(100), height: wp(0.25), borderWidth: wp(0.25), borderColor: '#BEBEBE', opacity: 0.3}} />
        );

        const {properties} = location;
        for (let i=0; i<properties.length; i+=1)
        {
          carouselViews.push(
            <View style={{marginTop: wp(2.5), paddingLeft: wp(5), paddingRight: wp(10), flexDirection: 'row'}}>
              <View style={{width: wp(40)}}>
                <Text style={{fontSize: wp(3.25), color: '#717171'}}>{properties[i].name}</Text>
              </View>
              <View style={{marginLeft: wp(5), width: wp(40)}}>
                <Text style={{fontSize: wp(3.25), color: '#717171'}}>{properties[i].value}</Text>
              </View>
            </View>
          );
        }

        carouselViews.push(
          <View style={{marginTop: wp(2.5), width: wp(100), height: wp(0.25), borderWidth: wp(0.25), borderColor: '#BEBEBE', opacity: 0.3}} />
        );

        let moreText = "More";
        if (this.state.descriptionDetail) {
          moreText = "Less";
        }
    
        carouselViews.push(
          <View style={{marginTop: wp(3), marginLeft: wp(5), }}>
            <View>
              <Text style={{color: '#4D4D4D', fontSize: wp(4), fontWeight: '600'}}>
              Overview
              </Text>
            </View>
          </View>
        );
        carouselViews.push(
          <View style={{marginTop: wp(1), width: wp(90), marginLeft: wp(5), marginHorizontal: wp(5), }}>
            <Text style={{color: '#4D4D4D', fontSize: wp(3.25)}}>
              {introduction}
            </Text>
          </View>
        );
        carouselViews.push(
          <TouchableOpacity 
            style={{marginTop: wp(1), width: wp(100), paddingRight: wp(5), justifyContent: 'flex-end', alignItems: 'flex-end'}}
            onPress={() => {
                if (this.state.descriptionDetail)
                  this.setState({descriptionDetail: false});
                else
                  this.setState({descriptionDetail: true});
              }
            }
          >
            <Text style={{color: '#0093DD', fontSize: wp(3.25), }}>
              {moreText}
            </Text>
          </TouchableOpacity>
        );

        const {sections} = location.content;
        for (let i=1; i<sections.length; i+=1)
        {
          const section = sections[i];
          carouselViews.push(
            <View style={{marginTop: wp(4), paddingLeft: wp(5), paddingRight: wp(5)}}>
              <Text style={{fontSize: wp(4), color: '#4D4D4D', fontWeight: '600'}}>{section.title}</Text>
            </View>
          );
          if (section.body != null)
          {
            const body = `<head>
            <style>
            body { font-size: ${wp(3.25)}px; color: #4D4D4D; }
            </style>
            </head>
            <body>${section.body}</body>
            </html>`;

            carouselViews.push(
              <View style={{marginTop: wp(2), paddingLeft: wp(5), paddingRight: wp(5), width: wp(100), }}>
                <AutoResizeHeightWebView
                  defaultHeight={wp(25)}
                  style={{backgroundColor:'white', width: wp(90)}}
                  source={{html: body}}
                />
              </View>
            );
          }
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
                <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                  {destinationName}
                </Text>
              </View>
              <View style={{ width: '10%', justifyContent: 'center', flexDirection: 'row' }} />
            </Animated.View>
          </Animated.View>
          <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12.5, width: '100%' }} />
          <ScrollView style={styles.container}>            
            <View style={{ backgroundColor: "#FCFCFC" }}>
              {
                this.state.loadingList ? <LoadingView />
                  : carouselViews  
              }
              <View style={{marginTop: wp(2.5), width: wp(100), height: wp(0.25), borderWidth: wp(0.25), borderColor: '#BEBEBE', opacity: 0.3}} />
              {/* <View style={{marginTop: wp(2.5), marginLeft: wp(5), width: wp(90), height: wp(12), backgroundColor: '#0093DD', alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{color: '#FFFFFF', fontSize: wp(4), fontWeight: '600'}}>
                Check Dates & Options
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
