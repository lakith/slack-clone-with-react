import React,{Component} from 'react'
import {Header,Segment,Input,Icon} from 'semantic-ui-react'

class MessageHeader extends Component {
    render() {
        return (
            <Segment style={{marginBottom : -8, height:'80px'}}>
                {/*channel Title*/}
                <Header fluid="true" as="h2" floated="left" style={{marginBottom : 0}} >
                    <span>
                        {this.props.channelName}
                        <Icon name={"star outline"} color="black" />
                    </span>
                    <Header.Subheader>
                        2 Users
                    </Header.Subheader>
                </Header>

                {/* <Header> */}
                    <Input
                        
                        size="mini"
                        icon="search"
                        name="searchTearm"
                        placeholder = "Search Messages"
                    />
                {/* </Header> */}
            </Segment>
        )
    }
}

export default MessageHeader;