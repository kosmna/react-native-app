
import React from 'react'
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Text } from '../../../components/StyledText'
import { fonts } from '../../../styles'

export default class OtherGiftCardListScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => {
        return (
          <View style={{ flex: 1, flexDirection: "row-reverse" }}>
            <View>
              <Image
                style={{ width: 21, height: 21, resizeMode: 'stretch', alignSelf: 'flex-end', marginRight: 40 }}
                source={require('../../../../assets/images/category/search.png')}
              />
            </View>

            <View style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
                {navigation.getParam('headerTitle') ?? "Explorer"}
              </Text>
            </View>
          </View>
        )
      }
    }
  }

  state = {
    merchantList: this.props.navigation.getParam('merchantList'),
    userInfo: this.props.navigation.getParam('userInfo'),
  };

  _renderMerchantList() {
    const merchantListView = []
    for (let i = 0; i < this.state.merchantList.length; i++) {
      merchantListView.push(
        <View key={'merchantItemView' + i}>
          <TouchableOpacity
            style={{ height: 97, flexDirection: "row", marginHorizontal: wp(10), justifyContent: 'space-between' }}
            onPress={() => this.props.navigation.navigate({
              routeName: 'OtherGiftCard',
              params: { giftData: this.state.merchantList[i], userInfo: this.state.userInfo },
            })
            }
          >
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{ alignItems: 'center', justifyContent: "center", marginRight: wp(2) }}
              >
                <Image
                  style={{ width: wp(15), height: wp(15), resizeMode: 'stretch', alignSelf: 'center' }}
                  source={{ uri: this.state.merchantList[i].logo_url.replace('http://', 'https://') }}
                />
              </View>
              <View style={{ marginLeft: wp(2), justifyContent: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#787473' }}> {this.state.merchantList[i].brand_name ?? this.state.merchantList[i].name} </Text>
                {/* <Text style={{ fontSize: 15, color: '#A2A2A4', marginTop: 5 }}> { (this.state.merchantList[i].value_restriction_list === undefined) ? (this.state.merchantList[i].brand_id) : ('$' + this.state.merchantList[i].value_restriction_list[0].value + ' - $' + this.state.merchantList[i].value_restriction_list[this.state.merchantList[i].value_restriction_list.length - 1].value) } </Text> */}
              </View>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={{ alignSelf: 'center', width: 13, height: 17, resizeMode: 'stretch' }}
                source={require('../../../../assets/images/home/arrow.png')}
              />
            </View>
          </TouchableOpacity>
          <View style={{ width: '100%', height: 1, backgroundColor: 'rgba(198, 198, 198, 0.14)' }} />
        </View>
      )
    }

    return merchantListView
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          <View style={{ backgroundColor: "#FFFFFF" }}>
            {this._renderMerchantList()}
            <View style={{ width: '100%', height: 1, marginTop: 20 }} />
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  statusItem: {
    marginLeft: 0,
    height: 27,
    borderColor: '#0093DD',
    borderWidth: 1,
    justifyContent: 'center',
    color: '#0093DD'
  },
  statusItemFirst: {
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 4
  },
  statusItemLast: {
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4
  },
  statusItemPrimary: {
    backgroundColor: '#007AFF'
  },
  statusText: {
    fontSize: 13,
    fontFamily: fonts.primaryRegular,
    color: '#0093DD',
    alignSelf: 'center'
  },
  statusTextPrimary: {
    color: '#FFFFFF'
  },
  textInput: {
    alignSelf: 'stretch',
    width: '100%',
    marginTop: 2,
    color: '#7A7C80',
    fontSize: wp(4.5)
  },
})
