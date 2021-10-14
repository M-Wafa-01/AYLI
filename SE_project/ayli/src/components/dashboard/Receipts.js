import React from 'react';
import moment from 'moment';

// Functional component to display the notifications details associated with the messages
const Receipts = (props) => {
    const { receipts } = props;
    return(
        <div className="section">
            <div className="card z-depth-0">
                <div className="card-content">
                    <span className="card-title">Notifications</span>
                    <ul className="receipts">
                        { receipts && receipts.map(item => {
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

export default Receipts;