import React, { Component } from 'react';
import ServiceList from '../services/ServiceList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import PropDecisions from '../dashboard/PropDecisions';

// class-based component to display the services to the SCO and the corresponding notifications and pass the services as props to ServiceList component and the notifications as props to the PropDecisions component
class AllServiceList extends Component {
    render(){
        const { services, auth, decisions, notifList } = this.props;
        
        if (!auth.uid) return <Redirect to="/signin" />

        return(
            <div>
            
            <div className="service-history container">
                <div className="row">
                    <div className="col s12 m6">
                        <ServiceList services={services} />
                    </div>
                    <div className="col s12 m5 offset-m1">
                        <PropDecisions decisions={decisions} notifList={notifList}/>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const id = state.firebase.profile.companyName;
    const idc = state.firebase.auth.uid;
    const services = state.firestore.ordered.services;
    const notifs = state.firestore.ordered.createServNotifications;
    const notifList = notifs ? notifs.filter(item => {return item.authorId === idc}) : null ;
    const decisionList = state.firestore.ordered.companyPropDecisions;
    const decisions = decisionList ? decisionList.filter(decision => {return decision.companyId === idc}) : null ;
    const serList = services ? services.filter(service => {return service.companyName === id}) : null ;
    console.log(decisions);
    console.log(state);
    return {
        services: serList,
        auth: state.firebase.auth,
        decisions: decisions,
        notifList: notifList
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'services', orderBy: ['createdAt', 'desc'] },
        { collection: 'companyPropDecisions', orderBy: ['time', 'desc'] },
        { collection: 'createServNotifications', orderBy: ['time', 'desc'] },
    ])
)(AllServiceList);