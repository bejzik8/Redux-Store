import * as actionTypes from '../actions/connectionsActions';


const initalState = {
    connections: [],

    filters: {
        selectedTags: []
    }
}

export const connectionsReducer = (state = initalState, action) => {
    switch (action.type) {

        case actionTypes.CONNECTIONS_LOAD:
            return {
                ...state,
                connections: action.payload.connections
            }

        case actionTypes.CONNECTIONS_SYNC:
            return {
                ...state,
                connections: action.payload.connections,
            }

        case actionTypes.SET_FILTER_DEFAULT_VALUES:
            return {
                ...state,
                filters: {
                    ...state.filters,
                    selectedTags: [],
                }
            }

        case actionTypes.SET_FILTER_SELECT_VALUE:
            switch (action.payload.type) {
                case 'selectedTags':
                    return {
                        ...state,
                        filters: {
                            ...state.filters,
                            selectedTags: action.payload.value
                        }
                    }
                default:
                    return state;
            }

        case actionTypes.UPDATE_CONNECTION:
            return {
                ...state,
                connections: state.connections.map(el => {
                    if (el.profileId === action.payload.profileId) {
                        return { ...el, ...action.payload.updatedProfileData }
                    } else {
                        return el;
                    }
                })
            }

        case actionTypes.SET_CONNECTION_LOADING_START:
            return {
                ...state,
                connections: state.connections.map(el => {
                    if (el.profileId === action.payload.profileId) {
                        return { ...el, loading: true }
                    } else {
                        return el;
                    }
                })
            }

        case actionTypes.SET_CONNECTION_LOADING_END:
            return {
                ...state,
                connections: state.connections.map(el => {
                    if (el.profileId === action.payload.profileId) {
                        return { ...el, loading: false }
                    } else {
                        return el;
                    }
                })
            }

        default: return state;
    }
}