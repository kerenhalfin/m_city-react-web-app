import React from 'react';
import {  easeBackOut, easePolyOut  } from 'd3-ease';
import NodeGroup from 'react-move/NodeGroup';

const MatchesList = (props) => {

    const showMatches = () => (
        props.matches ?
            <NodeGroup
                data={props.matches}
                keyAccessor={(d)=> d.id}

                start={()=>({
                    opacity:0,
                    x:-200
                })}

                enter={(data,index) => ({
                    opacity:[1],
                    x:[0],
                    timing: { duration: 700, 
                        delay: index * 400, 
                        ease: easeBackOut }
                })}

                update={(data,index) => ({
                    opacity:[1],
                    x:[0],
                    timing:{ 
                        duration: 700, 
                        delay: index * 400,
                        ease: easeBackOut 
                    }
                })}

                leave={(data,index) => ({
                    opacity:[0],
                    x:[-200],
                    timing:{ duration: 700,
                        delay: index * 50, 
                        ease:easePolyOut}
                })}
            >
                { (nodes)=> (
                    <div>
                        { nodes.map(({key,data,state:{x,opacity}})=>(
                            <div
                                key={key}
                                className="match_box_big"
                                style={{
                                    opacity,
                                    transform:`translate(${x}px)`
                                }}
                            >
                                <div className="block_wraper">
                                    <div className="block">
                                        <div className="icon"
                                            style={{ background:`url(/images/team_icons/${data.localThmb}.png)`}}
                                        ></div>
                                        <div className="team">{data.local}</div>
                                        <div className="result">{(data.resultLocal === '') ? '-' : data.resultLocal}</div>
                                    </div>
                                    <div className="block">
                                        <div className="icon"
                                            style={{ background:`url(/images/team_icons/${data.awayThmb}.png)`}}
                                        ></div>
                                        <div className="team">{data.away}</div>
                                        <div className="result">{(data.resultAway === '') ? '-' : data.resultAway}</div>
                                    </div>
                                </div>
                                <div className="block_wraper nfo">
                                    <div><strong>Date:</strong> {data.date}</div>
                                    <div><strong>Stadium:</strong> {data.stadium}</div>
                                    <div><strong>Referee:</strong> {data.referee}</div>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                )}
            </NodeGroup>

        :null
    )


    return(
        <div>
            {showMatches()}
        </div>
    )

} 

export default MatchesList;