import React, { useEffect, useState } from 'react';
import { Slide } from 'react-awesome-reveal';
import { getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Promise } from 'core-js';
import { CircularProgress } from '@material-ui/core';
import { showToastError, Tag } from '../utils/tools';
import PlayerCard from '../utils/playerCard';
import { playersCollection } from '../../firebase';

const TheTeam = () => {
    const [loading, setLoading] = useState(true);
    const [players, setPlayers] = useState(null);

    useEffect(() => {
        if (!players) {
            getDocs(playersCollection).then((snapshot) => {
                let promises = [];
                let imageRef;

                const playerDocs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const storage = getStorage();

                playerDocs.forEach((player, index) => {
                    promises.push(
                        new Promise((resolve, reject) => {
                            imageRef = ref(storage, `players/${player.image}`);

                            getDownloadURL(imageRef)
                            .then( (url) => {
                                playerDocs[index].url = url;
                                resolve();
                            }).catch((error) => {
                                reject();
                            });
                        })
                    )
                });

                Promise.all(promises).then(() => {
                    setPlayers(playerDocs);
                })

                console.log(playerDocs);
            }).catch((error) => {
                showToastError('Sorry try again later');
            }).finally(() => {
                setLoading(false);
            });
        }
    }, [players]);

    const showPlayerByCategory = (category) => (
        players ?
            (players.map((player, i) => {
                return (
                    (player.position === category) ?
                        <Slide left key={player.id} triggerOnce>
                            <div className="item">
                                <PlayerCard
                                    number={player.number}
                                    name={player.name}
                                    lastname={player.lastname}
                                    bck={player.url}
                                    isMainPage={false}
                                    />
                            </div>
                        </Slide>
                    : null
                    )
            }))
            : null
    )

    const titlePropertiesForDisplay = {
        bck: '#0e1731',
        size: '90px',
        color: '#fff'
    };

    return (
        <div className="the_team_container">
            { loading ?
                <div className="progress">
                    <CircularProgress/>
                </div>
            :
                <div>
                    <div className="team_category_wrapper">
                        <Tag className="title"
                            {...titlePropertiesForDisplay}>
                                Keepers
                        </Tag>
                        <div className="team_cards">
                            {showPlayerByCategory('Keeper')}
                        </div>
                    </div>

                    <div className="team_category_wrapper">
                        <Tag className="title"
                            {...titlePropertiesForDisplay}>
                                Defence
                        </Tag>
                        <div className="team_cards">
                            {showPlayerByCategory('Defence')}
                        </div>
                    </div>

                    <div className="team_category_wrapper">
                        <Tag className="title"
                            {...titlePropertiesForDisplay}>
                                Midfield
                        </Tag>
                        <div className="team_cards">
                            {showPlayerByCategory('Midfield')}
                        </div>
                    </div>

                    <div className="team_category_wrapper">
                        <Tag className="title"
                            {...titlePropertiesForDisplay}>
                                Strikers
                        </Tag>
                        <div className="team_cards">
                            {showPlayerByCategory('Striker')}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default TheTeam;