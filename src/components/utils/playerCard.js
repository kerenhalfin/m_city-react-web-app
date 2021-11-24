import React from 'react';

const PlayerCard = (props) => {
    return (
        <div className="player_card_wrapper">
            <div
                className="player_card_thmb"
                style={{
                    background: `#f2f9ff url(${props.bck})`
                }}
                >
            </div>
            <div className="player_card_nfo">
                <div className="player_card_number">
                    {props.number}
                </div>
            </div>
            <div className={props.isMainPage ? 'player_card_name_main' : 'player_card_name_general'}>
                <span>{props.name}</span>
                <span>{props.lastname}</span>
            </div>
        </div>
    )
}

export default PlayerCard;