import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Text } from '../../components/StyledText';
import LinearGradient from 'react-native-linear-gradient';

export default class DealDetailScreen extends React.Component {
  state = { 
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {    
    
  }

  _renderOfferListView() {
    const offerList = this.props.navigation.getParam('data').offers_list;
    const offerListItemViews = [];
    for (let i = 0; i < offerList.length; i+=1) {
      let offerName = offerList[i];
      if (typeof offerName !== "string") {
        offerName = offerName.dscnt_mode;
      }

      offerListItemViews.push(
        <View key={'offerListItem' + i} style={{flexDirection: 'row', marginTop: 2}}>
          <Text style={{color: '#6D6B6B', fontSize: 20, fontFamily: "Open Sans"}}>{'\u2022 '}</Text>
          <Text style={{color: '#7A7C80', fontSize: 14, fontFamily: "Open Sans", marginTop: 3}}>{offerName}</Text>
        </View>
      );
      
    }
    return (
      <View style={{width: '100%', paddingTop: 8}}>
        {offerListItemViews}
      </View>
    )
  }
  
  _processBooking() {
    this.props.navigation.navigate({
      routeName: 'Frame',
      params: { url: { uri: this.props.navigation.getParam('data').mobile_link_url } },
    })
  }

  _renderConditionListView() {
    const conditionList = this.props.navigation.getParam('data').conditions;
    const conditionListItemViews = [];
    for (let i = 0; i < conditionList.length; i+=1) {
      conditionListItemViews.push(
        <View key={'conditionListItem' + i} style={{flexDirection: 'row', marginTop: 2}}>
          <Text style={{color: '#6D6B6B', fontSize: 20, fontFamily: "Open Sans"}}>{'\u2022 '}</Text>
          <Text style={{color: '#7A7C80', fontSize: 14, fontFamily: "Open Sans", marginTop: 3}}>{conditionList[i]}</Text>
        </View>
      );
    }
    return (
      <View style={{width: '100%', paddingTop: 8}}>
        {conditionListItemViews}
      </View>
    )
  }

  render() {
    const dealData = this.props.navigation.getParam('data');
    return (
      <SafeAreaView style={styles.container}>
        <View style={[{ paddingTop:10, width: '100%', marginLeft: 7, marginHorizontal: 7}]}>
          <View 
            style={[
              { height: 44, width: '100%' },
              {alignItems: 'center', justifyContent: 'space-between', flexDirection: "row", }
            ]}
          >
            <TouchableOpacity 
              style={{width:'33%'}}
              onPress={() => this.props.navigation.goBack() }>

              <Image
                style={{width: 16, height: 28, resizeMode: 'stretch'}}
                source={require('../../../assets/images/category/back.png')}
              />

            </TouchableOpacity>

            <View style={{width:'34%', alignContent: 'center', alignItems:'center'}}>
              <Text style={{fontSize: 18, fontFamily: "Open Sans", color: "#000000", alignSelf: "center", fontWeight: "600", }}>
                Deal
              </Text>
            </View>
            <View style={{width:'33%', justifyContent: 'flex-end', flexDirection: 'row'}}>              
            </View>
          </View>
        </View>
        <View style={{backgroundColor: "#C6C6C6", height:2, marginTop: 0, width: '100%'}} />
        <ScrollView style={styles.container}>
          <Image
            style={styles.imgBanner}
            source={{ uri: dealData.icon_url.replace('http://', 'https://') }}
          />

          <View style={{paddingHorizontal: 20 }}>
            <Text style={{width: '100%', color: "#126994", fontSize: 17, fontFamily: "Open Sans", fontWeight: "600", marginTop: 19}}>
              {dealData.name + ' | ' + dealData.code}
            </Text>

            <Text style={{width: '100%', color: "#5E5E5E", fontSize: 15, fontFamily: "Open Sans", fontWeight: "600", marginTop: 18 }}>
              Offer
            </Text>
            {this._renderOfferListView()}

            <View style={{width: '100%', height: 1, backgroundColor: 'rgba(202,204,207, 0.2)', marginTop: 20}}/>

            <Text style={{width: '100%', color: "#5E5E5E", fontSize: 15, fontFamily: "Open Sans", fontWeight: "600", marginTop: 19}}>
              Conditions
            </Text>
            {this._renderConditionListView()}
          </View>
          <View style={{width: '100%', height: 44, marginTop: 50, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity
							onPress={() => this._processBooking()}
						>
              <LinearGradient
                style={{
                        paddingHorizontal: 30,
                        height: '100%',
                        borderRadius: 6,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                colors = {['#0093DD', '#004A6F']}>
                  <Text style={{color: "#FFFFFF", fontSize: 17, fontFamily: "Open Sans", fontWeight: "600"}}>
                    Processed to booking
                  </Text>
              </LinearGradient>
            </TouchableOpacity>            
          </View>          
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBanner: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 2,
    borderRadius: 6,
    height: hp(30),
    resizeMode: 'stretch'
  },
});
