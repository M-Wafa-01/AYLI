import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import moment from 'moment';

// Class-based component to display a preview of the message depending on the user type of the current signed in user 
class ProposalSummary extends Component {

    render(){

    const { proposal } = this.props;
    /*const content = devices ? (
        <span className="card-title">Proposal: </span>
    ) : null;*/

    return(
        <div className="card z-depth-0 service-summary">
            <div className="card-content grey-text text-darken-3">
                <span className="card-title">Proposal: </span>
                <p>Created by {proposal.authorCompanyName}</p>
                <p className="grey-text">{moment(proposal.proposalCreatedAt.toDate()).calendar()}</p>
            </div>
        </div>
    )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const devices = state.firestore.data.devices;
    return {
        devices: devices
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'devices', orderBy: ['createdAt', 'desc'] }      
    ])
)(ProposalSummary);