/* eslint-disable linebreak-style */
import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
    SafeAreaView
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { GetObjectForKey } from '../../components/AsyncStore';
import { Text } from '../../components/StyledText';
import { fonts } from '../../styles';

export default class GetKnowScreen extends React.Component {
    state = {
      location: null,
      userData: null,
    };
    
    componentDidMount() {
      const location = this.props.navigation.getParam('location');
      this.setState({location});
      GetObjectForKey('userData').then(userData => {
        this.setState({userData});
      }).catch(()=>{ 

      });
    }

    render() {
      const {location} = this.state;
      let title = "Get to know ";
      if (location !== null)
      {
        title = location.name;
        if (location.name.length > 10)
          title = `Get to know ${location.name.substring(0, 10)}...`;
        else
          title = `Get to know ${location.name}`;
      }

      const backgrounds = [
        {title: "Wikivoyage", tag_labels: "Wikivoyage", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "History", tag_labels: "history", image: '../../../assets/images/trip_ideas/merchant/greek-column.png'},
        {title: "Culture", tag_labels: "culture", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Festivals", tag_labels: "celebrations", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Art", tag_labels: "art", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Food", tag_labels: "food|foodexperiences", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Districts", tag_labels: "district", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Learn", tag_labels: "Learn", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Sleep", tag_labels: "Sleep", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Connect", tag_labels: "Connect", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Go next", tag_labels: "Go next", image: '../../../assets/images/trip_ideas/merchant/information.png'},
      ];
      const backgroundItemViews = [];
      for (let i = 0; i < backgrounds.length; i+=1) {
        const background = backgrounds[i];
        const {image} = background;

        backgroundItemViews.push(
          <TouchableOpacity 
            style={{marginTop: wp(1.5), height: wp(11), alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF', flexDirection: 'row'}}
            onPress={() => this.props.navigation.push(
                  'TripIdeasSeeDo',
                  { "location_id": location.id, "title": background.title, tag_labels: background.tag_labels },
                )
              }
          >
            <Image
              style={{ marginLeft: wp(5), width: wp(4), height: wp(4), resizeMode: 'stretch' }}
              source={require('../../../assets/images/trip_ideas/merchant/information.png')}
            />
            <Text style={{marginLeft: wp(4), color: '#707070', fontSize: wp(3)}}>
              {background.title}
            </Text>
          </TouchableOpacity>
        );
      }

      const practicalities = [
        {title: "Transport", tag_labels: "transport", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Getting there", tag_labels: "gettingthere", image: '../../../assets/images/trip_ideas/merchant/greek-column.png'},
        {title: "Orientation", tag_labels: "orientation", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Safety", tag_labels: "safety", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Work", tag_labels: "work", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Health", tag_labels: "health", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Groceries", tag_labels: "groceries", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Money", tag_labels: "money", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Parking", tag_labels: "parking", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Post Offices", tag_labels: "postoffices", image: '../../../assets/images/trip_ideas/merchant/information.png'},
        {title: "Laundry", tag_labels: "laundry", image: '../../../assets/images/trip_ideas/merchant/information.png'},
      ];
      const practicalItemViews = [];
      for (let i = 0; i < practicalities.length; i+=1) {
        const practical = practicalities[i];
        const {image} = practical;

        practicalItemViews.push(
          <TouchableOpacity 
            style={{marginTop: wp(1.5), height: wp(11), alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF', flexDirection: 'row'}}
            onPress={() => this.props.navigation.push(
                  'TripIdeasSeeDo',
                  { "location_id": location.id, "title": practical.title, tag_labels: practical.tag_labels },
                )
              }
          >
            <Image
              style={{ marginLeft: wp(5), width: wp(4), height: wp(4), resizeMode: 'stretch' }}
              source={require('../../../assets/images/trip_ideas/merchant/information.png')}
            />
            <Text style={{marginLeft: wp(4), color: '#707070', fontSize: wp(3)}}>
              {practical.title}
            </Text>
          </TouchableOpacity>
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
                  {title}
                </Text>
              </View>
              <View style={{ width: '10%', justifyContent: 'center', flexDirection: 'row' }} />
            </Animated.View>
          </Animated.View>
          <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12.5, width: '100%' }} />
          <ScrollView style={styles.container}>              
            <View style={{ backgroundColor: "#FCFCFC" }}>
              <View style={{marginTop: wp(4), marginLeft: wp(3.5), }}>
                <View>
                  <Text style={{color: '#555454', fontSize: wp(3.5)}}>
                  BackGround
                  </Text>
                </View>
              </View>
              {backgroundItemViews}
              <View style={{marginTop: wp(6.5), marginLeft: wp(3.5), }}>
                <View>
                  <Text style={{color: '#555454', fontSize: wp(3.5)}}>
                  Practicalities
                  </Text>
                </View>
              </View>
              {practicalItemViews}
              <View style={{ height: 30 }} />
            </View>
            {/* <View style={{marginTop: wp(4), marginLeft: wp(3.5), }}>
              <View>
                <Text style={{color: '#555454', fontSize: wp(3.5)}}>
                Editorial
                </Text>
              </View>
            </View>
            <View style={{marginLeft: wp(3.25), marginHorizontal: wp(6), marginTop: wp(2), height: wp(22), justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF'}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={{ width: wp(24), height: wp(22), resizeMode: 'stretch' }}
                  source={require('../../../assets/images/trip_ideas/merchant/eiffel.png')}
                />
                <View style={{marginLeft:wp(2), paddingTop: wp(1), width: wp(70)}}>
                  <Text style={{color: '#515151', fontWeight: '600', fontSize: wp(3.25)}}>
                  Cricket
                  </Text>
                  <Text style={{color: '#515151', fontSize: wp(3)}}>
                  Known as the home of cricket, Lords is the most famous cricket ground in the world. It was built in 1814 and named after Thomas Lord, the owner of Marylebone Cricket Club
                  </Text>
                </View>
                <View style={{marginLeft: wp(8), marginTop: wp(1), width: wp(10), marginHorizontal: wp(6)}} />
              </View>
            </View>
            <View style={{marginLeft: wp(3.25), marginHorizontal: wp(6), marginTop: wp(2), height: wp(22), justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF'}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={{ width: wp(24), height: wp(22), resizeMode: 'stretch' }}
                  source={require('../../../assets/images/trip_ideas/merchant/eiffel.png')}
                />
                <View style={{marginLeft:wp(2), paddingTop: wp(1), width: wp(70)}}>
                  <Text style={{color: '#515151', fontWeight: '600', fontSize: wp(3.25)}}>
                  Cricket
                  </Text>
                  <Text style={{color: '#515151', fontSize: wp(3)}}>
                  Known as the home of cricket, Lords is the most famous cricket ground in the world. It was built in 1814 and named after Thomas Lord, the owner of Marylebone Cricket Club
                  </Text>
                </View>
                <View style={{marginLeft: wp(8), marginTop: wp(1), width: wp(10), marginHorizontal: wp(6)}} />
              </View>
            </View>
            <View style={{marginLeft: wp(3.25), marginHorizontal: wp(6), marginTop: wp(2), height: wp(22), justifyContent: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF'}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={{ width: wp(24), height: wp(22), resizeMode: 'stretch' }}
                  source={require('../../../assets/images/trip_ideas/merchant/eiffel.png')}
                />
                <View style={{marginLeft:wp(2), paddingTop: wp(1), width: wp(70)}}>
                  <Text style={{color: '#515151', fontWeight: '600', fontSize: wp(3.25)}}>
                  Cricket
                  </Text>
                  <Text style={{color: '#515151', fontSize: wp(3)}}>
                  Known as the home of cricket, Lords is the most famous cricket ground in the world. It was built in 1814 and named after Thomas Lord, the owner of Marylebone Cricket Club
                  </Text>
                </View>
                <View style={{marginLeft: wp(8), marginTop: wp(1), width: wp(10), marginHorizontal: wp(6)}} />
              </View>
            </View>
            <View style={{marginTop: wp(1.5), height: wp(11), justifyContent: 'center', alignItems: 'center', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#CACCCF'}}>
              <Text style={{color: '#9F9F9F', fontSize: wp(3.25)}}>
              See all 5 options
              </Text>
            </View>
            <View style={{marginTop: wp(6.5), marginLeft: wp(3.5), }}>
              <View>
                <Text style={{color: '#555454', fontSize: wp(3.5)}}>
                Mini Guides
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
            </View> */}
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
});
