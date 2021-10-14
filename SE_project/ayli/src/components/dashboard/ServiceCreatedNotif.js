import React from 'react';
import moment from 'moment';

// Functional component to display the notifications details associated with the services and the claims
const ServiceCreatedNotif = (props) => {

    const { serNotifs, claims } = props;
    
    return(
        <div className="section">
            <div className="card z-depth-0">
                <div className="card-content">
                    <span className="card-title">Notifications</span>
                    <ul className="receipts">
                        { serNotifs && serNotifs.map(item => {
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
                        { claims && claims.map(item => {
                            return (
                                <li key={item.id}>
                                    <span>{item.content}</span>
                                    <p className="pink-text">{item.companyName} </p>
                                    <p className="pink-text">{item.companyId} </p>
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

export default ServiceCreatedNotif;