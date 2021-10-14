import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { confirmService } from '../../store/actions/serviceActions';
import moment from 'moment';

// Class-based component that displays and iteract with the user regarding the service details selected by the SCO
class BufferDetails extends Component {

    state = {
        ...this.props.service,
        id: ''
    }

    // On click Event handler function to call the dispatcher action function 'confirmService' to change the Redux store state and the Firebase Firestore
    handleClick = (e) => {
        e.preventDefault();
        this.state.decision = 'confirmed';
        this.state.id = this.props.id;
        this.props.confirmService(this.state);
        alert('The Service selected is confirmed');
        this.props.history.push('/create_proposal');
        
    }

    // React predefined Life cycle hook that executes when first the component is mounted to the DOM.
    // Add a listener for the Carousel of photos displayed.
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.carousel');
        var instances = window.M.Carousel.init(elems, {});
        });
    }
    
    // Render the component to the DOM
    render(){
        const { service, auth, devices } = this.props;
        //console.log(device);
        window.$(document).ready(function(){
            window.$('.carousel').carousel();
        });
        if (!auth.uid) return <Redirect to="/signin" />
        
        // JSX template displayed on the browser depending on the previous SC service decision
        if (service && devices) {
            const device = devices ? Object.keys(devices).filter((item) => {return item === service.device}) : null;
            console.log(service.device);
            console.log(device);
            const dev = devices ? devices[device[0]] : null;
            console.log(dev);
            if(service.decision === 'rejected'){
            return (
                <div className="container section service-details">
                    <div className="card z-depth-0">
                        <div className="card-content">
                            <span className="card-title">{service.serviceType} / { dev.deviceType } </span>
                            <p>{ service.serviceDescription }</p>
                            <p> { dev.manufacturer } - { dev.model } </p>
                        </div>
                        <div className="carousel">
                            { dev.photos && dev.photos.map((item) => {
                                console.log(item); 
                                return (   
                                               
                                    <a className="carousel-item " key={item.toString()}><img className="materialboxed thumbnail responsive-img" width="650" src={item} /></a>                                                   
                                          
                                )
                                }) 
                            }
                            { service.servicePhotos && service.servicePhotos.map((item) => {
                                console.log(item); 
                                return (   
                                               
                                    <a className="carousel-item " key={item.toString()}><img className="materialboxed thumbnail responsive-img" width="650" src={item} /></a>                                                   
                                          
                                )
                                }) 
                            }
                        </div>
                        
                        <div className="card-action grey lighten-4 grey-text">
                            <div>Posted by { service.authorFirstName } { service.authorLastName }</div>
                            <div>{moment(service.createdAt.toDate()).calendar()}</div>
                        </div>
                        <div className="input-field buttons-version-2">
                            <button className="btn green lighten-1 z-depth-0" id="confirm" type="submit" name="action" onClick={this.handleClick}>Confirm<i className="material-icons right">check</i></button>
                        </div>
                    </div>
                </div>
            )
        } else if(service.decision === 'confirmed'){
            return (
                <div className="container section service-details">
                    <div className="card z-depth-0">
                        <div className="card-content">
                            <span className="card-title">{service.serviceType} / { dev.deviceType } </span>
                            <p>{ service.serviceDescription }</p>
                            <p> { dev.manufacturer } - { dev.model } </p>
                        </div>
                        <div className="carousel">
                            { dev.photos && dev.photos.map((item) => {
                                console.log(item); 
                                return (   
                                               
                                    <a className="carousel-item " key={item.toString()}><img className="materialboxed thumbnail responsive-img" width="650" src={item} /></a>                                                   
                                          
                                )
                                }) 
                            }
                            { service.servicePhotos && service.servicePhotos.map((item) => {
                                console.log(item); 
                                return (   
                                               
                                    <a className="carousel-item " key={item.toString()}><img className="materialboxed thumbnail responsive-img" width="650" src={item} /></a>                                                   
                                          
                                )
                                }) 
                            }
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
    const devices = state.firestore.data.devices;
    return {
        service: service,
        devices: devices,
        auth: state.firebase.auth,
        id: iden
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and confirm the service by the current signed in SC
const mapDispatchToProps = (dispatch) => {
    return {
        confirmService: (service) => {dispatch(confirmService(service))}
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'devices' },
        { collection: 'rejectedServices', orderBy: ['createdAt', 'desc'] }
        
    ])
)(BufferDetails);
