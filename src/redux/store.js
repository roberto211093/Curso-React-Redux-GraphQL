import {createStore, combineReducers, compose, applyMiddleware} from "redux";
import userReducer, {restoreSessionAction} from './userDuck';
import charsReducer, {getCharactersActions} from './charsDuck';
import thunk from "redux-thunk";

let rootReducer = combineReducers({
    user: userReducer,
    characters: charsReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore() {
    let store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(thunk))
    );
    // Consumiendo los personajer por primera vez
    getCharactersActions()(store.dispatch, store.getState);
    restoreSessionAction()(store.dispatch, store.getState);
    return store;
}
