import React,{Component} from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import {Grid} from 'semantic-ui-react'
import ControlPanel from '../../components/ui/ControlPanel/ControlPanel'
import Messages from '../../components/ui/Messages/Messages'
import SidePanel from '../../components/ui/SidePanel/SidePanel'
import MetaPanel from '../../components/ui/MetaPanel/MetaPanel'



class Home extends Component {
    render () {
        return (
            <div> 
                <Grid columns="equal" className="app" style={{background:'#eee'}}>
                    <ControlPanel />

                    <SidePanel />

                    <Grid.Column style={{marginLeft:320}} >
                        <Messages {...this.props} key={"Messages unique key - 123SL2323"} />
                    </Grid.Column>

                    <Grid.Column width={4} >
                        <MetaPanel />
                        {this.props.isAuthenticated ? <NavLink to="/logout">logout</NavLink> : <NavLink to="/login">login</NavLink>}
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

let mapStateToProps = state => {
    return {
        isAuthenticated : state.auth.userId !== null,
        userId:state.auth.userId,
        displayName : state.auth.displayName,
        photoURL : state.auth.photoUrl,
        currentChannel : state.channelData.channel
    }
};

export default connect(mapStateToProps,null)(Home);