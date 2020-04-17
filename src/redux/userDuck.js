import {loginWithGoogle, signOutGoogle} from '../firebase';
import {getFavoritesActions} from './charsDuck';
// const
let initData = {
    fetching: false,
    loggedIn: false
};
let LOGIN = "LOGIN";
let LOGIN_SUCCESS = "LOGIN_SUCCESS";
let LOGIN_ERROR = "LOGIN_ERROR";
let LOGOUT = "LOGOUT";

// reducer
export default function reducer(state = initData, action) {
    switch (action.type) {
        case LOGIN:
            return {...state, fetching: true}
        case LOGIN_SUCCESS:
            return {...state, fetching: false, ...action.payload, loggedIn: true}
        case LOGIN_ERROR:
            return {...state, fetching: false, error: action.payload}
        case LOGOUT:
            return {...initData}
        default:
            return state;
    }
}

//funcion auxiliar
function saveStorage(storage) {
    localStorage.state = JSON.stringify(storage);
}

// action (action creator)
export let restoreSessionAction = () => (dispatch, getState) => {
    let state = localStorage.getItem('state');
    state = JSON.parse(state);
    if (state && state.user) {
        dispatch({
            type: LOGIN_SUCCESS,
            payload: state.user
        })
    }
    if (state && state.characters) {
        getFavoritesActions()(dispatch, getState);
    }
}

export let doGoogleLoginAction = () => (dispatch, getState) => {
    dispatch({
        type: LOGIN
    })
    return loginWithGoogle()
        .then(user => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                }
            });
            saveStorage(getState());
            getFavoritesActions()(dispatch, getState);
            // Siempre un Action debe recibir una segunda llamada (dispatch, getState)
        })
        .catch(error => {
            dispatch({
                type: LOGIN_ERROR,
                payload: error.message
            })
        })
}

export let doLogoutAction = () => (dispatch, getState) => {
    signOutGoogle()
    localStorage.removeItem('state');
    dispatch({
        type: LOGOUT
    })
}
