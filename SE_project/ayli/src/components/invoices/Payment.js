import React, { Component } from 'react';
import Cards from 'react-credit-cards';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { createCard } from '../../store/actions/proposalActions';
import { Redirect } from 'react-router-dom';
import 'react-credit-cards/es/styles-compiled.css';

var month;
var year;

// class-based component to diplay the payment form 
class Payment extends Component {
    state = {
        cvc: '',
        expiry: '',
        focus: '',
        name: '',
        number: '',
        invoiceId: '',
        companyId: '',
        invoice: null,
        errors: {}
    };

    // Event handler function to set the focus property in the state
    handleInputFocus = (e) => {
        this.setState({ focus: e.target.name });
    }

    // Event handler function to set the expiry date property in the state
    handleDate = (e) => {
        const { name, value } = e.target;
        month = new Date(value).getMonth() + 1;
        
        year = new Date(value).getFullYear();
        console.log(month)
        console.log(year)
        if (month < 10){
            var nn = '0' + month.toString() + year.toString();
        } else {
            var nn = month.toString() + year.toString();
        }
        console.log(nn)
        this.setState({ expiry: nn});
    }

    // On change event handler function to set the rest of the credit card properties in the state
    handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log (e.target.value)
        this.setState({ [name]: value });
    }

    // On submit event handler function to call the dispatcher action function to add the payment to the Firebase Firestore and to redirect the user to the home page
    handleSubmit = (e) => {
        e.preventDefault();
        
        if(this.validate()){
        this.props.createCard(this.state);
        alert('Your payment is proceeded successfully');
        this.props.history.push('/');
        }
    }

    // On key press event handler function to allow only numeric characters(only numbers)
    onKeyPress(event) {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        if (/\+|-/.test(keyValue))
        event.preventDefault();
    }

    // Function to evaluate the form inputs
    validate = () => {
        let errors = {};
        let isValid = true;
        if (!this.state.name) {
            isValid = false;
            errors["nameerr"] = "Please type your full name.";
        } else {errors["nameerr"] = ""}

        if (!this.state.number) {
        isValid = false;
        errors["numbererr"] = "Please enter the card number.";
        } else {errors["numbererr"] = ""}

        if (this.state.number.length > 19) {
            isValid = false;
            errors["numbererr"] = "Please enter a valid card number.";
            } else {errors["numbererr"] = ""}

        if (!this.state.expiry) {
            isValid = false;
            errors["expiryerr"] = "Please select your card expiry date.";
        } else { errors["expiryerr"] = "" }

        var dateN = new Date();
        var monthN = dateN.getMonth() + 1;
        var yearN = dateN.getFullYear();
        var betweenMonths = month - monthN;
        var betweenYears = year - yearN;
        
        if (((betweenYears < 5) && (betweenYears > 0)) || ((betweenYears === 5) && (betweenMonths < 0))){
            errors["expiryerr"] = ""
        } else {
            isValid = false;
            errors["expiryerr"] = "Please enter valid credit card.";
        }

        if (!this.state.cvc) {
            isValid = false;
            errors["cvcerr"] = "Please enter the card cvc";
        } else {errors["cvcerr"] = ""}

        if(this.state.cvc.length > 3){
            isValid = false;
            errors["cvcerr"] = "Please enter a valid cvc code";
        } else {errors["cvcerr"] = ""}


        this.setState({
            errors: errors
        });

        return isValid;
    }
  
    // Render the component to the DOM
    render() {
        const { auth} = this.props;
            if (!auth.uid) return <Redirect to="/signin" />
            this.state.invoiceId = this.props.invoiceId;
            this.state.companyId = this.props.companyId;
            this.state.invoice = this.props.invoice;
        return (
        <div id="PaymentForm" className="row">
            <br/>
            <br/>
            <Cards className="choose col s12 m6"
            cvc={this.state.cvc}
            expiry={this.state.expiry}
            focused={this.state.focus}
            name={this.state.name}
            number={this.state.number}
            />
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                <div className="input-field">
                        <input type="text" name="name" placeholder="Owner Full Name" onChange={this.handleInputChange} onFocus={this.handleInputFocus} />  
                        <div className="text-danger">{this.state.errors.nameerr}</div>
                    </div>
                    <div className="input-field">
                        <input type="number" name="number" onKeyPress={this.onKeyPress} className="validate" placeholder="Card Number" onChange={this.handleInputChange} onFocus={this.handleInputFocus} />
                        <div className="text-danger">{this.state.errors.numbererr}</div>
                    </div>
                    <div className="input-field">
                        <input type="month" name="expiry" placeholder="Expiry Date" min="2018-01" max="2018-12-31" onChange={this.handleDate} onFocus={this.handleInputFocus} /> 
                        <div className="text-danger">{this.state.errors.expiryerr}</div> 
                    </div>
                    <div className="input-field">
                        <input type="number" name="cvc" onKeyPress={this.onKeyPress} max="999" className="validate" placeholder="CVC" onChange={this.handleInputChange} onFocus={this.handleInputFocus} />  
                        <div className="text-danger">{this.state.errors.cvcerr}</div>
                    </div>
                    <div className="input-field create">
                        <button className="btn light-blue lighten-3 z-depth-0">PAY</button>
                    </div>
                </form>
            </div>
        </div>
        );
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state, ownProps) => {
        const idc = ownProps.match.params.id;
        const invoices = state.firestore.data.invoices;
        const invoiceIdc = invoices ? Object.keys(invoices).filter(item => {
            return item === idc
        }) : null;
    
        const invoiceId = invoiceIdc ? invoiceIdc[0] : null;
        const invoice = invoiceId ? invoices[invoiceId]: null;
        console.log(invoice);
        const companyId = invoiceId ? invoices[invoiceId].authorCompanyId : null;
        if (invoice){
            console.log(invoice.service.companyId[0].address)
        }
        console.log(invoices)
        console.log(invoiceIdc)
        return {
            auth: state.firebase.auth,
            invoiceId: invoiceId,
            companyId: companyId,
            invoice: invoice
        }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and register the payment in the Firebase Firestore
const mapDispatchToProps = (dispatch) => {
    return {
        createCard: (card) => {dispatch(createCard(card));}
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'invoices' },
        { collection: 'services' }
    ])
)(Payment);