import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { createClaim } from '../../store/actions/proposalActions';
import { Redirect } from 'react-router-dom';

// Class-based component that displays the contact form and interacts with the user inputs 
class Contact extends Component {

    state = {
        invoiceId: 'Choose the Service Center',
        companyName: '',
        companyId: '',
        title: '',
        body: '',
        claim: 'Is this a claim ?',
        errors: {}
    }

    // On click event handler function to set the claim proprety in the state according to the selected input by the user
    handleClick = (e) => {
        this.setState({
            ...this.state,
            claim: e.target.id
        })
    }

    // On click event handler function to set propreties in the state according to the selected input by the user
    handleClickSecond = (iden) => {
        console.log(iden);
        this.setState({
            invoiceId: iden,
            companyName: this.props.invoiceList[iden].authorCompanyName,
            companyId: this.props.invoiceList[iden].authorCompanyId   
        })
    }

    // On change(when writing anything in the input field) Event handler function to set the the rest of the inputs entered by the user to the state to register it
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    // On submit Event handler function to evaluate the inputs entered by the user and to call the action dispatcher needed to create a claim document in the Firebase API and to change the Redux store
    handleSubmit = (e) => {
        e.preventDefault();
        if(this.validate()){
            this.props.createClaim(this.state);
            alert('Your contact request is successfully registered')
            this.props.history.push('/');
        }
    }

    // Evaluate the inputs enetered by the user
    validate = () => {
        let errors = {};
        let isValid = true;

        if (!this.state.claim || (this.state.claim === 'Is this a claim ?')) {
            isValid = false;
            errors["claimerr"] = "Please enter the type of contact.";
        } else {errors["claimerr"] = ""}

        if (!this.state.invoiceId || (this.state.invoiceId === 'Choose the Service Center')) {
            isValid = false;
            errors["invoiceIderr"] = "Please select the company to claim according to the invoice ID.";
        } else {errors["invoiceIderr"] = ""}
    
        if (!this.state.title) {
            isValid = false;
            errors["titleerr"] = "Please enter the problem title.";
        } else {errors["titleerr"] = ""}
        if (!this.state.body) {
            isValid = false;
            errors["bodyerr"] = "Please enter the problem decription.";
        } else { errors["bodyerr"] = "" }

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

    // Render the class-based component to the DOM
    render(){
        const { auth, invoices, invoiceList } = this.props;
        
        // Redirect the user to the sign in page if it is not authenticated
        if (!auth.uid) return <Redirect to="/signin" />

        // Initialize the listener for the dropdown list
        window.$(document).ready(function () {
            window.$(".dropdown-button").dropdown();
        });

        // save a JSX snippet according to the claim proprety value in the state
        const content = (this.state.claim === 'yes') ? (
            <div>
                <br />
                
                <div className="invoice-list">
                    <ul id="invoiceId" className="dropdown-content">
                        {   
                            invoices && invoices.map((item) => {
                            const invoice = invoiceList[item];
                            return (   
                                    
                                <li key={item}>                                                       
                                    <a className="blue-text text-lighten-3" onClick={() => {this.handleClickSecond(item)}}>Company Name: { invoice.authorCompanyName }, INVOICE REGARDING SERVICE NUMBER: { invoice.service.serviceId }</a>                                                                                     
                                </li>
                                        
                            )
                        }) }
                    </ul>
                    <a className="btn dropdown-button #ef9a9a red lighten-3" id="botton" data-beloworigin="true" data-hover="true" data-activates="invoiceId" dropdown="true">{this.state.invoiceId}<i className="material-icons right">arrow_drop_down</i></a>
                    <div className="text-danger">{this.state.errors.invoiceIderr}</div>
                </div>

                <div className="input-field">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" onChange={this.handleChange}/>
                    <div className="text-danger">{this.state.errors.titleerr}</div>
                </div>
                <div className="input-field">
                    <label htmlFor="body">Message</label>
                    <textarea id="body" className="materialize-textarea" onChange={this.handleChange}></textarea>
                    <div className="text-danger">{this.state.errors.bodyerr}</div>
                </div>

            </div>
        ) : (
            <div>

                <div className="input-field">
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" onChange={this.handleChange}/>
                    <div className="text-danger">{this.state.errors.titleerr}</div>
                </div>
                <div className="input-field">
                    <label htmlFor="body">Message</label>
                    <textarea id="body" className="materialize-textarea" onChange={this.handleChange}></textarea>
                    <div className="text-danger">{this.state.errors.bodyerr}</div>
                </div>

            </div>
        )

        // JSX template to display the contact component in the browser
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Contact Us</h5>
                    <div className="claim-type">
                        <ul id="claim" className="dropdown-content">
                            <li><a id="yes" className="blue-text text-lighten-3" onClick={this.handleClick}>Yes</a></li>
                            <li><a id="no" className="blue-text text-lighten-3" onClick={this.handleClick}>No</a></li>
                        </ul>
                        <a className="btn dropdown-button #ef9a9a red lighten-3" data-beloworigin="true" data-hover="true" data-activates="claim" dropdown="true" name="">{this.state.claim}<i className="material-icons right">arrow_drop_down</i></a>
                        <div className="text-danger">{this.state.errors.claimerr}</div>
                    </div>
                    { content }
                    <div className="input-field">
                        <button className="btn light-blue lighten-3">Send</button>
                    </div>
                </form>
            </div>
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const id = state.firebase.auth.uid;
    const invoiceList = state.firestore.data.invoices; 
    const invoices = invoiceList ? Object.keys(invoiceList).filter(item => {
        return invoiceList[item].userId === id;
    }) : null;
    console.log(invoices)
    return {
        auth: state.firebase.auth,
        invoices: invoices,
        invoiceList: invoiceList
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and login the user
const mapDispatchToProps = (dispatch) => {
    return {
        createClaim: (claim) => {dispatch(createClaim(claim));}
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'invoices' }
    ])
)(Contact);
