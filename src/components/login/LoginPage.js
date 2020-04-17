import React from 'react';
import styles from './login.module.css';
import {connect} from 'react-redux';
import {doGoogleLoginAction, doLogoutAction} from '../../redux/userDuck';

function LoginPage({loggedIn, fetching, doGoogleLoginAction, doLogoutAction}) {
    // loggedIn, fetching, doGoogleLoginAction, doLogoutAction serian las Props
    function doLogin() {
        doGoogleLoginAction();
    }

    function logout() {
        doLogoutAction();
    }

    return (
        <div className={styles.container}>
        {
            fetching ? <h1>Cargando...</h1>
                : <div>
                    {loggedIn ?
                        <div>
                            <h1>
                                Cierra tu sesión
                            </h1>
                            <button onClick={logout}>
                                Cerrar Sesión
                            </button>
                        </div>
                        :
                        <div>
                            <h1>
                                Inicia Sesión con Google
                            </h1>
                            <button onClick={doLogin}>
                            Iniciar
                            </button>
                        </div>
                    }
                </div>
        }
        </div>
    )
}
// ESTO:
// function mapState({user: {fetching, loggedIn} }) {
//     return {fetching};
// }
// Y ESTO:
// function mapState(state) {
//     return {
//         fetching: state.user.fetching,
//         loggedIn: state.user.loggedIn
//     };
// }
// Es lo mismo
function mapState(state) {
    return {
        fetching: state.user.fetching,
        loggedIn: state.user.loggedIn
    };
}

export default connect(mapState, {doGoogleLoginAction, doLogoutAction})(LoginPage)
