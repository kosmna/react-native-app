export const initialState = {
  isLogin: false,
  userInfo: null
}

const PROFILE_UPDATE = 'HomeState/PROFILE_UPDATE'
const LOGIN = 'HomeState/LOGIN'
const LOGOUT = 'HomeState/LOGOUT'
export const SIGNUP = 'HomeState/SIGNUP'

function Login(userInfo) {
  return {
    type: LOGIN,
    payload: userInfo
  }
}

function ProfileUPDATE(updatedInfo) {
  return {
    type: PROFILE_UPDATE,
    payload: updatedInfo
  }
}

function Logout() {
  return {
    type: LOGOUT,
  }
}

export function ProfileUpdate(userInfo) {
  return dispatch => {
    dispatch(ProfileUPDATE(userInfo))
  }
}

export function UserLogin(userInfo) {
  return dispatch => {
    dispatch(Login(userInfo))
  }
}

export function UserLogout() {
  return dispatch => {
    dispatch(Logout())
  }
}

export default function HomeStateReducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return Object.assign({}, state, {
        isLogin: true,
        userInfo: action.payload,
      })
    case PROFILE_UPDATE:
      return Object.assign({}, state, {
        isLogin: true,
        userInfo: action.payload,
      })
    case LOGOUT:
      return {
        ...state,
        isLogin: false,
        userInfo: null,
      }
    default:
      return state
  }
}

// @flow
// type AppStateType = {
//   isFirstOpen: boolean,
// };

// type ActionType = {
//   type: string,
//   payload?: any,
// };

