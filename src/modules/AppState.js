export const initialState = {
  isFirstOpen: true,
  notification_unread_count: 0
}

export const SET_FIRST_OPEN = 'AppState/SET_FIRST_OPEN'

export function setAppOpened() {
  return {
    type: SET_FIRST_OPEN,
  }
}

export default function AppStateReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FIRST_OPEN:
      return {
        ...state,
        isFirstOpen: false,
      }
    case 'UPDATE_NOTIFICATION_COUNT':
      return Object.assign({}, state, {
        'notification_unread_count': action.payload
      })
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

