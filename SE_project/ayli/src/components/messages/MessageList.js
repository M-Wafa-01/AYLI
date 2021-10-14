import React from 'react';
import MessageSummary from './MessageSummary';
import { Link } from 'react-router-dom';

// Functional component to add a link to each message and pass the message as props to the MessageSummary component
const MessageList = ({messages}) => {
    return(
        <div className="post-list section">
            { messages && messages.map(message => {
                return(
                    <Link to={'/message/' + message.id} key={message.id}>
                        <MessageSummary message={message} />
                    </Link>
                )
            }) }
        </div>
    );
}

export default MessageList;