import React from 'react';
import Card from '../card/Card';
import styles from './home.module.css';
import { connect } from 'react-redux';
import { removeCharacterActions, addToFavoritesActions } from '../../redux/charsDuck';

function Home({ chars, removeChar, addToFavoritesActions }) {

    function renderCharacter() {
        let char = chars[0];
        return (
            <Card leftClick={nextCharacter} rightClick={addToFav} {...char} />
        )
    }

    function nextCharacter() {
        removeChar();
    }

    function addToFav() {
        addToFavoritesActions();
    }

    return (
        <div className={styles.container}>
            <h2>Personajes de Rick y Morty</h2>
            <div>
                {renderCharacter()}
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        chars: state.characters.array
    }
}

export default connect(mapStateToProps, {removeChar: removeCharacterActions, addToFavoritesActions})(Home)
