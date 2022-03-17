import React from 'react'
import { View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { createAppContainer, createStackNavigator } from "react-navigation"
import { Text } from '../../components/StyledText'
import Chat from './Chat/Chat'
import ChatWithUs from './Chat/ChatWithUs'
import NewChatView from './Chat/NewChatView'
import HelpScreen from './Help'
import HelpFaqs from './HelpFaqs'


const HelpNavigator = createStackNavigator({
    Help: HelpScreen,
    Chat: Chat,
    ChatWithUs: ChatWithUs,
    HelpFaqs: HelpFaqs,
    NewChatView: NewChatView
}, {
    initialRouteName: 'Help',
    defaultNavigationOptions: {
        headerTitle: (props) => {
            return (
                <View style={{ flex: 0.9 }}>
                    <Text style={{ fontSize: wp(4), textAlign: 'center' }}>{props.children}</Text>
                </View>
            )
        }
    }
})

export default createAppContainer(HelpNavigator)