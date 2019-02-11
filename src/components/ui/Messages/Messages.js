import React,{Component} from 'react'
import { Segment, Comment } from 'semantic-ui-react';

import MessageHeader from './MessageHeader/MessageHeader';
import MessageForm from './MessageForm/MessageForm';
import firebase from '../../../firebaseConfig/firebase';
import Message from './Message/Message';

class Messages extends Component {
    
    state={
        messageRef:firebase.database().ref('messages'),
        messages:[],
        messagesLoading:true,
        channelKey:null
    }

    componentDidUpdate(){
        if(this.props.currentChannel && this.props.userId){
            this.addListners(this.props.currentChannel.key)
        }
    }

    componentDidMount(){
        if(this.props.currentChannel && this.props.userId){
            this.addListners(this.props.currentChannel.key)
        }
    }

    addListners = (channelKey)=> {
        this.addMessageListner(channelKey);
    }

    addMessageListner = (channelKey)=> {
        if(channelKey) {
            if(this.state.message === [] || (this.state.messages !== [] && this.state.channelKey !== channelKey)){
                let lodedMessages = [];
                this.state.messageRef.child(channelKey).on('child_added',snap=>{
                    lodedMessages.push(snap.val());
                   // console.log(lodedMessages)
                    this.setState({messages:lodedMessages,messagesLoading:false,channelKey:channelKey})
                }) 
            }
        }
    }

    displayMessages = (messages) => {
        
        if(messages.length > 0 ){
           
           return( messages.map(message => (
                <Message
                    key={message.timeStamp}
                    message={message}
                    userId={this.props.userId}
                    displayName= {this.props.displayName}
                    photoURL = {this.props.photoURL}
                />
            ))
           )
        }
    }

    displayChannelname = channel => channel ? `#${channel.name}` : `Select A Channel`; 

    render () {
        //  console.log("render")
        //  console.log(this.props);
         

        return(
            <React.Fragment >
                <MessageHeader
                    channelName = {this.displayChannelname(this.props.currentChannel)}
                />

                <Segment>
                    <Comment.Group  className="messages">
                         {this.displayMessages(this.state.messages)} 
                    </Comment.Group>
                </Segment>

                <MessageForm {...this.props} messageRef={this.state.messageRef} key={this.props.currentChannel && this.props.currentChannel.key} />

            </React.Fragment>
        )
    }
}



export default Messages;