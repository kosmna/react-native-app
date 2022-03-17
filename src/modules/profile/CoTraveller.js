import axios from 'axios'
import React from 'react'
import { Image, ToastAndroid, TouchableOpacity, View, ScrollView, StyleSheet } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Button from '../../components/Button'
import Loading from '../../components/Loading'
import { Text } from '../../components/StyledText'
import { BookAuthentication, BookBackendUrl } from '../backend/constants'

export default class CoTraveller extends React.Component {

    static navigationOptions = {
        title: 'Saved Co-Travellers'
    }

    state = {
        loading: true,
        partner_id: this.props.navigation.getParam('userInfo').partner_id,
        partner_referral_code: this.props.navigation.getParam('userInfo').partner_referral_code
    }

    componentDidMount() {

        this.load_cotravellers()

        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            (payload) => {
                this.setState({ top_loading: true })
                this.load_cotravellers()
            }
        )
    }

    componentWillUnmount() {
        this.willFocusSubscription.remove()
    }

    load_cotravellers = () => {
        let request_data = JSON.stringify({
            'Authorization': BookAuthentication,
            "referral_code": this.state.partner_referral_code,
            "partner_id": this.state.partner_id
        })

        axios({
            method: 'POST',
            url: BookBackendUrl + '/bnggetcotravellers' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                this.setState({ cotravellers: data.cotravellers_list, invites_sent: data.invites_sent, invites_received: data.invites_received, loading: false, top_loading: false })
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    update_invite = (invite_id, status) => {

        let request_data = JSON.stringify({
            'Authorization': BookAuthentication,
            "referral_code": this.state.partner_referral_code,
            "partner_id": this.state.partner_id,
            "id": invite_id,
            "status": status
        })

        axios({
            method: 'POST',
            url: BookBackendUrl + '/bngupdateinvitestatus' + '?data=' + request_data,
            responseType: 'json'
        })
            .then((response) => {
                let data = response.data
                if (data.success) {
                    this.setState({ top_loading: true })
                    this.load_cotravellers()
                }
                else
                    ToastAndroid.show('Error occured! Try Again!')
            })
            .catch((error) => {
                console.warn(error)
            })
    }

    render() {
        if (this.state.loading)
            return <Loading />

        let cotravellers_list = []
        cotravellers_list = this.state.cotravellers.map((cotraveller, index) => {
            return (
                <View key={index} style={{ display: 'flex', height: hp(8), flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#CACCCF', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{ fontFamily: 'Open Sans', fontSize: wp(4), marginLeft: wp(5) }}>{cotraveller.name}</Text>
                    {
                        cotraveller.editable &&
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('EditCoTraveller', { id: cotraveller.id, userInfo: this.props.navigation.getParam('userInfo') })}
                        >
                            <Image
                                source={require('../../../assets/images/profile/edit.png')}
                                style={{ width: wp(4), height: wp(4), marginRight: wp(8) }}
                            />
                        </TouchableOpacity>
                    }
                </View>
            )
        })

        let invites_sent_list = []
        invites_sent_list = this.state.invites_sent.map((invite, index) => {
            return (
                <View key={index} style={{ display: 'flex', height: hp(8), flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#CACCCF', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
                    <Text style={{ fontFamily: 'Open Sans', fontSize: wp(4), marginLeft: wp(5) }}>{invite.email}</Text>
                    <View style={{ marginRight: wp(5) }}>
                        <Button
                            primary
                            caption="Invite Sent"
                            onPress={() => { }}
                            bordered={true}
                            small={true}
                        />
                    </View>
                </View>
            )
        })

        let invites_received_list = []
        invites_received_list = this.state.invites_received.map((invite, index) => {
            return (
                <View key={index} style={{ display: 'flex', flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#CACCCF', justifyContent: 'flex-start', alignItems: 'center', backgroundColor: 'white', width: '100%' }}>
                    <View style={{ marginLeft: wp(3) }}>
                        <Image
                            source={{ width: '30%', uri: invite.profile_image_url.replace('http://', 'https://') + '&unique=' + this.state.image_unique_value }}
                            style={{ width: wp(15), height: wp(15), borderRadius: wp(10) }}
                        />
                    </View>

                    <View style={{ width: '70%', justifyContent: 'flex-start', alignItems: 'center', marginLeft: wp(2) }}>
                        <Text style={{ fontFamily: 'Open Sans', fontSize: wp(4), marginVertical: hp(1.5), textAlign: 'center' }}>Co-Traveller invitation from {invite.name} ({invite.email})</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginBottom: hp(1.5) }}>
                            <Button
                                style={{ marginRight: wp(2) }}
                                bgColor='green'
                                caption="Accept"
                                onPress={() => this.update_invite(invite.id, 'invite_accepted')}
                                bordered={true}
                                small={true}
                            />
                            <Button
                                bgColor='red'
                                caption="Reject"
                                onPress={() => this.update_invite(invite.id, 'invite_rejected')}
                                bordered={true}
                                small={true}
                            />
                        </View>
                    </View>
                </View>
            )
        })

        if (this.state.cotravellers.length == 0 && this.state.invites_sent.length == 0 && this.state.invites_received.length == 0)
            cotravellers_list.push(
                <View key='no_cotraveller' style={{ marginVertical: hp(5), marginHorizontal: wp(20) }}>
                    <Text style={{ textAlign: 'center', fontSize: wp(4.5) }}>You have not added any Co-Travellers yet</Text>
                </View>
            )

        return (
            <View style={{ flex: 1, justifyContent: 'space-between', backgroundColor: '#F5F5F5' }}>

                {/* Loader overlay */}
                {this.state.top_loading && <Loading />}

                <View style={{ flex: 0.9 }}>
                    <ScrollView style={{ width: '100%', height: '100%' }}>

                        {(this.state.cotravellers.length > 0) && <Text style={styles.heading_text}>Added Co-Travellers</Text>}
                        {cotravellers_list}

                        {(this.state.invites_received.length > 0) && <Text style={styles.heading_text}>Invites Received</Text>}
                        {invites_received_list}

                        {(this.state.invites_sent.length > 0) && <Text style={styles.heading_text}>Invites Sent</Text>}
                        {invites_sent_list}
                    </ScrollView>
                </View>

                <TouchableOpacity
                    style={{ flex: 0.1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0093DD' }}
                    onPress={() => this.props.navigation.navigate('AddCoTraveller', { userInfo: this.props.navigation.getParam('userInfo') })}
                >
                    <Text style={{ fontSize: wp(4.5), color: 'white' }}>Add Co-Traveller</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    heading_text: {
        fontSize: wp(4),
        marginLeft: wp(4),
        textAlignVertical: 'bottom',
        color: '#787474',
        marginTop: hp(3),
        marginBottom: hp(1),
        fontWeight: 'bold',
    }
})