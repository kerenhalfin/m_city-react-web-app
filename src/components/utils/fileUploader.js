import React, { Component } from 'react';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { CircularProgress, Button } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';

class fileUploader extends Component {
    constructor(props) {
        super(props);
        this.playerImg = React.createRef();
    }
    
    state = {
        name: '',
        isUploading: false,
        fileURL: ''
    };

    static getDerivedStateFromProps(props,state){
        if(props.defaultImg){
            return state = {
                name: props.defaultImgName,
                fileURL: props.defaultImg
            }
        }
        return null;
    };

    handleUploadStart = () => {
        console.log(this.state);

        this.setState({
            isUploading: true
        })
    }

    handleUploadError = (e) => {
        console.log(e);
        this.setState({
            isUploading: false
        })
    }

    handleUploadSuccess = (filename) => {
        this.setState({
            name: filename,
            isUploading: false
        })
    }

    uploadImage = (inputFiles) => {
        if (inputFiles && inputFiles.length) {
            const chosenFile = inputFiles[0];

            const img = this.playerImg.current;
            img.src = URL.createObjectURL(chosenFile);
            img.onload = function() {
                URL.revokeObjectURL(this.src);
            }

            const fileExtensionRegex = /(?:\.([^.]+))?$/.exec(chosenFile.name);
            let fileExtension = '';
            if ((fileExtensionRegex != null) && (fileExtensionRegex[0] != null)) {
                fileExtension = fileExtensionRegex[0];
            }

            let filenameToUse = chosenFile.name;
            if (fileExtension) {
                filenameToUse = uuidv4() + fileExtension;
            }

            this.handleUploadStart();

            const storage = getStorage();
            const imageRef = ref(storage, `${this.props.dir}/${filenameToUse}` );
            uploadBytes(imageRef, chosenFile).then((result) => {
                this.handleUploadSuccess(result.metadata.name);
                console.log(result);
            }).catch((error) => {
                this.handleUploadError(error);
            });

            this.props.filename(filenameToUse);
        }
    };

    uploadAgain = () => {
        this.setState({
            name:'',
            isUploading:false,
            fileURL:''
        });
        this.props.resetImage();
    }
    
    render() {
        return (
            <div>
                { !this.state.fileURL ?
                    <div>
                        <input type="file" accept="image/*" name="image" onChange={(event) => this.uploadImage(event.target.files) }/>
                    </div>
                :null}

                { this.state.isUploading ?
                    <div className="progress"
                        style={{textAlign:'center',margin:'30px 0'}}
                    >
                        <CircularProgress
                            style={{color:'#98c6e9'}}
                            thickness={7}
                        />
                    </div>
                :null}

                <div className="image_upload_container">
                    <img
                        id="playerImg"
                        ref={this.playerImg}
                        style={{
                            width:'100%'
                        }}
                        src={this.state.fileURL}
                        alt={this.state.name}
                    >
                    </img>
                    { this.state.fileURL ? 
                        <Button
                            className="remove"
                            variant="outlined"
                            onSubmit={()=> this.uploadAgain()}
                        >
                            Remove
                        </Button>

                        :null
                    }
                    
                </div>
            </div>
        );
    }
}

export default fileUploader;