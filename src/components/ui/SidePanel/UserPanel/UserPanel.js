import React,{Component} from 'react';
import {Grid,Header,Icon, Dropdown,Image} from 'semantic-ui-react';
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'

class UserPanel extends Component {

    handleSignout =()=> {
        this.props.history.push("/logout")
        console.log("pushed2")
    }

    componentDidMount(){
        console.log(this.props.photoUrl)
    }

    dropDownOptions = () => [
        {
            key:"user",
            text:<span>Signed in as <strong>{this.props.displayName?this.props.displayName:"Avetar"}</strong></span>,
            disabled : this.props.isAuthenticated
        },
        {
            key:'avetar',
            text:<span>Change Avetar</span>
        },
        {
            key:'signOut',
            text:<span onClick={this.handleSignout}>Sign Out</span>,
            disabled:!this.props.isAuthenticated
        }
    ]
    
    render() {
        return (
            <Grid style={{background:'#4c3c4c'}}>
                <Grid.Column>
                    <Grid.Row style={{ padding:'1.2em',margin:0}}>
                        <Header inverted floated="left" as="h2">
                            <Icon name="code" />
                            <Header.Content>DevChat</Header.Content>
                        </Header>
                    </Grid.Row>
                    <Header  style={{padding:'0.25em'}} as="h4" inverted>
                        <Dropdown trigger={<span>
                                                <Image src={this.props.photoURL} spaced="right" avatar/>
                                                {this.props.displayName?this.props.displayName:"Avetar"}
                                            </span>} options={this.dropDownOptions()} />
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
} 

const mapStateToProps = state => {
    return {
        isAuthenticated : state.auth.userId !== null,
        displayName : state.auth.displayName,
        photoURL : state.auth.photoUrl
    }
}

export default withRouter(connect(mapStateToProps,null)(UserPanel));