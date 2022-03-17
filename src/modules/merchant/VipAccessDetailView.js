import React from 'react';
import {
  StyleSheet,
  ScrollView,
  Animated,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Linking,
  SafeAreaView,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { Text } from '../../components/StyledText';
import { GetObjectForKey } from '../../components/AsyncStore';
import { VipReedomOffer } from '../backend/homeapi';
import SegmentedControlTab from "react-native-segmented-control-tab";
import AutoHeiWebView from '../../components/AutoHeiWebView';
import AutoHeightWebView from 'react-native-autoheight-webview';
import { Dimensions } from 'react-native';
import moment from "moment";
import { fonts } from '../../styles';

export default class VipAccessDetailView extends React.Component {    
    constructor() {
      super();
      this.state = {
        selectedIndex: 0,
        redeemList: [],
        tabTitles: [],
      };
    }

    handleIndexChange = index => {
      this.setState({
        ...this.state,
        selectedIndex: index
      });
    };

    _getVipMerchantItemData() {
      return this.props.navigation.getParam('data');
    }

    _capitalizeFirstLetter(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    _onContinueSiteClicked(strLink) {      
      if (strLink.length > 0) {
        Linking.openURL(strLink)
      }
    }
      
    _getRedeemInfo() {
      GetObjectForKey('userData').then(userData => {
        let offerData = this._getVipMerchantItemData();
        console.log("OFFFFER DATA = ", offerData);
        VipReedomOffer(userData.partner_id, userData.partner_referral_code, offerData.offer_key).then(result=>{
          if(result === null)
          {
            
          } else if(result.success) {
            var redeemListAry = result.redeem_list.filter(redeem => redeem.redemption_method !== 'call');            
            console.log('redeemListAry = ', redeemListAry);
            if((redeemListAry.some(redeem => redeem.redemption_method === "instore")) && (redeemListAry.some(redeem => redeem.redemption_method === "instore_print"))) {
              redeemListAry = redeemListAry.filter(redeem => redeem.redemption_method !== 'instore_print');
            }

            var tabTitleStrings = redeemListAry.map(function(item){
              var repMethod = item.redemption_method;
              if ((repMethod === 'instore') || (repMethod === 'instore_print')) {
                repMethod = 'in-store';
              }
              else if (repMethod === 'link') {
                repMethod = 'online';
              }
              return (repMethod.toUpperCase());
            });

            this.setState({ redeemList: redeemListAry, tabTitles: tabTitleStrings});
          } else {
            
          }
      
        }).catch((err)=>{ 
          console.log('error = ', err); 
        });
      });      
    }

    componentDidMount() {
      this._getRedeemInfo();
    }

    render() {
      let offerData = this._getVipMerchantItemData();
      let expDate = Date.parse(offerData.expires_on);      	
      const formattedDate = moment(expDate).format("MMM DD, YYYY");

      var centerContentView = [];
      if (this.state.redeemList.length > 0) {
          let curRepMode = this.state.redeemList[this.state.selectedIndex].redemption_method;
          if ((curRepMode == 'instore') || (curRepMode == 'instore_print')) {
            centerContentView.push(
              <View key={'instoreView'} style={{width: '100%'}}> 
                <AutoHeiWebView
                  style={{width: '100%'}}                  
                  source={{uri: this.state.redeemList[this.state.selectedIndex].details.link}}                  
                />
              </View>
            );
          }
          else if (curRepMode == 'link') {
             centerContentView.push(
              <View key={'linkView'} style={{width: '100%'}}> 
                <AutoHeightWebView
                  style={{left: '10%', width: '80%'}}
                  source={{html: '<p style="font-size:16;color:#A2A2A4;">' + this.state.redeemList[this.state.selectedIndex].details.display + '</p>'}}
                />
                { (this.state.redeemList[this.state.selectedIndex].details.link != undefined) && (
                    <View style={{width: '100%', height: 90, marginTop: 30, alignContent: 'center', alignItems: 'center'}}>
                      <TouchableOpacity 
                        style={{backgroundColor: '#00A4F6', width: 196, height: 40, borderRadius: 4,justifyContent: 'center', alignItems: 'center'}}
                        onPress={() => this._onContinueSiteClicked(this.state.redeemList[this.state.selectedIndex].details.link)}
                      >
                        <Text style={{color: '#FFFFFF'}}> Continue to Site</Text>
                      </TouchableOpacity>
                    </View>
                )}
              </View>
            );


          }
          else if (curRepMode == 'call') {
            centerContentView.push(
                <View key={'callView'} style={{width: '100%', height: '100%'}}>
                  <Text style={{width: '100%', fontFamily: fonts.primaryRegular, fontSize: 13, paddingHorizontal: 17, textAlign: 'center', color: '#00A4F6'}}>
                      To redeem, call on this number
                  </Text>
                  <Text style={{width: '100%', fontFamily: fonts.primaryRegular, fontSize: 22, marginTop: 5, textAlign: 'center', color: '#00A4F6'}}>
                      +1 213 456 7908
                  </Text>
                </View>
            );            
          }
      }
      
      
      return (
        <SafeAreaView style={styles.container}>
          <View style={[{ paddingTop:10, width: '100%', marginHorizontal: 7}]}>
            <View 
              style={[
                { height: 44, width: '100%' },
                {alignItems: 'center', justifyContent: 'flex-start', flexDirection: "row", }
              ]}
            >
              <TouchableOpacity 
                style={{width:'10%'}}
                onPress={() => this.props.navigation.goBack()}
              >
                <Image
                  style={{width: 16, height: 28, resizeMode: 'stretch'}}
                  source={require('../../../assets/images/category/back.png')}
                />
              </TouchableOpacity>
              <View style={{width:'80%', alignContent: 'center', alignItems:'center'}}>
                <Text style={{fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                Show
                </Text>
              </View>
            </View>
          </View>

          <View style={{backgroundColor: "#C6C6C6", height:2, marginTop: 10, width: '100%'}} />

          <ScrollView style={styles.container}>            
            <View style={{width: '100%', paddingHorizontal: 26, marginTop: 13}}>
              <SegmentedControlTab
                values={ this.state.tabTitles }
                selectedIndex={this.state.selectedIndex}
                activeTabStyle={{backgroundColor: '#00A4F6'}}
                activeTabTextStyle={{color: '#FFFFFF',  fontSize: 13}}
                tabTextStyle={{color: '#007AFF', fontSize: 13}}
                onTabPress={this.handleIndexChange}
              />
            </View>
            <View style={{width: '100%', marginTop: 16}}>
              {centerContentView}
            </View>

            <View style={{backgroundColor: "#CACCCF", height:1, width: '100%'}} />

            <View style={{paddingHorizontal: 17, paddingTop: 24, paddinbBottom: 20}}>
              <Text 
                style={{
                  color: '#6D6B6B',
                  fontSize: 12,
                  fontFamily: fonts.primarySemiBold
                }}>
                  Valid Through
              </Text>
              <Text 
                style={{
                  color: '#00A4F6',
                  fontSize: 14,
                  fontFamily: fonts.primaryRegular
                }}>
                { formattedDate }
              </Text>
            </View>

            <View style={{paddingHorizontal: 17, paddingTop: 24, paddinbBottom: 20}}>
              <Text 
                style={{
                  color: '#6D6B6B',
                  fontSize: 12,
                  fontFamily: fonts.primarySemiBold
                }}>
                  Terms & Conditions:
              </Text>
              <Text 
                style={{
                  color: '#6D6B6B',
                  fontSize: 12,
                  fontFamily: fonts.primaryRegular,
                  marginBottom: 20,
                }}>
                {offerData.terms_of_use}
              </Text>
            </View>

          </ScrollView>
        </SafeAreaView>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },  
});