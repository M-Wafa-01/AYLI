import React, { Component } from 'react';
import ServiceList from '../services/ServiceList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { pushBuffer } from '../../store/actions/serviceActions'
import ServiceCreatedNotif from '../dashboard/ServiceCreatedNotif';

// class-based component to display the services to the EDU and the corresponding notifications and pass the services as props to ServiceList component and the notifications as props to the ServiceCreatedNotif component
class ServiceHistory extends Component {
    render(){
        const { services, auth, serNotifs, claims } = this.props;
        if (!auth.uid) return <Redirect to="/signin" />

        return(
            <div className="service-history container">
                <div className="row">
                    <div className="col s12 m6">
                        <ServiceList services={services} />
                    </div>
                    <div className="col s12 m5 offset-m1">
                        <ServiceCreatedNotif serNotifs={serNotifs} claims={claims}/>
                    </div>
                </div>
            </div>
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const id = state.firebase.auth.uid;
    const services = state.firestore.ordered.services;
    const claimList = state.firestore.ordered.claimNotifications;
    const claims = claimList ? claimList.filter(item => {return item.authorId === id}) : null ;
    const notifs = state.firestore.ordered.confirmServNotifications;
    const serNotifs = notifs ? notifs.filter(item => {return item.userId === id}) : null ;
    console.log(claims)
    const serList = services ? services.filter(service => {return service.authorId === id}) : null ;
    
    const serviceList = serList ? serList.filter(service => {
        var origin = (service.createdAt).seconds * 1000;
        var now = (new Date).getTime();
        var result = now - origin;
        console.log(service)
        if(service.decision === ''){
            if (result >= service.companyId[0].duration){
                pushBuffer(service);
            }
        }
        return ((result <= service.companyId[0].duration) || (service.decision === 'confirmed')) }) : null ;
    console.log(serviceList);
    return {
        services: serviceList,
        auth: state.firebase.auth,
        notifications: state.firestore.ordered.notifications,
        serNotifs: serNotifs,
        claims: claims
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'services', orderBy: ['createdAt', 'desc'] },
        { collection: 'users', orderBy: ['createdAt', 'desc'] },
        { collection: 'confirmServNotifications', orderBy: ['time', 'desc'] },
        { collection: 'claimNotifications', orderBy: ['time', 'desc'] }
    ])
)(ServiceHistory);