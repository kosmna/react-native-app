import React from 'react'
import { Text, View } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { createAppContainer, createStackNavigator } from "react-navigation"
import EventIndex from './Container'
import EventItem from './ItemView'
import EventTicket from './TicketView'


const EventNavigator = createStackNavigator({
  EventIndex,
  EventItem,
  EventTicket,
}, {
  initialRouteName: 'EventIndex',
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

export default createAppContainer(EventNavigator)