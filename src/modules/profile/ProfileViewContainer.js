// @flow
import { compose } from 'recompose'
import { connect } from 'react-redux'

import ProfileView from './ProfileView'

import { UserLogout } from '../home/HomeState'

export default compose(
    connect(
        state => ({
            isLogin: state.home.isLogin,
            userInfo: state.home.userInfo,
            'notification_unread_count': state.app.notification_unread_count
        }),
        {
            UserLogout,
        },
    )
)(
    ProfileView,
)
