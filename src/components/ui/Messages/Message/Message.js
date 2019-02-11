import React from 'react'
import { Comment, Image} from 'semantic-ui-react'
import moment from 'moment'


const isOwnMessage = (message,userId) => {
    return message.user.id === userId ? 'message__self' : '';
}

const timeFromNow = (timeStamp) => moment(timeStamp).fromNow();

const isImage = (message) =>{
    return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
}


const Message = (props) => {

    // console.log(props.userId)
    // console.log(props.displayName)
    // console.log(props.photoURL)
    
        return (
            <Comment>
                <Comment.Avatar src={props.photoURL} />
                <Comment.Content className={isOwnMessage(props.message, props.userId)} >
                    <Comment.Author as='a'>{props.message.user.name}</Comment.Author>
                    <Comment.Metadata>{timeFromNow(props.message.timeStamp)}</Comment.Metadata>
                    {isImage(props.message) ? (<Image src={props.message.image} className="message__image"/>) :(<Comment.Text>{props.message.content}</Comment.Text>) }
                </Comment.Content>
            </Comment>
        )
    
}

export default Message;
