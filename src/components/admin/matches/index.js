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
import { matchesCollection } from '../../../firebase';

const AdminMatches = () => {
    const [lastVisible, setLastVisible] = useState(null);
    const [loading, setLoading] = useState(false);
    const [matches, setMatches] = useState(null);

    const loadMatches = (query, isFirstLoad) => {
        getDocs(query).then((snapshot) => {
            if (snapshot && snapshot.docs && snapshot.docs.length) {
                const lastVisibleDoc = snapshot.docs[snapshot.docs.length - 1];
                const matchesMap = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
    
                setLastVisible(lastVisibleDoc);
    
                if (isFirstLoad) {
                    setMatches(matchesMap);
                } else {
                    setMatches([...matches, ...matchesMap]);
                }
            }

        }).catch((error) => {
            showToastError(error);
        }).finally(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        if (!matches) {
            setLoading(true);

            const q = query(
                matchesCollection, 
                limit(2)
            );

            loadMatches(q, true);
        }

    }, [matches, loadMatches]);

    const loadMoreMatches = () => {
        if (lastVisible) {
            setLoading(true);

            const q = query(
                matchesCollection, 
                startAfter(lastVisible),
                limit(2)
            );

            loadMatches(q, false);

        } else {
            showToastError('nothing to load')
        }
    }

    return (
        <AdminLayout title="The Matches">
            <div className="mb-5">
                <Button
                    variant="outlined"
                    component={Link}
                    to={'/admin_matches/add_match'}
                >
                    Add match
                </Button>
            </div>

            <Paper className="mb-5">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Match</TableCell>
                            <TableCell>Result</TableCell>
                            <TableCell>Final</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { matches ?
                            matches.map((match, i) => (
                                <TableRow key={match.id}>
                                    <TableCell>
                                        {match.date}
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/admin_matches/edit_match/${match.id}`}>
                                            {match.away} <strong>-</strong> {match.local}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {(match.resultAway === '') ? '-' : match.resultAway} 
                                        <strong> - </strong> 
                                        {(match.resultLocal === '') ? '-' : match.resultLocal}
                                    </TableCell>
                                    <TableCell>
                                        {match.final === 'Yes' ?
                                        <span className="matches_tag_red">
                                            Final
                                        </span>
                                        :
                                        <span className="matches_tag_green">
                                            Not played yet
                                        </span>
                                        }
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
                onClick={() => loadMoreMatches()}
            >
                Load more
            </LoadingButton>

        </AdminLayout>
    )
}

export default AdminMatches;