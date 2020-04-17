import React from 'react'
import styles from './favs.module.css'
import Card from '../card/Card'
import {connect} from "react-redux";

function FavPage({favs = [0]}) {
    function renderCharacter(char) {
        return (
            <Card hide {...char} key={char.id}/>
        )
    }

    return (
        <div className={styles.container}>
            <h2>Favoritos</h2>
            {favs.map(renderCharacter)}
            {!favs.length && <h3>No hay personajes agregados</h3>}
        </div>
    )
}

function mapStateToProps({characters}) {
    return {
        favs: characters.favorites
    }
}

export default connect(mapStateToProps)(FavPage)
