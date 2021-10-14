import React from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

// Functional component to display the message details depending on the user type of the current signed in user
const MessageDetails = (props) => {
    const { message, auth } = props;
    if (!auth.uid) return <Redirect to="/signin" />

    if (message) {
        const content = (message.userType === 'AYLI') ? (
            <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">{ message.title }</span>
                        <p>{ message.content }</p>
                    </div>
                    <div className="card-action grey lighten-4 grey-text">
                        <div>Posted by { message.authorFirstName } { message.authorLastName }</div>
                        <div>{moment(message.createdAt.toDate()).calendar()}</div>
                    </div>
                </div>
        ) : (
            <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">{ message.title }</span>
                        <p>{ message.content }</p>
                    </div>
                    <div className="card-action grey lighten-4 grey-text">
                        <div>Posted by { message.authorCompanyName }</div>
                        <div>{moment(message.createdAt.toDate()).calendar()}</div>
                    </div>
                </div>
        );
        return (
            <div className="container section message-details">
                { content }
            </div>
        )
    } else {
        return (
            <div className="container center">
                <p>Loading message...</p>
            </div>
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const messages = state.firestore.data.messages;
    const userType = state.firebase.profile.userType;
    const repmessages = state.firestore.data.repmessages;
    var aux
    if (userType === 'AYLI')
    {
        const message = messages ? messages[id] : null;
        aux = message;
    } else {
        const mes = repmessages ? repmessages[id] : null;
        aux = mes;
    }
    
    return {
        message: aux, 
        auth: state.firebase.auth,
        userType: userType
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'messages' },
        { collection: 'repmessages' }
    ])
)(MessageDetails);
