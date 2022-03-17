import React from 'react'
import {
	StyleSheet,
	ScrollView,
	Animated,
	View,
	TouchableOpacity,
	Image,
	SafeAreaView,
} from 'react-native'

import { Text } from '../../components/StyledText'
import { GetMerchantList, GetBngPokeMerchantList, PokeMerchant } from '../backend/homeapi'
import { GetObjectForKey } from '../../components/AsyncStore'
import { geocodeLocationByCoords } from '../../components/location-service'
import FilterView from '../../components/FilterView'
import { fonts } from '../../styles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

// import RangeSlider from 'rn-range-slider';

const SchimmerEffectAnimationComponent = () => {
	return (
		<ShimmerPlaceHolder
			style={{ alignSelf: 'center', width: wp(95), height: hp(13), opacity: 0.5 }}
			autoRun={true} />
	)
}

const SchimmerAnimationForNNumberRows = ({ numberOfRows, uniqueKey }) => {
	let shimmerRowsArray = []
	for (let index = 0; index < numberOfRows; index++) {
		shimmerRowsArray.push(
			<ShimmerPlaceHolder
				key={`loading-${index}-${uniqueKey}`}
				autoRun={true}
				style={{ marginBottom: 5, width: wp(90), height: hp(10), alignSelf: 'center', opacity: 0.5 }}
			/>
		)
	}
	return (<View style={{ marginTop: hp(4), marginHorizontal: hp(10) }}>{shimmerRowsArray}</View>)
}

export default class CategoryScreen extends React.Component {
	state = {
		categoryType: null,
		categoryData: null,
		merchantList: [],
		pokeMerchatList: [],
		activePokeMerchantIndex: -1,
		showFilterView: false,
		loading_merchant_list_views: true,
		loading_poke_list: true,
		filterData: null,
		curMaxDist: 0,
	};

	componentDidMount() {
		if (this.state.categoryType == null) {
			this.setState({ categoryType: this.props.navigation.getParam('type'), categoryData: this.props.navigation.getParam('categoryData') }, function () {
				this._getMerchantList()
				this._getPokeMerchantList()
			})
		}
	}

	_getMerchantList(dist = 25) {
		const geoLocInfo = this.props.navigation.getParam('geoLocation')
		// let busType = this.state.categoryType == 'Online' ? ["is_online"] : ["is_brick_mortar"]; //(this.state.categoryType == 'Online' ? ["is_brick_mortar"] : ["is_online", "is_brick_mortar"]);
		const params = {
			"latitude": geoLocInfo.lat,
			"longitude": geoLocInfo.lng,
			"radius": dist * 1609,
		}

		if (this.state.categoryData != null) {
			params.retail_category_id = this.state.categoryData.category_id
		}

		GetMerchantList(params).then(result => {
			if (result === null) {

			} else if (result.success) {
				this.setState({
					merchantList: [...result.merchant_list, ...result.avip_merchant_list],
					loading_merchant_list_views: false,
					curMaxDist: (params.radius / 1609),
				})
				let validCategoryList = result.category_list.filter(obj => (obj.category_name != ''))
				this._initFilterDataWith([...result.merchant_list, ...result.avip_merchant_list], validCategoryList)
			} else {

			}
		}).catch((err) => {
			console.log('error = ', err)
		})
	}

	_initFilterDataWith(merchantListAry, categoryList) {
		let strCategories = []
		for (let i = 0; i < categoryList.length; i++) {
			strCategories.push(categoryList[i].category_name)
		}
		strCategories.sort()
		if (this.state.filterData !== null) {
			let newFilterData = this.state.filterData
			newFilterData.aryCategory = strCategories
			newFilterData.categories = []

			this.setState({ filterData: newFilterData })
			return
		}
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
			this.setState({ loading_merchant_list_views: true, merchantList: [] })
			this._getMerchantList(filterParam.maxDistance)
		}
		this.setState({ filterData: filterParam })
	}

	_openFilterView() {
		if ((this.state.filterData !== null) && (this.state.categoryType !== 'Invite')) {
			this.setState({ showFilterView: true })
		}
	}

	_updateMerchantPokeData() {
		let newPokeMerchantList = this.state.pokeMerchatList
		newPokeMerchantList[this.state.activePokeMerchantIndex].is_poked = true
		this.setState({ pokeMerchatList: newPokeMerchantList, activePokeMerchantIndex: -1 })
	}

	_pokeMerchant() {
		const merchantId = this.state.pokeMerchatList[this.state.activePokeMerchantIndex].merchantid
		GetObjectForKey('userData').then(userData => {
			PokeMerchant(userData.partner_id, userData.partner_referral_code, merchantId).then(result => {
				if (result === null) {

				} else if (result.success) {
					this._updateMerchantPokeData()
				} else {

				}
			}).catch((err) => {
				console.log('error = ', err)
			})
		})
	}


	_getPokeMerchantList() {
		let userObj = this.props.navigation.getParam('userInfo')
		if ((userObj == null) || (userObj == undefined)) {
			return
		}

		let categoryId = 0
		if (this.state.categoryData != null) {
			categoryId = this.state.categoryData.category_id
		}

		const geoLocInfo = this.props.navigation.getParam('geoLocation')
		geocodeLocationByCoords(geoLocInfo.lat, geoLocInfo.lng).then(
			(data) => {
				const postalCodeComponent = data.filter(obj => obj.types.includes('postal_code'))
				const zip = postalCodeComponent[0].short_name
				console.log('zip = ', zip)
				GetBngPokeMerchantList(categoryId, zip, geoLocInfo.lat, geoLocInfo.lng, userObj.partner_id, userObj.partner_referral_code).then(result => {
					if (result === null) {

					} else if (result.success) {
						this.setState({
							pokeMerchatList: result.poke_merchant_list,
							loading_poke_list: false
						})
					} else {

					}
				}).catch((err) => {
					console.log('error = ', err)
				})
			}
		)
	}

	_openMerchantDetailPage(merchantItemData) {
		if (merchantItemData.type === 'access_vip' || merchantItemData.type == 'cashback') {
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

	_setCategoryType(type) {
		// if (this.state.categoryType != null) {
		console.log('update category value')
		this.setState({ categoryType: type })
		// }
	}

	_getActiveMerchantList() {
		var activeMerchants = []
		if ((this.state.categoryType === 'In-store') || (this.state.categoryType === 'Online')) {
			if (this.state.categoryType === 'In-store') {
				activeMerchants = this.state.merchantList.filter(obj => obj.is_brick_mortar)
			}
			else {
				activeMerchants = this.state.merchantList.filter(obj => obj.is_online)
			}
		}
		else {
			activeMerchants = this.state.merchantList
		}

		if (this.state.filterData !== null) {
			const filteredMerchants = []
			for (let i = 0; i < activeMerchants.length; i++) {
				const merchantDist = parseInt(activeMerchants[i].distance.replace(" mi.", ""))
				if ((merchantDist >= this.state.filterData.minDistance) && (merchantDist < this.state.filterData.maxDistance)) {
					if ((this.state.filterData.categories.length == 0) || ((this.state.filterData.categories.length != 0) && (this.state.filterData.categories.indexOf(activeMerchants[i].category_name) !== -1))) {
						if (this.state.filterData.queryString !== "") {
							if (activeMerchants[i].store_name.toLowerCase().includes(this.state.filterData.queryString.toLowerCase())) {
								filteredMerchants.push(activeMerchants[i])
							}
						}
						else {
							filteredMerchants.push(activeMerchants[i])
						}
					}
				}
			}

			activeMerchants = filteredMerchants
		}

		return activeMerchants
	}

	_renderPokeMerchantItemView(pokeMerchantItemIndex) {
		return (
			<View key={'PokeMerchantItemView' + pokeMerchantItemIndex} style={{ marginLeft: 19 }}>
				<View style={{ width: '100%', flexDirection: "row" }}>
					<View style={{ width: '80%', flexDirection: 'column' }}>
						<Text style={{ fontSize: 14, textAlign: 'left', marginTop: 10, width: '100%', fontFamily: "Open Sans", fontWeight: '600', color: '#7A7C80' }}>{this.state.pokeMerchatList[pokeMerchantItemIndex].name}</Text>
						<Text style={{ fontSize: 13, textAlign: 'left', width: '100%', fontFamily: "Open Sans", fontWeight: '300', color: '#888888' }}>{this.state.pokeMerchatList[pokeMerchantItemIndex].category}</Text>
						<View style={{ flexDirection: 'row', marginTop: 7 }}>
							<Image
								style={{ width: 8, height: 12, alignSelf: "center", resizeMode: 'stretch' }}
								source={require('../../../assets/images/home/placeholder.png')}
							/>
							<Text style={{ marginLeft: 4, fontSize: 12, fontFamily: "Open Sans" }}>{this.state.pokeMerchatList[pokeMerchantItemIndex].distance}</Text>
						</View>
					</View>
					<View style={{ width: '20%', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
						<TouchableOpacity
							onPress={() => this._showPockPopup(pokeMerchantItemIndex)}
						>
							<Text style={{ fontSize: 13, paddingHorizontal: 10, paddingVertical: 5, fontFamily: "Open Sans", color: '#0093DD' }}>{this.state.pokeMerchatList[pokeMerchantItemIndex].is_poked ? 'Invited' : 'Invite'}</Text>
						</TouchableOpacity>
					</View>
				</View>
				<View
					style={{ backgroundColor: 'rgba(198, 198, 198, 0.14)', height: 1, marginTop: 10.5, width: '100%' }}
				/>
			</View>
		)
	}

	_redirectToMapScreen() {
		this.props.navigation.navigate({
			routeName: 'Map',
			params: {
				'merchantList': this._getActiveMerchantList(),
				'curLocation': this.props.navigation.getParam('geoLocation')
			},
		})
	}

	_hidePockPopup() {
		this.setState({ activePokeMerchantIndex: -1 })
	}

	_showPockPopup(pokeIndex) {
		if (!this.state.pokeMerchatList[pokeIndex].is_poked) {
			this.setState({ activePokeMerchantIndex: pokeIndex })
		}
	}

	render() {
		let userObj = this.props.navigation.getParam('userInfo')
		const typeOptions = []
		typeOptions.push(
			<View key={'TypeContainerView'} style={{ width: 285, height: 27, alignContent: 'center', alignItems: 'center', borderRadius: 6, borderColor: '#A2A2A4', borderWidth: 1, flexDirection: 'row' }}>
				<TouchableOpacity
					activeOpacity={1}
					style={[{ width: '33.33%', borderTopLeftRadius: 6, borderBottomLeftRadius: 6, alignItems: 'center', justifyContent: 'center' }, (this.state.categoryType == 'In-store') ? styles.storeTypeActiveBkgColor : styles.storeTypeDeactiveBkgColor]}
					onPress={() => this.setState({ categoryType: 'In-store' })}
				>
					<View style={{ borderTopLeftRadius: 6, borderColor: '#00000000', borderBottomLeftRadius: 6, height: 27, alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
						<Text style={[{ fontSize: 14, fontFamily: "Open Sans", alignSelf: "center" }, (this.state.categoryType == 'In-store') ? styles.storeTypeActiveTextColor : styles.storeTypeDeactiveTextColor]}>In-store</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={1}
					style={[{ width: '33.33%', alignItems: 'center', justifyContent: 'center' }, (this.state.categoryType == 'Online') ? styles.storeTypeActiveBkgColor : styles.storeTypeDeactiveBkgColor]}
					onPress={() => this.setState({ categoryType: 'Online' })}
				>
					<View style={{ height: 27, alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
						<Text style={[{ fontSize: 14, fontFamily: "Open Sans", alignSelf: "center" }, (this.state.categoryType == 'Online') ? styles.storeTypeActiveTextColor : styles.storeTypeDeactiveTextColor]}>Online</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					activeOpacity={1}
					style={[{ width: '33.33%', borderTopRightRadius: 6, borderBottomRightRadius: 6, borderColor: '#00000000', alignItems: 'center', justifyContent: 'center' }, (this.state.categoryType == 'Invite') ? styles.storeTypeActiveBkgColor : styles.storeTypeDeactiveBkgColor]}
					onPress={() => this.setState({ categoryType: 'Invite' })}
				>
					<View style={{ borderTopRightRadius: 6, borderBottomRightRadius: 6, height: 27, alignItems: 'center', justifyContent: 'center', paddingLeft: 10, paddingRight: 10 }}>
						<Text style={[{ fontSize: 14, fontFamily: "Open Sans", alignSelf: "center" }, (this.state.categoryType == 'Invite') ? styles.storeTypeActiveTextColor : styles.storeTypeDeactiveTextColor]}>Invite</Text>
					</View>
				</TouchableOpacity>
			</View>
		)

		const merchantListItemViews = []

		let activeMerchants = this._getActiveMerchantList()
		if (activeMerchants.length != 0) {
			for (let i = 0; i < activeMerchants.length; i++) {
				let merchantListItem = activeMerchants[i]
				merchantListItemViews.push(
					<TouchableOpacity
						key={i}
						style={{ marginLeft: 14, marginTop: 0 }}
						onPress={() => this._openMerchantDetailPage(merchantListItem)}
					>
						<View style={{ flexDirection: "column" }}>
							<View style={{ marginLeft: 12, marginTop: 5 }}>
								<View style={{ flexDirection: "row", marginLeft: 0, marginHorizontal: 27 }}>
									<View style={{ width: '80%', flexDirection: "row" }}>
										<Image
											style={{ marginLeft: 4, marginTop: 2, width: 72, height: 61, alignSelf: "center", resizeMode: 'stretch' }}
											source={{ uri: merchantListItem.logo_url }}
										/>
										<View style={{ marginLeft: 25, justifyContent: 'space-between', }}>
											<Text style={{ fontSize: 15, fontFamily: "Open Sans", fontWeight: "600" }}>{merchantListItem.store_name}</Text>
											<View style={{ flexDirection: 'row', }}>
												<Image
													style={{ width: 8, height: 12, alignSelf: "center", resizeMode: 'stretch' }}
													source={require('../../../assets/images/home/placeholder.png')}
												/>
												<Text style={{ marginLeft: 4, fontSize: 12, fontFamily: "Open Sans" }}> {merchantListItem.distance} </Text>
											</View>
											<Text style={{ fontSize: 12, fontFamily: "Open Sans", color: '#0093DD' }}>{merchantListItem.savings + ((merchantListItem.location_count <= 1) ? ('') : (' | ' + merchantListItem.location_count + ' Locations'))}</Text>
										</View>
									</View>
									<View style={{ justifyContent: 'center', width: '20%', flexDirection: 'row-reverse', marginHorizontal: 27 }}>
										<Image
											style={{ alignSelf: 'center', width: 13, height: 17, resizeMode: 'stretch' }}
											source={require('../../../assets/images/home/arrow.png')}
										/>
									</View>
								</View>
							</View>
							{(i != (activeMerchants.length - 1)) && (
								<View style={{ backgroundColor: 'rgba(198, 198, 198, 0.14)', height: 1, marginTop: 9.5, width: '100%' }} />
							)
							}
						</View>
					</TouchableOpacity>
				)
			}
		}

		const pokeListViews = []

		for (let i = 0; i < this.state.pokeMerchatList.length; i++) {
			pokeListViews.push(
				<View style={{ width: '100%' }}>
					{this._renderPokeMerchantItemView(i)}
				</View>
			)
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
							style={{ width: '33%' }}
							onPress={() => this.props.navigation.goBack()}
						>
							<Image
								style={{ width: wp(5), height: wp(8), resizeMode: 'stretch', marginLeft: wp(2) }}
								source={require('../../../assets/images/category/back.png')}
							/>
						</TouchableOpacity>
						<View style={{ width: '34%', alignContent: 'center', alignItems: 'center' }}>
							<Text style={{ fontSize: 18, fontFamily: "Open Sans", color: "#000000", alignSelf: "center", fontWeight: "600", }}>
								{(this.state.categoryData != null) ? (this.state.categoryData.category_name) : (this.state.categoryType)}
							</Text>
						</View>
						<View style={{ width: '33%', justifyContent: 'flex-end', flexDirection: 'row' }}>
							<TouchableOpacity
								onPress={() => console.log('Search Clicked')}
							>
								<Image
									style={{ width: 21, height: 21, resizeMode: 'stretch', alignSelf: 'center', marginRight: 16 }}
									source={require('../../../assets/images/category/search.png')}
								/>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => this._openFilterView()}
							>
								<Image
									style={{ width: 21, height: 17, resizeMode: 'stretch', alignSelf: 'center', marginRight: 30 }}
									source={require('../../../assets/images/category/noun_filter.png')}
								/>
							</TouchableOpacity>
						</View>
					</Animated.View>
				</Animated.View>
				<View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 12, width: '100%', opacity: 0.2 }} />
				<ScrollView style={styles.container}>

					<View style={{ width: '100%', alignContent: 'center', marginTop: 13, alignItems: 'center' }}>
						{typeOptions}
					</View>
					{(this.state.categoryType !== 'Invite') && (
						this.state.loading_merchant_list_views ?

							<SchimmerAnimationForNNumberRows
								numberOfRows={10}
								uniqueKey={'10rows'}
							/>
							:
							<View style={{ marginTop: 20 }}>
								{merchantListItemViews}
							</View>
					)}


					{((userObj != null) && (userObj != undefined) && (this.state.categoryType === 'Invite')) && (
						<View>
							<View style={{ marginVertical: hp(2), backgroundColor: "#C6C6C6", height: 2, width: '100%', opacity: 0.5 }} />
							{
								this.state.loading_poke_list ?
									<SchimmerAnimationForNNumberRows
										numberOfRows={10}
										uniqueKey={'10rows'}
									/>
									:
									<View>
										<View style={[{ marginTop: 0, marginBottom: 4, width: '100%', marginLeft: 12, justifyContent: 'center' }]}>
											<Text style={{ fontSize: 16, fontFamily: "Open Sans", color: "#7A7C80", fontWeight: "600", }}>
												Invite them to Bookngogo &amp; get rewarded
                						</Text>
										</View>
										<View style={{ marginTop: 0, flexDirection: "column" }}>
											{pokeListViews}
										</View>
									</View>
							}
						</View>
					)}
				</ScrollView>
				{(this.state.activePokeMerchantIndex != -1) && (
					<View style={{
						position: 'absolute',
						top: 100,
						backgroundColor: '#FFFFFF',
						left: 10,
						right: 10,
						borderStyle: 'solid',
						paddingBottom: 10,
						borderRadius: 4,
						shadowOffset: { width: 0, height: 5, },
						shadowColor: 'black',
						shadowOpacity: 1,
						elevation: 5,
					}}>

						<View
							style={{ width: '100%', flexDirection: 'row', height: 44, justifyContent: 'flex-end', alignItems: 'center' }}>

							<TouchableOpacity
								style={{ width: '10%', alignItems: 'flex-end', paddingHorizontal: 19, paddingTop: 15 }}
								onPress={() => this._hidePockPopup()}
							>
								<Image
									style={{ width: 17, height: 17, resizeMode: 'stretch' }}
									source={require('../../../assets/images/category/icn_close_circle.png')}
								/>
							</TouchableOpacity>

						</View>
						<View style={{ width: '80%', left: '10%', flexDirection: "row" }}>
							<View
								style={{
									borderStyle: 'solid',
									backgroundColor: '#FFFFFF',
									borderRadius: 4,
									shadowOffset: { width: 0, height: 5, },
									shadowColor: 'black',
									shadowOpacity: 1,
									elevation: 5,
								}}>
								<Image
									style={{ width: 67, height: 61, alignSelf: "center", resizeMode: 'stretch' }}
									source={this.state.pokeMerchatList[this.state.activePokeMerchantIndex].image_url == '' ? require('../../../assets/images/category/7-eleven-logo.png') : { uri: this.state.pokeMerchatList[this.state.activePokeMerchantIndex].image_url }}
								/>
							</View>

							<View style={{ marginLeft: 25, width: '70%', }}>
								<Text style={{ fontSize: 15, fontFamily: "Open Sans", fontWeight: "600", color: '#515151' }}>{this.state.pokeMerchatList[this.state.activePokeMerchantIndex].name}</Text>
								<View style={{ flexDirection: 'row', marginTop: 4 }}>
									<Image
										style={{ width: 8, height: 12, alignSelf: "center", resizeMode: 'stretch' }}
										source={require('../../../assets/images/home/placeholder.png')}
									/>
									<Text style={{ marginLeft: 4, fontSize: 12, fontFamily: "Open Sans", color: '#ABABAB' }}>{this.state.pokeMerchatList[this.state.activePokeMerchantIndex].distance}</Text>
								</View>
								<Text style={{ fontSize: 12, fontFamily: "Open Sans", marginTop: 4, color: '#7A7CB0' }}>{this.state.pokeMerchatList[this.state.activePokeMerchantIndex].address}</Text>
							</View>
						</View>
						{(this.state.pokeMerchatList[this.state.activePokeMerchantIndex].description != '' && ((this.state.categoryType === 'Invite'))) && (
							<ScrollView style={{ width: '80%', marginTop: 10, left: '10%', height: 150 }}>
								<Text
									style={{
										width: '100%',
										color: '#919194',
										fontSize: 12,
										lineHeight: 16,
										textAlign: "left",
										fontFamily: "Open Sans",
									}}>
									{this.state.pokeMerchatList[this.state.activePokeMerchantIndex].description}
								</Text>
							</ScrollView>
						)}
						<TouchableOpacity
							style={{ alignItems: 'center', marginTop: 40, marginBottom: 50, paddingHorizontal: 19, height: 36 }}
							onPress={() => this._pokeMerchant()}
						>
							<View
								style={{
									backgroundColor: '#0093DD',
									borderRadius: 4,
									paddingHorizontal: 44,
									paddingVertical: 8,
									flexDirection: 'row',
								}}>

								<Image
									style={{ width: 11, height: 16, alignSelf: "center", resizeMode: 'stretch' }}
									source={require('../../../assets/images/category/icon_poke_hand.png')}
								/>
								<Text style={{ marginLeft: 8, fontSize: 12, fontFamily: "Open Sans", color: '#FFFFFF' }}>Poke</Text>
							</View>
						</TouchableOpacity>
					</View>
				)}

				<TouchableOpacity
					style={{ position: 'absolute', borderRadius: 25, width: 50, height: 50, right: 20, bottom: 40 }}
					underlayColor='#DDDDDD'
					onPress={() => this._redirectToMapScreen()}
				>
					<Image
						style={{ width: '100%', height: '100%' }}
						source={require('../../../assets/images/merchant/icon_view_map.png')} />
				</TouchableOpacity>
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
			</SafeAreaView>
		)
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
	storeTypeDeactiveBkgColor: {
		backgroundColor: '#FFFFFF'
	},

	storeTypeActiveBkgColor: {
		backgroundColor: '#0093DD'
	},
	storeTypeDeactiveTextColor: {
		color: '#4A4C63'
	},
	storeTypeActiveTextColor: {
		color: '#F8F8FF'
	},
	countryText: {
		fontSize: 13,
		fontFamily: "Open Sans",
		color: '#0093DD'
	},
	tabView: {
		marginLeft: 6,
		borderRadius: 4,
		height: 27,
		paddingLeft: 14,
		paddingRight: 14,
		justifyContent: 'center',
	},
	tabText: {
		fontSize: 14,
		fontFamily: "Open Sans",
		color: '#0093DD'
	},
})