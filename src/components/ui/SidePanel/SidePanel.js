import React,{Component} from 'react';
import {Menu} from 'semantic-ui-react'
import UserPanel from './UserPanel/UserPanel';
import Channels from './Channels/Channels'


class SidePanel extends Component {
    render () {
        return(
            <Menu
                size="large"
                inverted
                fixed="left"
                vertical
                style={{background:'#4c3c4c',fontSize:'1.2em'}}
            >
                <UserPanel />
                <Channels />
            </Menu>
        )
    }
}

export default SidePanel;