import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { replyMessage } from '../../store/actions/messageActions';
import { Redirect } from 'react-router-dom';

// class-based component to create a new message by the SC
class ReplyMessage extends Component {
    state = {
        title: '',
        content: '',
        companyEmail: '',
        userType: '',
        userEmail: 'Choose Customer email',
        errors: {}
    }

    // On change event handler function to set the input fields values of the message form to the state
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    // On click event handler function to set companyEmail and the userEmail propreties of the state
    handleClick = (email) => {
        console.log(email);
        this.setState({
            ...this.state,
            userEmail: email,
            companyEmail:  this.props.comEmail
        })
        console.log(this.state)
    }

    // On submit form event handler function to call the dispatcher action function to add the message to the Firebase database and redirect the user to the inbox window
    handleSubmit = (e) => {
        e.preventDefault();
        this.state.userType = this.props.userType;
        if(this.validate() ){
        this.props.replyMessage(this.state);
        alert('Your message is sent successfully');
        this.props.history.push('/inbox');
        }
    }

    // Function too evaluate the input fields values of the form
    validate = () => {
        let errors = {};
        let isValid = true;
    
        if (!this.state.title) {
            isValid = false;
            errors["titleerr"] = "Please enter your message title.";
        } else {errors["titleerr"] = ""}
        if (!this.state.content) {
            isValid = false;
            errors["contenterr"] = "Please enter your message content.";
        } else { errors["contenterr"] = "" }

        if (!this.state.userEmail || (this.state.userEmail === 'Choose Customer email')) {
            isValid = false;
            errors["userEmailerr"] = "Please select the message user email.";
        } else { errors["userEmailerr"] = "" }

        this.setState({
            errors: errors
            });

        return isValid;
    }

    // React predefined Life cycle hook that executes when first the component is mounted to the DOM.
    // Add a listener for the drop down buttons in the form.
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.dropdown-button');
            var instances = window.M.Dropdown.init(elems, {});
            
          });
    }
    
    // Render the component to the DOM
    render() {
        
        window.$(document).ready(function () {
            window.$(".dropdown-button").dropdown();
        });
        
        const { auth, users } = this.props;
        if (!auth.uid) return <Redirect to="/signin" />

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Reply message</h5>

                    <div className="device-type">
                        <ul id="selectedEmail" className="dropdown-content">
                        {   
 
                                users && users.map((item) => {
                               
                                return (   
                                      
                                    <div key={item.email}>
                                                                                          
                                            <li><a id="user" className="blue-text text-lighten-3" onClick={() => {this.handleClick(item.email)}}>{item.firstName} {item.lastName} - {item.email}</a></li>                                                 
                                        
                                    </div>
                                            
                                )
 
                                })
                            }
                            </ul>
                        <a className="btn dropdown-button #ef9a9a red lighten-3" data-beloworigin="true" data-hover="true" data-activates="selectedEmail" dropdown="true" name="">{this.state.userEmail}<i className="material-icons right">arrow_drop_down</i></a>
                        <div className="text-danger">{this.state.errors.userEmailerr}</div>
                    </div>
                    
                    <div className="input-field">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" onChange={this.handleChange}/>
                        <div className="text-danger">{this.state.errors.titleerr}</div>
                    </div>
                    <div className="input-field">
                        <label htmlFor="content">Message Content</label>
                        <textarea id="content" className="materialize-textarea" onChange={this.handleChange}></textarea>
                        <div className="text-danger">{this.state.errors.contenterr}</div>
                    </div>
                    <div className="input-field">
                        <button className="btn light-blue lighten-3">Send</button>
                    </div>
                </form>
            </div>
            
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const userType = state.firebase.profile.userType;
    const email = state.firebase.profile.email;
    const idc = state.firebase.auth.uid;
    const services = state.firestore.data.services;
    const serviceList = services ? Object.values(services).filter(item => {
        if (item.companyId){
        return item.companyId[0].id === idc
        }
    }) : null;
     
    const userList = state.firestore.data.users;
    const users = userList ? Object.values(userList).filter(item => {
        return item.userType === 'Customer'
    }) : null;
    
    var ser = []
    var i = 0;
    const sList = serviceList ? Object.values(serviceList).map(item => {
        ser[i] = users && Object.values(users).filter(user => {
            return user.email === item.userEmail
        })
        i++
    }) : null;

    if (ser[0]!=null ){
        for (let i = 0; i < ser.length-1; i++) {
            const item1 = ser[i];
            for (let j = i+1; j < ser.length; j++) {
                const item2 = ser[j];
                if ((item2 != 0) && (item1 != 0)){
                    if (item1[0].email === item2[0].email){
                        ser[j] =0
                    }
                }
            }    
        }
    }
    var aux = [];
    var j = 0;
    for (let i = 0; i < ser.length; i++) {
        const element = ser[i];
        if ((element != 0) && (element != null)){
            aux[j] = element[0];
            j++;
        }      
    }
    return {
        auth: state.firebase.auth,
        users: aux,
        userType: userType,
        comEmail: email
        
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and send the message to the selected EDU
const mapDispatchToProps = (dispatch) => {
    return {
        replyMessage: (message) => {
            dispatch(replyMessage(message));
        }
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' },
        { collection: 'services' }
    ])
)(ReplyMessage);