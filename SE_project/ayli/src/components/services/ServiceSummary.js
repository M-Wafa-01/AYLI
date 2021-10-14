import React from 'react';
import moment from 'moment';

// Class-based component to display a preview of the service 
const ServiceSummary = ({service}) => {
    const content = (service.decision === 'confirmed') ? (
        <span className="card-title">Request - State: {service.decision}</span>
    ) : (
        <span className="card-title">Request </span>
    )
    return(
        <div className="card z-depth-0 service-summary">
            <div className="card-content grey-text text-darken-3">
                { content }
                <p>Posted by {service.authorFirstName} {service.authorLastName}</p>
                <p className="grey-text">{moment(service.createdAt.toDate()).calendar()}</p>
            </div>
        </div>
    )
}

export default ServiceSummary;