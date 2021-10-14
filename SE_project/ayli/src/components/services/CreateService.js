import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { createService } from '../../store/actions/serviceActions';
import { Redirect } from 'react-router-dom';
import { storage } from '../../config/fbConfig';

var i = 0;
var company
var name = '';
// class-based component to create a new service
class CreateService extends Component {
    state = {
        serviceType: 'Choose Service Type',
        serviceDescription: '',
        device: 'Select Device',
        servicePhotos: [
            { image: null, url: '' }
        ],
        delivery: 'Delivery',
        companyName: 'Enter Company Name',
        userEmail: '',
        companyId: '',
        deviceType: 'Select Device',
        manufacturer: '',
        decision: '',
        errors: {}
    }

    // On click event handler function to set service type of the state
    handleClick = (e) => {
        this.setState({
            ...this.state,
            serviceType: e.target.id
        })
    }

    // On click event handler function to set device proprety of the state
    handleClickSecond = (device) => {
        console.log(device);
        this.state.deviceType = this.props.deviceList[device].deviceType;
        this.state.manufacturer = this.props.deviceList[device].manufacturer;
        this.setState({
            ...this.state,
            device: device
        })
    }

    // On click event handler function to set delivery proprety of the state
    handleClickThird = (e) => {
        this.setState({
            ...this.state,
            delivery: e.target.id
        })
    }

    // On change event handler function to set the input fields values of the service form to the state
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    // On change event handler function to set the company name to the state
    handleChangeName = (e) => {
        this.state.companyName = e.target.value;
        name = this.state.companyName;
    }
    
    // On change event handler function to import images to the state
    handleChangeFile = (e) => {
    
    if(e.target.files[0]){
        var stateCopy = Object.assign({}, this.state);
        stateCopy.servicePhotos = stateCopy.servicePhotos.slice();
        stateCopy.servicePhotos[i] = Object.assign({}, stateCopy.servicePhotos[i]);
        stateCopy.servicePhotos[i].image = e.target.files[0];
        this.setState(stateCopy);
  
        const image = stateCopy.servicePhotos[i].image;
        if ((image !== null) ){
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on('state_changed', 
        (snaphot) => {
            // progress function
        }, 
        (error) => {
            // error function
            console.log(error);
        }, 
        () => {
            // complete function
            storage.ref('images').child(image.name).getDownloadURL().then(url => {
                console.log(url);
                
                stateCopy.servicePhotos[i-1] = Object.assign({}, stateCopy.servicePhotos[i-1]);
                stateCopy.servicePhotos[i-1].url = url;
                this.setState(stateCopy);
            })
        });
        }      
    }
    i++;   
    }

    // On submit form event handler function to call the dispatcher action function to add the new service to the Firebase database and redirect the user to the home page
    handleSubmit = (e) => {
        e.preventDefault();
        this.state.userEmail = this.props.userEmail;
        company = this.props.users ? this.props.users.filter(user => {
            return user.companyName === this.state.companyName
        }) : null;
        this.state.userEmail = this.props.userEmail;
        this.state.companyId = company;
        if(this.validate() ){
        this.props.createService(this.state);
        alert('Your service is sent successfully');
        this.props.history.push('/');
        }
    }

    // Function too evaluate the input fields values of the form
    validate = () => {
        let errors = {};
        let isValid = true;
        if (!this.state.serviceType || (this.state.serviceType === 'Choose Service Type')) {
            isValid = false;
            errors["serviceTypeerr"] = "Please select the service type.";
        } else {errors["serviceTypeerr"] = ""}

        if (!this.state.serviceDescription) {
        isValid = false;
        errors["serviceDescriptionerr"] = "Please enter the service description.";
        } else {errors["serviceDescriptionerr"] = ""}

        if (!this.state.device  || (this.state.device === 'Select Device')) {
            isValid = false;
            errors["deviceerr"] = "Please select your device.";
        } else { errors["deviceerr"] = "" }

        if (!this.state.delivery  || (this.state.delivery=== 'Delivery')) {
            isValid = false;
            errors["deliveryerr"] = "Please select the delivery";
        } else {errors["deliveryerr"] = ""}

        if (!this.state.companyName || (this.state.companyName === 'Enter Company Name')) {
            isValid = false;
            errors["companyNameerr"] = "Please choose the company name.";
        } else {errors["companyNameerr"] = ""}

        this.setState({
            errors: errors
          });
    
        return isValid;
    }

    // React predefined Life cycle hook that executes when first the component is mounted to the DOM.
    // Add a listener for the drop down buttons in the form.
    // Add a second listener for the Materialbox of the images showed on the same form in the form.
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.dropdown-button');
            var instances = window.M.Dropdown.init(elems, {});
            
          });
        
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.materialboxed');
            var instances = window.M.Materialbox.init(elems, {});
        });
    }

    // Render the component to the DOM
    render() {
        const { auth, deviceList, idc, name } = this.props;
        window.$(document).ready(function () {
            window.$(".dropdown-button").dropdown();
        });
        window.$(".dropdown-button");
        window.$(document).ready(function(){
            window.$('.materialboxed').materialbox();
          });
          window.$(".materialboxed");
        if (!auth.uid) return <Redirect to="/signin" />

        var test
        if (name && (this.state.companyName === 'Enter Company Name')){
            test= ''
            this.state.companyName = name;
        } else if (this.state.companyName != name){
            test = 'AYLI'
        }
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Create new service request</h5>
                    <div className="service-type">
                        <ul id="serviceType" className="dropdown-content">
                            <li><a id="Standard Service" onClick={this.handleClick}>Standard Service</a></li>
                            <li><a id="Special Service" onClick={this.handleClick}>Special Service</a></li>
                        </ul>
                        <a className="btn dropdown-button" id="botton" data-beloworigin="true" data-hover="true" data-activates="serviceType" dropdown="true">{this.state.serviceType}<i className="material-icons right">arrow_drop_down</i></a>
                        <div className="text-danger">{this.state.errors.serviceTypeerr}</div>
                    </div>
                        <div className="input-field col s12">
                        <label htmlFor="serviceDescription">serviceDescription</label>
                        <textarea id="serviceDescription" className="materialize-textarea" onChange={this.handleChange}></textarea>
                        <div className="text-danger">{this.state.errors.serviceDescriptionerr}</div>
                    </div>
                    <div className="device-type">
                        <ul id="deviceType" className="dropdown-content">
                            {   
                                deviceList && Object.keys(deviceList).map((item) => {
                                const device = deviceList[item];
                                if(device.ownerId === idc){
                                return (   

                                    <li key={item}>                                                                                          
                                        <a id="device" onClick={() => {this.handleClickSecond(item)}}>DeviceType: {device.deviceType}, manufacturer: {device.manufacturer}, model: {device.model}</a>                                                                                          
                                    </li>
                                            
                                )
                                }
                            }) }
                        </ul>
                        <a className="btn dropdown-button" id="botton" data-beloworigin="true" data-hover="true" data-activates="deviceType" dropdown="true">{this.state.deviceType} {this.state.manufacturer}<i className="material-icons right">arrow_drop_down</i></a>
                        <div className="text-danger">{this.state.errors.deviceerr}</div>
                    </div>
                    
                    <div className="file-field input-field multiImage-second">
                        <div className="btn">
                            <span><i className="material-icons left">cloud_upload</i>File</span>
                            <input id="servicePhoto" type="file" multiple onChange={this.handleChangeFile} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
                        </div>
                        <ul className="list-inline imgList row">
                            { this.state.servicePhotos && this.state.servicePhotos.map((item) => {
                                //console.log(item);
                                //console.log(this.state);
                                const id = Math.random();  
                                if(item.url){ 
                                    return (   
                                        
                                        <li key={id}>
                                            <div className="col s2">                                                  
                                                <img className="materialboxed thumbnail responsive-img" width="650" height="650" src={item.url} />                                                  
                                            </div>
                                        </li>
                                            
                                    )
                                }
                                }) 
                                
                            }
                        </ul>
                        
                    </div>
                    <div className="delivery-type">
                        <ul id="delivery" className="dropdown-content">
                            <li><a id="Yes" onClick={this.handleClickThird}>Yes</a></li>
                            <li><a id="No" onClick={this.handleClickThird}>No</a></li>
                        </ul>
                        <a className="btn dropdown-button" id="botton" data-beloworigin="true" data-hover="true" data-activates="delivery" dropdown="true">{this.state.delivery}<i className="material-icons right">arrow_drop_down</i></a>
                        <div className="text-danger">{this.state.errors.deliveryerr}</div>
                    </div>

                    <div className="input-field">
                        <label htmlFor="companyName">{test}</label>
                        <input type="text" id="companyName" placeholder={name} onChange={this.handleChangeName}/>
                        <div className="text-danger">{this.state.errors.companyNameerr}</div>
                    </div>

                    <div className="input-field create">
                        <button className="btn pink lighten-1 z-depth-0">Create</button>
                    </div>
                </form>
            </div>
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    
    const id = state.firebase.auth.uid;
    const devices = state.firestore.data.devices;
    const name = state.firestore.data.aux;
    const email = state.firebase.profile.email;
    const users = state.firestore.ordered.users;
    
    const autoName = name ? Object.keys(name).filter((item) => {
        return item === 'test';}) : null;
    
    const aux = autoName ? name[autoName].companyName : null;

    const userList = users ? users.filter(user => {return user.userType === 'Service Center'}) : null ;

    return {
        auth: state.firebase.auth,
        deviceList: devices,
        idc: id,
        name: aux,
        userEmail: email,
        users: userList
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and register the service in the Firebase Firestore
const mapDispatchToProps = (dispatch) => {
    return {
        createService: (service) => {dispatch(createService(service));}
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'devices' },
        { collection: 'aux' }
    ])
)(CreateService);