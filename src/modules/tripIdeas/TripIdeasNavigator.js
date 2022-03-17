
import { createStackNavigator, createAppContainer } from "react-navigation"

import TripIdeasScreen from './TripIdeasViewContainer'
import TripIdeasSearch from './SearchView'
import TripIdeasDestination from './DestinationView'
import TripIdeasSeeDo from './SeeDoView'
import TripIdeasRegionList from './RegionListView'
import TripIdeasGetKnow from './GetKnowView'
import TripIdeasSeeItem from './SeeItemView'
import TripIdeasCafeItem from './CafeItemView'

const TripIdeasNavigator = createStackNavigator({
  TripIdeasScreen,
  TripIdeasSearch,
  TripIdeasDestination,
  TripIdeasSeeDo,
  TripIdeasRegionList,
  TripIdeasGetKnow,
  TripIdeasSeeItem,
  TripIdeasCafeItem,
}, {
  initialRouteName: 'TripIdeasScreen',
  defaultNavigationOptions: {
    header: null
  }
})

export default createAppContainer(TripIdeasNavigator)