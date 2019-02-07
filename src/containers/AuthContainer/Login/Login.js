import  React , {Component} from 'react'
import {Grid,Form,Segment,Button,Header,Message,Icon} from 'semantic-ui-react'
import {NavLink,Redirect} from 'react-router-dom'
//import firebase from '../../../firebaseConfig/firebase'
import {connect} from 'react-redux'
import * as authAction from '../../../store/index'

class Login extends Component {

    state={
        email: "",
        password: ""
    }

    
    handleChange = (event)=>{
        this.setState({[event.target.name] : event.target.value});

    }

    handleInputErrors = (errors,inputName) => {
        return errors.some(error=>
            error.message.toLowerCase().includes(inputName)
            ) ? "error" : ""
    }

    isFormValid = ({email,password}) => email && password;


    handleSubmit = (event) =>{
        event.preventDefault();
        if(this.isFormValid(this.state)){
            // this.setState({loading:true,errors:[]});
            // // firebase
            // //     .auth()
            // //     .signInWithEmailAndPassword(this.state.email,this.state.password)
            // //     .then(signedInUser=> {
            // //         console.log(signedInUser);
            // //         this.setState({loading:false})
            // //     })
            // //     .catch(err=> {
            // //         console.log(err);
            // //         this.setState({loading:false,errors:this.state.errors.concat(err)});
            // //     })
            this.props.OnAuth(this.state.email,this.state.password);
        }
    }

    displayErrors = errors => errors.map((error,index)=>(
        <p key={index}>{error.message}</p>
    )); 

    render(){

        let authRedirect;
        if(this.props.isAuthenticated){
            authRedirect = <Redirect to='/' />
        }

        const {email, password} = this.state;

        console.log("login");

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                {authRedirect}
                <Grid.Column  style={{maxWidth:500}}>
                    <Header as="h1" icon color="orange" textAlign="center">
                        <Icon name="code branch" color='violet' />
                            Login to DevChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input className={this.handleInputErrors(this.props.errors,'email')}  fluid name="email" icon="mail" iconPosition="left" placeholder="Email Address" onChange={this.handleChange} type="email" value={email} />
                            <Form.Input className={this.handleInputErrors(this.props.errors,'password')}   fluid name="password" icon="lock" iconPosition="left" placeholder="Password" onChange={this.handleChange} type="password" value={password} />
                            <Button disabled={this.props.loading} className={this.props.loading? 'loading':''} color="violet" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {this.props.errors.length > 0? (<Message error><h3>Error</h3>{this.displayErrors(this.props.errors)}</Message>):null}
                    <Message>Don't have an account ?  <NavLink to="/register">Signup</NavLink></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return{
        loading : state.auth.loading,
        errors : state.auth.error,
        isAuthenticated : state.auth.userId !== null,
        authRedirectPath : state.auth.authRedirectPath
    }
}

const mapDispatchToProps = dispatch => {
    return {
        OnAuth : (email,password) => dispatch(authAction.auth(email,password)),
        onSetAuthRidirectPath: () => dispatch(authAction.setAuthRedirectPath('/'))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Login);