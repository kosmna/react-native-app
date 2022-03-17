import { connect } from 'react-redux'
import { compose } from 'recompose'
import EventIndex from './IndexView'

export default compose(
    connect(
        state => ({
            userInfo: state.home.userInfo
        })
    ))(
        EventIndex
    )
