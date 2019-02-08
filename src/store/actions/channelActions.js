import * as channelActions from './actionTypes'

export const setSelectedChannel  = (channel) => {
    return{
        type:channelActions.SET_SELECTED_CHANNEL,
        channel:channel
    }
}