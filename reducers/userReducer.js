import * as actionTypes from '../actions/userActions';

const userInitialState = {
    isLoggedIn: false,
    csrfToken: '',
    firstTimeLogin: false,
    linkedinUser: undefined,
    lastSyncAt: ''
}

export const userReducer = (state = userInitialState, action) => {
    switch(action.type) {
        case actionTypes.USER_LOGIN:
            return {
                ...state,
                isLoggedIn: true
            }

        case actionTypes.LINKEDIN_USER_LOGIN:
            return {
                ...state,
                linkedinUser: action.payload,
            }

        case actionTypes.CSRF_TOKEN_SET:
            return {
                ...state,
                csrfToken: action.payload.csrfToken
            }

        case actionTypes.SET_LAST_SYNC_AT:
            return {
                ...state,
                lastSyncAt: action.payload.lastSyncAt
            }
            
        case actionTypes.SET_FIRST_TIME_LOGIN:
            return {
                ...state,
                firstTimeLogin: action.payload.value
            }

        case actionTypes.USER_LOGOUT:
            return {
                ...state,
                isLoggedIn: false
            }

        default: return state;
    }
}