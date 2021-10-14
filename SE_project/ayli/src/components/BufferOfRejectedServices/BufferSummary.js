import React from 'react';
import moment from 'moment';

// Functional component with the JSX template to display the preview of each service on the buffer window in the browser
const BufferSummary = ({service}) => {
    return(
        <div className="card z-depth-0 service-summary">
            <div className="card-content grey-text text-darken-3">
                <span className="card-title">{service.serviceType} {service.id}</span>
                <p>Posted by {service.authorFirstName} {service.authorLastName}</p>
                <p className="grey-text">{moment(service.createdAt.toDate()).calendar()}</p>
            </div>
        </div>
    )
}

export default BufferSummary;