import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { confirmService } from '../../store/actions/serviceActions';
import { rejectService } from '../../store/actions/serviceActions';
import moment from 'moment';

// Class-based component to display the message details depending on the user type of the current signed in user
class ServiceRequestDetails extends Component {

    state = {
        ...this.props.service,
        id: ''
    }

    // On click event handler function to call the dispatcher action function to confirm a service depending on the SCO decision regarding the proposal
    handleClick = (e) => {
        e.preventDefault();
        if(e.target.id === 'confirm'){
            this.state.decision = 'confirmed';
            this.state.id = this.props.id;
            this.props.confirmService(this.state);
            alert('The Service selected is confirmed');
            this.props.history.push('/create_proposal');
        } else if(e.target.id === 'reject'){
            this.state.decision = 'rejected';
            this.state.id = this.props.id;
            alert('The Service selected is rejected');
            this.props.rejectService(this.state);
            this.props.history.push('/home');
        }
    }

    // React predefined Life cycle hook that executes when first the component is mounted to the DOM.
    // Add a listener for the drop down buttons in the form.
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.carousel');
        var instances = window.M.Carousel.init(elems, {});
        });
    }
    
    // Render the component to the DOM
    render(){
        const { service, auth, userType } = this.props;
        
        window.$(document).ready(function(){
            window.$('.carousel').carousel();
        });
        if (!auth.uid) return <Redirect to="/signin" />
        
        if (service) {
            if(!service.decision){
                const content = (userType === 'AYLI') ? (
                    <div className="input-field buttons-version-2">
                            <button className="btn green lighten-1 z-depth-0" id="confirm" type="submit" name="action" onClick={this.handleClick}>Confirm<i className="material-icons right">check</i></button>
                            <button className="btn red lighten-1 z-depth-0 right" id="reject" type="submit" name="action" onClick={this.handleClick}>Reject<i className="material-icons right">not_interested</i></button>
                        </div>
                ) : null;

            
            const contenu = (service.serviceHotel === 'YES') ? (
                <div>
                    <p>Sea View: { service.seaView }</p>
                    <p>Minimum price for a hotel room: { service.minHotelRoom } EUR</p>
                    <p>Maximum price for a hotel room: { service.maxHotelRoom } EUR</p>
                </div>
            ) : null;

            const contenu1 = ((service.serviceHostel === 'YES') || (service.serviceRestaurant === 'YES') || (service.serviceEntertainment === 'YES')) ? (      
                <p>Opening Time: { service.openingHours }</p>
            ) : null;

            const contenu2 = (service.serviceHostel === 'YES') ? (
                <div>
                    <p>Minimum price for a hostel room: { service.minHostelRoom } EUR</p>
                    <p>Maximum price for a hostel room: { service.maxHostelRoom } EUR</p>
                </div>
            ) : null;

            const contenu3 = (service.serviceRestaurant === 'YES') ? (
                <div>
                    <p>Minimum price for a meal: { service.minMeal } EUR</p>
                    <p>Maximum price for a meal: { service.maxMeal } EUR</p>
                </div>
            ) : null;

            const contenu4 = (service.serviceEntertainment === 'YES') ? (
                <div>
                    <p>Minimum price for an event: { service.minService } EUR</p>
                    <p>Maximum price for an event: { service.maxService } EUR</p>
                </div>
            ) : null;

            const contenu5 = ((service.rating !== 'Filter By Rating') && (service.rating !== '')) ? (
                <p>Filter By Rating: { service.rating }</p>
            ) : null;

            const contenu6 = ((service.distance !== 'Near Me') && (service.distance !== '')) ? (
                <p>Filter By Distance: { service.distance }</p>
            ) : null;

            const contenu7 = (service.singles === 'YES') ? (
                <p>For Singles: { service.singles }</p>
            ) : null;

            const contenu8 = (service.couples === 'YES') ? (
                <p>For Couples: { service.couples }</p>
            ) : null;

            const contenu9 = (service.family === 'YES') ? (
                <p>For Families: { service.family }</p>
            ) : null;

            const contenu10 = (service.classic === 'YES') ? (
                <p>Classic Style: { service.classic }</p>
            ) : null;

            const contenu11 = (service.modern === 'YES') ? (
                <p>Modern Style: { service.modern }</p>
            ) : null;
            

            return (
                <div className="container section service-details">
                    <div className="card z-depth-0">
                        <div className="card-content">
                            <span className="card-title">Request</span>
                            <p>{ service.serviceDescription }</p>
                            { contenu }
                            { contenu1 }
                            { contenu2 }
                            { contenu3 }
                            { contenu4 }
                            { contenu5 }
                            { contenu6 }
                            { contenu7 }
                            { contenu8 }
                            { contenu9 }
                            { contenu10 }
                            { contenu11 }
                        </div>
                        { content }

                        <div className="card-action grey lighten-4 grey-text">
                            <div>Posted by { service.authorFirstName } { service.authorLastName }</div>
                            <div>{moment(service.createdAt.toDate()).calendar()}</div>
                        </div>
                        
                    </div>
                </div>
            )
        } else if(service.decision === 'confirmed'){
            return (
                <div className="container section service-details">
                    <div className="card z-depth-0">
                        <div className="card-content">
                            <span className="card-title">Request</span>
                            <p>{ service.serviceDescription }</p>
                        </div>
                        

                        <div className="card-action grey lighten-4 grey-text">
                            <div>Posted by { service.authorFirstName } { service.authorLastName }</div>
                            <div>{moment(service.createdAt.toDate()).calendar()}</div>
                        </div>
                        <div className="input-field buttons-version-2">
                            <button className="btn disabled">Confirmed<i className="material-icons right">check</i></button>
                        </div>
                    </div>
                </div>
            )
        } else if(service.decision === 'rejected'){
            return (
                <div className="container section service-details">
                    <div className="card z-depth-0">
                        <div className="card-content">
                            <span className="card-title">Request</span>
                            <p>{ service.serviceDescription }</p>
                        </div>
                        

                        <div className="card-action grey lighten-4 grey-text">
                            <div>Posted by { service.authorFirstName } { service.authorLastName }</div>
                            <div>{moment(service.createdAt.toDate()).calendar()}</div>
                        </div>
                        <div className="input-field buttons-version-2">
                            <button className="btn disabled">Rejected<i className="material-icons right">not_interested</i></button>
                        </div>
                    </div>
                </div>
            )
            }
        } else {
            return (
                <div className="container center">
                    <p>Loading Service Details...</p>
                </div>
            )
        }
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state, ownProps) => {
    const iden = ownProps.match.params.id;
    const services = state.firestore.data.services;
    const service = services ? services[iden] : null;
    const userType = state.firebase.profile.userType;
    console.log(state);
    return {
        service: service,
        auth: state.firebase.auth,
        id: iden,
        userType: userType
    }
}

// map the action dispatcher functions needed to the prop to use it in order to change the redux store state and register the confirmed service and the rejected service in the Firebase Firestore
const mapDispatchToProps = (dispatch) => {
    return {
        confirmService: (service) => {dispatch(confirmService(service))},
        rejectService: (service) => {dispatch(rejectService(service))}
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'services', orderBy: ['createdAt', 'desc'] }
        
    ])
)(ServiceRequestDetails);
