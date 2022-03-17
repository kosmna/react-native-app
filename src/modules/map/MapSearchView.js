import React from 'react'
import { Image, SafeAreaView, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import MapView from 'react-native-map-clustering'
import { Marker } from 'react-native-maps'
import FilterView from '../../components/FilterView'
import Loading from '../../components/Loading'
import MapInput from '../../components/MapInput'
import { Text } from '../../components/StyledText'
import { GetMerchantList } from '../backend/homeapi'

const ONE_LATITUDE_DEGREE_IN_METERS = 111.32 * 1000
const LATLON_DELTA = 0.2

export default class MapSearchScreen extends React.Component {
  state = {
    merchantList: [],
    inApiCall: false,
    region: {
      latitude: this.props.navigation.getParam('curLocation').lat, //40.27649,
      longitude: this.props.navigation.getParam('curLocation').lng, //-111.65756,
      latitudeDelta: 0.093,
      longitudeDelta: 0.093,
    },
    markers: [],
    showFilterView: false,
    filterData: null,
    curMaxDist: 0,
    lastFetchedCoord: null,
  };

  constructor(props) {
    super(props)

  }

  getCoordsFromName(loc) {
    console.log('getCoordsFromName(loc)', loc)
    this.map.getMapRef().animateToRegion({
      latitude: loc.lat,
      longitude: loc.lng,
      latitudeDelta: 0.093,
      longitudeDelta: 0.093,
    })

    if (this.props.navigation.getParam('merchantList') == undefined) {
      this._getMerchantList(loc.lat, loc.lng)
    }
  }

  _initFilterDataWith(merchantListAry, categoryList) {
    if (this.state.filterData !== null) {
      return
    }

    let strCategories = []
    for (let i = 0; i < categoryList.length; i++) {
      strCategories.push(categoryList[i].category_name)
    }
    strCategories.sort()

    this.setState({
      filterData:
      {
        queryString: "",
        minDistance: 0,
        maxDistance: 25,
        lowLimit: 0,
        highLimit: 100,
        aryCategory: strCategories,
        categories: [],
      }
    })
  }

  _filterParamChanged(filterParam) {
    if (filterParam.maxDistance > this.state.curMaxDist) {
      this.setState({ loading_merchant_list_views: true, merchantList: [], markers: [] })
      this._getMerchantList(this.state.region.latitude, this.state.region.longitude, filterParam.maxDistance)
    }

    this.setState({ filterData: filterParam }, () => {
      this._updateMarker()
    })
  }

  _openFilterView() {
    if (this.state.filterData !== null) {
      this.setState({ showFilterView: true })
    }
  }

  _getTruncatedString(strName) {
    if (strName.length > 15) {
      return strName.substring(15) + '...'
    }

    return strName
  }

  _updateMarker() {
    const markerList = []
    for (let i = 0; i < this.state.merchantList.length; i++) {
      let locationList = this.state.merchantList[i].location_list
      if ((locationList == undefined) || (locationList.length == 0)) {
        continue
      }

      let itemLoc = {
        longitude: locationList[0].longitude,
        latitude: locationList[0].latitude
      }

      if (this.state.filterData !== null) {
        const merchantDist = parseInt(this.state.merchantList[i].distance.replace(" mi.", ""))
        if ((merchantDist >= this.state.filterData.minDistance) && (merchantDist < this.state.filterData.maxDistance)) {
          if ((this.state.filterData.categories.length != 0) && (this.state.filterData.categories.indexOf(this.state.merchantList[i].category_name) === -1)) {
            continue
          }

          if (this.state.filterData.queryString !== "") {
            if (!this.state.merchantList[i].store_name.toLowerCase().includes(this.state.filterData.queryString.toLowerCase())) {
              continue
            }
          }
        }
        else {
          continue
        }
      }

      markerList.push(
        {
          key: 'marker' + i,
          coordinate: itemLoc,
          merchantIndex: i,
          storeName: this._getTruncatedString(this.state.merchantList[i].store_name),
          saving: this.state.merchantList[i].savings,
          logoUrl: this.state.merchantList[i].logo_url,
        }
      )
    }
    console.log('markerList === ', markerList.length)
    this.setState({
      markers: markerList
    })
  }

  _getMapDeltaValue(zoomVal) {
    if ((zoomVal === undefined) || (zoomVal === null) || (zoomVal === 0)) {
      return (0.193)
    }

    return (Math.exp(Math.log(360) - (zoomVal * Math.LN2)) * 6)
  }

  _getMerchantList(lat, lng, dist = 25) {
    this.setState({ inApiCall: true })
    const params = {
      "latitude": lat,
      "longitude": lng,
      "radius": dist * 1609,
    }

    GetMerchantList(params).then(result => {
      this.setState({ inApiCall: false })
      if (result === null) {

      } else if (result.success) {
        let merchantListData = [...result.merchant_list, ...result.avip_merchant_list]
        const zoomLevel = ((result.zoom_level == null) || (result.zoom_level == undefined)) ? 0 : result.zoom_level

        const latDelta = this._getMapDeltaValue(zoomLevel)

        this.map.animateToRegion({
          latitude: params.latitude, //this.state.region.latitude,
          longitude: params.longitude, //this.state.region.longitude,
          latitudeDelta: latDelta,
          longitudeDelta: latDelta,
        })
        let validCategoryList = result.category_list.filter(obj => (obj.category_name != ''))
        this.setState({ merchantList: merchantListData, curMaxDist: (params.radius / 1609), lastFetchedCoord: { latitude: params.latitude, longitude: params.longitude } }, function () {
          this._initFilterDataWith(merchantListData, validCategoryList)
          this._updateMarker()
        })
      } else {

      }
    }).catch((err) => {
      console.log('error = ', err)
    })
  }

  onMapRegionChange(region) {
    console.log('regionChanged:', region)
    if ((this.state.lastFetchedCoord !== null) && (this.state.filterParam != null)) {
      const longDelta = region.longitude - this.state.lastFetchedCoord.longitude
      const latDelta = region.latitude - this.state.lastFetchedCoord.latitude
      if ((longDelta >= LATLON_DELTA) || (latDelta >= LATLON_DELTA)) {
        this._getMerchantList(region.latitude, region.longitude, this.state.filterParam.maxDistance)
      }
    }
    // this.setState({ region });
  }

  componentDidMount() {
    if (this.props.navigation.getParam('merchantList') == undefined) {
      this._getMerchantList(this.props.navigation.getParam('curLocation').lat, this.props.navigation.getParam('curLocation').lng)
    }
    else {
      let merchantListData = this.props.navigation.getParam('merchantList')
      const validCategoryList = []
      for (let i = 0; i < merchantListData.length; i++) {
        if (merchantListData[i].category_name !== '') {
          if (validCategoryList.indexOf(merchantListData[i].category_name) === -1) {
            validCategoryList.push(merchantListData[i].category_name)
          }
        }
      }

      console.log('MapvalidCategory = ', validCategoryList)
      this._initFilterDataWith(merchantListData, validCategoryList)
      this.setState({ merchantList: merchantListData }, function () {
        this._updateMarker()
      })
    }
  }

  handleMarkerPress(event) {
    const markerID = event.nativeEvent.id
    let merchantItemData = this.state.merchantList[parseInt(markerID)]
    if (merchantItemData.type == 'access_vip' || merchantItemData.type == 'cashback') {
      this.props.navigation.navigate({
        routeName: 'VipAccess',
        params: { vipMerchantData: merchantItemData },
      })
    }
    else if (merchantItemData.type === 'merchant' || merchantItemData.type === 'own') {
      this.props.navigation.navigate({
        routeName: 'Merchant',
        params: { merchantData: merchantItemData, tabVisible: false },
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={this.state.region}
          onRegionChange={this.onMapRegionChange.bind(this)}
          mapRef={ref => (this.map = ref)}
        >
          {this.state.markers.map((marker) => {
            return (
              <Marker identifier={marker.merchantIndex.toString()} onPress={(event) => this.handleMarkerPress(event)} {...marker} >

                <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <View style={[styles.marker, { flexDirection: 'column' }]}>
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        style={styles.markerImage}
                        source={{ uri: marker.logoUrl }}
                      />
                      <Text style={styles.markerTextName}>{marker.storeName}</Text>
                    </View>
                    <Text style={styles.markerTextSaving}>{marker.saving.replace('Upto ', '').replace(' savings', '')}</Text>
                  </View>
                  <View style={styles.markerBottomTriangle} />
                </View>
              </Marker>
            )
          })}
        </MapView>
        <SafeAreaView style={[{ position: 'absolute', width: '100%', paddingTop: 10, flexDirection: 'row' }]}>
          <TouchableOpacity
            style={{ paddingHorizontal: 16, height: 44, marginTop: 6, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => this.props.navigation.goBack()}
          >
            <Image
              style={{ width: 16, height: 28, resizeMode: 'stretch' }}
              source={require('../../../assets/images/category/back.png')}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: 8, height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
            <MapInput notifyChange={(loc) => this.getCoordsFromName(loc)}
            />
          </View>

          <TouchableOpacity
            onPress={() => this.setState({ showFilterView: !this.state.showFilterView })}
          >
            <View style={{ width: 44, marginLeft: 4, marginHorizontal: 18, height: 50, backgroundColor: '#FFFFFF', borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                style={{ width: 21, height: 17, resizeMode: 'stretch', alignSelf: 'center' }}
                source={require('../../../assets/images/category/noun_filter.png')}
              />
            </View>
          </TouchableOpacity>
        </SafeAreaView>
        {(this.props.navigation.getParam('merchantList') != undefined) && (
          <TouchableHighlight
            style={{ position: 'absolute', borderRadius: 25, width: 50, height: 50, right: 20, bottom: 40 }}
            underlayColor='#DDDDDD'
            onPress={() => this.props.navigation.goBack()}>
            <Image
              style={{ width: '100%', height: '100%' }}
              source={require('../../../assets/images/merchant/icon_view_list.png')} />
          </TouchableHighlight>
        )}
        {this.state.showFilterView && (
          <FilterView
            hideCategorySection={false}
            initialFilterParam={this.state.filterData}
            onTapOutSide={() => this.setState({ showFilterView: false })}
            onValueChange={(filterParam) => this._filterParamChanged(filterParam)}
            styles={{
            }}
          />
        )}
        {(this.state.inApiCall) && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: '#00000033', alignItems: 'center', justifyContent: 'center' }]}>
            <Loading />
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBanner: {
    marginBottom: 2,
    height: 171,
    resizeMode: 'stretch'
  },
  categoryItem: {
    marginLeft: 18,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: "center"
  },
  categoryText: {
    marginTop: 7,
    fontSize: 14,
    fontFamily: "Open Sans",
    fontWeight: "bold",
    color: "#887575",
    alignSelf: "center"
  },
  marker: {
    backgroundColor: "#005b9e",
    height: 38,
    borderRadius: 18,
    paddingLeft: 8,
    paddingRight: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  markerBottomTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 9,
    borderRightWidth: 9,
    borderTopWidth: 9,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: '#005B9E'
  },
  markerImage: {
    width: 13,
    height: 13,
    backgroundColor: "#005b9e",
    alignSelf: "center",
    resizeMode: 'stretch'
  },
  markerTextName: {
    marginLeft: 4,
    color: "#FFFFFF",
    fontSize: 10
  },
  markerTextSaving: {
    color: "#FFBB00",
    fontSize: 12
  }
})
