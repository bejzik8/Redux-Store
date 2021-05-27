import { combineReducers } from 'redux';

import { userReducer } from './userReducer';
import { uiReducer } from './uiReducer';
import { connectionsReducer } from './connectionsReducer';
import { tagsReducer } from './tagsReducer';

export const rootReducer = combineReducers({
    user: userReducer,
    ui: uiReducer,
    connections: connectionsReducer,
    tags: tagsReducer
});