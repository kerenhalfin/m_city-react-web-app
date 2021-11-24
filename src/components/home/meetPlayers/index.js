import React, {useState} from 'react';
import { Tag } from '../../utils/tools';
import { Fade } from 'react-awesome-reveal';
import HomeCards from './cards';

const MeetPlayers = () => {
    const [show, setShow] = useState(false);

    let tagDefault = {
        bck: '#0e1731',
        size:'100px',
        color: '#fff'
    }

    const showTextTag = (text) => (
        <Tag
            {...tagDefault}
            add={{
                display:'inline-block',
                marginBottom: '20px'
            }}>
                {text}
        </Tag>
    )

    return (
        <Fade 
            onVisibilityChange={(inView) => {
                if(inView) {
                    setShow(true)
                }
            }}
            triggerOnce
        >
            <div className="home_meetplayers">
                <div className="container">
                    <div className="home_meetplayers_wrapper">
                        <div className="home_card_wrapper">
                            <HomeCards
                                show={show}/>
                        </div>
                        <div className="home_text_wrapper">
                            <div>
                                {showTextTag('Meet')}
                            </div>
                            <div>
                                {showTextTag('The')}
                            </div>
                            <div>
                                {showTextTag('Players')}
                            </div>
                            <div>
                                <Tag
                                    bck='#fff'
                                    size='27px'
                                    color='#0e1731'
                                    link={true}
                                    linkTo='/theTeam'
                                    add={{
                                        display:'inline-block',
                                        marginBottom:'27px',
                                        border:'1px solid #0e1731'
                                    }}
                                >
                                    Meet them here
                                </Tag>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fade>
    )
}

export default MeetPlayers;