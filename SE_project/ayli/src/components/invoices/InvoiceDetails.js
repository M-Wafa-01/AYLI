import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { NavLink} from 'react-router-dom';
import { confirmStatus } from '../../store/actions/proposalActions';
import { createRating } from '../../store/actions/proposalActions';
import { storage } from '../../config/fbConfig';
import moment from 'moment';
import ReactStars from "react-rating-stars-component";

var button1 = null;
var button11 = null;
var button2 = null;
var button11 = null;
var button33 = null;
var button22 = null;
var i = 0;
// class-based component to display the invoice details
class InvoiceDetails extends Component {
    state = {
        invoiceId: '',
        processing: '',
        done: '',
        rating: 0,
        invoiceComment: '',
        invoicePhotos: [
            { image: null, url: '' }
        ],
        invoice: null

    }

    // On click event handler function to confirm the satus 'ED is repaired' of the ED (by the SC) 
    handleClick1 = (e) => {
        this.state.processing = 'yes';
        this.setState({
            ...this.state
        })
        
        this.props.confirmStatus(this.state);
        this.props.history.push('/invoices');
    }

    // On click event handler function to confirm the satus 'ED is held by the EDU' of the ED (by the SC)  
    handleClick2 = (e) => {
        this.state.done = 'yes';
        if(!this.state.processing && this.state.done){
            
            this.state.done = '';
        }
        this.setState({
            ...this.state
        })
        
        this.props.confirmStatus(this.state);
        
        this.props.history.push('/invoices');
    }

    // On click event handler function to call the dispatcher action function to rate the company
    handleChange = (e) => {
        this.state.rating = e;
        console.log(this.state)
        this.props.createRating(this.state);

    }

    // On change event handler function to import images to the state
    handleChangeFile = (e) => {
    
        if(e.target.files[0]){
            var stateCopy = Object.assign({}, this.state);
            stateCopy.invoicePhotos = stateCopy.invoicePhotos.slice();
            stateCopy.invoicePhotos[i] = Object.assign({}, stateCopy.invoicePhotos[i]);
            stateCopy.invoicePhotos[i].image = e.target.files[0];
            this.setState(stateCopy);
      
            const image = stateCopy.invoicePhotos[i].image;
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
                    
                    stateCopy.invoicePhotos[i-1] = Object.assign({}, stateCopy.invoicePhotos[i-1]);
                    stateCopy.invoicePhotos[i-1].url = url;
                    this.setState(stateCopy);
                })
            });
            }      
        }
        i++;   
        }

    // React predefined Life cycle hook that executes when first the component is mounted to the DOM.
    // Set the state to the registered status of ED in the Firebase Cloud Firestore
    componentDidMount = () => {
        if(this.props.status){
            this.setState({
                invoiceId: this.props.idc,
                processing: this.props.status.processing,
                done: this.props.status.done
            })
        }
    }

    // React predefined Life cycle hook that executes when first the component will be unmounted tfrom the DOM.
    // Set the state to the registered status of ED in the Firebase Cloud Firestore
    componentWillUnmount = () => {
        if(this.props.status){
            this.setState({
                invoiceId: this.props.idc,
                processing: this.props.status.processing,
                done: this.props.status.done
            })
        }
    }

    // Render the component to the DOM
    render(){
        
        const { invoice, auth, idc, userType, rating_value } = this.props;
        if (!auth.uid) return <Redirect to="/signin" />
        
        if(this.props.idc){
            this.state.invoiceId = this.props.idc;
            this.state.invoice = this.props.invoice;
        }

        if(this.props.status){
            
            this.state.processing = this.props.status.processing;
            this.state.done = this.props.status.done;
            
        } else {
            if (userType === 'AYLI'){
                this.props.confirmStatus(this.state);
            }
        }

        // Save the JSX template depending on the user type to pay the invoice
        const method = (userType === 'Customer') ? (
            <div className="input-field buttons">
                <NavLink to={'/pay/' + idc}><button className="btn light-blue lighten-3 z-depth-0" id="confirm" type="submit" name="action">Pay<i className="material-icons right">payment</i></button></NavLink>
            </div>
        ) : null;

        // Save the JSX template depending on the user type to rate the SC
        const rating = (userType === 'Customer') ? (
            <div>
                <div className="input-field">
                    <h4>Rating: </h4>
                    <ReactStars count={5} value={rating_value} onChange={this.handleChange} size={24} activeColor="#ffd700" />
                </div>
                <div>
                    <h5 className="grey-text">Review</h5>
                    <div className="input-field col s12">
                        <label htmlFor="invoiceComment">Please comment the service quality</label>
                        <textarea id="invoiceComment" className="materialize-textarea" onChange={this.handleChange}></textarea>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <div className="file-field input-field multiImage-second">
                    <div className="btn #ef9a9a red lighten-3">
                        <span><i className="material-icons left">cloud_upload</i>File</span>
                        <input id="servicePhoto" type="file" multiple onChange={this.handleChangeFile} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
                    </div>
                    <ul className="list-inline imgList row">
                        { this.state.invoicePhotos && this.state.invoicePhotos.map((item) => {
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
            </div>
        ) : null; 

        
        if (!this.state.processing && this.state.done){
            
            this.state.done = '';
        }

        // Update the status of the ED depending on the status registered in the databse server
        
        if (!this.state.processing){
            button1 = <a className="waves-effect waves-light btn-large col s2 push-s1 #ef9a9a red lighten-3"id="processing" type="submit" name="action" onClick={this.handleClick1}>In process</a>
            button11 = <a className="btn-large disabled col s2 push-s1">In process</a>
        }
        if (!this.state.done){
            button2 = <a className="waves-effect waves-light btn-large col s4 push-s2 #ef9a9a red lighten-3" id="done" type="submit" name="action" onClick={this.handleClick2}>We are waiting for you!</a>
            button22 = <a className="btn-large disabled col s4 push-s2">We are waiting for you!</a>
        }
        if (this.state.processing){
            button1 = <a className="btn-large disabled col s2 push-s1">In process</a>
            button11 = <a className="waves-effect waves-light btn-large col s2 push-s1 #ef9a9a red lighten-3">In process</a>
        }
        if(this.state.done){
            button2 = <a className="btn-large disabled col s4 push-s2">We are waiting for you!</a>
            button22 = <a className="waves-effect waves-light btn-large col s4 push-s2 pulse #ef9a9a red lighten-3">We are waiting for you!</a>
        }

        if ((!this.state.processing) && (!this.state.done)) {
            button33 = <a className="waves-effect waves-light btn-large col s2 pulse #ef9a9a red lighten-3">Accepted</a>
        } else {
            button33 = <a className="waves-effect waves-light btn-large col s2 #ef9a9a red lighten-3">Accepted</a>
        }
        
        if (this.state.processing && !this.state.done){
            button1 = <a class="btn-large disabled col s2 push-s1">In process</a>
            button11 = <a class="waves-effect waves-light btn-large col s2 push-s1 pulse #ef9a9a red lighten-3">In process</a>
        } else if (this.state.processing && this.state.done){
            button1 = <a class="btn-large disabled col s2 push-s1">In process</a>
            button11 = <a class="waves-effect waves-light btn-large col s2 push-s1 #ef9a9a red lighten-3">In process</a>
            button2 = <a class="btn-large disabled col s4 push-s2">We are waiting for you!</a>
            button22 = <a class="waves-effect waves-light btn-large col s4 push-s2 pulse #ef9a9a red lighten-3">We are waiting for you!</a>
            
        }

        

        const status = (userType === 'AYLI') ? (
            <div className="hey">
                <h3>Proposal Status:</h3>
                <br />
                <div className="track row">
                    <a className="btn-large disabled col s2">Accepted</a>
                    { button1 }
                    { button2 }
                </div>
            </div>
        ) : (
            <div className="row">
                <h3>Proposal Status:</h3>
                <br />
                <div className="track row">
                    { button33 }
                    { button11 }
                    { button22 }
                </div>
            </div>
        );
 
        
        // JSX template to display the invoice details based on the payment property value
        if (invoice) {
            const offer1 = (invoice.nOffers === 'one offer') ? (
                <p>Cost of Offer 1: { invoice.cost1 }</p>
            ): null;
            const offer2 = (invoice.nOffers === 'two offers') ? (
                <div>
                <p>Cost of Offer 1: { invoice.cost1 }</p>
                <p>Cost of Offer 2: { invoice.cost2 }</p>
                </div>
            ): null;
            const offer3 = (invoice.nOffers === 'three offers') ? (
                <div>
                <p>Cost of Offer 1: { invoice.cost1 }</p>
                <p>Cost of Offer 2: { invoice.cost2 }</p>
                <p>Cost of Offer 3: { invoice.cost3 }</p>
                </div>
            ): null;
            //console.log(invoice)
            if (invoice.payment === 'NOT YET'){      
            return (
                <div className="container section invoice-details">
                    <div className="card z-depth-0">
                        <div className="card-content">
                            <span className="card-title">INVOICE REGARDING SERVICE NUMBER: { invoice.id }</span>
                            <p>Company Name: { invoice.authorCompanyName }</p>
                            <p>Company ID: { invoice.authorCompanyId }</p>
                            <p>Company TAX ID: { invoice.companyTaxId }</p>
                            <p>Company EMAIL: { invoice.companyEmail }</p>
                            <p>Offer Description: { invoice.offerDescription }</p>
                            <p>Offers Number: { invoice.nOffers }</p>
                            { offer1 }
                            { offer2 }
                            { offer3 }
                            <p>User First & Last Name: { invoice.authorFirstName } { invoice.authorLastName }</p>
                            <p>User ID: { invoice.userId }</p>
                            <p>User Email Address: { invoice.userEmail }</p>
                        </div>
                        <div className="card-action grey lighten-4 grey-text">
                            <div>Invoice ID: { idc[0] }</div>
                            <div>{moment(invoice.invoiceCreatedAt.toDate()).calendar()}</div>
                        </div>
                        <br/>
                        <div className="row">
                            { method }
                            { rating }
                        </div>
                        <br/>
                        
                        { status }
                        
                    </div>
                </div>
            )
            } else if (invoice.payment === 'PENDING'){ 
                return (
                    <div className="container section invoice-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">INVOICE REGARDING SERVICE NUMBER: { invoice.id }</span>
                                <p>Company Name: { invoice.authorCompanyName }</p>
                                <p>Company ID: { invoice.authorCompanyId }</p>
                                <p>Company TAX ID: { invoice.companyTaxId }</p>
                                <p>Company EMAIL: { invoice.companyEmail }</p>
                                <p>Offer Description: { invoice.offerDescription }</p>
                                <p>Offers Number: { invoice.nOffers }</p>
                                { offer1 }
                                { offer2 }
                                { offer3 }
                                <p>User First & Last Name: { invoice.authorFirstName } { invoice.authorLastName }</p>
                                <p>User ID: { invoice.userId }</p>
                                <p>User Email Address: { invoice.userEmail }</p>
                            </div>
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Invoice ID: { idc[0] }</div>
                                <div>{moment(invoice.invoiceCreatedAt.toDate()).calendar()}</div>
                            </div>
                            <br/>
                            <div className="row">
                                <div className=" look input-field buttons">
                                    <button className="btn disabled">Pending<i className="material-icons right">access_time</i></button>                            
                                </div>
                                { rating }
                            </div>
                            
                            <br/>
                            
                            { status }
                            
                        </div>
                    </div>
                )
            } else if (invoice.payment === 'PROCEEDED'){
                return (
                    <div className="container section invoice-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">INVOICE REGARDING SERVICE NUMBER: { invoice.id }</span>
                                <p>Company Name: { invoice.authorCompanyName }</p>
                                <p>Company ID: { invoice.authorCompanyId }</p>
                                <p>Company TAX ID: { invoice.companyTaxId }</p>
                                <p>Company EMAIL: { invoice.companyEmail }</p>
                                <p>Offer Description: { invoice.offerDescription }</p>
                                <p>Offers Number: { invoice.nOffers }</p>
                                { offer1 }
                                { offer2 }
                                { offer3 }
                                <p>User First & Last Name: { invoice.authorFirstName } { invoice.authorLastName }</p>
                                <p>User ID: { invoice.userId }</p>
                                <p>User Email Address: { invoice.userEmail }</p>
                            </div>
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Invoice ID: { idc[0] }</div>
                                <div>{moment(invoice.invoiceCreatedAt.toDate()).calendar()}</div>
                            </div>
                            <div className="row">
                            <div className="input-field buttons">
                            <button className="btn disabled">Proceeded<i className="material-icons right">check</i></button>                            
                            </div>
                                { rating }
                            </div>
                            
                            <br/>
                            
                            { status }
                            
                        </div>
                    </div>
                )
            } else {
                return (
                    <div className="container center">
                        <p>Problem is detected in the payment status! Please contact the administrator using the CONTACT section.</p>
                    </div>
                )
            }
        } else {
            return (
                <div className="container center">
                    <p>Loading Invoice...</p>
                </div>
            )
        }
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const userType = state.firebase.profile.userType;
    const invoices = state.firestore.data.invoices;
    const users = state.firestore.data.users;
    const services = state.firestore.data.serviceStatus;
    
    const invoiceId = invoices ? Object.keys(invoices).filter(item => {
        return item === id
    }) : null;

    if(invoiceId){
        var iden = invoiceId[0]
    }
    
    const invoice = invoiceId ? invoices[invoiceId[0]] : null; 
    if (invoice){
        const status = services ? Object.keys(services).filter(item => {
            return item === id
        }) : null;
        if (status){
            var etat = services[status[0]];
            //console.log(etat)
        }  
    } 
    console.log(invoice);
    console.log(users);
    const user = invoice ? Object.keys(users).filter(item => {
        return item === invoice.authorCompanyId
    }) : null;

    console.log(user);
    var rating = users[user].rating;
    console.log(rating);

    return {
        invoice: invoice, 
        auth: state.firebase.auth,
        idc: iden,
        rating_value: rating,
        userType: userType,
        status: etat
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and update the ED status and rate the SC
const mapDispatchToProps = (dispatch) => {
    return {
        confirmStatus: (status) => {dispatch(confirmStatus(status))},
        createRating: (status) => {dispatch(createRating(status))}
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'invoices' },
        { collection: 'users' },
        { collection: 'serviceStatus' }
    ])
)(InvoiceDetails);
