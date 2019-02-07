import * as authActions from '../actions/actionTypes'
import { updatedObject } from '../shared/utility';

const initialState = {
    user:null,
    userId:null,
    email:null,
    displayName:null,
    photoUrl:null,
    error:[],
    loading:false,
    authRedirectPath: '/'
}

const authStart = (state,action) => {
    return updatedObject(state,{loading:true,error:[]})
}

const authSuccess = (state,action) => {
    return updatedObject(state,{
        user:action.user,
        userId:action.user.user.uid,
        email:action.user.user.email,
        displayName:action.user.user.displayName,
        photoUrl:action.user.user.photoURL,
        error:[],
        loading:false
    })
    
}

const authSuccess2 = (state,action) => {
    return updatedObject(state , {
        user : action.user,
        userId : action.uid,
        email:action.email,
        displayName:action.displayName,
        photoUrl:action.photoUrl,
        error:[],
        loading:false
    })
}

const authFail = (state,action) => {
    return updatedObject(state,{
        error:state.error.concat(action.error),
        loading:false
    })
}

const authLogout = (state,action) => {
    return updatedObject(state,{
        user:null,
        userId:null,
        email:null,
        displayName:null,
        photoUrl:null,
        loading:false
    })
}

const setAuthRidirectPath = (state,action)=> {
    return updatedObject(state,{authRedirectPath:action.path});
}

const reducer = (state=initialState,action)=> {
    switch(action.type){
        case (authActions.AUTH_START):
            return authStart(state,action);
        case (authActions.AUTH_SUCCCESS):
            let result =authSuccess(state,action);
            return result
        case (authActions.AUTH_SUCCCESS2):
            return authSuccess2(state,action)
        case (authActions.AUTH_FAIL):
            return authFail(state,action);
        case (authActions.AUTH_LOGOUT):
            return authLogout(state,action);
        case (authActions.SET_AUTH_REDIRECT_PATH):
            return setAuthRidirectPath(state,action);
        default:
            return state;
    }
}

export default reducer;