import React, { useState, useEffect } from 'react';
import { Slide } from 'react-awesome-reveal';
import { matchesCollection } from '../../../firebase';
import { getDocs } from 'firebase/firestore';
import MatchBlock from '../../utils/matches_block';

const Blocks = () => {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        if (!matches.length) {
            getDocs(matchesCollection).then((snapshot) => {
                const matches = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setMatches(matches);

            }).catch((error) => {
                console.log(error);
            })
        } else {

        }
    }, [matches]);

    const showMatches = () => (
        matches ? 
            matches.map((match) => (
                <Slide bottom key={match.id} className="item" triggerOnce>
                    <div>
                        <div className="wrapper">
                            <MatchBlock match={match}/>
                        </div>
                    </div>
                </Slide>
            ))
        : null
    )

    return (
        <div className="home_matches">
            {showMatches()}
        </div>
    )
}

export default Blocks;