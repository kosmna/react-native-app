
import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { CheckBox } from 'react-native-elements'
import { Text } from '../../../components/StyledText';
import { fonts } from '../../../styles';

export default class GiftCardPaymentMethodScreen extends React.Component {
    state = {
      checked1: false,
      checked2: false,
    };

    render() {
      return (
        <ScrollView style={styles.container}>
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
                  source={require('../../../../assets/images/category/back.png')}
                />
              </TouchableOpacity>
              <View style={{ width: '80%', alignContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                Select Payment Method
                </Text>
              </View>
              <View style={{ width: '10%', justifyContent: 'flex-end' }} />
            </Animated.View>
          </Animated.View>
          <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 2, width: '100%' }} />
          <View style={{marginTop: 0, width: '100%', backgroundColor: '#FFF', height: 53, justifyContent: 'center', alignItems: 'center', borderBottomColor: '#F1F1F1', borderBottomWidth: 2}}>
            <View style={{flexDirection: "row"}}>
              <Text style={{fontSize: 16, fontWeight: '600', color: '#0093DD'}}>Total Payable</Text>
              <Text style={{fontSize: 16, fontWeight: '600', color: '#0093DD'}}> $ 50</Text>
            </View>
          </View>
          <View style={{marginTop: 0, width: '100%', height: 60, justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F5F5', flexDirection: "row"}}>
            <View style={{marginTop: 11, marginLeft: 18, flexDirection: 'row'}}>
              <Image
                style={{width: 70, height: 35, resizeMode: 'stretch'}}
                source={require('../../../../assets/images/my_point/bookngogo_gift_card/gogo.png')}
              />
              <Text style={{marginLeft: -25, fontSize: 18, fontWeight: '600', color: '#0193DD'}}>Card</Text>
            </View>
            <View style={{marginTop: 0, marginHorizontal: 18, flexDirection: 'row'}}>
              <Text style={{fontSize: 14, color: '#515151'}}>Available Balance: </Text>
              <Text style={{fontSize: 14, fontWeight: '600', color: '#515151'}}> $300</Text>
            </View>
          </View>
          <View style={{marginLeft: wp(3.5), marginHorizontal: wp(6.5), width: '100%', height: wp(24), justifyContent: 'space-between', flexDirection: 'row'}}> 
            <View style={{marginTop: wp(3.25), flexDirection: 'row'}}>
              <View>
                <CheckBox
                  containerStyle={{marginLeft: 0, marginTop: 0, width: wp(5), height: wp(5)}}
                  checked={this.state.checked1}
                  onPress={() => {const {checked1} = this.state; this.setState({checked1: !checked1})}}
                />
              </View>
              <View style={{marginLeft: wp(2)}}>
                <Text style={{color: '#040404', fontSize: 13}}>Name on the card</Text>
                <Text style={{color: '#040404', fontSize: 14, fontWeight: '600'}}>Jones Nick</Text>
                <Text style={{color: '#7A7C80', fontSize: 15}}>364x xxxx xxxx 3785</Text>
              </View>
              <View style={{marginLeft: wp(1), alignItems: 'center'}}>
                <Text style={{color: '#040404', fontSize: 13}}>Expire</Text>
                <Text style={{color: '#040404', fontSize: 14, fontWeight: '600'}}> </Text>
                <Text style={{color: '#7A7C80', fontSize: 15}}>07/22</Text>
              </View>
              <View style={{marginLeft: wp(1), alignItems: 'center'}}>
                <Text style={{color: '#040404', fontSize: 13}}>CVV</Text>
                <Text style={{color: '#040404', fontSize: 14, fontWeight: '600'}}> </Text>
                <View style={{width: wp(12.5), height: wp(6), borderRadius: wp(1), backgroundColor: '#F1EFEF'}} />
              </View>
            </View>
            <View style={{marginTop: wp(3.25), marginHorizontal: wp(6.5), alignItems: 'center'}}>
              <Text style={{color: '#040404', fontSize: 13}}>Use</Text>
              <Text style={{color: '#040404', fontSize: 14, fontWeight: '600'}}> </Text>
              <View style={{width: wp(12.5), height: wp(6), borderRadius: wp(1), backgroundColor: '#F1EFEF'}}>
                <Text style={{color: '#7A7C80', fontSize: 15, fontWeight: '600'}}>$</Text>
              </View>
            </View>
          </View>
          <View style={{marginTop: 0, width: '100%', height: wp(12), justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F5F5', flexDirection: "row"}}>
            <View style={{marginTop: 0, marginLeft: 18, flexDirection: 'row'}}>
              <Text style={{fontSize: 18, fontWeight: '600', color: '#515151'}}>Default Card</Text>
            </View>
            <View style={{marginTop: 0, marginHorizontal: 18, flexDirection: 'row'}}>
              <Text style={{fontSize: 14, color: '#515151'}}>Remaining Balance: </Text>
              <Text style={{fontSize: 14, fontWeight: '600', color: '#515151'}}> $</Text>
            </View>
          </View>
          <View style={{marginLeft: wp(3.5), marginHorizontal: wp(6.5), width: '100%', height: wp(24), justifyContent: 'space-between', flexDirection: 'row', shadowOffset:{  width: 10,  height: 10,  }, shadowColor: 'black', shadowOpacity: 1.0,}}> 
            <View style={{marginTop: wp(3.25), flexDirection: 'row'}}>
              <View>
                <CheckBox
                  containerStyle={{marginLeft: 0, marginTop: 0, width: wp(5), height: wp(5)}}
                  checked={this.state.checked2}
                  onPress={() => {const {checked2} = this.state; this.setState({checked2: !checked2})}}
                />
              </View>
              <View style={{marginLeft: wp(2)}}>
                <Text style={{color: '#040404', fontSize: 13}}>Name on the card</Text>
                <Text style={{color: '#040404', fontSize: 14, fontWeight: '600'}}>Jones Nick</Text>
                <Text style={{color: '#7A7C80', fontSize: 15}}>364x xxxx xxxx 3785</Text>
              </View>
              <View style={{marginLeft: wp(1), alignItems: 'center'}}>
                <Text style={{color: '#040404', fontSize: 13}}>Expire</Text>
                <Text style={{color: '#040404', fontSize: 14, fontWeight: '600'}}> </Text>
                <Text style={{color: '#7A7C80', fontSize: 15}}>07/22</Text>
              </View>
              <View style={{marginLeft: wp(1), alignItems: 'center'}}>
                <Text style={{color: '#040404', fontSize: 13}}>CVV</Text>
                <Text style={{color: '#040404', fontSize: 14, fontWeight: '600'}}> </Text>
                <View style={{width: wp(12.5), height: wp(6), borderRadius: wp(1), backgroundColor: '#F1EFEF'}} />
              </View>
            </View>
            <View style={{marginTop: wp(3.25), marginHorizontal: wp(6.5), alignItems: 'center'}} />
          </View>
          <View style={{marginTop: 0, width: '100%', height: wp(3), justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F5F5', flexDirection: "row"}} />
          <View style={{marginLeft: wp(3.5), marginHorizontal: wp(6.5), width: '100%', height: wp(13), justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}> 
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#7A7C80', fontSize: 14}}>Saved debit/credit card</Text>
            </View>
            <View style={{marginHorizontal: wp(10), alignItems: 'center'}}>
              <Image
                style={{ width: 12, height: 12, resizeMode: 'stretch' }}
                source={require('../../../../assets/images/my_point/right_arrow.png')}
              />
            </View>
          </View>
          <View style={{marginTop: 0, width: '100%', height: wp(10), justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F5F5', flexDirection: "row"}}>
            <View style={{marginTop: 0, marginLeft: 18, flexDirection: 'row'}}>
              <Text style={{fontSize: 18, fontWeight: '600', color: '#515151'}}>Add another card</Text>
            </View>
            <View style={{marginTop: 0, marginHorizontal: 18, flexDirection: 'row'}} />
          </View>
          <View style={{marginLeft: wp(3.5), marginHorizontal: wp(6.5), width: '100%', height: wp(13), justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center'}}> 
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{color: '#515151', fontSize: 14}}>Add debit/credit card</Text>
            </View>
            <View style={{marginHorizontal: wp(10), alignItems: 'center'}}>
              <Image
                style={{ width: 12, height: 12, resizeMode: 'stretch' }}
                source={require('../../../../assets/images/my_point/right_arrow.png')}
              />
            </View>
          </View>
          <TouchableOpacity style={{marginTop: 30, backgroundColor: '#0093DD', height: 60, width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{ fontSize: 18, color: "#FCFEFF", fontWeight: '600'}}>
            Pay Now
            </Text>
          </TouchableOpacity>
        </ScrollView>
      );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    textInput: {
      marginTop: -6,
      color: '#7A7C80',
      fontSize: wp(3.5),
  },
});
