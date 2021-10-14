import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { signOut } from '../../store/actions/authActions';

// class-based component to display the signed in links
class SignedInLinks extends Component {

    // React predefined Life cycle hook that executes when first the component is mounted to the DOM.
    // Add a listener for the drop down buttons in the form.
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.dropdown-button');
            var instances = window.M.Dropdown.init(elems, {});
            
          });
    }
    // Render the component to the DOM
    render(){

        const { user } = this.props;

        // Initialize the dropdown listener
        window.$(document).ready(function () {
            window.$(".dropdown-button").dropdown();
        });
        
        // JSX and JavaScript to diplay the component in the browser depending on the user type
        if (typeof(user) !== "undefined"){
            
            if (user.userType === 'AYLI')
            {
            
                return(
                    <div>
                    
                        <Link to='/home' className="brand-logo">AYLI</Link>    
                        <ul className="right">
                            <li><NavLink to='/create_post'>New Post</NavLink></li>
                            <li><NavLink to='/replymessage'>Reply Message</NavLink></li>
                            <li><NavLink to='/create_proposal'>Create Proposal</NavLink></li>
                            <li>
                                <ul id="dropdown2" className="dropdown-content">
                                    <li><NavLink to='/forum' className="blue-text text-lighten-3">Broadcast</NavLink></li>
                                    <li><NavLink to='/inbox' className="blue-text text-lighten-3">Inbox</NavLink></li>
                                    <li><NavLink to='/invoices' className="blue-text text-lighten-3">Invoices</NavLink></li>
                                    <li><NavLink to='/buffer' className="blue-text text-lighten-3">Shared Requests</NavLink></li>
                                    <li><a className="blue-text text-lighten-3" onClick={this.props.signOut}>Log Out</a></li>                       
                                </ul>
                                <a className='btn dropdown-button btn-floating #81d4fa light-blue lighten-3' data-beloworigin="true" data-activates="dropdown2">
                                { this.props.profile.initials }
                            </a> </li>                
                        </ul>
                    
                    </div>
                )
            } else if (user.userType === 'Customer'){
                
                return(

                    <div>
                    
                    <Link to='/' className="brand-logo">AYLI</Link> 
                    <ul className="right">
                    
                        <li><NavLink to='/newmessage'>New Message</NavLink></li>
                        
                        <li>
                            <ul id="dropdown2" className="dropdown-content">
                                <li><NavLink to='/forum' className="blue-text text-lighten-3">Broadcast</NavLink></li>
                                <li><NavLink to='/inbox' className="blue-text text-lighten-3">Inbox</NavLink></li>
                                <li><NavLink to='/proposalList' className="blue-text text-lighten-3">Proposals</NavLink></li>
                                <li><NavLink to='/history' className="blue-text text-lighten-3">History</NavLink></li>
                                <li><NavLink to='/invoices' className="blue-text text-lighten-3">Invoices</NavLink></li>
                                <li><NavLink to='/contact' className="blue-text text-lighten-3">Contact</NavLink></li>
                                <li><a className="blue-text text-lighten-3" onClick={this.props.signOut}>Log Out</a></li>
                            </ul>
                            <a className='btn dropdown-button btn-floating #81d4fa light-blue lighten-3' data-beloworigin="true" data-activates="dropdown2">
                            { this.props.profile.initials }
                        </a> </li>
                    </ul>
                    
                    </div>
                )
            }

    } else {
        //window.location.reload();
        return (
            <div className="container center">
                <p>Loading Page...</p>
            </div>
        )
    }
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    
    const id = state.firebase.auth.uid;
    const users = state.firestore.data.users;
    var userId = '';
    var userSelect
    console.log(users)
    const user = users ? Object.keys(users).filter((item) => {
        if ( (item) && (item === id)){
        userId = item
        //console.log(userId)
        userSelect = users[item];}
        return item === id}) : null;
    // console.log(userSelect)
    // console.log(user)
    return {
        auth: state.firebase.auth,
        user: userSelect
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and logout the user
const mapDispatchToProps = (dispatch) => {
    return {
        signOut: () => dispatch(signOut())
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' }
    ])
)(SignedInLinks);