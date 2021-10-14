import React from 'react';
import ServiceSummary from './ServiceSummary';
import { Link } from 'react-router-dom';

// Functional component to add a link to each service and pass the proposal as props to the ServiceSummary component
const ServiceList = ({services}) => {
    return(
        <div className="service-list section">
            { services && services.map(service => {
                return(
                    <Link to={'/service/' + service.id} key={service.id}>
                        <ServiceSummary service={service} />
                    </Link>
                )
            }) }
        </div>
    )
}

export default ServiceList;

