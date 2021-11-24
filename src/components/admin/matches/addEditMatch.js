import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Select, MenuItem, FormControl } from '@material-ui/core';
import LoadingButton from '@mui/lab/LoadingButton';
import { getDocs, getDoc, doc, addDoc, query, orderBy, updateDoc } from 'firebase/firestore';
import AdminLayout from '../../../hoc/adminLayout';
import {
    showToastError, 
    showToastSuccess, 
    textErrorHelper, 
    selectErrorHelper, 
    selectIsError,
    getUITheme
} from '../../utils/tools';
import { matchesCollection, teamsCollection } from '../../../firebase';

const DEFAULT_VALUES = {
    date: '',
    local: '',
    resultLocal: '',
    away: '',
    resultAway: '',
    referee: '',
    stadium: '',
    result: '',
    final: ''
};

const AddEditMatch = (props) => {
    const [loading, setLoading] = useState(false);
    const [formType, setFormType] = useState('');
    const [teams, setTeams] = useState(null);
    const [values, setValues] = useState(DEFAULT_VALUES);

    const GAME_RESULTS = {
        'W': {id: 'W', text: 'Win'},
        'D': {id: 'D', text: 'Draw'},
        'L': {id: 'L', text: 'Lose'},
        'n/a': {id: 'n/a', text: 'Not available'}
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: values,
        validationSchema: Yup.object({
            date: Yup.string()
                .required('This input is required'),
            local: Yup.string()
                .required('This input is required'),
            resultLocal: Yup.number()
                .min(0, 'The minimum is zero')
                .max(99, 'The maximum is 99'),
            away: Yup.string()
                .required('This input is required'),
            resultAway: Yup.number()
                .min(0, 'The minimum is zero')
                .max(99, 'The maximum is 99'),
            referee: Yup.string()
                .required('This input is required'),
            stadium: Yup.string()
                .required('This input is required'),
            result: Yup.mixed()
                .required('This input is required')
                .oneOf(Object.keys(GAME_RESULTS)),
            final: Yup.mixed()
                .required('This input is required')
                .oneOf(['Yes', 'No'])
        }),
        onSubmit: (values) => {
            submitForm(values);
        }
    });

    const showMenuItems = (items, keyProp, valueProp, textProp) => (
        items ?
            items.map((item) => (
                    <MenuItem key={item[keyProp]} value={item[valueProp]}>
                        {item[textProp]}
                    </MenuItem>
                ))
            : null
    )

    const showTeams = () => (
        showMenuItems(teams, 'id', 'shortName', 'shortName')
    )

    const showResults = () => (
        showMenuItems(Object.values(GAME_RESULTS), 'id', 'id', 'text')
    )

    const submitForm = (values) => {
        let dataToSubmit = values;

        teams.forEach((team) => {
            if (team.shortName === dataToSubmit.local) {
                dataToSubmit['localThmb'] = team.thmb;
            }
            else if (team.shortName === dataToSubmit.away) {
                dataToSubmit['awayThmb'] = team.thmb;

            }
        });

        setLoading(true);

        if (formType === 'add') {
            addDoc(matchesCollection, dataToSubmit).then(() => {
                showToastSuccess('Match added');
                formik.resetForm();
            }).catch((error) => {
                showToastError('Sorry, something went wrong', error);
            }).finally(() => {
                setLoading(false);
            });
        } else {
            const docRef = doc(matchesCollection, props.match.params.matchid);
            updateDoc(docRef, dataToSubmit).then(() => {
                showToastSuccess('Match updated');
            }).catch((error) => {
                showToastError('Sorry, something went wrong', error);
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    useEffect(()=> {
        if (!teams) {
            const q = query(
                teamsCollection, 
                orderBy('shortName')
            );

            getDocs(q).then( (snapshot) => {
                const teams = snapshot.docs.map( (doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setTeams(teams);
            }).catch( error => {
                showToastError(error)
            })
        }
    }, [teams]);


    useEffect(() => {
        const param = props.match.params.matchid;
        if (param) {
            // edit
            const docRef = doc(matchesCollection, param);
            getDoc(docRef).then((snapshot) => {
                if (snapshot.data()) {
                    setFormType('edit');
                    setValues(snapshot.data());
                } else {
                    showToastError('No records found');
                }
            })
        } else {
            // add
            setFormType('add');
            setValues(DEFAULT_VALUES);
        }
    }, [props.match.params.matchid]);

    return (
        <AdminLayout title={((formType === 'add') ? 'Add' : 'Edit') + ' Match'}>
            <div className="editmatch_dialog_wrapper">
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <h4>Select date</h4>
                            <FormControl>
                                <TextField
                                    id="date"
                                    name="date"
                                    type="date"
                                    variant="outlined"
                                    {...formik.getFieldProps('date')}
                                    {...textErrorHelper(formik, 'date')}
                                    />
                            </FormControl>
                        </div>

                        <hr/>

                        <div>
                            <h4>Result local</h4>
                            <FormControl error={selectIsError(formik, 'local')}>
                                <Select
                                    id="local"
                                    name="local"
                                    variant="outlined"
                                    displayEmpty
                                    {...formik.getFieldProps('local')}
                                    >
                                    <MenuItem value="" disabled>Select a team</MenuItem>
                                    {showTeams()}
                                </Select>
                                {selectErrorHelper(formik, 'local')}
                            </FormControl>

                            <FormControl
                                style={{
                                    marginLeft: '10px'
                                }}>
                                <TextField
                                    id="resultLocal"
                                    name="resultLocal"
                                    type="number"
                                    variant="outlined"
                                    {...formik.getFieldProps('resultLocal')}
                                    {...textErrorHelper(formik, 'resultLocal')}
                                />
                            </FormControl>
                        </div>

                        <div>
                            <h4>Result away</h4>

                            <FormControl error={selectIsError(formik, 'away')}>
                                <Select
                                    id="away"
                                    name="away"
                                    variant="outlined"
                                    displayEmpty
                                    {...formik.getFieldProps('away')}
                                    >
                                    <MenuItem value="" disabled>Select a team</MenuItem>
                                    {showTeams()}
                                </Select>
                                {selectErrorHelper(formik, 'away')}
                            </FormControl>

                            <FormControl
                                style={{
                                    marginLeft: '10px'
                                }}>
                                <TextField
                                    id="resultAway"
                                    name="resultAway"
                                    type="number"
                                    variant="outlined"
                                    {...formik.getFieldProps('resultAway')}
                                    {...textErrorHelper(formik, 'resultAway')}
                                />
                            </FormControl>
                        </div>

                        <hr/>

                        <div>
                            <h4>Match info</h4>

                            <div className="mb-5">
                                <FormControl>
                                        <TextField
                                            id="referee"
                                            name="referee"
                                            variant="outlined"
                                            placeholder="Add the referee name"
                                            {...formik.getFieldProps('referee')}
                                            {...textErrorHelper(formik, 'referee')}
                                            />
                                </FormControl>
                            </div>

                            <div className="mb-5">
                                <FormControl>
                                    <TextField
                                        id="stadium"
                                        name="stadium"
                                        variant="outlined"
                                        placeholder="Add the stadium name"
                                        {...formik.getFieldProps('stadium')}
                                        {...textErrorHelper(formik, 'stadium')}
                                        />
                                </FormControl>
                            </div>

                            <div className="mb-5">
                                <FormControl error={selectIsError(formik, 'result')}>
                                    <Select
                                        id="result"
                                        name="result"
                                        variant="outlined"
                                        displayEmpty
                                        {...formik.getFieldProps('result')}
                                        >
                                        <MenuItem value="" disabled>Select a result</MenuItem>
                                        { showResults() }
                                    </Select>
                                    
                                        
                                    {selectErrorHelper(formik, 'result')}
                                </FormControl>
                            </div>

                            <div className="mb-5">
                                <FormControl error={selectIsError(formik, 'final')}>
                                    <Select
                                        id="final"
                                        name="final"
                                        variant="outlined"
                                        displayEmpty
                                        {...formik.getFieldProps('final')}
                                        >
                                        <MenuItem value="" disabled>Was the game played?</MenuItem>
                                        <MenuItem value="Yes">Yes</MenuItem>
                                        <MenuItem value="No">No</MenuItem>
                                    </Select>
                                    {selectErrorHelper(formik, 'final')}
                                </FormControl>
                            </div>

                            <LoadingButton
                                type="submit"
                                theme={getUITheme()}
                                color="primary" 
                                loading={loading}
                                loadingIndicator="Saving..."
                                variant="contained"
                            >
                            {
                                `${(formType === 'add') ? 'Add' : 'Edit'} match`
                            }
                            </LoadingButton>
                        
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddEditMatch;