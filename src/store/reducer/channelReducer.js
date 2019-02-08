import * as channelActions from '../actions/actionTypes'
import { updatedObject } from '../shared/utility';

const initialState = {
    channel:null
}

const setChannel = (state,action) => {
    return updatedObject(state,{channel:action.channel})
}

const reducer = (state=initialState,action) => {
    switch(action.type){
        case (channelActions.SET_SELECTED_CHANNEL):
            return setChannel(state,action);
        default :
            return state
    }
}

export default reducer;