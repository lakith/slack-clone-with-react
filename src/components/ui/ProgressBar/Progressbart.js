import React from 'react'
import { Progress } from 'semantic-ui-react';

const ProgressBar = (props) => {
    let progress = ''
    if(props.uploadState==="uploading"){
        progress = (
            <Progress 
            className="progress__bar"
            percent={props.percentUploaded}
            progress
            indicating
            size="medium"
            inverted
        />
        )
    }

    return progress 
}

export default ProgressBar;