import React from 'react';
import BufferSummary from './BufferSummary';
import { Link } from 'react-router-dom';

// Functional component with the JSX template to add a link for each service listed in the buffer and pass the service as props to the 'BufferSummary' component
const BufferList = ({services}) => {
    return(
        <div className="service-list section">
            { services && services.map(service => {
                return(
                    <Link to={'/buffer_service/' + service.id} key={service.id}>
                        <BufferSummary service={service} />
                    </Link>
                )
            }) }
        </div>
    )
}

export default BufferList;

