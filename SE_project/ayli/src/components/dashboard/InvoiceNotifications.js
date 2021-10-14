import React from 'react';
import moment from 'moment';

// Functional component to display the notifications details associated with the invoices
const InvoiceNotifications = (props) => {

    const { invNotifs } = props;
    
    return(
        <div className="section">
            <div className="card z-depth-0">
                <div className="card-content">
                    <span className="card-title">Notifications</span>
                    <ul className="receipts">
                        { invNotifs && invNotifs.map(item => {
                            return (
                                <li key={item.id}>
                                    <span>{item.content}</span>
                                    <p className="pink-text">Company Name: {item.companyName}</p>
                                    <p className="pink-text">User Name: {item.userName}</p>
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

export default InvoiceNotifications;