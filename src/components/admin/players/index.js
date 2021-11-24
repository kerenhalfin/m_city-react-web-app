import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { query, getDocs, limit, startAfter } from 'firebase/firestore';
import { Button, 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableRow, 
    Paper } from '@material-ui/core';
import LoadingButton from '@mui/lab/LoadingButton';
import { showToastError, getUITheme } from '../../utils/tools';
import AdminLayout from '../../../hoc/adminLayout';
import { playersCollection } from '../../../firebase';

const AdminPlayers = () => {
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [players, setPlayers] = useState(null);

    const loadPlayers = (query, isFirstLoad) => {
        getDocs(query).then((snapshot) => {
            if (snapshot && snapshot.docs && snapshot.docs.length) {
                const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
                const playersMap = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
    
                setLastVisible(lastVisibleDoc);
    
                if (isFirstLoad) {
                    setPlayers(playersMap);
                } else {
                    setPlayers([...players, ...playersMap]);
                }
            }

        }).catch((error) => {
            showToastError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        if (!players) {
            setLoading(true);

            const q = query(
                playersCollection, 
                limit(2)
            );

            loadPlayers(q, true);
        }

    }, [players, loadPlayers]);

    const loadMorePlayers = () => {
        if (lastVisible) {
            setLoading(true);

            const q = query(
                playersCollection, 
                startAfter(lastVisible),
                limit(2)
            );

            loadPlayers(q, false);

        } else {
            showToastError('nothing to load')
        }
    }

    return (
        <AdminLayout title="The Players">
            <div className="mb-5">
                <Button
                    variant="outlined"
                    component={Link}
                    to={'/admin_players/add_player'}
                >
                    Add player
                </Button>
            </div>

            <Paper className="mb-5">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>First name</TableCell>
                            <TableCell>Last name</TableCell>
                            <TableCell>Number</TableCell>
                            <TableCell>Position</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { players ?
                            players.map((player, i) => (
                                <TableRow key={player.id}>
                                    <TableCell>
                                        <Link to={`/admin_players/edit_player/${player.id}`}>
                                            {player.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/admin_players/edit_player/${player.id}`}>
                                            {player.lastname}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {player.number}
                                    </TableCell>
                                    <TableCell>
                                        {player.position}
                                    </TableCell>
                                </TableRow>
                            ))
                        : null
                        }
                    </TableBody>
                </Table>
            </Paper>

            <LoadingButton
                type="submit"
                theme={getUITheme()}
                color="primary" 
                loading={loading}
                loadingIndicator="Loading..."
                variant="contained"
                onClick={() => loadMorePlayers()}
            >
                Load more
            </LoadingButton>
        </AdminLayout>
    )
}

export default AdminPlayers;