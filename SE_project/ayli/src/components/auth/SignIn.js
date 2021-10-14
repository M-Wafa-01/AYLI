import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { signIn } from '../../store/actions/authActions';
import { Redirect } from 'react-router-dom';
import background from "../../images/Picture1.png";

// Class-based component that displays and interacts with the user inputs in the sign in form
class SignIn extends Component {
    state = {
        email: '',
        password: '',
        errors: {}
    }

    // Event handler function when when filling in the email and password inputs
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    // Event handler function when submitting the login form
    handleSubmit = (e) => {
        e.preventDefault();
        if(this.validate()){

            // Call the signIn method prop to dispatch an action that verifies the credentials entered and login the user
            this.props.signIn(this.state);

            // Pop up window to inform the user about the decision of the administrator regarding joining him to the community
            if ((this.props.profile.userType === 'AYLI') && (this.props.auth.uid) && (this.props.profile.adminDecision === 'PENDING') && (this.state.email === this.props.profile.email)){
                
                alert('Your Admission Request is still pending!');
            } else if ((this.props.profile.userType === 'AYLI') && (this.props.auth.uid) && (this.props.profile.adminDecision === 'REJECTED') && (this.state.email === this.props.profile.email)){
                
                alert('Your Admission Request is rejected!');
            } else if((this.props.profile.userType === 'AYLI') && (this.props.auth.uid) && (this.props.profile.adminDecision === 'ACCEPTED') ){
                alert('You are allowed to sign in');
            } else if ((this.props.profile.userType === 'Customer') && (this.props.auth.uid)){
                alert('You are allowed to sign in');
            }
        }      
    }

    // Function too evaluate the input fields values of the form 
    validate = () => {
        let errors = {};
        let isValid = true;
    
        if (!this.state.email) {
            isValid = false;
            errors["emailerr"] = "Please enter your email.";
        } else {errors["emailerr"] = ""}
        if (!this.state.password) {
            isValid = false;
            errors["passworderr"] = "Please enter your password.";
        } else { errors["passworderr"] = "" }

        this.setState({
            errors: errors
            });

        return isValid;
    }

    // Render the component to the DOM
    render() {

        // Destructuring of the props to allow easy reusability of the prop
        const { authError, auth, userType, profile } = this.props;
        
        if ((userType === 'AYLI') && (auth.uid) && (profile.adminDecision === 'ACCEPTED')){
            alert('You are allowed to sign in');
            return <Redirect to="/home" />
        } else if ((userType === 'Customer') && (auth.uid)){
            alert('You are allowed to sign in');
            return <Redirect to="/" />
        }
        // JSX template for the sign in page displayed on the browser
        return (

            <div className="signIn" style={{ backgroundImage: `url(${background})`, backgroundPosition: 'center', backgroundSize: '1925px 1360px', backgroundRepeat: 'no-repeat', minWidth: '100%', minHeight: '100%', backgroundColor: '#95e8f3'}}>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                
                
                <div className="container">
                    
                    <form onSubmit={this.handleSubmit} className="white">
                        <h5 className="grey-text text-darken-3">Sign In</h5>
                        <div className="input-field">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" onChange={this.handleChange}/>
                            <div className="text-danger">{this.state.errors.emailerr}</div>
                        </div>
                        <div className="input-field">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" onChange={this.handleChange}/>
                            <div className="text-danger">{this.state.errors.passworderr}</div>
                        </div>
                        <div className="input-field">
                            <button className="btn #1b5e20 green darken-4 z-depth-0">Login</button>
                            <div className="red-text center">
                                { authError ? <p>{authError}</p> : null }
                            </div>                    
                        </div>
                    </form>
                </div>
            </div>
        )       
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const userType = state.firebase.profile.userType;
    return {
        authError: state.auth.authError,
        auth: state.firebase.auth,
        userType: userType,
        profile: state.firebase.profile
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and login the user
const mapDispatchToProps = (dispatch) => {
    return {
        signIn: (creds) => dispatch(signIn(creds))
    }
}
// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' }
    ])
)(SignIn);