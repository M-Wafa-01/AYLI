import React from 'react';
import SignedInLinks from './SignedInLinks';
import SignedOutLinks from './SignedOutLinks';
import { connect } from 'react-redux';

// Functional component to display the navbar in the browser
const Navbar = (props) => {

    const { auth, profile } = props;
    var links
    if (auth.uid && (profile.userType === 'AYLI') && (profile.adminDecision === 'PENDING')){
        //links = <SignedOutLinks />
        links = (
            
            <div className="signOut right">                
                <SignedOutLinks />
            </div>
            
        )
    } else if (auth.uid && (profile.userType === 'AYLI') && (profile.adminDecision === 'ACCEPTED')){
        //links = <SignedInLinks profile={profile} />
        links = (
            <nav className="nav-wrapper #ef9a9a red lighten-3">
                <div className="container">                
                    <SignedInLinks profile={profile} />
                </div>
            </nav>
        );
    } else if (auth.uid && (profile.userType === 'Customer')){
        links = (
            <nav className="nav-wrapper #ef9a9a red lighten-3">
                <div className="container">                
                    <SignedInLinks profile={profile} />
                </div>
            </nav>
        );
        //links = <SignedInLinks profile={profile} />
    } else {
        links = (
            
            <div className="signOut right">                
                <SignedOutLinks />
            </div>
            
        );
       // links = <SignedOutLinks />
    }
    
    return(
          <div >
            { links }
          </div>            
        
            
    )
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        profile: state.firebase.profile
    }
}

// export the component and wrapping it by higher order components 'connect' to connect to React Redux and to the Firebase Cloud Firestore.
export default connect(mapStateToProps)(Navbar);