import  React , {Component} from 'react'
import {Grid,Form,Segment,Button,Header,Message,Icon} from 'semantic-ui-react'
import {NavLink,Redirect} from 'react-router-dom'
import firebase from '../../../firebaseConfig/firebase'
import md5 from 'md5'
import {connect} from 'react-redux'

class Register extends Component {

    state={
        username : "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors : [],
        loading:false,
        usersRef:firebase.database().ref('users'),
        redirect:false,
    }

    isFormValid = () => {
        let errors = [];
        let error;

        if(this.isEmptyForm(this.state)) {
            error = {message:"Fill all the fields"};
            this.setState({errors:errors.concat(error)})
            return false;
        } else if(!this.isPasswordValid(this.state)) {
            error = {message : "Invalied password"}
            this.setState({errors:errors.concat(error)});
            return false;
        } else {
            return true;
        }
    }

    isEmptyForm = ({username,email,password,passwordConfirmation})=> {
        console.log("Form Validation - required");
        return !username.length || !email.length || !password.length || !passwordConfirmation
    }

    isPasswordValid = ({password,passwordConfirmation}) => {
        console.log("Form Validation - password");
        if(password.length < 6 || passwordConfirmation.length < 6) {
            return false;
        } else if (password !== passwordConfirmation){
            return false;
        } else {
            return true;
        }
    }

    handleChange = (event)=>{
        this.setState({[event.target.name] : event.target.value});

    }

    handleInputErrors = (errors,inputName) => {
        return errors.some(error=>
            error.message.toLowerCase().includes(inputName)
            ) ? "error" : ""
    }

    saveUser = (createdUser) => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name:createdUser.user.displayName,
            email:createdUser.user.email,
            avatar:createdUser.user.photoURL
        })
    }


    handleSubmit = (event) =>{
        event.preventDefault();
        if(this.isFormValid()){
            this.setState({loading:true,errors:[]});
            firebase
                .auth()
                .createUserWithEmailAndPassword(this.state.email,this.state.password)
                .then(createdUser => {
                    console.log(createdUser)
                    createdUser.user.updateProfile({
                        displayName:this.state.username,
                        photoURL: `https://en.gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                     .then(()=>{
                        this.saveUser(createdUser)
                        .then(()=>{
                            console.log("user saved");
                            this.setState({loading:false,redirect:true});
                        })
                        .catch((err)=>{
                            this.setState({errors:this.state.errors.concat(err),loading:false})
                        }) 
                        
                    }) 
                    .catch((err)=> {
                        this.setState({loading:false,errors:this.state.errors.concat(err)})
                    })
                    
                })
                .catch((err)=> {
                    console.log("error" + err);
                    this.setState({errors:this.state.errors.concat(err),loading:false});
                })
        }
    }

    displayErrors = errors => errors.map((error,index)=>(
        <p key={index}>{error.message}</p>
    )); 

    render(){

        const {username, email, password , passwordConfirmation,errors} = this.state;

        let authRedirect;
        if(this.props.isAuthenticated){
            authRedirect = <Redirect to='/' />
        }

        let redirectTOLogin;
        if(this.state.redirect){
            redirectTOLogin= <Redirect to='/login' />
        }

        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                {authRedirect}
                {redirectTOLogin}
                <Grid.Column  style={{maxWidth:500}}>
                    <Header as="h1" icon color="orange" textAlign="center">
                        <Icon name="puzzle piece" color='orange' />
                            Register for DavChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input className={this.handleInputErrors(errors,'username')}  fluid name="username" icon="user" iconPosition="left" placeholder="Username" onChange={this.handleChange} type="text" value={username} />
                            <Form.Input className={this.handleInputErrors(errors,'email')}  fluid name="email" icon="mail" iconPosition="left" placeholder="Email Address" onChange={this.handleChange} type="email" value={email} />
                            <Form.Input className={this.handleInputErrors(errors,'password')}   fluid name="password" icon="lock" iconPosition="left" placeholder="Password" onChange={this.handleChange} type="password" value={password} />
                            <Form.Input className={this.handleInputErrors(errors,'password')} fluid name="passwordConfirmation" icon="repeat" iconPosition="left" placeholder="Password Confirmation" onChange={this.handleChange} type="password" value={passwordConfirmation} />
                            <Button disabled={this.state.loading} className={this.state.loading? 'loading':''} color="orange" fluid size="large">Submit</Button>
                        </Segment>
                    </Form>
                    {errors.length > 0? (<Message error><h3>Error</h3>{this.displayErrors(errors)}</Message>):null}
                    <Message>Already a member ?  <NavLink to="/login">Login</NavLink></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return{
        isAuthenticated : state.auth.userId !== null,
    }}

export default connect(mapStateToProps,null)(Register);