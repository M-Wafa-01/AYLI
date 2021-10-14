import React, { Component } from 'react';
import PropNotifications from './PropNotifications';
import ProposalList from '../proposals/ProposalList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';

// class-based component to display the proposals and the corresponding notifications and pass the proposals as props to ProposalList component and the notifications as props to the PropNotifications component
class Proposals extends Component {

    render(){

        const { proposals, auth, propNotifications } = this.props;
        if (!auth.uid) return <Redirect to="/signin" />

        return(
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m6">
                        <ProposalList proposals={proposals} />
                    </div>
                    <div className="col s12 m5 offset-m1">
                        <PropNotifications propNotifications={propNotifications}/>
                    </div>
                </div>
            </div>
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const id = state.firebase.auth.uid;
    const proposals = state.firestore.ordered.proposals;
    const confirmedProposals = state.firestore.ordered.confirmedProposals;

    const proposalList = proposals && proposals.filter(item => {
        console.log(item.userId)
        return id === item.userId
    })
    const propList = proposalList && proposalList.filter(item => {
        return item.decision !== 'rejected'
    })
    var dev
    var list
    var aux = propList;
    
    const pl = confirmedProposals && confirmedProposals.map(item => {        
            dev = item.device
            list = aux && aux.filter(car => {
                return (((car.device === dev) && (car.decision === 'confirmed')) || (car.device !== dev))
            })
            console.log(list)
            aux = list
    })
    
    return {
        proposals: propList,
        auth: state.firebase.auth,
        propNotifications: state.firestore.ordered.propNotifications
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'proposals', orderBy: ['proposalCreatedAt', 'desc'] },
        { collection: 'confirmedProposals', orderBy: ['createdAt', 'desc'] },
        { collection: 'propNotifications', limit: 3, orderBy: ['time', 'desc'] }
    ])
)(Proposals);