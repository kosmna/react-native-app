
import React from 'react';
import {
    StyleSheet,
    ScrollView,
    Animated,
    View,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Modal,
} from 'react-native';

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Text } from '../../components/StyledText';
import { fonts } from '../../styles';

export default class TicketScreen extends React.Component {
    state = {
      visibleConvert: true
    };
    
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
                  style={{ width: '10%' }}
                  onPress={() => this.props.navigation.goBack()}
                >
                  <Image
                    style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                    source={require('../../../assets/images/category/back.png')}
                  />
                </TouchableOpacity>
                <View style={{ width: '80%', alignContent: 'center', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                  Select Tickets
                  </Text>
                </View>
                <View style={{ width: '10%', justifyContent: 'flex-end' }} />
              </Animated.View>
            </Animated.View>
            <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12.5, width: '100%' }} />
            <ScrollView style={styles.container}>
              <View style={{ backgroundColor: "#FCFCFC" }}>
                <View style={{marginLeft: wp(5), marginHorizontal: wp(5), marginTop: wp(5), justifyContent: "space-between", flexDirection: 'row'}}>
                  <View>
                    <Text style={{color: '#5E5E5E', fontSize: wp(3.5), fontWeight: '600'}}>Universal Studio</Text>
                  </View>
                </View>
                <View style={{marginLeft: wp(5), marginHorizontal: wp(5), marginTop: wp(1.5), }}>
                  <Text style={{color: '#5E5E5E', fontSize: wp(3.5), }}>Florida, CA</Text>
                </View>
                <View style={{marginLeft: wp(5), marginHorizontal: wp(5), marginTop: wp(1.5), }}>
                  <Text style={{color: '#0D4BC8', fontSize: wp(3.5), }}>Valid any day till 30th March, 2020</Text>
                </View>
                <View style={{ backgroundColor: "#C6C6C6", height: 1, marginTop: wp(4), width: '100%' }} />
                <View style={{marginLeft: wp(5), marginHorizontal: wp(6), marginTop: wp(7), flexDirection: 'row', justifyContent: 'space-between'}}>
                  <View>
                    <Text style={{color: '#5E5E5E', fontSize: wp(3.5)}}>One full day adventure</Text>
                    <Text style={{color: '#5E5E5E', fontSize: wp(3.5), fontWeight: '600'}}>$80</Text>
                  </View>
                  <View style={{marginLeft: wp(15), flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{width: wp(5), height: wp(5), borderRadius: wp(2.5), borderWidth: wp(0.5), borderColor: '#A2A2A4', justifyContent: 'center', alignItems: 'center'}}>
                      <View style={{width: wp(2.5), height: wp(0.5), backgroundColor: '#A2A2A4'}} />
                    </View>
                    <Text style={{marginLeft: wp(4), marginTop: wp(0.5), color: '#5E5E5E', fontSize: wp(3.5)}}>2</Text>
                    <View style={{marginLeft: wp(4), width: wp(5), height: wp(5), borderRadius: wp(2.5), borderWidth: wp(0.5), borderColor: '#A2A2A4', justifyContent: 'center', alignItems: 'center'}}>
                      <View style={{marginTop: wp(-1), width: wp(0.5), height: wp(2.5), backgroundColor: '#A2A2A4'}} />
                      <View style={{marginTop: wp(-1.5), width: wp(2.5), height: wp(0.5), backgroundColor: '#A2A2A4'}} />
                    </View>
                  </View>
                </View>
              </View>
              <Modal
                animationType='fade'
                transparent
                visible={this.state.visibleConvert}
                onRequestClose={() => {
                        this.setState({ visibleConvert: false })
                    }}
              >
                <View style={{ flex: 1 }}>

                  <TouchableOpacity
                    style={{ flex: 0.5, opacity: 0.5, backgroundColor: 'gray' }}
                    onPress={() => this.setState({ visibleConvert: false })}
                  />

                  <View style={{ flex: 0.5, justifyContent: 'space-evenly', backgroundColor: '#fff' }}>
                    <View style={{ flexDirection: "row", justifyContent: 'center', marginHorizontal: wp(5), width: '100%' }}>
                      <View style={{marginTop: wp(2), width: wp(9), height: wp(0.5), backgroundColor: '#AEA8A8'}} />
                    </View>
                    <View style={{marginLeft: wp(5), marginHorizontal: wp(5), marginTop: wp(5), justifyContent: "space-between", flexDirection: 'row'}}>
                      <View>
                        <Text style={{color: '#6D6B6B', fontSize: wp(3.5), fontWeight: '600'}}>Price Summary</Text>
                      </View>
                    </View>
                    <View style={{marginLeft: wp(5), marginHorizontal: wp(6), marginTop: wp(4), flexDirection: 'row', justifyContent: 'space-between'}}>
                      <View>
                        <Text style={{color: '#5E5E5E', fontSize: wp(3)}}>One full day adventure</Text>
                        <Text style={{color: '#5E5E5E', fontSize: wp(3), fontWeight: '600'}}>$80</Text>
                      </View>
                      <View style={{marginLeft: wp(15), flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{marginLeft: wp(4), marginTop: wp(0.5), color: '#5E5E5E', fontSize: wp(3)}}>$160</Text>
                      </View>
                    </View>
                    <View style={{marginLeft: wp(5), marginHorizontal: wp(12), marginTop: wp(2), flexDirection: 'row', justifyContent: 'space-between'}}>
                      <View>
                        <Image
                          style={{ width: wp(14), height: wp(7), resizeMode: 'stretch' }}
                          source={require('../../../assets/images/event/gogo.png')}
                        />
                      </View>
                      <View style={{marginLeft: wp(15), flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{marginLeft: wp(4), marginTop: wp(0.5), color: '#5E5E5E', fontSize: wp(3)}}>5</Text>
                      </View>
                    </View>
                    <View style={{marginLeft: wp(5), marginHorizontal: wp(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                      <View style={{flexDirection: 'row'}}>
                        <Image
                          style={{ width: wp(6), height: wp(6), resizeMode: 'stretch' }}
                          source={require('../../../assets/images/event/heart.png')}
                        />
                        <Text style={{marginLeft: wp(1), color: '#0193DD', fontSize: wp(3)}}>given</Text>
                        <Image
                          style={{ marginLeft: wp(1), width: wp(14), height: wp(7), resizeMode: 'stretch' }}
                          source={require('../../../assets/images/event/gogo.png')}
                        />
                      </View>
                      <Text style={{marginLeft: wp(3), color: '#515455', fontSize: wp(3)}}>2</Text>
                    </View>
                    <View style={{ backgroundColor: "#C6C6C6", height: 1, marginTop: wp(4), width: '100%' }} />
                    <View style={{marginLeft: wp(5), marginHorizontal: wp(5), marginTop: wp(2), justifyContent: "space-between", flexDirection: 'row'}}>
                      <View>
                        <Text style={{color: '#6D6B6B', fontSize: wp(3.5), fontWeight: '600'}}>Details</Text>
                      </View>
                    </View>
                    <View style={{marginLeft: wp(5), marginHorizontal: wp(5), marginTop: wp(3), justifyContent: "space-between", flexDirection: 'row'}}>
                      <View>
                        <Text style={{color: '#6D6B6B', fontSize: wp(3.5)}}>Name</Text>
                      </View>
                    </View>
                    <View style={{ marginLeft: wp(5), marginTop: wp(6), backgroundColor: "#AEA8A8", height: 1, width: wp(60), }} />

                    {/* Convert Button */}
                    <TouchableOpacity
                      style={{ marginTop: wp(6), flexDirection: "row", height: wp(9), width: wp(100), backgroundColor: '#005B9E', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: wp(3.5), fontFamily: fonts.primarySemiBold, color: '#FFFFFF' }}>Complete Payment</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
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
