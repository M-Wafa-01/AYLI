import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signUp } from '../../store/actions/authActions';
import ReactPhoneInput from 'react-phone-input-2'
import { isValidPhoneNumber } from 'react-phone-number-input'
import TimeInput from 'material-ui-time-picker'
import lime from "@material-ui/core/colors/lime";
import { createMuiTheme } from "@material-ui/core";
import noUiSlider from 'nouislider'
import Nouislider from "nouislider-react";
import wNumb from 'wnumb'
import "nouislider/distribute/nouislider.css";
import background from "../../images/Picture1.png";

var k = 'NO';
var mi = 0;
var ma = 0;
var hi = 0;
var ha = 0;
var ri = 0;
var ra = 0;
var ei = 0;
var ea = 0;
class SignUp extends Component {
    state = {
        userType: 'Choose',
        firstName: '',
        lastName: '',
        companyName: '',
        serviceHotel: '',
        serviceHostel: '',
        serviceRestaurant: '',
        serviceEntertainment: '',
        times1: new Date(),
        times2: new Date(),
        openingTime: null,
        closingTime: null,
        minHotelRoom: '',
        maxHotelRoom: '',
        minHostelRoom: '',
        maxHostelRoom: '',
        minMeal: '',
        maxMeal: '',
        minService: '',
        maxService: '',
        minPrice: '',
        maxPrice: '',
        taxId: '',
        phone: '',
        address: '',
        email: '',
        password: '',
        passwordConfirmed: '',
        couplesLevel: 'Couples Level',
        familyLevel: 'Family Level',
        customerRange: 'Customer Range',
        placeStyle: 'Place Style',
        seaView: 'Sea View',
        rating: 0,
        responseTime: '',
        time: 'Units',
        duration: 0,
        adminDecision: 'PENDING',
        errors: {}
    }
    
    // On click Event handler function to set the user type input inside the form of the sign up page
    handleClick = (e) => {
        const du = {
            firstName: '',
            lastName: '',
            phone: '',
            address: '',
            email: '',
            password: '',
            passwordConfirmed: ''
        }
        const ss = {
            companyName: '',
            serviceHotel: '',
            serviceHostel: '',
            serviceRestaurant: '',
            serviceEntertainment: '',
            times1: new Date(),
            times2: new Date(),
            openingTime: null,
            closingTime: null,
            minHotelRoom: '',
            maxHotelRoom: '',
            minHostelRoom: '',
            maxHostelRoom: '',
            minMeal: '',
            maxMeal: '',
            minService: '',
            maxService: '',
            minPrice: '',
            maxPrice: '',
            taxId: '',
            phone: '',
            address: '',
            email: '',
            password: '',
            passwordConfirmed: '',
            couplesLevel: 'Couples Level',
            familyLevel: 'Family Level',
            customerRange: 'Customer Range',
            placeStyle: 'Place Style',
            seaView: 'Sea View',
            rating: '',
            responseTime: '',
            time: 'Units',
            duration: 0,
            adminDecision: 'PENDING'
        }
        if (this.state.userType === 'AYLI') {this.setState({
            ...this.state,
            ...ss,
            userType: e.target.id
        })
        }
        else {this.setState({
            ...this.state,
            ...du,
            userType: e.target.id
        })
        }       
    }

    // On click  Event handler function to set the unit of the time to execute a service, entered by the user to the state to register it
    handleClickFourth = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            time: e.target.id
        })
    }

    // On click  Event handler function to set the unit of the time to execute a service, entered by the user to the state to register it
    handleClickFifth = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            couplesLevel: e.target.id
        })
    }
    // On click  Event handler function to set the unit of the time to execute a service, entered by the user to the state to register it
    handleClickSixth = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            familyLevel: e.target.id
        })
    }
    // On click  Event handler function to set the unit of the time to execute a service, entered by the user to the state to register it
    handleClickSeventh = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            customerRange: e.target.id
        })
    }
    // On click  Event handler function to set the unit of the time to execute a service, entered by the user to the state to register it
    handleClickEighth = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            placeStyle: e.target.id
        })
    }

    // On click  Event handler function to set the unit of the time to execute a service, entered by the user to the state to register it
    handleClickNineth= (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            seaView: e.target.id
        })
    }

    handleClickTenth = (e) => {
        e.preventDefault();
    }

    // On key(of the keyboard) press Event handler function to make the input ccepts only numeric characters(numbers) by the user
    onKeyPress(event) {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
         if (/\+|-/.test(keyValue))
           event.preventDefault();
       }

    // On change(when writing anything in the input field) Event handler function to set the the rest of the inputs entered by the user to the state to register it
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    handleChange1 = (e) => {
        //document.write(e.target.checked);
        if (e.target.checked) {
            //alert ("hi");
            this.setState({
                [e.target.id]: 'YES'
            })
          } else {
            //alert ("bye");
            this.setState({
                [e.target.id]: 'NO'
            })
            
          }
    }
    handleChange2 = (value) => {

        this.setState({ 
            times1: value,
            openingTime: value.toLocaleTimeString()
        })
    }
    handleChange3 = (value) => {

        this.setState({ 
            times2: value,
            closingTime: value.toLocaleTimeString()
        })
    }
    // On change Event handler function to set and control the phone number entered by the user to the state to register it
    handlePhone = (value) => {
        this.setState({
            phone: value
        })
        if (!(isValidPhoneNumber('+' + value))){
            this.state.errors["phoneerr"] = "Please enter your correct phone number.";
        } else {this.state.errors["phoneerr"] = ""}
        
    }
    handleChange4 = (e) => {
        this.setState({
            minHotelRoom: mi,
            maxHotelRoom: ma
        })
        
    }
    handleChange5 = (e) => {
        this.setState({
            minHostelRoom: hi,
            maxHostelRoom: ha
        })
        
    }
    handleChange6 = (e) => {
        this.setState({
            minMeal: ri,
            maxMeal: ra
        })
        
    }
    handleChange7 = (e) => {
        this.setState({
            minService: ei,
            maxService: ea
        })
        
    }

    /*onChangeSlide(data) {
        console.log(data) // logs the value
        this.setState({
            minRoom: mi,
            maxRoom: ma
        })
      }*/

    // On submit Event handler function to evaluate the inputs entered by the user and to call the action dispatcher needed to sign up the new user to the Firebase API and to change the Redux store
    handleSubmit = (e) => {
        e.preventDefault();
        var duration = 0;
        // Covert the response time entered by the user to ms and save it to state
        if (this.state.time === 'days'){
            duration = this.state.responseTime * 24 * 60 * 60 * 1000;
        } else if (this.state.time === 'hours'){
            duration = this.state.responseTime * 60 * 60 * 1000;
        } else if (this.state.time === 'minutes'){
            duration = this.state.responseTime * 60 * 1000;
        } else if (this.state.time === 'seconds'){
            duration = this.state.responseTime * 1000;
        }
        this.state.duration = duration;
        console.log(this.state);
        if(this.validate() ){
            if (this.state.userType === 'AYLI'){
                this.props.signUp(this.state);
                k = 'YES';
                alert('Your Admission Request is sent');
            } else if (this.state.userType === 'Customer'){
                this.props.signUp(this.state);
                alert('Your Signup process is confirmed');
            } 
        }
    }

    // Evaluate the inputs enetered by the user
    validate = () => {
        let errors = {};
        let isValid = true;
        if (!this.state.userType || (this.state.userType === 'Choose')) {
            isValid = false;
            errors["userTypeerr"] = "Please select your user type.";
            } else {errors["userTypeerr"] = ""}
        if (this.state.userType === 'AYLI') {
            if (!this.state.companyName) {
            isValid = false;
            errors["companyNameerr"] = "Please enter your name.";
            } else {errors["companyNameerr"] = ""}
            if (!this.state.taxId) {
                isValid = false;
                errors["taxIderr"] = "Please enter your tax identifier.";
            } else { errors["taxIderr"] = "" }
            
            if (!this.state.couplesLevel || (this.state.couplesLevel === 'Couples Level')) {
                isValid = false;
                errors["couplesLevelerr"] = "Please select the couples level.";
            } else if (this.state.couplesLevel) {errors["couplesLevelerr"] = ""}
            if (!this.state.familyLevel || (this.state.familyLevel === 'Family Level')) {
                isValid = false;
                errors["familyLevelerr"] = "Please select the family level.";
            } else if (this.state.familyLevel) {errors["familyLevelerr"] = ""}
            if (!this.state.customerRange || (this.state.customerRange === 'Customer Range')) {
                isValid = false;
                errors["customerRangeerr"] = "Please select the customer range.";
            } else if (this.state.customerRange) {errors["customerRangeerr"] = ""}
            if (!this.state.placeStyle || (this.state.placeStyle === 'Place Style')) {
                isValid = false;
                errors["placeStyleerr"] = "Please select your place style.";
            } else if (this.state.placeStyle) {errors["placeStyleerr"] = ""}
            if (!this.state.seaView || (this.state.seaView === 'Sea View')) {
                isValid = false;
                errors["seaViewerr"] = "Please select your sea view.";
            } else if (this.state.seaView) {errors["seaViewerr"] = ""}
            /*if (!this.state.openingTime) {
                isValid = false;
                errors["openingTimeerr"] = "Please select your opening time.";
            } else if (this.state.openingTime) {errors["openingTimeerr"] = ""}
            if (!this.state.closingTime) {
                isValid = false;
                errors["closingTimeerr"] = "Please select your closing time.";
            } else if (this.state.closingTime) {errors["closingTimeerr"] = ""}*/

            if (!this.state.responseTime) {
                isValid = false;
                errors["responseTimeerr"] = "Please enter your response time.";
            } else if (this.state.responseTime) {errors["responseTimeerr"] = ""}

            if (!this.state.time || (this.state.time === 'Units')) {
                isValid = false;
                errors["timeerr"] = "Please select your response time units.";
            } else if (this.state.time) {errors["timeerr"] = ""}
        } else {
            if (!this.state.firstName) {
                isValid = false;
                errors["firstNameerr"] = "Please enter your first name.";
            } else {errors["firstNameerr"] = ""}
            if (!this.state.lastName) {
                isValid = false;
                errors["lastNameerr"] = "Please enter your last name.";
            } else{errors["lastNameerr"] = ""}
        }

        if (!this.state.phone) {
            isValid = false;
            errors["phoneerr"] = "Please enter your phone number.";
        } else if (this.state.phone) {errors["phoneerr"] = ""}

        if (!this.state.address) {
            isValid = false;
            errors["addresserr"] = "Please enter your address.";
        } else if (this.state.address) {errors["addresserr"] = ""}

        if (!this.state.email) {
            isValid = false;
            errors["emailerr"] = "Please enter your email address.";
        } else if (this.state.email) {errors["emailerr"] = ""}

        if (typeof this.state.email !== "undefined") {
            
            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(this.state.email)) {
            isValid = false;
            errors["emailerr"] = "Please enter valid email address.";
            } else if (pattern.test(this.state.email)) {errors["emailerr"] = ""}
        }

        if (!this.state.password) {
            isValid = false;
            errors["passworderr"] = "Please enter your password.";
        } else if (this.state.password) {errors["passworderr"] = ""}

        if (!this.state.passwordConfirmed) {
            isValid = false;
            errors["passwordConfirmederr"] = "Please enter your confirm password.";
        } else if (this.state.passwordConfirmed) {errors["passwordConfirmederr"] = ""}

        if (typeof this.state.password !== "undefined" && typeof this.state.passwordConfirmed !== "undefined") {
            
            if (this.state.password !== this.state.passwordConfirmed) {
            isValid = false;
            errors["passworderr"] = "Passwords don't match.";
            } else if (this.state.password === this.state.passwordConfirmed) {errors["passworderr"] = ""}
        } 

        this.setState({
            errors: errors
            });

        return isValid;
    }

    // React predefined Life cycle hook that executes when first the component is mounted to the DOM.
    // Add a listener for the drop down buttons in the form.
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.dropdown-button');
            var instances = window.M.Dropdown.init(elems, {});
          });  
        
   }

   // render to the DOM
    render() {
        
        
        const { auth, authError, profile } = this.props;

        // Redirect the user after he is signed up according to the user type and the admission request status
        if ((profile.userType === 'AYLI') && (auth.uid) && (profile.adminDecision === 'PENDING') && (this.state.email === this.props.profile.email) && (k === 'YES')){
            k = 'NO';
            return <Redirect to="/signin" />
        } else if ((profile.userType === 'AYLI') && (auth.uid) && (profile.adminDecision === 'ACCEPTED')){
            return <Redirect to="/home" />
        } else if ((profile.userType === 'Customer') && (auth.uid)){
            return <Redirect to="/" />
        }
        
        window.$(document).ready(function () {
            window.$(".dropdown-button").dropdown();
        });
        window.$(".dropdown-button");
        
        window.$(document).ready(function ($) {
            var dollarPrefixFormat = wNumb({prefix: '€', decimals: 0})
            var slider = document.getElementById('test-slider11');
            noUiSlider.create(slider, {
                start: [30, 350],
                connect: true,
                margin: 5,
                tooltips: [dollarPrefixFormat, dollarPrefixFormat],
                pips: {
                    mode: 'steps',
                    density: 5,
                    stepped: true,
                    format: dollarPrefixFormat
                },
                
                range: {
                    'min': 1,
                    'max': 500
                }
                
            }).on('change', function (values){
                mi=values[0];
                ma=values[1];
                
            });
        });

        window.$(document).ready(function ($) {
            var dollarPrefixFormat = wNumb({prefix: '€', decimals: 0})
            var slider = document.getElementById('test-slider22');
            noUiSlider.create(slider, {
                start: [30, 80],
                connect: true,
                margin: 5,
                tooltips: [dollarPrefixFormat, dollarPrefixFormat],
                pips: {
                    mode: 'steps',
                    density: 5,
                    stepped: true,
                    format: dollarPrefixFormat
                },
                
                range: {
                    'min': 1,
                    'max': 100
                }
                
            }).on('change', function (values){
                hi=values[0];
                ha=values[1];
                
            });
        });

        window.$(document).ready(function ($) {
            var dollarPrefixFormat = wNumb({prefix: '€', decimals: 0})
            var slider = document.getElementById('test-slider33');
            noUiSlider.create(slider, {
                start: [30, 80],
                connect: true,
                margin: 5,
                tooltips: [dollarPrefixFormat, dollarPrefixFormat],
                pips: {
                    mode: 'steps',
                    density: 5,
                    stepped: true,
                    format: dollarPrefixFormat
                },
                
                range: {
                    'min': 1,
                    'max': 100
                }
                
            }).on('change', function (values){
                ri=values[0];
                ra=values[1];
                
            });
        });

        window.$(document).ready(function ($) {
            var dollarPrefixFormat = wNumb({prefix: '€', decimals: 0})
            var slider = document.getElementById('test-slider44');
            noUiSlider.create(slider, {
                start: [30, 80],
                connect: true,
                margin: 5,
                tooltips: [dollarPrefixFormat, dollarPrefixFormat],
                pips: {
                    mode: 'steps',
                    density: 5,
                    stepped: true,
                    format: dollarPrefixFormat
                },
                
                range: {
                    'min': 1,
                    'max': 100
                }
                
            }).on('change', function (values){
                ei=values[0];
                ea=values[1];
                
            });
        });
          //window.$('.timepicker');
          
          /*window.$(document).ready(function(event) {
            
            const input = window.$('.timepicker');
            
            // initialize timepicker
            var picker = input.pickatime({
                
                default: 'now', // Set default time: 'now', '1:30AM', '16:30'
            
                fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
            
                twelvehour: true, // Use AM/PM or 24-hour format
            
                donetext: 'OK', // text for done-button
            
                cleartext: 'Clear', // text for clear-button
            
                canceltext: 'Cancel', // Text for cancel-button
            
                autoclose: false, // automatic close timepicker
            
                ampmclickable: true, // make AM PM clickable
            
                aftershow: function(){} //Function for after opening timepicker
                
            });
            //event.stopPropagation();
            
            // get picker
            //const picker = input.pickatime('picker');
            // set initial value using arrays formatted as [HOUR,MINUTE].
            picker.set('select', [3,0]); // <-- picker.set is not a function
            
          });*/

          //window.$('.timepicker');
         // window.$('#lunchtime');


        
        // Save the JSX code to display inside the inputs inside the form according to the user type.
        const milieu = (this.state.userType === 'AYLI') ? (
                <div className="service-center">
                    <div className="input-field">
                        <i className="medium material-icons prefix">person_outline</i>
                        <input id="companyName" type="text" className="validate" onChange={this.handleChange} />
                        <label htmlFor="companyName">Name</label>
                        <div className="text-danger">{this.state.errors.companyNameerr}</div>
                    </div>
                    <br/>
                    <br/>
                    <div className="row list">
                        <i className="col s31 small material-icons prefix">business</i>
                        <br/>
                        <br/>
                        <ul id="service" className="validate">
                        
                            <li className="col s3 push-s1">
                            <input id="serviceHotel" className="serviceHotel validate" type="checkbox" onChange={this.handleChange1}/>
                            <label id="serviceHotel1" htmlFor="serviceHotel">Hotel</label>   
                            </li>
                            <li className="col s2 push-s1">
                            <input id="serviceHostel" className="serviceHostel validate" type="checkbox" onChange={this.handleChange1}/>
                            <label id="serviceHostel1" htmlFor="serviceHostel">Hostel</label>   
                            </li>
                            <li className="col s2 push-s2">
                            <input id="serviceRestaurant" className="serviceRestaurant validate" type="checkbox" onChange={this.handleChange1}/>
                            <label id="serviceRestaurant1" htmlFor="serviceRestaurant">Restaurant</label>   
                            </li>
                            <li className="col s2 push-s3">
                            <input id="serviceEntertainment" className="serviceEntertainment validate" type="checkbox" onChange={this.handleChange1}/>
                            <label id="serviceEntertainment1" htmlFor="serviceEntertainment">Entertainment</label>   
                            </li>
                        </ul>
                        <br/>
                        <br/>
                        <div className="col s6 text-danger">{this.state.errors.serviceserr}</div>
                    </div>

                    
                    
                    
                </div>
        ) : (
        <div>
            <div className="row">
                <div className="input-field col s6">
                    <i className="material-icons prefix">account_circle</i>
                    <input id="firstName" type="text" className="validate" onChange={this.handleChange} />
                    <label htmlFor="firstName">First Name</label>
                    <div className="text-danger">{this.state.errors.firstNameerr}</div>
                </div>
                <div className="input-field col s6">
                    <input id="lastName" type="text" className="validate" onChange={this.handleChange} />
                    <label htmlFor="lastName">Last Name</label>
                    <div className="text-danger">{this.state.errors.lastNameerr}</div>
                </div>
            </div>

    
            <div className="input-field trial">
                <ReactPhoneInput className="validate" country={'it'} value={this.state.phone} onChange={this.handlePhone}/>
                <div className="text-danger">{this.state.errors.phoneerr}</div>
            </div>
            <br/>
            <div className="input-field">
                <i className="material-icons prefix">home</i>
                <input id="address" type="text" className="validate" onChange={this.handleChange}/>
                <label htmlFor="address">Address</label>
                <div className="text-danger">{this.state.errors.addresserr}</div>
            </div>
            <div className="input-field">
                <i className="material-icons prefix">email</i>
                <input id="email" type="email" className="validate" onChange={this.handleChange}/>
                <label htmlFor="email">Email</label>
                <div className="text-danger">{this.state.errors.emailerr}</div>
            </div>
        <div className="row">
            <div className="input-field col s6">
                <i className="material-icons prefix">vpn_key</i>
                <input id="password" type="password" className="validate" onChange={this.handleChange}/>
                <label htmlFor="password">Password</label>
                <div className="text-danger">{this.state.errors.passworderr}</div>
            </div>
            <div className="input-field col s6">
                <input id="passwordConfirmed" type="password" className="validate" onChange={this.handleChange}/>
                <label htmlFor="passwordConfirmed">Confirm password</label>
                <div className="text-danger">{this.state.errors.passwordConfirmederr}</div>
            </div>
        </div>
        <div className="input-field center">
            <button className="btn #1b5e20 green darken-4 z-depth-0">Sign Up<i className="material-icons right">send</i></button>
            <div className="red-text center">
                { authError ? <p>{authError}</p> : null }
            </div>
        </div>
    </div>)

        //hjjjj
        const milieu2 = (this.state.userType === 'AYLI') ? (
            <div>
            
                    <div className="row">
                        <div className="couples input-field col s3">

                            <ul id="couplesLevel" className="dropdown-content validate">
                                <li><a className="green-text text-darken-4" id="low couples level" onClick={this.handleClickFifth}>Low couples level</a></li>
                                <li><a className="green-text text-darken-4" id="medium couples level" onClick={this.handleClickFifth}>Medium couples level</a></li>
                                <li><a className="green-text text-darken-4" id="high couples level" onClick={this.handleClickFifth}>High couples level</a></li>
                            </ul>
                            
                            <a className="btn dropdown-button #1b5e20 green darken-4" id="botton" data-beloworigin="true" data-hover="true" data-activates="couplesLevel" dropdown="true">{this.state.couplesLevel}<i className="material-icons right">arrow_drop_down</i></a>
                            <div className="text-danger">{this.state.errors.couplesLevelerr}</div>
                        </div>
                        <div className="families input-field col s3">

                            <ul id="familyLevel" className="dropdown-content validate">
                                <li><a className="green-text text-darken-4" id="low family level" onClick={this.handleClickSixth}>Low family level</a></li>
                                <li><a className="green-text text-darken-4" id="medium family level" onClick={this.handleClickSixth}>Medium family level</a></li>
                                <li><a className="green-text text-darken-4" id="high family level" onClick={this.handleClickSixth}>High family level</a></li>
                            </ul>
                            
                            <a className="btn dropdown-button #1b5e20 green darken-4" id="botton" data-beloworigin="true" data-hover="true" data-activates="familyLevel" dropdown="true">{this.state.familyLevel}<i className="material-icons right">arrow_drop_down</i></a>
                            <div className="text-danger">{this.state.errors.familyLevelerr}</div>
                        </div>
                        <div className="places input-field col s3">

                            <ul id="placeStyle" className="dropdown-content validate">
                                <li><a className="green-text text-darken-4" id="classic style" onClick={this.handleClickEighth}>Classic Style</a></li>
                                <li><a className="green-text text-darken-4" id="modern style" onClick={this.handleClickEighth}>Modern Style</a></li>
                            </ul>
                            
                            <a className="btn dropdown-button #1b5e20 green darken-4" id="botton" data-beloworigin="true" data-hover="true" data-activates="placeStyle" dropdown="true">{this.state.placeStyle}<i className="material-icons right">arrow_drop_down</i></a>
                            <div className="text-danger">{this.state.errors.placeStyleerr}</div>
                        </div>
                        <div className="customers input-field col s3">

                            <ul id="customerRange" className="dropdown-content validate">
                                <li><a className="green-text text-darken-4" id="Age: 18-35" onClick={this.handleClickSeventh}>Age: 18-35</a></li>
                                <li><a className="green-text text-darken-4" id="Age: 36-50" onClick={this.handleClickSeventh}>Age: 36-50</a></li>
                                <li><a className="green-text text-darken-4" id="Age: 50+" onClick={this.handleClickSeventh}>Age: 50+</a></li>
                            </ul>
                            
                            <a className="btn dropdown-button #1b5e20 green darken-4" id="botton" data-beloworigin="true" data-hover="true" data-activates="customerRange" dropdown="true">{this.state.customerRange}<i className="material-icons right">arrow_drop_down</i></a>
                            <div className="text-danger">{this.state.errors.customerRangeerr}</div>
                        </div>
                    </div>
                    <br/>
                    <br/>
                    
                    
                    <br/>
                    <div className="row">
                    <div className="input-field col s12 m4 ">
                        <i className="material-icons prefix">access_time</i>
                        <input id="responseTime" type="number" onKeyPress={this.onKeyPress} className="validate" onChange={this.handleChange} />
                        <label htmlFor="responseTime">Response Time</label>
                        <div className="text-danger">{this.state.errors.responseTimeerr}</div>
                        
                    </div>
                    <div className="input-field col s12 m4 ">
                        <ul id="time" className="dropdown-content validate">
                            <li><a className="green-text text-darken-4" id="seconds" onClick={this.handleClickFourth}>Seconds</a></li>
                            <li><a className="green-text text-darken-4" id="minutes" onClick={this.handleClickFourth}>Minutes</a></li>
                            <li><a className="green-text text-darken-4" id="hours" onClick={this.handleClickFourth}>Hours</a></li>
                            <li><a className="green-text text-darken-4" id="days" onClick={this.handleClickFourth}>Days</a></li>
                        </ul>
                        <a className="btn dropdown-button #1b5e20 green darken-4" id="botton" data-beloworigin="true" data-hover="true" data-activates="time" dropdown="true">{this.state.time}<i className="material-icons right">arrow_drop_down</i></a>
                        <div className="text-danger">{this.state.errors.timeerr}</div>
                    </div>
                    </div>
                    
                    <div className="input-field ">
                        <i className="material-icons prefix">payment</i>
                        <input id="taxId" type="text" type="number" onKeyPress={this.onKeyPress} className="validate" onChange={this.handleChange} />
                        <label htmlFor="taxId">Tax Identifier</label>
                        <div className="text-danger">{this.state.errors.taxIderr}</div>
                    </div>
                   
                    <div className="input-field trial">
                    <ReactPhoneInput className="validate" country={'it'} value={this.state.phone} onChange={this.handlePhone}/>
                    <div className="text-danger">{this.state.errors.phoneerr}</div>
                    </div>
                    <br/>
                    <div className="input-field">
                        <i className="material-icons prefix">home</i>
                        <input id="address" type="text" className="validate" onChange={this.handleChange}/>
                        <label htmlFor="address">Address</label>
                        <div className="text-danger">{this.state.errors.addresserr}</div>
                    </div>
                    <div className="input-field">
                        <i className="material-icons prefix">email</i>
                        <input id="email" type="email" className="validate" onChange={this.handleChange}/>
                        <label htmlFor="email">Email</label>
                        <div className="text-danger">{this.state.errors.emailerr}</div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <i className="material-icons prefix">vpn_key</i>
                            <input id="password" type="password" className="validate" onChange={this.handleChange}/>
                            <label htmlFor="password">Password</label>
                            <div className="text-danger">{this.state.errors.passworderr}</div>
                        </div>
                        <div className="input-field col s6">
                            <input id="passwordConfirmed" type="password" className="validate" onChange={this.handleChange}/>
                            <label htmlFor="passwordConfirmed">Confirm password</label>
                            <div className="text-danger">{this.state.errors.passwordConfirmederr}</div>
                        </div>
                    </div>
                    <div className="input-field center">
                        <button className="btn #1b5e20 green darken-4 z-depth-0">Sign Up<i className="material-icons right">send</i></button>
                        <div className="red-text center">
                            { authError ? <p>{authError}</p> : null }
                        </div>
                    </div>
            </div>
        ) : (
            <div>

            </div>
        )

        // blahhh
        const hotel = (this.state.serviceHotel === 'YES') ? (
        <div className="hotel">
            <div className="row">
                <div className="seaViews input-field col s3">

                    <ul id="seaView" className="dropdown-content validate">
                        <li><a className="green-text text-darken-4" id="off-shore" onClick={this.handleClickNineth}>Off-shore</a></li>
                        <li><a className="green-text text-darken-4" id="on-shore" onClick={this.handleClickNineth}>On-shore</a></li>
                    </ul>
                    
                    <a className="btn dropdown-button #1b5e20 green darken-4" id="botton" data-beloworigin="true" data-hover="true" data-activates="seaView" dropdown="true">{this.state.seaView}<i className="material-icons right">arrow_drop_down</i></a>
                    <div className="text-danger">{this.state.errors.seaViewerr}</div>
                </div>
                
            </div>
            <br />
            <br />
            <div className="container">
            <h3 className="grey-text center-align" >Hotel Room Price Range</h3>
            <br />
            
            <div id="test-slider11" onClick={this.handleChange4}></div>
            </div>
            <br />
            <br />
            <br />
        </div>
        ):(
        <div>

        </div>
        )
        const dil = new Date();
        const defaultMaterialTheme = createMuiTheme({
            palette: {
              primary: lime,
            },
          });
        //khlkj
        const others = ((this.state.serviceHostel === 'YES') || (this.state.serviceRestaurant === 'YES') || (this.state.serviceEntertainment === 'YES')) ? (
            <div className="hotel">
                <div className="row">
                    <div className="input-field col s6 ">
                        <i className="material-icons prefix">access_time</i>
                        <TimeInput theme="Bourbon" className="col s6 push-s1 validate" format='ampm' placeholder="Opening Time" value={this.state.times1} onChange={this.handleChange2} />
                        <br />
                        <br />
                        <br />
                        <br />
                        <div className="text-danger col s6 push-s1">{this.state.errors.openingTimeerr}</div>
                    </div>
                    <div className="input-field col s6 pull-s2">
                    <i className="material-icons prefix">access_time</i>
                        <TimeInput className="col s6 push-s1 validate" format='ampm' placeholder="Closing Time" value={this.state.times2} onChange={this.handleChange3} />
                        <br />
                        <br />
                        <br />
                        <br />
                        <div className="text-danger col s6 push-s1">{this.state.errors.closingTimeerr}</div>
                    </div>
                </div>
                
            </div>
            ):(
            <div>
    
            </div>
            )

            const hostel = ((this.state.serviceHostel === 'YES')) ? (
                <div className="hostel">
                    <div className="container">
                    <h3 className="grey-text" >Hostel Room Price Range</h3>
                    <br />
                    <div id="test-slider22" onClick={this.handleChange5}></div>
                    </div>
                    <br />
                    <br />
                    <br />
                </div>
                ):(
                <div>
        
                </div>
                )
            const restaurant = ((this.state.serviceRestaurant === 'YES')) ? (
                <div className="restaurant">
                    <div className="container">
                    <h3 className="grey-text" >Restaurant Meal Price Range</h3>
                    <br />
                    <div id="test-slider33" onClick={this.handleChange6}></div>
                    </div>
                    <br />
                    <br />
                    <br />
                </div>
                ):(
                <div>
        
                </div>
                )
            const entertainment = ((this.state.serviceEntertainment === 'YES')) ? (
                <div className="entertainment">
                    <div className="container">
                    <h3 className="grey-text" >Entertainment Service Price Range</h3>
                    <br />
                    <div id="test-slider44" onClick={this.handleChange7}></div>
                    </div>
                    <br />
                    <br />
                    <br />
                </div>
                ):(
                <div>
        
                </div>
                )

        // JSX template to display the dropdown input of the user type and the cooresponding form fields
        return (
            <div className="signUp" style={{ backgroundImage: `url(${background})`, backgroundPosition: 'center', backgroundAttachment: 'fixed', backgroundSize: '1925px 1360px', backgroundRepeat: 'no-repeat', minWidth: '100%', minHeight: '100%', backgroundColor: '#95e8f3'}}>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white col s12">
                    <div className="choose container">
                        <ul id="userType" className="dropdown-content validate">
                            <li><a className="green-text text-darken-4" id="AYLI" onClick={this.handleClick}>AYLI</a></li>
                            <li><a className="green-text text-darken-4" id="Customer" onClick={this.handleClick}>Customer</a></li>
                        </ul>
                        <a className="btn dropdown-button #1b5e20 green darken-4" id="botton" data-beloworigin="true" data-hover="true" data-activates="userType" dropdown="true">{this.state.userType}<i className="material-icons right">arrow_drop_down</i></a>
                        <div className="text-danger">{this.state.errors.userTypeerr}</div>
                    </div>
                    { milieu }
                    { hotel }
                    { others }
                    { hostel }
                    { restaurant }
                    { entertainment }
                    { milieu2 }                    
                </form>                
            </div>
            </div>           
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    return {
        auth: state.firebase.auth,
        authError: state.auth.authError,
        profile: state.firebase.profile
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and login the user
const mapDispatchToProps = (dispatch) => {
    return {
        signUp: (newUser) => {dispatch(signUp(newUser))}
    }
}

// export the component and wrapping it by higher order component 'connect' to connect the exported component to React Redux.
export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
