import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Select, MenuItem, FormControl } from '@material-ui/core';
import LoadingButton from '@mui/lab/LoadingButton';
import { addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, deleteObject } from "firebase/storage";
import { playersCollection } from '../../../firebase';
import AdminLayout from '../../../hoc/adminLayout';
import { showToastError, 
    showToastSuccess, 
    textErrorHelper, 
    selectErrorHelper, 
    selectIsError,
    getUITheme } from '../../utils/tools';
import FileUploader from '../../utils/fileUploader';

const DEFAULT_VALUES = {
    name: '',
    lastname: '',
    number: '',
    position: '',
    image:''
};

const AddEditPlayers = (props) => {
    const [loading, setLoading] = useState(false);
    const [formType, setFormType] = useState('');
    const [values, setValues] = useState(DEFAULT_VALUES);
    const [defaultImg, setDefaultImg] = useState('');
    const [initialDefaultImg, setInitialDefaultImg] = useState('');
    const storage = getStorage();

    const submitForm = (values) => {
        let dataToSubmit = values;
        setLoading(true);

        if (formType === 'add') {
            addDoc(playersCollection, dataToSubmit).then(() => {
                showToastSuccess('Player added');
                formik.resetForm();
                props.history.push('/admin_players');

            }).catch((error) => {
                showToastError(error);
            });
        } else {
            const docRef = doc(playersCollection, props.match.params.playerid);
            updateDoc(docRef, dataToSubmit).then(() => {
                
                if ((initialDefaultImg && (initialDefaultImg !== '')) && 
                ((initialDefaultImg !== formik.values.image) || (formik.values.image === ''))) {
                    
                    const imageRef = ref(storage, `players/${initialDefaultImg}` );
                    deleteObject(imageRef).then(() => {
                        console.log('Image deleted successfully from storage');
                    }).catch((error) => {
                        console.log(error);
                    });
                }
                
                showToastSuccess('Player updated');

            }).catch((error) => {
                showToastError(error);
            }).finally(() => {
                setLoading(false);
            });
        }
    }

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: values,
        validationSchema: Yup.object({
            name: Yup.string()
                .required('This input is required'),
            lastname: Yup.string()
                .required('This input is required'),
            number: Yup.number()
                .required('This input is required')
                .min(0, 'The minimum is zero')
                .max(100, 'The maximum is 100'),
            position: Yup.string()
                .required('This input is required'),
            image: Yup.string()
                .required('This input is required')
        }),
        onSubmit: (values) => {
            submitForm(values);
        }
    });

    const updateImageName = (filename) => {
        formik.setFieldValue('image', filename);
    }

    const resetImage = () => {
        updateImageName('');
        setDefaultImg('');
    }

    useEffect(() => {
        const param = props.match.params.playerid;

        if (param) {
            const docRef = doc(playersCollection, param);
            getDoc(docRef).then((snapshot) => {
                if (snapshot.data()) {
                    setInitialDefaultImg(snapshot.data().image);

                    if (snapshot.data().image) {
                        const imageRef = ref(storage, `players/${snapshot.data().image}`);

                        getDownloadURL(imageRef)
                        .then( (url) => {
                            updateImageName(snapshot.data().image);
                            setDefaultImg(url);
                        });
                    } else {
                        updateImageName('');
                    }
                    
                    setFormType('edit');
                    setValues(snapshot.data());
                } else {
                    showToastError('Sorry, nothing was found');
                }
            }).catch((error) => {
                showToastError(error);
            });

        } else {
            setFormType('add');
            setValues(DEFAULT_VALUES);
        }

    }, [props.match.params.playerid, updateImageName, storage]);

    return (
        <AdminLayout title={`${(formType === 'add') ? 'Add' : 'Edit'} Player`}>
            <div className="editplayers_dialog_wrapper">
                <div>
                    <form onSubmit={formik.handleSubmit}>
                        <FormControl error={selectIsError(formik,'image')}>
                            <FileUploader
                                dir="players"
                                defaultImg={defaultImg} /// image url
                                defaultImgName={formik.values.image} /// name of file
                                filename={(filename)=> updateImageName(filename)}
                                resetImage={()=> resetImage()}/>
                            {selectErrorHelper(formik,'image')}
                        </FormControl>

                        <hr/>
                        <h4>Player info</h4>
                        <div className="mb-5">
                            <FormControl>
                                <TextField 
                                    id="name"
                                    name="name"
                                    variant="outlined"
                                    placeholder="Add first name"
                                    {...formik.getFieldProps('name')}
                                    {...textErrorHelper(formik, 'name')}
                                />
                            </FormControl>
                        </div>

                        <div className="mb-5">
                            <FormControl>
                                <TextField 
                                    id="lastname"
                                    name="lastname"
                                    variant="outlined"
                                    placeholder="Add last name"
                                    {...formik.getFieldProps('lastname')}
                                    {...textErrorHelper(formik, 'lastname')}
                                />
                            </FormControl>
                        </div>

                        <div className="mb-5">
                            <FormControl>
                                <TextField 
                                    type="number"
                                    id="number"
                                    name="number"
                                    variant="outlined"
                                    placeholder="Add number"
                                    {...formik.getFieldProps('number')}
                                    {...textErrorHelper(formik, 'number')}
                                />
                            </FormControl>
                        </div>

                        <div className="mb-5">
                            <FormControl error={selectIsError(formik, 'position')}>
                                <Select 
                                    id="position"
                                    name="position"
                                    variant="outlined"
                                    displayEmpty
                                    {...formik.getFieldProps('position')}
                                >
                                    <MenuItem value="" disabled>Select a position</MenuItem>
                                    <MenuItem value="Keeper">Keeper</MenuItem>
                                    <MenuItem value="Defence">Defence</MenuItem>
                                    <MenuItem value="Midfield">Midfield</MenuItem>
                                    <MenuItem value="Striker">Striker</MenuItem>
                                </Select>

                                {selectErrorHelper(formik, 'position')}

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
                            `${(formType === 'add') ? 'Add' : 'Edit'} player`
                        }
                        </LoadingButton>
                    </form>
                </div>
            </div>
        </AdminLayout>
    )
}

export default AddEditPlayers;