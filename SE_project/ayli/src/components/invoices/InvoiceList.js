import React from 'react';
import InvoiceSummary from './InvoiceSummary';
import { Link } from 'react-router-dom';

// Functional component to add a link to each invoice and pass the invoice as props to the InvoiceSummary component
const InvoiceList = ({invoices}) => {
    return(
        <div className="invoices-list section">
            { invoices && invoices.map(invoice => {
                return(
                    <Link to={'/invoice/' + invoice.id} key={invoice.id}>
                        <InvoiceSummary invoice={invoice} />
                    </Link>
                )
            }) }
        </div>
    )
}

export default InvoiceList;

