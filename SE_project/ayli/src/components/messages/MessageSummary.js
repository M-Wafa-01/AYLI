import React from 'react';
import moment from 'moment';

// Functional component to display a preview of the message depending on the user type of the current signed in user 
const MessageSummary = ({message}) => {
    const content = (message.userType === 'Customer') ? (
        <div className="card-content grey-text text-darken-3">
            <span className="card-title">{message.title}</span>
            <div>Posted by { message.authorFirstName } { message.authorLastName }</div> 
            <p className="grey-text">{moment(message.createdAt.toDate()).calendar()}</p>
        </div>   
    ) : (
        <div className="card-content grey-text text-darken-3">
            <span className="card-title">{message.title}</span>
            <div>Posted by { message.authorCompanyName }</div> 
            <p className="grey-text">{moment(message.createdAt.toDate()).calendar()}</p>
        </div> 
    );
    return(
        <div className="card z-depth-0 message-summary">
            { content }
        </div>
    );
}

export default MessageSummary;