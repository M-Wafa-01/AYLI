import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { createProposal } from '../../store/actions/proposalActions';
import { storage } from '../../config/fbConfig';
import { Redirect } from 'react-router-dom';

var i = 0;
// class-based component to create a new proposal by the SCO
class CreateProposal extends Component {
    state = {
        userEmail: 'Choose User',
        offerDescription: '',
        nOffers: 'Number of offers',
        cost1: 0,
        cost2: 0,
        cost3: 0,
        proposalPhotos: [
            { image: null, url: '' }
        ],
        userId: '',
        decision: '',
        errors: {},
        service: null
    }
    
    // On change event handler function to set the input fields values of the proposal form to the state
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    // On click event handler function to set companyEmail and the userEmail propreties of the state
    handleClick = (item) => {
        this.setState({
            ...this.state,
            userEmail: this.props.userList[item].email,
            userId: item
        })
        console.log(this.state)
    }


    // On click event handler function to set delay proprety of the state
    handleClickThird = (e) => {
        this.setState({
            ...this.state,
            nOffers: e.target.id
        })
    }

    // On key press event handler function to allow only numeric characters(only numbers)
    onKeyPress(event) {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
         if (/\+|-/.test(keyValue))
           event.preventDefault();
    }

    // On change event handler function to import images to the state
    handleChangeFile = (e) => {
    
        if(e.target.files[0]){
            var stateCopy = Object.assign({}, this.state);
            stateCopy.proposalPhotos = stateCopy.proposalPhotos.slice();
            stateCopy.proposalPhotos[i] = Object.assign({}, stateCopy.proposalPhotos[i]);
            stateCopy.proposalPhotos[i].image = e.target.files[0];
            this.setState(stateCopy);
      
            const image = stateCopy.proposalPhotos[i].image;
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
                    
                    stateCopy.proposalPhotos[i-1] = Object.assign({}, stateCopy.proposalPhotos[i-1]);
                    stateCopy.proposalPhotos[i-1].url = url;
                    this.setState(stateCopy);
                })
            });
            }      
        }
        i++;   
        }
    
    // On submit form event handler function to call the dispatcher action function to add the proposal to the Firebase database and redirect the user to the home page
    handleSubmit = (e) => {
        e.preventDefault();
        
        console.log(this.state)
        if(this.validate() ){
        this.props.createProposal(this.state);
        alert('Your proposal is sent successfully');
        this.props.history.push('/home');
        }
    }

    // Function too evaluate the input fields values of the form
    validate = () => {
        let errors = {};
        let isValid = true;

        if (!this.state.userEmail || (this.state.userEmail === 'Choose User')) {
            isValid = false;
            errors["userEmailerr"] = "Please choose the user email.";
        } else {errors["userEmailerr"] = ""}
        
        if (!this.state.nOffers || (this.state.nOffers === 'Number of offers')) {
            isValid = false;
            errors["nOfferserr"] = "Please choose the number of offers to give.";
        } else if (this.state.nOffers === 'one offer') {
            if (!this.state.cost1 || (this.state.cost1 == 0)) {
                isValid = false;
                errors["cost1err"] = "Please enter the proposal cost for offer number 1.";
                } else if(this.state.cost1.length > 4){
                    isValid = false;
                    errors["cost1err"] = "Please enter a valid cost for offer number 1.";
                } else {errors["cost1err"] = ""}
                errors["nOfferserr"] = "";
        } else if (this.state.nOffers === 'two offers') {
            if (!this.state.cost1 || (this.state.cost1 == 0)) {
                isValid = false;
                errors["cost1err"] = "Please enter the proposal cost for offer number 1.";
                } else if(this.state.cost1.length > 4){
                    isValid = false;
                    errors["cost1err"] = "Please enter a valid cost for offer number 1.";
                } else {errors["cost1err"] = ""}
    
            if (!this.state.cost2 || (this.state.cost2 == 0)) {
                isValid = false;
                errors["cost2err"] = "Please enter the proposal cost for offer number 2.";
                } else if(this.state.cost2.length > 4){
                    isValid = false;
                    errors["cost2err"] = "Please enter a valid cost for offer number 2.";
                } else {errors["cost2err"] = ""}
                errors["nOfferserr"] = "";
        } else if (this.state.nOffers === 'three offers') {
            if (!this.state.cost1 || (this.state.cost1 == 0)) {
                isValid = false;
                errors["cost1err"] = "Please enter the proposal cost for offer number 1.";
                } else if(this.state.cost1.length > 4){
                    isValid = false;
                    errors["cost1err"] = "Please enter a valid cost for offer number 1.";
                } else {errors["cost1err"] = ""}
    
            if (!this.state.cost2 || (this.state.cost2 == 0)) {
                isValid = false;
                errors["cost2err"] = "Please enter the proposal cost for offer number 2.";
                } else if(this.state.cost2.length > 4){
                    isValid = false;
                    errors["cost2err"] = "Please enter a valid cost for offer number 2.";
                } else {errors["cost2err"] = ""}
            
            if (!this.state.cost3 || (this.state.cost3 == 0)) {
                isValid = false;
                errors["cost3err"] = "Please enter the proposal cost for offer number 3.";
                } else if(this.state.cost3.length > 4){
                    isValid = false;
                    errors["cost3err"] = "Please enter a valid cost for offer number 3.";
                } else {errors["cost3err"] = ""}
                errors["nOfferserr"] = "";
        } else {errors["nOfferserr"] = ""}

        if (!this.state.offerDescription) {
            isValid = false;
            errors["offerDescriptionerr"] = "Please enter your offer description regrding the customer service request.";
        } else { errors["offerDescriptionerr"] = "" }

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
    
    // Render the component to the DOM
    render() {
        const { auth, services, users, userList } = this.props;
        
        if (!auth.uid) return <Redirect to="/signin" />
        window.$(document).ready(function () {
            window.$(".dropdown-button").dropdown();
        });
        window.$(".dropdown-button");
        this.state.service = this.props.service;

        const offers1 = ((this.state.nOffers === 'one offer')) ? (
            <div className="offer1">
                <div className="row">
                    <div className="input-field col s12 m3 ">
                        <i className="material-icons prefix">payment</i>
                        <input id="cost1" type="number" onKeyPress={this.onKeyPress} className="validate" onChange={this.handleChange} />
                        <label htmlFor="cost1">Offer 1: Cost</label>
                        <div className="text-danger">{this.state.errors.cost1err}</div>
                        
                    </div>
                    <div className="input-field col s12 m3 ">
                        <a className="btn #ef9a9a red lighten-3">euros<i className="material-icons right">euro_symbol</i></a>
                    </div>
                </div>
            </div>
            ) : null;

        const offers2 = ((this.state.nOffers === 'two offers')) ? (
            <div className="offer2">
                <div className="row">
                    <div className="input-field col s12 m3 ">
                        <i className="material-icons prefix">payment</i>
                        <input id="cost1" type="number" onKeyPress={this.onKeyPress} className="validate" onChange={this.handleChange} />
                        <label htmlFor="cost1">Offer 1: Cost</label>
                        <div className="text-danger">{this.state.errors.cost1err}</div>
                        
                    </div>
                    <div className="input-field col s12 m3 ">
                        <a className="btn #ef9a9a red lighten-3">euros<i className="material-icons right">euro_symbol</i></a>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12 m3 ">
                        <i className="material-icons prefix">payment</i>
                        <input id="cost2" type="number" onKeyPress={this.onKeyPress} className="validate" onChange={this.handleChange} />
                        <label htmlFor="cost2">Offer 2: Cost</label>
                        <div className="text-danger">{this.state.errors.cost2err}</div>
                        
                    </div>
                    <div className="input-field col s12 m3 ">
                        <a className="btn #ef9a9a red lighten-3">euros<i className="material-icons right">euro_symbol</i></a>
                    </div>
                </div>
            </div>
            ) : null; 

        const offers3 = ((this.state.nOffers === 'three offers')) ? (
            <div className="offer3">
                <div className="row">
                    <div className="input-field col s12 m3 ">
                        <i className="material-icons prefix">payment</i>
                        <input id="cost1" type="number" onKeyPress={this.onKeyPress} className="validate" onChange={this.handleChange} />
                        <label htmlFor="cost1">Offer 1: Cost</label>
                        <div className="text-danger">{this.state.errors.cost1err}</div>
                        
                    </div>
                    <div className="input-field col s12 m3 ">
                        <a className="btn #ef9a9a red lighten-3">euros<i className="material-icons right">euro_symbol</i></a>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12 m3 ">
                        <i className="material-icons prefix">payment</i>
                        <input id="cost2" type="number" onKeyPress={this.onKeyPress} className="validate" onChange={this.handleChange} />
                        <label htmlFor="cost2">Offer 2: Cost</label>
                        <div className="text-danger">{this.state.errors.cost2err}</div>
                        
                    </div>
                    <div className="input-field col s12 m3 ">
                        <a className="btn #ef9a9a red lighten-3">euros<i className="material-icons right">euro_symbol</i></a>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s12 m3 ">
                        <i className="material-icons prefix">payment</i>
                        <input id="cost3" type="number" onKeyPress={this.onKeyPress} className="validate" onChange={this.handleChange} />
                        <label htmlFor="cost3">Offer 3: Cost</label>
                        <div className="text-danger">{this.state.errors.cost3err}</div>
                        
                    </div>
                    <div className="input-field col s12 m3 ">
                        <a className="btn #ef9a9a red lighten-3">euros<i className="material-icons right">euro_symbol</i></a>
                    </div>
                </div>
            </div>
            ) : null;

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Create new proposal</h5>
                    <div className="choose-user">
                        <ul id="selectedEmail" className="dropdown-content">
                            {   
                                
                                
                                users && users.map((item) => {

                                    var uList = userList && Object.keys(userList).filter(id => {
                                        return userList[id].email === item.email
                                    })
                                
                                return (   
                                      
                                    <div key={item.email}>
                                                                                          
                                            <li><a id="user" className="blue-text text-lighten-3" onClick={() => {this.handleClick(uList[0])}}>{item.firstName} {item.lastName} - {item.email}</a></li>                                                 
                                        
                                    </div>
                                            
                                )
                                
                                })

                            }
                            </ul>
                        <a className="btn dropdown-button #ef9a9a red lighten-3" data-beloworigin="true" data-hover="true" data-activates="selectedEmail" dropdown="true" name="">{this.state.userEmail}<i className="material-icons right">arrow_drop_down</i></a>
                        <div className="text-danger">{this.state.errors.userEmailerr}</div>
                    </div>
                    
                    <div className="input-field">
                        <label htmlFor="offerDescription">Offer Description</label>
                        <textarea id="offerDescription" className="materialize-textarea" onChange={this.handleChange}></textarea>
                        <div className="text-danger">{this.state.errors.offerDescriptionerr}</div>
                    </div>

                    <div className="file-field input-field multiImage-second">
                        <div className="btn #ef9a9a red lighten-3">
                            <span><i className="material-icons left">cloud_upload</i>File</span>
                            <input id="servicePhoto" type="file" multiple onChange={this.handleChangeFile} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
                        </div>
                        <ul className="list-inline imgList row">
                            { this.state.proposalPhotos && this.state.proposalPhotos.map((item) => {
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
                    <div className="input-field col s12 m4 ">
                        <ul id="nOffers1" className="dropdown-content validate">
                            <li><a id="one offer" className="blue-text text-lighten-3" onClick={this.handleClickThird}>One Offer</a></li>
                            <li><a id="two offers" className="blue-text text-lighten-3" onClick={this.handleClickThird}>Two Offers</a></li>
                            <li><a id="three offers" className="blue-text text-lighten-3" onClick={this.handleClickThird}>Three Offers</a></li>
                        </ul>
                        <a className="btn dropdown-button #ef9a9a red lighten-3" id="botton" data-beloworigin="true" data-hover="true" data-activates="nOffers1" dropdown="true">{this.state.nOffers}<i className="material-icons right">arrow_drop_down</i></a>
                        <div className="text-danger">{this.state.errors.nOfferserr}</div>
                    </div>
                    <br />
                    { offers1 }
                    { offers2 }
                    { offers3 }

                    <div className="input-field create">
                        <button className="btn light-blue lighten-3">Create</button>
                    </div>
                </form>
            </div>
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const idc = state.firebase.auth.uid;
    const services = state.firestore.data.services;
    
    const serviceList = services ? Object.values(services).filter(item => {
        if (item.companyId){
        return item.companyId[0].id === idc
        }
    }) : null;
    const name = state.firestore.data.aux;
    const autoName = name ? Object.keys(name).filter((item) => {
        return (item === idc)}) : null;
    var service
    
    const inter = autoName ? Object.values(autoName).map(item => {
        if(name){
        service = name[item];
        }
        return item
    }) : null;
     
    const userList = state.firestore.data.users;
    const users = userList ? Object.values(userList).filter(item => {
        return item.userType === 'Customer'
    }) : null;
    
    var ser = []
    var i = 0;
    const sList = serviceList ? Object.values(serviceList).map(item => {
        ser[i] = users && Object.values(users).filter(user => {
            return user.email === item.userEmail
        })
        i++
    }) : null;

    var serList = serviceList;
    if (serList!=null ){
        for (let i = 0; i < serList.length-1; i++) {
            const item1 = serList[i];
            for (let j = i+1; j < serList.length; j++) {
                const item2 = serList[j];
                if ((item2 != 0) && (item1 != 0)){
                    if (item1.device === item2.device){
                        serList[j] =0
                    }
                }
            }       
        }
    }
    var mid = []
    var k = 0;
    if (serList){
        for (let i = 0; i < serList.length; i++) {
            const element = serList[i];
            if ((element != 0) && (element != null)){
                mid[k] = element;
                k++;
            }
            
        }
    }

    if (ser[0]!=null ){
        for (let i = 0; i < ser.length-1; i++) {
            const item1 = ser[i];
            for (let j = i+1; j < ser.length; j++) {
                const item2 = ser[j];
                if ((item2 != 0) && (item1 != 0)){
                    if (item1[0].email === item2[0].email){
                        ser[j] =0
                    }
                }
            }    
        }
    }
    var aux = [];
    var j = 0;
    for (let i = 0; i < ser.length; i++) {
        const element = ser[i];
        if ((element != 0) && (element != null)){
            aux[j] = element[0];
            j++;
        }      
    }
    
    return {
        auth: state.firebase.auth,
        services: mid,
        users: aux,
        userList: userList,
        service: service
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and register the payment in the Firebase Firestore
const mapDispatchToProps = (dispatch) => {
    return {
        createProposal: (proposal) => {dispatch(createProposal(proposal));}
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'aux' },
        { collection: 'services' },
        { collection: 'users' }
    ])
)(CreateProposal);