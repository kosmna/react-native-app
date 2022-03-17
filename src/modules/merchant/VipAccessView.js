import React from 'react'
import { Animated, Button, Image, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { GetObjectForKey } from '../../components/AsyncStore'
import { Text } from '../../components/StyledText'
import { fonts } from '../../styles'


export default class VipAccessView extends React.Component {
	state = {
		expandStatus: [],
		termsPopupText: '',
	};

	_getMerchantItemData() {
		return this.props.navigation.getParam('vipMerchantData')
	}

	_wrapUndefString(param) {
		if (param == undefined) {
			return ''
		}

		return param
	}

	_redeemBtnClicked(offerData) {
		GetObjectForKey('userData').then(userData => {
			if (userData !== null) {
				this._openDetailView(offerData)
			}
			else {
				this._showSiginInToast()
			}
		}).catch((err) => {
			this._showSiginInToast()
		})
	}

	_showSiginInToast() {
		ToastAndroid.show('Please sign in to redeem this offer', ToastAndroid.SHORT)
	}

	_openDetailView(offerData) {
		this.props.navigation.navigate({
			routeName: 'VipAccessDetail',
			params: { data: offerData },
		})
	}

	_getMerchantItemAddress(merchantData, locationIndex) {
		let merchantLocData = merchantData.location_list[locationIndex]
		let extendedAddrStr = (merchantLocData.extended_street_address == undefined) ? '' : merchantLocData.extended_street_address

		let strFullAddr = this._wrapUndefString(merchantLocData.street_address) + ' ' + this._wrapUndefString(merchantLocData.extendedAddrStr) + ' ' + this._wrapUndefString(merchantLocData.state_region) + ' ' + this._wrapUndefString(merchantLocData.city_locality) + ' ' + this._wrapUndefString(merchantLocData.country) + ' ' + this._wrapUndefString(merchantLocData.postal_code)
		return strFullAddr.replace('  ', ' ')
	}

	_getMerchantOfferData(merchantData, locationIndex, offerIndex) {
		return merchantData.location_list[locationIndex].offers_list[offerIndex]
	}

	_updateExpandStatus(itemIndex) {
		var newStatus = this.state.expandStatus
		newStatus[itemIndex] = !newStatus[itemIndex]
		this.setState({ expandStatus: newStatus })
	}

	_getExpandStatus(itemIndex) {
		if (this.state.expandStatus.length > itemIndex) {
			return this.state.expandStatus[itemIndex]
		}

		return false
	}

	_getDiscountString(offerData) {
		let offerDiscountVal = (offerData.discount_value == undefined ? 0 : offerData.discount_value)
		if (offerData.discount_type == 'percent') {
			return 'Save ' + offerDiscountVal + '%'
		}
		else if (offerData.discount_type == 'amount') {
			return 'Save $' + offerDiscountVal
		}
		console.log('EmptyDiscountData = ', offerData)
		return ''
	}

	_showTermsPopup(termsContent) {
		this.setState({
			termsPopupText: termsContent
		})
	}

	componentDidMount() {
		var initialStatus = []
		let merchantData = this._getMerchantItemData()
		for (var i = 0; i < merchantData.location_list.length; i++) {
			initialStatus.push(i == 0 ? true : false)
		}
		this.setState({
			expandStatus: initialStatus
		})
	}

	render() {
		let merchantData = this._getMerchantItemData()
		var firstSection = []

		if (merchantData.location_list.length != 0) {
			firstSection.push(
				<View key={'firstSection'} style={{ width: '100%' }}>
					<View style={{ width: '100%', flexDirection: "row", paddingHorizontal: 19, paddingTop: 16, paddingBottom: 13 }}>
						<Image
							style={{ marginLeft: 3, marginTop: 0, width: 72, height: 61, alignSelf: "center", resizeMode: 'stretch' }}
							source={{ uri: merchantData.logo_url }}
						/>
						<View style={{ marginLeft: 15, justifyContent: 'flex-end' }}>
							<Text style={{ fontSize: 15, fontFamily: fonts.primarySemiBold, color: '#7A7C80' }}>{merchantData.store_name}</Text>
							<Text style={{ fontSize: 12, fontFamily: fonts.primaryRegular, color: '#A2A2A4' }}>{this._getMerchantItemAddress(merchantData, 0)}</Text>
						</View>
					</View>
				</View>
			)

			for (var i = 0; i < merchantData.location_list[0].offers_list.length; i++) {
				let offerData = this._getMerchantOfferData(merchantData, 0, i)
				firstSection.push(
					<View key={'firstSectionChild' + i} style={{ width: '100%', flexDirection: "column", marginTop: 14, paddingHorizontal: 19 }}>
						<View style={{ marginTop: 4, width: '100%', backgroundColor: 'rgba(188, 233, 255, 0.36)', flexDirection: 'row' }}>
							<View style={{ width: '65%', paddingHorizontal: 14, paddingVertical: 10 }}>
								<Text style={{ color: '#0193DD' }}>{this._getDiscountString(offerData)}</Text>
								<Text> {offerData.title} </Text>
							</View>
							<View style={{ paddingTop: 10, paddingHorizontal: 10, width: '35%', justifyContent: 'center' }}>
								{
									merchantData.type !== 'cashback' &&
									<Button
										bgColor="#2295DA"
										textColor="#FFFFFF"
										title="Redeem"
										fontSize={12}
										fontFamily="Open Sans"
										onPress={() => this._redeemBtnClicked(offerData)}
										style={{ marginHorizontal: 10 }}>
									</Button>
								}
								<TouchableOpacity
									onPress={() => this._showTermsPopup(offerData.terms_of_use)}
								>
									<Text
										style={{
											width: '100%',
											color: '#A2A2A4',
											fontSize: 10,
											textAlign: "center",
											textDecorationLine: 'underline',
											fontFamily: fonts.primaryRegular,
											paddingTop: 8,
											paddingBottom: 7
										}}>see offer terms</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)
			}
		}

		var merchantExtendedSections = []
		if (merchantData.location_list.length > 1) {
			for (var i = 1; i < merchantData.location_list.length; i++) {
				let locationIndex = i
				merchantExtendedSections.push(
					<TouchableOpacity
						key={'ExtendSectionTouch' + i}
						style={{ width: '100%', paddingVertical: hp(1), paddingHorizontal: 7.5 }}
						onPress={() => this._updateExpandStatus(locationIndex)}
					>
						<View style={{ width: '100%', height: 65, flexDirection: "column-reverse" }}>
							<View style={{ backgroundColor: "#C6C6C6", height: 1, width: '100%' }} />
							<View style={{ marginBottom: 10, paddingHorizontal: 11.5, flexDirection: "row-reverse" }}>
								<Image
									source={this._getExpandStatus(locationIndex) ? require('../../../assets/images/profile/arrow_up.png') : require('../../../assets/images/profile/arrow_down.png')}
									style={{ width: wp(3.5), height: wp(3.5), marginRight: wp(5) }}
									tintColor='#6D6B6B'
								/>
								<View style={{ flex: 1 }}>
									<Text
										style={{
											width: '100%',
											color: '#6D6B6B',
											fontFamily: fonts.primaryRegular,
											fontSize: 12
										}}>
										{this._getMerchantItemAddress(merchantData, locationIndex)}
									</Text>
								</View>
							</View>
						</View>
					</TouchableOpacity>
				)
				if (this._getExpandStatus(locationIndex)) {
					for (var j = 0; j < merchantData.location_list[locationIndex].offers_list.length; j++) {
						let offerData = this._getMerchantOfferData(merchantData, locationIndex, j)

						merchantExtendedSections.push(
							<View key={'ExtendSectionChildView' + i + j} style={{ width: '100%', paddingHorizontal: 19 }}>
								<View style={{ marginTop: 4, width: '100%', backgroundColor: 'rgba(188, 233, 255, 0.36)', flexDirection: 'row' }}>
									<View style={{ width: '65%', paddingHorizontal: 14, paddingVertical: 10 }}>
										<Text style={{ color: '#0193DD' }}>{this._getDiscountString(offerData)}</Text>
										<Text>{offerData.title}</Text>
									</View>
									<View style={{ paddingTop: 10, paddingHorizontal: 10, width: '35%', justifyContent: 'center' }}>
										{
											merchantData.type !== 'cashback' &&
											<Button
												bgColor="#2295DA"
												textColor="#FFFFFF"
												title="Redeem"
												fontSize={12}
												fontFamily="Open Sans"
												onPress={() => this._redeemBtnClicked(offerData)}
												style={{ marginHorizontal: 10 }}>
											</Button>
										}
										<TouchableOpacity
											onPress={() => this._showTermsPopup(offerData.terms_of_use)}
										>
											<Text
												style={{
													width: '100%',
													color: '#A2A2A4',
													fontSize: 10,
													textAlign: "center",
													textDecorationLine: 'underline',
													fontFamily: fonts.primaryRegular,
													paddingTop: 8,
													paddingBottom: 7
												}}>
												see offer terms
                        </Text>
										</TouchableOpacity>
									</View>
								</View>
							</View>
						)
					}
				}
			}
		}

		return (
			<SafeAreaView style={styles.container}>
				<Animated.View style={[{ paddingTop: 10, width: '100%', marginHorizontal: 7 }]}>
					<Animated.View
						style={[
							{ height: 44, width: '100%' },
							{ alignItems: 'center', justifyContent: 'flex-start', flexDirection: "row", }
						]}
					>
						<TouchableOpacity
							style={{ width: '10%' }}
							onPress={() => this.props.navigation.goBack()}
						>
							<Image
								style={{ width: wp(5), height: wp(8), resizeMode: 'stretch', marginLeft: hp(0.5) }}
								source={require('../../../assets/images/category/back.png')}
							/>
						</TouchableOpacity>
						<View style={{ width: '80%', alignContent: 'center', alignItems: 'center' }}>
							<Text style={{ fontSize: 18, fontFamily: fonts.primarySemiBold, color: "#000000", alignSelf: "center" }}>
								{merchantData.store_name}
							</Text>
						</View>
					</Animated.View>
				</Animated.View>

				<View style={{ backgroundColor: "#C6C6C6", height: 2, marginTop: 10, width: '100%' }} />

				<ScrollView style={styles.container}>
					{firstSection}

					<View style={{ paddingBottom: 20 }}>
						{merchantExtendedSections}
					</View>
				</ScrollView>
				{(this.state.termsPopupText != '') && (
					<View style={{
						position: 'absolute',
						top: 170,
						backgroundColor: '#FFFFFF',
						left: 10,
						right: 10,
						height: 255,
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
							<Text
								style={{
									width: '90%',
									color: '#848484',
									fontSize: 12,
									textAlign: "left",
									paddingLeft: 22,
									paddingTop: 6,
									lineHeight: 17,
									textDecorationLine: 'underline',
									fontFamily: fonts.primaryRegular,
								}}>
								Terms &amp; Conditions
              </Text>

							<TouchableOpacity
								style={{ width: '10%', alignItems: 'flex-end', paddingHorizontal: 19, paddingTop: 5 }}
								onPress={() => this.setState({ termsPopupText: '' })}
							>
								<Image
									style={{ width: 17, height: 17, resizeMode: 'stretch' }}
									source={require('../../../assets/images/category/icn_close_circle.png')}
								/>
							</TouchableOpacity>

						</View>
						<ScrollView>
							<Text
								style={{
									width: '100%',
									color: '#919194',
									paddingTop: 13,
									paddingHorizontal: 19,
									fontSize: 12,
									lineHeight: 16,
									textAlign: "left",
									fontFamily: fonts.primaryRegular,
								}}>
								{this.state.termsPopupText}
							</Text>
						</ScrollView>
					</View>
				)}
			</SafeAreaView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
	},
})