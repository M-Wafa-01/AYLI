import React, { Component } from 'react';
import Receipts from './Receipts';
import MessageList from '../messages/MessageList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';

// class-based component to display the messages and the corresponding notifications and pass the messages as props to MessageList component and the notifications as props to the Receipts component
class InBox extends Component {
    render(){

        const { messages, auth, receipts, repliedmessages, userType, companyreceipts } = this.props;
        
        if (!auth.uid) return <Redirect to="/signin" />
        if (userType === 'AYLI'){
        return(
            <div className="inbox container">
                <div className="row">
                    <div className="col s12 m6">
                        <MessageList messages={messages} />
                    </div>
                    <div className="col s12 m5 offset-m1">
                        <Receipts receipts={receipts}/>
                    </div>
                </div>
            </div>
        )
        } else {
            return(
                <div className="inbox container">
                    <div className="row">
                        <div className="col s12 m6">
                            <MessageList messages={repliedmessages} />
                        </div>
                        <div className="col s12 m5 offset-m1">
                            <Receipts receipts={companyreceipts}/>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const messages = state.firestore.ordered.messages;
    const receipts = state.firestore.ordered.receipts;
    const companyreceipts = state.firestore.ordered.companyreceipts;
    const repliedmessages = state.firestore.ordered.repmessages;
    const userType = state.firebase.profile.userType;
    const email = state.firebase.profile.email;
    const mesList = messages ? messages.filter(message => {return message.companyEmail === email}) : null ;
    const resList = repliedmessages ? repliedmessages.filter(repmessage => {return repmessage.userEmail === email}) : null ;
    
    return {
        messages: mesList,
        auth: state.firebase.auth,
        receipts: receipts,
        repliedmessages: resList,
        userType: userType,
        companyreceipts: companyreceipts
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'messages', orderBy: ['createdAt', 'desc'] },
        { collection: 'repmessages', orderBy: ['createdAt', 'desc'] },
        { collection: 'receipts', limit: 3, orderBy: ['time', 'desc'] },
        { collection: 'companyreceipts', limit: 3, orderBy: ['time', 'desc'] }
    ])
)(InBox);