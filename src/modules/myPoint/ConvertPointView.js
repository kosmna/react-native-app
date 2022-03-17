import React from 'react'
import {
  StyleSheet,
  ScrollView,
  Animated,
  View,
  TouchableOpacity,
  Image
} from 'react-native'

import { Text } from '../../components/StyledText'
import { fonts } from '../../styles'

export default class ConvertPointScreen extends React.Component {

  static navigationOptions = {
    title: 'Convert'
  }

  state = {

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
              style={{ width: '33%' }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Image
                style={{ width: 16, height: 28, resizeMode: 'stretch' }}
                source={require('../../../assets/images/category/back.png')}
              />
            </TouchableOpacity>
            <View style={{ width: '34%', alignContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                Convert
              </Text>
            </View>
            <View style={{ width: '33%', justifyContent: 'flex-end', flexDirection: 'row' }} />
          </Animated.View>
        </Animated.View>
        <View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 0 }} />
        <View style={{ backgroundColor: "#FCFCFC" }}>
          <View style={[{ marginTop: 30, marginBottom: 0, marginLeft: 23, justifyContent: 'center' }]}>
            <Text style={{ fontSize: 16, fontFamily: fonts.primaryRegular, color: "#918888", }}>
              Convert your Gogo$ to
            </Text>
          </View>
          <View style={[{ marginTop: 7, marginBottom: 0, marginLeft: 23, justifyContent: 'center' }]}>
            <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#515151" }}>
              50$
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginLeft: 27, marginHorizontal: 27, marginTop: 15, height: 46, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: "row", flex: 0.5, height: 46, borderWidth: 1, borderColor: '#ACACAC', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: '#7A7C80', marginTop: 11 }}>Travel $</Text>
            </View>
            <View style={{ flexDirection: "row", flex: 0.5, height: 46, marginLeft: 13, borderWidth: 1, borderColor: '#0093DD', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: '#7A7C80', marginTop: 11 }}>Cash</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", marginLeft: 27, marginHorizontal: 27, marginTop: 24, height: 40, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: "row", flex: 0.5, height: 40 }}>
              <Text style={{ fontSize: 16, fontFamily: fonts.primaryRegular, color: '#515151', marginTop: 11 }}>Converted value</Text>
            </View>
            <View style={{ flexDirection: "row", flex: 0.5, height: 40, marginLeft: 13, borderRadius: 4, justifyContent: 'center', backgroundColor: '#F6F4F4' }} />
          </View>
          <View style={{ backgroundColor: "#d0d0d0", height: 2, marginTop: 30 }} />
          <View style={{ flexDirection: "row", marginLeft: 27, marginHorizontal: 27, marginTop: 24, height: 40, justifyContent: 'space-between' }}>
            <View style={{ flexDirection: "row", flex: 0.5, height: 40, }}>
              <Text style={{ fontSize: 16, fontFamily: fonts.primaryRegular, color: '#515151', marginTop: 11 }}>Password</Text>
              <Image
                style={{ width: 22, height: 14, marginLeft: 4, resizeMode: 'stretch', marginTop: 15 }}
                source={require('../../../assets/images/my_point/eye.png')}
              />
            </View>
            <View style={{ flexDirection: "row", flex: 0.5, height: 40, marginLeft: 13, borderRadius: 4, justifyContent: 'center', backgroundColor: '#F6F4F4' }} />
          </View>
          <View style={{ flexDirection: "row", marginLeft: 40, marginHorizontal: 40, marginTop: 37, height: 45 }}>
            <TouchableOpacity
              style={{ flexDirection: "row", flex: 1, height: 45, justifyContent: 'center', backgroundColor: '#0070A0' }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Text style={{ fontSize: 17, fontFamily: fonts.primarySemiBold, color: '#FFFFFF', marginTop: 11 }}>Convert</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: "#d0d0d0", height: 1, marginTop: 23 }} />
          <View style={{ height: '100%', backgroundColor: '#FCFCFC' }}>
            <Text style={{ marginTop: 50, marginLeft: 30 }}>
              <Text style={{ fontSize: 12, color: '#ACACAC' }}>*Terms & Conditions</Text>
              <Text style={{ fontSize: 12, color: '#ACACAC' }}>{'\n'}- You cant switch back your travel$ to Gogo$</Text>
            </Text>
          </View>
          <View style={{ marginTop: 10, backgroundColor: '#FCFCFC' }} />
        </View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  Transaction: {
    marginLeft: 14,
    marginTop: 7,
    marginHorizontal: 14,
    justifyContent: 'center',
    borderLeftColor: '#38DE3D',
    borderLeftWidth: 7,
    borderRightWidth: 1,
    borderBottomWidth: 2,
    borderRightColor: '#ddd',
    borderBottomColor: '#ddd',
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    height: 67,
  },
})
