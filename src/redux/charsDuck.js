// import axios from 'axios';
import {getFavoritos, updateDB} from '../firebase';
import ApolloClient, {gql} from 'apollo-boost';
// const
let initData = {
    fetching: false,
    array: [],
    current: {},
    favorites: [],
    nextPage: 1
};
// eslint-disable-next-line
let URL = "https://rickandmortyapi.com/api";

let client = new ApolloClient({
    uri: "https://rickandmortyapi.com/graphql"
})

let GET_CHARACTERS = "GET_CHARACTERS";
let GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS";
let GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR";

let REMOVE_CHARACTERS = "REMOVE_CHARACTERS";

let ADD_TO_FAVORITES = "ADD_TO_FAVORITES";
let GET_FAVORITES = "ADD_FAVORITES";
let GET_FAVORITES_SUCCESS = "ADD_FAVORITES_SUCCESS";
let GET_FAVORITES_ERROR = "ADD_FAVORITES_ERROR";

let UPDATE_PAGE = "UPDATE_PAGE";

// reducer
export default function reducer(state = initData, action) {
    switch (action.type) {
        case GET_CHARACTERS:
            return {...state, fetching: true}
        case GET_CHARACTERS_SUCCESS:
            return {...state, array: action.payload, fetching: false}
        case GET_CHARACTERS_ERROR:
            return {...state, fetching: false, error: action.payload}

        case REMOVE_CHARACTERS:
            return {...state, array: action.payload}
        case ADD_TO_FAVORITES:
            return {...state, ...action.payload}

        case GET_FAVORITES:
            return {...state, fetching: true}
        case GET_FAVORITES_SUCCESS:
            return {...state, fetching: false, favorites: action.payload}
        case GET_FAVORITES_ERROR:
            return {...state, fetching: false, error: action.payload}

        case UPDATE_PAGE:
            return {...state, nextPage: action.payload}
        default:
            return state;
    }
}

// actions (thunks)
export let getFavoritesActions = () => (dispatch, getState) => {
    dispatch({
        type: GET_FAVORITES
    })
    let {uid} = getState().user;
    return getFavoritos(uid)
        .then(favorites => {
            dispatch({
                type: GET_FAVORITES_SUCCESS,
                payload: [...favorites]
            })
        })
        .catch(error => {
            dispatch({
                type: GET_FAVORITES_ERROR,
                payload: error.message
            })
        })
}

export let addToFavoritesActions = () => (dispatch, getState) => {
    let {array, favorites} = getState().characters; // Se trae la llave array y favorites del state characters
    let {uid} = getState().user; // Se trae la llave array y favorites del state characters
    let char = array.shift();
    favorites.push(char)
    updateDB(favorites, uid)
    dispatch({
        type: ADD_TO_FAVORITES,
        payload: {array: [...array], favorites: [...favorites]} //pasamos un objeto deconstruido al reducer para informar que son arrays diferentes
    })
    if (!array.length) {
        getCharactersActions()(dispatch, getState);
    }
}

export let removeCharacterActions = () => (dispatch, getState) => {
    let {array} = getState().characters; // Se trae la llave array del state characters
    array.shift(); // Se elimina el indice 0 del array de characters
    if (!array.length) {
        getCharactersActions()(dispatch, getState);
        return;
    }
    dispatch({
        type: REMOVE_CHARACTERS,
        payload: [...array]
    })
}

export let getCharactersActions = () => (dispatch, getState) => {
    // getCharactersActions es una funcion que devuelve otra funcion
    let query = gql`
    query ($page:Int){
        characters(page:$page){
          info{
            pages
            next
            prev
          }
          results{
            name
            image
          }
        }
      }
    `
    dispatch({
        type: GET_CHARACTERS
    })
    let {nextPage} = getState().characters
    return client.query({
        query,
        variables: {page: nextPage}
    }).then(({data, error}) => {
        if (error) {
            dispatch({
                type: GET_CHARACTERS_ERROR,
                payload: error
            })
            return
        }
        dispatch({
            type: GET_CHARACTERS_SUCCESS,
            payload: data.characters.results
        })
        dispatch({
            type: UPDATE_PAGE,
            payload: data.characters.info.next ? data.characters.info.next : 1
        })
    })
    // return axios.get(`${URL}/character`)
    //     .then(res => {
    //         dispatch({
    //             type: GET_CHARACTERS_SUCCESS,
    //             payload: res.data.results
    //         })
    //     })
    //     .catch(error => {
    //         dispatch({
    //             type:GET_CHARACTERS_ERROR,
    //             payload: error.message
    //         })
    //     });
}
