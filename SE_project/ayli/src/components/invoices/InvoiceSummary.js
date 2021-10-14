import React from 'react';
import moment from 'moment';

// Functional component to display a preview of the invoice 
const InvoiceSummary = ({invoice}) => {
    return(
        <div className="card z-depth-0 invoice-summary">
            <div className="card-content grey-text text-darken-3">
                <span className="card-title">INVOICE REGARDING SERVICE REQUEST NUMBER: { invoice.id }</span>
                <p>Company Name: { invoice.authorCompanyName }</p>
                <p>User First & Last Name: { invoice.authorFirstName } { invoice.authorLastName }</p>
                <p className="grey-text">{moment(invoice.invoiceCreatedAt.toDate()).calendar()}</p>
            </div>
        </div>
    )
}

export default InvoiceSummary;