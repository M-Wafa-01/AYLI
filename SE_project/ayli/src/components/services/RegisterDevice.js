import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerDevice } from '../../store/actions/serviceActions';
import { Redirect } from 'react-router-dom';
import { storage } from '../../config/fbConfig';

var i = 0;
// class-based component to create a new device
class RegisterDevice extends Component {
    state = {
        deviceType: 'Select Device',
        model: '',
        manufacturer: '',
        photos : [
            { image: null, url: '' }
        ],
        errors: {}       
    }

    // On click event handler function to set device type of the state
    handleClick = (e) => {
        this.setState({
            ...this.state,
            deviceType: e.target.id
        })
    }

    // On change event handler function to import images to the state
    handleChangeFile = (e) => {
        
        if(e.target.files[0]){
            var stateCopy = Object.assign({}, this.state);
            stateCopy.photos = stateCopy.photos.slice();
            stateCopy.photos[i] = Object.assign({}, stateCopy.photos[i]);
            stateCopy.photos[i].image = e.target.files[0];
            this.setState(stateCopy);

                const image = stateCopy.photos[i].image;
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
                        
                        stateCopy.photos[i-1] = Object.assign({}, stateCopy.photos[i-1]);
                        stateCopy.photos[i-1].url = url;
                        this.setState(stateCopy);
                    })
                });
            }
            
        }
        i++;
        
    }

    // On change event handler function to set the input fields values of the device form to the state
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    // On submit form event handler function to call the dispatcher action function to add the new device to the Firebase database and redirect the user to the home page
    handleSubmit = (e) => {
        e.preventDefault();
        if(this.validate() ){
            this.props.registerDevice(this.state);
            alert('Your device is well registered');
            this.props.history.push('/');
        }
    }

    // Function too evaluate the input fields values of the form
    validate = () => {
        let errors = {};
        let isValid = true;
        if (!this.state.deviceType || (this.state.deviceType === 'Select Device')) {
            isValid = false;
            errors["deviceTypeerr"] = "Please select your device type.";
        } else {errors["deviceTypeerr"] = ""}
    
        if (!this.state.model) {
            isValid = false;
            errors["modelerr"] = "Please enter your device model.";
        } else {errors["modelerr"] = ""}
        if (!this.state.manufacturer) {
            isValid = false;
            errors["manufacturererr"] = "Please enter your device manufacturer.";
        } else { errors["manufacturererr"] = "" }

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
        const { auth } = this.props;
        window.$(document).ready(function () {
            window.$(".dropdown-button").dropdown();
        });
        window.$(".dropdown-button");
        window.$(document).ready(function(){
            window.$('.materialboxed').materialbox();
          });
          window.$(".materialboxed");
        if (!auth.uid) return <Redirect to="/signin" />
        
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Register your device</h5>

                    <div className="choose-type container">
                        <ul id="deviceType" className="dropdown-content">
                            <li><a id="Smartphone" onClick={this.handleClick}>Smartphone</a></li>
                            <li><a id="Laptop" onClick={this.handleClick}>Laptop</a></li>
                            <li><a id="Desktop Computer" onClick={this.handleClick}>Desktop Computer</a></li>
                            <li><a id="Tablet" onClick={this.handleClick}>Tablet</a></li>
                        </ul>
                        <a className="btn dropdown-button" id="botton" data-beloworigin="true" data-hover="true" data-activates="deviceType" dropdown="true">{this.state.deviceType}<i className="material-icons right">arrow_drop_down</i></a>
                        <div className="text-danger">{this.state.errors.deviceTypeerr}</div>
                    </div>
                    <div className="input-field">
                        <label htmlFor="model">Model</label>
                        <input id="model" type="text" className="validate" onChange={this.handleChange}/>
                        <div className="text-danger">{this.state.errors.modelerr}</div>
                    </div>
                    <div className="input-field">
                        <input id="manufacturer" type="text" className="validate" onChange={this.handleChange} />
                        <label htmlFor="manufacturer">Company Name</label>
                        <div className="text-danger">{this.state.errors.manufacturererr}</div>
                    </div>
                        
                    <div className="file-field input-field multiImage">
                        <div className="btn">
                            <span><i className="material-icons left">cloud_upload</i>File</span>
                            <input id="photos" type="file" multiple onChange={this.handleChangeFile} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
                        </div>
                        <ul className="list-inline imgList row">
                            { this.state.photos && this.state.photos.map((item) => {
                                console.log(this.state);
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
                    
                    <div className="input-field">
                        <button className="btn pink lighten-1 z-depth-0">Register</button>
                    </div>
                </form>
            </div>
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and register the service in the Firebase Firestore
const mapDispatchToProps = (dispatch) => {
    return {
        registerDevice: (device) => {dispatch(registerDevice(device));}
    }
}

// export the component and wrapping it by higher order components 'connect' to connect to React Redux.
export default connect(mapStateToProps, mapDispatchToProps)(RegisterDevice);
