import * as actionTypes from '../actions/uiActions';

export const MODAL_TYPE = {
    FEEDBACK: 'feedback',
    NOTE: 'note',
    MESSAGE: 'message',
    APPLY_TAG: 'apply-tag',
    REMOVE_TAG: 'remove-tag',
    NEW_TAG: 'new-tag',
    EDIT_TAG: 'edit-tag',
    DELETE_TAG: 'delete-tag',
    WELCOME: 'welcome',
    LINKEDIN_LOGIN: 'check-linkedin-login',
    CLOSE: ''
}

export const TOAST_TYPE = {
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CLOSE: ''
}

export const PAGE_TYPE = {
    CONNECTIONS: 'connections',
    TAGS: 'tags'
}

const uiInitialState = {
    page: PAGE_TYPE.CONNECTIONS,

    showSpinner: false,
    showSpinnerCounter: 0,

    modalDisplay: '',
    modalPayload: null,

    note: '',
    profileId: '',
    profileIds: [],

    toast: {
        type: '',
        message: ''
    },

    backgroundUpdateLoader: false
}

export const uiReducer = (state = uiInitialState, action) => {
    switch(action.type) {

        case actionTypes.SET_PAGE:
            return {
                ...state,
                page: action.payload.page
            }

        case actionTypes.LOADING_START:
            return {
                ...state,
                showSpinner: true,
                showSpinnerCounter: state.showSpinnerCounter + 1,
            }

        case actionTypes.LOADING_END:
            return {
                ...state,
                showSpinner: state.showSpinnerCounter > 1,
                showSpinnerCounter: state.showSpinnerCounter - 1,
            }
            
        case actionTypes.MODAL_FEEDBACK:
            return {
                ...state,
                modalDisplay: MODAL_TYPE.FEEDBACK
            }

        case actionTypes.MODAL_NOTE:
            return {
                ...state,
                modalDisplay: MODAL_TYPE.NOTE,
                profileId: action.payload.profileId,
                note: action.payload.note
            }

        case actionTypes.MODAL_MESSAGE:
            return {
                ...state,
                modalDisplay: MODAL_TYPE.MESSAGE,
                profileIds: action.payload.profileIds
            }

        case actionTypes.MODAL_APPLY_TAG:
            return {
                ...state,
                modalDisplay: MODAL_TYPE.APPLY_TAG,
                profileIds: action.payload.profileIds
            }

        case actionTypes.MODAL_REMOVE_TAG:
            return {
                ...state,
                modalDisplay: MODAL_TYPE.REMOVE_TAG,
                profileIds: action.payload.profileIds
            }

        case actionTypes.MODAL_NEW_TAG:
            return {
                ...state,
                modalDisplay: MODAL_TYPE.NEW_TAG
            }

        case actionTypes.MODAL_EDIT_TAG:
            return {
                ...state,
                modalDisplay: MODAL_TYPE.EDIT_TAG,
                modalPayload: { tag: action.payload.tag }
            }

        case actionTypes.MODAL_DELETE_TAG:
            return {
                ...state,
                modalDisplay: MODAL_TYPE.DELETE_TAG,
                modalPayload: { id: action.payload.id, tagName: action.payload.tagName }
            }    

        case actionTypes.MODAL_WELCOME:
            return {
                ...state,
                modalDisplay: MODAL_TYPE.WELCOME
            }

        case actionTypes.MODAL_LINKED_LOGIN:
            return {
                ...state,
                modalDisplay: MODAL_TYPE.LINKEDIN_LOGIN
            }

        case actionTypes.MODAL_CLOSE:
            return {
                ...state,
                modalDisplay: MODAL_TYPE.CLOSE
            }

        case actionTypes.TOAST_SUCCESS:
            return {
                ...state,
                toast: {
                    type: TOAST_TYPE.SUCCESS,
                    message: action.payload.message
                }
            }

        case actionTypes.TOAST_INFO:
            return {
                ...state,
                toast: {
                    type: TOAST_TYPE.INFO,
                    message: action.payload.message
                }
            }

        case actionTypes.TOAST_WARNING:
            return {
                ...state,
                toast: {
                    type: TOAST_TYPE.WARNING,
                    message: action.payload.message
                }
            }

        case actionTypes.TOAST_ERROR:
            return {
                ...state,
                toast: {
                    type: TOAST_TYPE.ERROR,
                    message: action.payload.message
                }
            }

        case actionTypes.TOAST_HIDE:
            return {
                ...state,
                toast: {
                    type: TOAST_TYPE.CLOSE,
                    message: ''
                }
            }

        case actionTypes.BACKGROUND_UPDATE_LOADER_SET:
            return {
                ...state,
                backgroundUpdateLoader: action.payload.value
            }

        default: return state;
    }
}