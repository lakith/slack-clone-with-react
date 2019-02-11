import React,{Component} from 'react';
import {Modal,Icon,Button,Input} from 'semantic-ui-react';
import mime from 'mime-types'

class FileModal extends Component {

    state={
        file:null,
        authorized : ['image/jpeg','image/png']
    }

    addFile = (event) => {
        const file = event.target.files[0];
        //let blob = new Blob(file,{type:'image/jpeg'})
        if(file){
            this.setState({ file });
        }
    }

    sendFile = () => {
        if(this.state.file !== null) {
            if(this.isAuthorized(this.state.file.name)){
                const metadata = {contentType:mime.lookup(this.state.file.name)};
                this.props.uploadFile(this.state.file,metadata)
                this.props.closeModal();
                this.clearFile();
            }
        }
    }

    clearFile = () => {
        this.setState({file:null})
    }

    isAuthorized = (filename) => {
       return this.state.authorized.includes(mime.lookup(filename))
    }

    render(){
        return(
            <Modal basic open={this.props.modal} onClose={this.props.closeModal}>
                <Modal.Header>Select an image file</Modal.Header>
                <Modal.Content>
                    <Input 
                        fluid
                        label="File types: jpg,png"
                        name="file"
                        type="file"
                        onChange={this.addFile}
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="green"
                        onClick={this.sendFile}
                        inverted
                    >
                        <Icon name="checkmark" /> Send
                    </Button>
                    <Button
                        color="red"
                        inverted
                        onClick={this.props.closeModal}
                    >
                        <Icon name="remove" /> Cancel
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default FileModal;