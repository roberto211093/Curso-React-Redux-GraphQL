import React, { useEffect, useState } from 'react'
import Card from '../card/Card'
import { gql } from 'apollo-boost'
import { useQuery } from 'react-apollo'

export default function GraphHome() {
    let [chars, setChars] = useState([])
    let query = gql`
        {
            characters{
                results{
                    name
                    image
                }
            }
        }
    `
    // let res = useQuery(query);
    // console.log(res);
    let {data, loading, error} = useQuery(query);

    useEffect(() => {
        if (data && !loading && !error) {
            setChars([...data.characters.results])
        }
    }, [data]);

    function nextCharacter() {
        chars.shift()
        setChars([...chars])
    }

    return (
        <div>
            {
                loading
                    ? <h2>Cargando</h2>
                    : <Card
                        leftClick={nextCharacter}
                        {...chars[0]}
                    />
            }
        </div>
    )
}
