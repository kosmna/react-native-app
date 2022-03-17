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

import { Text } from '../../components/StyledText';
import { fonts } from '../../styles';

export default class MerchantDetailScreen extends React.Component {
  state = {
    
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.container}>
          <Animated.View style={[{ paddingTop:10, width: '100%', marginLeft: 7, marginHorizontal: 7}]}>
            <Animated.View 
              style={[
                { height: 44, width: '100%' },
                {alignItems: 'center', justifyContent: 'space-between', flexDirection: "row", }
              ]}
            >
              <TouchableOpacity 
                style={{width:'20%'}}
                onPress={() => this.props.navigation.goBack()}
              >
                <Image
                  style={{width: 16, height: 28, resizeMode: 'stretch'}}
                  source={require('../../../assets/images/category/back.png')}
                />
              </TouchableOpacity>
              <View style={{width:'60%', alignContent: 'center', alignItems:'center'}}>
                <Text style={{fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                Octopus Resort
                </Text>
              </View>
              <View style={{width:'20%', justifyContent: 'flex-end', flexDirection:'row'}}>
                <Image
                  style={{width: 18, height: 18, resizeMode: 'stretch', alignSelf: 'flex-end'}}
                  source={require('../../../assets/images/merchant/ring.png')}
                />
                <Image
                  style={{marginLeft: 10, width: 21, height: 21, resizeMode: 'stretch', alignSelf: 'flex-end', marginRight: 40}}
                  source={require('../../../assets/images/merchant/discuss-issue.png')}
                />
              </View>
            </Animated.View>
          </Animated.View>
          <View style={{backgroundColor: "#C6C6C6", height:2, marginTop: 0, width: '100%'}} />
          <View style={[{ marginTop:14, marginLeft: 20, marginRight: 20, marginBottom: 13}]}>
            <View style={{flexDirection: 'row'}}>
              <View 
                style={[
                  { 
                    marginLeft: 0, marginHorizontal: 0, flex: 1
                  }
                ]}
              >
                <Text style={{fontFamily: fonts.primaryRegular}}>
                  <Text style={{fontSize: 15, fontFamily: fonts.primarySemiBold, color: '#515151'}}>Welcome to</Text>
                  <Text style={{fontSize: 14, fontFamily: fonts.primaryRegular, color: '#7A7C80'}}>{"\n"}Octopus Resort</Text>
                  <Text style={{fontSize: 13, fontFamily: fonts.primaryRegular, marginTop: 7, color: '#515151', }}>{"\n"}{"\n"}You will find some of the best snorkeling and diving in Fiji.Our beautiful coral reef, a protected marine reserve, is steps from the sand.</Text> 
                  <Text style={{fontSize: 13, fontFamily: fonts.primaryRegular, marginTop: 7, color: '#515151', }}>{"\n"}{"\n"}With a keen focus on the Fijian culture and a strong connection with the local village, the resort offers what Fiji is all about, and boasts some of the warmest, friendliest people anywhere in the world.</Text> 
                </Text>

              </View>
            </View>
          </View>
          <View style={{marginLeft: 23, marginTop: 20}}>
            <Text style={{fontSize: 17, color: '#484848', fontWeight: '600'}}>Gallery</Text>
          </View>
          <View style={{marginLeft: 19, marginTop: 14, marginHorizontal: 30, flexDirection: "row", justifyContent: 'flex-start'}}>
            <View style={{width: 81, height: 81, justifyContent: 'center', borderRadius: 5}}>
              <Image
                style={{width: 81, height: 81, alignSelf: "center", resizeMode: 'stretch'}}
                source={require('../../../assets/images/merchant/gallery1.png')}
              />
            </View>
            <View style={{width: 81, height: 81, justifyContent: 'center', borderRadius: 5, marginLeft: 3}}>
              <Image
                style={{width: 81, height: 81, alignSelf: "center", resizeMode: 'stretch'}}
                source={require('../../../assets/images/merchant/gallery2.png')}
              />
            </View>
            <View style={{width: 81, height: 81, justifyContent: 'center', borderRadius: 5, marginLeft: 3}}>
              <Image
                style={{width: 81, height: 81, alignSelf: "center", resizeMode: 'stretch'}}
                source={require('../../../assets/images/merchant/gallery3.png')}
              />
            </View>
            <View style={{width: 81, height: 81, justifyContent: 'center', borderRadius: 5, marginLeft: 3}}>
              <Image
                style={{width: 81, height: 81, alignSelf: "center", resizeMode: 'stretch'}}
                source={require('../../../assets/images/merchant/gallery4.png')}
              />
            </View>
          </View>
          <TouchableOpacity 
            style={{flex:1, marginTop: 10, marginHorizontal: 30, flexDirection: 'row-reverse'}}
          >
            <Text style={{fontSize: 15, color: '#0093DD'}}>More</Text>
          </TouchableOpacity>
          <View style={{backgroundColor: "#C6C6C6", height:1, marginTop: 18, width: '100%'}} />
          <View style={{marginTop: 8, marginBottom: 8, marginLeft: 23, marginRight: 41, justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={{fontSize: 15, color: '#100F0F'}}>Check-in 2 PM</Text> 
            <Text style={{fontSize: 15, color: '#100F0F'}}>Check-out 11 AM</Text>
          </View>
          <View style={{backgroundColor: "#C6C6C6", height:1, marginTop: 6, width: '100%'}} />
          <View style={{height:10}} />
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
