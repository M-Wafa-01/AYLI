import React, { Component } from 'react';
import InvoiceList from '../invoices/InvoiceList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import InvoiceNotifications from '../dashboard/InvoiceNotifications';

// class-based component to display the invoices and the corresponding notifications and pass the invoices as props to PostList component and the notifications as props to the Notifcation component
class Invoices extends Component {
    render(){
        const { invoices, auth, invNotifs} = this.props;
        
        if (!auth.uid) return <Redirect to="/signin" />
        return(
            <div className="service-history container">
                <div className="row">
                    <div className="col s12 m6">
                        <InvoiceList invoices={invoices} />
                    </div>
                    <div className="col s12 m5 offset-m1">
                        <InvoiceNotifications invNotifs={invNotifs}/>
                    </div>
                </div>
            </div>
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const idc = state.firebase.auth.uid;
    const userType = state.firebase.profile.userType;
    var invoices
    var invNotifs
    const invoiceList = state.firestore.ordered.invoices;
    const invNotifList = state.firestore.ordered.createInvNotifications;
    if (userType === 'Customer'){
        invoices = invoiceList  ? invoiceList.filter(invoice => {return invoice.userId === idc}) : null ;
        invNotifs = invNotifList ? invNotifList.filter(decision => {return decision.authorId === idc}) : null ;
    } else {
        
        invoices = invoiceList  ? invoiceList.filter(invoice => {return invoice.authorCompanyId === idc}) : null ;
        invNotifs = invNotifList ? invNotifList.filter(decision => {return decision.companyId === idc}) : null ;
    }
    console.log(state)
    return {
        invoices: invoices,
        auth: state.firebase.auth,
        invNotifs: invNotifs,
        userType: userType
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'invoices', orderBy: ['invoiceCreatedAt', 'desc'] },
        { collection: 'createInvNotifications', orderBy: ['time', 'desc'] },
    ])
)(Invoices);