import * as authActions from './actionTypes';
import firebase from '../../firebaseConfig/firebase'


export const authStart = ()=> {
    return {
        type:authActions.AUTH_START
    }
}

export const authSuccess = (createdUser)=> {
    return{
        type:authActions.AUTH_SUCCCESS,
        user:createdUser
    }
}

export const authSuccess2 = (createdUser,uid,email,displayName,photoUrl)=> {
    return{
        type:authActions.AUTH_SUCCCESS2,
        user:createdUser,
        uid:uid,
        email:email,
        displayName:displayName,
        photoUrl:photoUrl
    }
}

export const authFail = (error) => {
    return {
        type:authActions.AUTH_FAIL,
        error:error
    }
}

export const logout =()=> {
    localStorage.removeItem('user')
    localStorage.removeItem('expirationDate')
    localStorage.removeItem('uid')
    localStorage.removeItem('email');
    localStorage.removeItem('displayName');
    localStorage.removeItem('photoUrl');
    return {
        type:authActions.AUTH_LOGOUT
    }
}

export const checkAuthTimeOut = (expirationTime) => {
    return dispatch => {
        setTimeout(()=>{
            dispatch(logout());
        },expirationTime*1000)
    }
}

export const auth=(email,password) => {
    return dispatch => {
        dispatch(authStart());

        firebase
                .auth()
                .signInWithEmailAndPassword(email,password)
                .then(signedInUser=> {
                    const expirationDate = new Date(new Date().getTime()+18000*1000);
                    localStorage.setItem('user',signedInUser);
                    localStorage.setItem('expirationDate',expirationDate);
                    localStorage.setItem('uid',signedInUser.user.uid);
                    localStorage.setItem('email',signedInUser.user.email);
                    localStorage.setItem('displayName',signedInUser.user.displayName);
                    localStorage.setItem('photoUrl',signedInUser.user.photoURL);
                    console.log(signedInUser);
                    dispatch(authSuccess(signedInUser))
                })
                .catch(err=> {
                    console.log(err);
                    dispatch(authFail(err))
                })
    }
}

export const setAuthRedirectPath= (path) => {
    return{
        type:authActions.SET_AUTH_REDIRECT_PATH,
        path:path
    }
}

export const authCheckState = () => {
    return dispatch=> {
        dispatch(authStart());
        const user = localStorage.getItem('user');
        //console.log(Object.keys(user).map(obj=> (user[obj])));
        if(!user) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate > new Date()){
                const uid = localStorage.getItem('uid');
                const email = localStorage.getItem('email');
                const displayName = localStorage.getItem('displayName');
                const photoUrl = localStorage.getItem('photoUrl');
                dispatch(authSuccess2(user,uid,email,displayName,photoUrl));
                dispatch(checkAuthTimeOut((expirationDate.getTime() - new Date().getTime())/1000))
            } else {
                dispatch(logout());
            }
        }
    }
}