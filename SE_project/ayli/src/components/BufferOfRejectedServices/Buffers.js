import React, { Component } from 'react';
import BufferList from './BufferList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';

// class-based component with the JSX template to pass the services list as props to the 'BufferList' component
class Buffers extends Component {
    render(){
        const { services, auth } = this.props;
        if (!auth.uid) return <Redirect to="/signin" />

        return(
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m6">
                        <BufferList services={services} />
                    </div>

                </div>
            </div>
        )
    }
}

// map the the Redux store state to the current component props
const mapStateToProps = (state) => {
    const rejectedServices = state.firestore.ordered.rejectedServices;
    const serviceList = rejectedServices && rejectedServices.filter(item => {
        return item.decision === 'rejected'
    })
    return {
        services: serviceList,
        auth: state.firebase.auth
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'rejectedServices', orderBy: ['createdAt', 'desc'] }
    ])
)(Buffers);