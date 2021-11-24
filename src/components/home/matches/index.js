import React from 'react';
import { Tag } from '../../utils/tools';
import Blocks from './blocks';

const MatchesHome = () => {
    return (
        <div className="home_matches_wrapper">
            <div className="container">
                <Tag 
                    bck='#0e1731'
                    size='50px'
                    color='#fff'
                >
                        Matches
                </Tag>

                <Blocks/>

                <Tag 
                    size='22px'
                    color='#0e1731'
                    link= {true}
                    linkTo="/the_team"
                >
                        Matches
                </Tag>
            </div>
        </div>
    )
}

export default MatchesHome;