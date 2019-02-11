import React,{Component} from 'react'
import { Segment, Input, Button } from 'semantic-ui-react';
import firebase from '../../../../firebaseConfig/firebase';
import FileModal from '../FileModal/FileModal';
import uuidv4 from 'uuid/v4'
import ProgressBar from '../../ProgressBar/Progressbart';

class MessageForm extends Component {

    state={
        message:"",
        loading:false,
        errors:[],
        modal:false,
        uploadTask:null,
        uploadState:'',
        storageRef: firebase.storage().ref(),
        percentUploaded:0
    } 

    openModal = () => {
        this.setState({modal:true})
    }

    closeModal = () => {
        this.setState({modal:false})
    }

    handleChange = (event)=> {
        this.setState({[event.target.name] : event.target.value})
    }

    createMessage = (fileUrl = null) => {
        const message = {
          timeStamp:firebase.database.ServerValue.TIMESTAMP,
          user: {
                 id:this.props.userId,
                 name:this.props.displayName,
                 avatar:this.props.photoURL
                  }
        };
        if (fileUrl !== null) {
          message["image"] = fileUrl;
        } else {
          message["content"] = this.state.message;
        }
        return message;
      };
    

    sendMessage = ()=> {

        const {messageRef} = this.props;
        const {message} = this.state;
        
        if(this.props.isAuthenticated) {
            if(message){
                this.setState({loading:true});
                messageRef
                    .child(this.props.currentChannel.key)
                    .push()
                    .set(this.createMessage())
                    .then(()=> {
                        this.setState({loading:false,message:'',errors:[]})
                    })
                    .catch(err=> {
                        console.log(err);
                        this.setState({loading:false,errors:this.state.errors.concat(err)});
                    })
            } else {
                this.setState({errors:this.state.errors.concat({message:"Add A Message"})})
            }
        }else {
            this.setState({errors:this.state.errors.concat({message:"Sign in to the application First"})})
        }


    }

    // uploadFile = (file,metadeta) => {
    //     const pathToUpload = this.props.currentChannel.key;
    //     const ref = this.props.messageRef;
    //     const filePath = `chat/public/${uuidv4()}.jpg`

    //     this.setState({
    //         uploadState:'Uploading',
    //         uploadTask:this.state.storageRef.child(filePath).put(file,metadeta)
    //     },
    //         ()=>{
    //             this.state.uploadTask.on('state_change',snap=>{
    //                 const percentUploaded = Math.round((snap.bytesTransferred/snap.totalBytes) * 100);
    //                 this.setState({percentUploaded:percentUploaded})
    //             })
    //         } , 
    //         (err) => {
    //             console.log(err)
    //             this.setState({
    //                 errors : this.state.errors.concat(err),
    //                 uploadState:'error',
    //                 uploadTask:null
    //             })
    //         },
    //         ()=> {
    //             this.state.uploadTask.snapshot.ref.getDownloadUrl().then(downloadUrl => {
    //                 this.sendFileMessage(downloadUrl,ref,pathToUpload);
    //             }).catch (err=> {
    //                 console.log(err)
    //                 this.setState({
    //                     errors : this.state.errors.concat(err),
    //                     uploadState:'error',
    //                     uploadTask:null
    //                 })
    //             }) 
    //         }
    //     )
    // }

    uploadFile = (file, metadata) => {
        const pathToUpload = this.props.currentChannel.key;
        const ref = this.props.messageRef;
        const filePath = `chat/public/${uuidv4()}.jpg`;

        console.log(file)
        console.log(metadata)
    
        this.setState(
          {
            uploadState: "uploading",
            uploadTask: this.state.storageRef.child(filePath).put(file, metadata)
          },
          () => {
            this.state.uploadTask.on(
              "state_changed",
              snap => {
                const percentUploaded = Math.round(
                  (snap.bytesTransferred / snap.totalBytes) * 100
                );
                this.setState({ percentUploaded });
              },
              err => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null
                });
              },
              () => {
                this.state.uploadTask.snapshot.ref
                  .getDownloadURL()
                  .then(downloadUrl => {
                    this.sendFileMessage(downloadUrl, ref, pathToUpload);
                  })
                  .catch(err => {
                    console.error(err);
                    this.setState({
                      errors: this.state.errors.concat(err),
                      uploadState: "error",
                      uploadTask: null
                    });
                  });
              }
            );
          }
        );
     };
    

     sendFileMessage = (fileUrl, ref, pathToUpload) => {
        //  console.log("path")
        //  console.log(pathToUpload)
        //  console.log("ref")
        //  console.log(ref);
        //  console.log("fileUrl")
        //  console.log(fileUrl)
         
        ref
          .child(pathToUpload)
          .push()
          .set(this.createMessage(fileUrl))
          .then(() => {
            this.setState({ uploadState: "done" });
          })
          .catch(err => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err)
            });
          });
      };

    render(){
        return(
            <Segment className="message__form">
                <Input 
                    fluid
                    name="message"
                    style={{marginBottom:'0.5em'}}
                    label={<Button icon="add" />}
                    labelPosition="left"
                    placeholder="Write Your Message"
                    onChange={this.handleChange}
                    value={this.state.message}
                    className={
                        //"error"
                        this.state.errors.some(error=> error.message.includes("Add A Message") || error.message.includes("Sign in to the application First"))? "error" : ""
                    }
                />
                <Button.Group icon widths="2">
                    <Button 
                        onClick={this.sendMessage}
                        color="orange"
                        content="Add Reply"
                        disabled={this.state.loading}
                        labelPosition="left"
                        icon="edit"
                    />

                    <Button 
                        color="teal"
                        content="Upload Media"
                        disabled={this.state.uploadState === "uploading"}
                        onClick={this.openModal}
                        labelPosition="right"
                        icon="cloud upload"
                    />
                </Button.Group>
                
                <FileModal
                        modal={this.state.modal}
                        uploadFile = {this.uploadFile}
                        closeModal={this.closeModal}
                    /> 

                <ProgressBar percentUploaded= {this.state.percentUploaded} uploadState={this.state.uploadState} /> 

            </Segment>
        )
    }
}

export default MessageForm;