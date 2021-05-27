import * as actionTypes from '../actions/tagsActions';

const tagsInitialState = {
    allTags: []
}

export const tagsReducer = (state = tagsInitialState, action) => {
    switch(action.type) {

        case actionTypes.SET_TAGS:
            return {
                ...state,
                allTags: action.payload.tags,
            }

        default: return state;
    }
}