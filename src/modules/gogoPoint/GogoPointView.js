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

export default class GogoPointScreen extends React.Component {
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
                style={{width:'33%'}}
                onPress={() => this.props.navigation.navigate({
                    routeName: 'MyPoint',
                    params: { },
                  })
                }
              >
                <Image
                  style={{width: 16, height: 28, resizeMode: 'stretch'}}
                  source={require('../../../assets/images/category/back.png')}
                />
              </TouchableOpacity>
              <View style={{width:'34%', alignContent: 'center', alignItems:'center'}}>
                <Text style={{fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center", }}>
                Gogo $
                </Text>
              </View>
              <View style={{width:'33%', justifyContent: 'flex-end', flexDirection: 'row'}}>
                <Image
                  style={{width: 21, height: 21, resizeMode: 'stretch', alignSelf: 'flex-end'}}
                  source={require('../../../assets/images/magnifying-glass.png')}
                />
                <Image
                  style={{marginLeft: 10, width: 21, height: 21, resizeMode: 'stretch', alignSelf: 'flex-end', marginRight: 40}}
                  source={require('../../../assets/images/filter.png')}
                />
              </View>
            </Animated.View>
          </Animated.View>
          <View style={{backgroundColor: "#C6C6C6", height:2, marginTop: 0, width: '100%'}} />
          <View style={{backgroundColor: "#FCFCFC"}}>
            <View style={[{ marginTop:11, marginBottom: 4, width: '100%', marginLeft: 12, justifyContent: 'center' }]}>
              <Text style={{fontSize: 17, fontFamily: fonts.primarySemiBold, color: "#333131", }}>
              Transaction
              </Text>
            </View>
            <View styles={{marginTop: 10, marginLeft: 0, justifyContent: 'space-between', flexDirection: 'row'}}>
              <View style={{marginLeft: 0, flexDirection: 'row'}}>
                <Text style={{marginLeft: 45, width: 35, fontSize: 15, fontFamily: fonts.primaryRegular, color: '#8E8888'}}>Date</Text>
                <Text style={{marginLeft: 19, fontSize: 15, fontFamily: fonts.primaryRegular, color: '#8E8888'}}>Booking Reference</Text>
              </View>
              <Text style={{marginHorizontal: 24, fontSize: 15, fontFamily: fonts.primaryRegular, color: '#8E8888'}}>Dollars</Text>
            </View>
            <View style={styles.Category}>
              <View style={{flexDirection: "row", marginLeft: 0, marginHorizontal: 17, height: 34, justifyContent: 'space-between'}}>
                <View style={{flexDirection: "row", justifyContent: 'center'}}>
                  <Image
                    style={{alignSelf:'center', marginLeft: 17, width: 34, height: 30, resizeMode: 'stretch'}}
                    source={require('../../../assets/images/my_point/gogo.png')}
                  />
                  <Text style={{alignSelf:'center', marginLeft: 10, width: 60, fontSize: 15, fontFamily: fonts.primarySemiBold, color: '#ACACAC'}}>Gogo $</Text>
                  <Text style={{alignSelf:'center', marginLeft: 40, width: 80, fontSize: 25, fontFamily: fonts.primarySemiBold, color: '#333131'}}>$ 579</Text>
                </View>
                <View style={{flexDirection: "row", marginHorizontal: 17, justifyContent: 'center'}}>
                  <Image
                    style={{alignSelf:'center', width: 13, height: 17, resizeMode: 'stretch'}}
                    source={require('../../../assets/images/home/arrow.png')}
                  />
                </View>
              </View>
            </View>
            <View style={styles.Category}>
              <View style={{flexDirection: "row", marginLeft: 0, marginHorizontal: 17, height: 34, justifyContent: 'space-between'}}>
                <View style={{flexDirection: "row", justifyContent: 'center'}}>
                  <Image
                    style={{alignSelf:'center', marginLeft: 17, width: 34, height: 30, resizeMode: 'stretch'}}
                    source={require('../../../assets/images/my_point/travel.png')}
                  />
                  <Text style={{alignSelf:'center', marginLeft: 10, width: 60, fontSize: 15, fontFamily: fonts.primarySemiBold, color: '#ACACAC'}}>Travel $</Text>
                  <Text style={{alignSelf:'center', marginLeft: 40, width: 80, fontSize: 25, fontFamily: fonts.primarySemiBold, color: '#333131'}}>$ 300</Text>
                </View>
                <View style={{flexDirection: "row", marginHorizontal: 17, justifyContent: 'center'}}>
                  <Image
                    style={{alignSelf:'center', width: 13, height: 17, resizeMode: 'stretch'}}
                    source={require('../../../assets/images/home/arrow.png')}
                  />
                </View>
              </View>
            </View>
            <View style={styles.Category}>
              <View style={{flexDirection: "row", marginLeft: 0, marginHorizontal: 17, height: 34, justifyContent: 'space-between'}}>
                <View style={{flexDirection: "row", justifyContent: 'center'}}>
                  <Image
                    style={{alignSelf:'center', marginLeft: 17, width: 34, height: 30, resizeMode: 'stretch'}}
                    source={require('../../../assets/images/my_point/cash.png')}
                  />
                  <Text style={{alignSelf:'center', marginLeft: 10, width: 60, fontSize: 15, fontFamily: fonts.primarySemiBold, color: '#ACACAC'}}>Cash</Text>
                  <Text style={{alignSelf:'center', marginLeft: 40, width: 80, fontSize: 25, fontFamily: fonts.primarySemiBold, color: '#333131'}}>$70</Text>
                </View>
                <View style={{flexDirection: "row", marginHorizontal: 17, justifyContent: 'center'}}>
                  <Image
                    style={{alignSelf:'center', width: 13, height: 17, resizeMode: 'stretch'}}
                    source={require('../../../assets/images/home/arrow.png')}
                  />
                </View>
              </View>
            </View>
            <View style={{height: 30}} />
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
  countryView: {
    marginLeft: 6, 
    borderRadius: 4, 
    height: 27, 
    borderColor: '#0093DD', 
    borderWidth: 1, 
    paddingLeft: 14, 
    paddingRight: 14, 
    justifyContent: 'center',
    color: '#0093DD'
  },
  countryText: {
    fontSize: 13, 
    fontFamily: fonts.primaryRegular,
    color: '#0093DD'
  },
  Category: {
    marginLeft: 12, 
    marginTop: 12, 
    marginHorizontal: 12, 
    shadowColor: '#000000', 
    shadowOffset: {width:2, height:2}, 
    shadowOpacity: 0.4, 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    backgroundColor: "#FFFFFF", 
    borderRadius: 4, 
    height: 100
  },
  Question: {
    marginLeft: 12, 
    marginTop: 4, 
    marginHorizontal: 12, 
    shadowColor: '#000000', 
    shadowOffset: {width:2, height:2}, 
    shadowOpacity: 0.4, 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#ddd', 
    backgroundColor: "#FFFFFF", 
    borderRadius: 4, 
    height: 28
  },
});
