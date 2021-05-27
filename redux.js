import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';

import { rootReducer } from './reducers/rootReducer';

const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
});

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunkMiddleware)));