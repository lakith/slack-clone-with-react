import React,{Component} from 'react';
import { Menu, Icon,Modal, Form, Input, Button } from 'semantic-ui-react';
import firebase from '../../../../firebaseConfig/firebase'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import * as channelAction from '../../../../store/actions/channelActions'

class Channels extends Component {

    state = {
        channels:[],
        modal:false,
        channelName:'',
        channelDetails:'',
        channelRef:firebase.database().ref('channels'),
        firstLoad: true,
        activeChannel:''
    }

    handleChange = event => {
        this.setState({[event.target.name]:event.target.value});
    }

    openModal = ()=> {
        this.setState({modal:true})
    }

    closeModal = ()=> {
        this.setState({modal:false})
    }

    componentDidMount(){
        this.addListeners();
    }

    componentWillUnmount() {
        this.removeListeners();
    }

    removeListeners = () => {
        this.state.channelRef.off();
    }

    addListeners = ()=> {
        let loadedChannels = [];
        this.state.channelRef.on('child_added',snap => {
            loadedChannels.push(snap.val());
            this.setState({channels:loadedChannels},()=>this.setFirstChannel());
        })
    }

    setFirstChannel = () => {
        
        if(this.state.firstLoad && this.state.channels.length > 0){
            const firstChannel = this.state.channels[0];
            this.props.OnChannelClick(firstChannel);
            this.setActiveChannel(firstChannel);

        }
        this.setState({firstLoad:false})
    }

    addChannel = () => {
        if(this.props.isAuthenticated)
            {const {channelRef,channelName,channelDetails} = this.state;

            const key = channelRef.push().key;

            const newChannel = {
                key:key,
                name:channelName,
                details:channelDetails,
                createdBy: {
                    name:this.props.displayName,
                    avatar:this.props.photoURL
                }
            };

            channelRef
                .child(key)
                .update(newChannel)
                .then(()=>{
                    this.setState({channelName:'',channelDetails:''});
                    this.closeModal();
                })
                .catch(err=>{
                    console.log(err);
                })
        } else {
            this.props.history.push('/login')
        }

    }

    handleSubmit = event => {
        event.preventDefault();
        if(this.isFormValid(this.state)){
            this.addChannel();
        }
    }
    
    isFormValid = ({channelName,channelDetails}) => {
        return channelName && channelDetails
    }

    showAllChannels = channels => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item
                key={channel.key}
                onClick={()=>this.changeChannel(channel)}
                name={channel.name}
                style={{opacity:0.7}}
                active={channel.key === this.state.activeChannel}
            >
               # {channel.name}
            </Menu.Item>
        )) 
    )

    changeChannel = (channel) => {
        this.setActiveChannel(channel);
        this.props.OnChannelClick(channel)
    }

    setActiveChannel = (channel) => {
        this.setState({activeChannel : channel.key})
    }

    render () {

        //let {channels} = this.state.channels;

        return (
            <React.Fragment>
                <Menu.Menu style={{paddingBottom:'2em'}} >
                    <Menu.Item>
                        <span>
                            <Icon name="exchange"/> CHANNELS
                        </span>{" "}
                        ({this.state.channels.length}) <Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {/* ALl channels */}
                    {this.showAllChannels(this.state.channels)}
                </Menu.Menu>

                <Modal basic open={this.state.modal} onClose={this.closeModal}>
                    <Modal.Header>Add a Channel</Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input 
                                    fluid
                                    label="Name Of The Channel"
                                    name="channelName"
                                    value={this.props.channelName}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>

                            <Form.Field>
                                <Input 
                                    fluid
                                    label="About The Channel"
                                    name="channelDetails"
                                    value={this.props.channelDetails}
                                    onChange={this.handleChange}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                        <Modal.Actions>
                            <Button color="green" inverted onClick={this.handleSubmit}>
                                <Icon name="checkmark" />  Add
                            </Button>
                            <Button color="red" inverted>
                                <Icon name="remove" onClick={this.closeModal} />  Cancel
                            </Button>
                        </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
} 

let mapStateToProp = state => {
    return {
        isAuthenticated : state.auth.userId !== null,
        displayName : state.auth.displayName,
        photoURL : state.auth.photoUrl
    }
}

let mapDispatchToProps = dispatch => {
    return {
        OnChannelClick : (channel) => dispatch(channelAction.setSelectedChannel(channel))
    }
}

export default withRouter(connect(mapStateToProp,mapDispatchToProps)(Channels));