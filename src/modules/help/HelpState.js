export default function HelpStateReducer(state = {}, action) {
    switch (action.type) {
        case 'SET_STREAM_USER':
            return Object.assign({}, state, {
                stream_user: action.payload
            });
        case 'UPDATE_UNREAD_COUNT':
            return Object.assign({}, state, {
                unread_count: action.payload
            });
        default:
            return state;
    }
}