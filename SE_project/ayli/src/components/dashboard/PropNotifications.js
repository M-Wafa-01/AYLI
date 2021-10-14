import React from 'react';
import moment from 'moment';

// Functional component to display the notifications details associated with the proposals
const PropNotifications = (props) => {
    const { propNotifications } = props;
    return(
        <div className="section">
            <div className="card z-depth-0">
                <div className="card-content">
                    <span className="card-title">Notifications</span>
                    <ul className="receipts">
                        { propNotifications && propNotifications.map(item => {
                            return (
                                <li key={item.id}>
                                    <span>{item.content}</span>
                                    <p className="pink-text">{item.user} </p>
                                    <div className="grey-text note-date">
                                        { moment(item.time.toDate()).fromNow() }
                                    </div>
                                </li>
                            )
                        }) }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default PropNotifications;