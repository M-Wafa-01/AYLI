import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { confirmProposal } from '../../store/actions/proposalActions';
import { rejectProposal } from '../../store/actions/proposalActions';
import { generateInvoice } from '../../store/actions/proposalActions';
import moment from 'moment';

// Class-based component to display the message details depending on the user type of the current signed in user
class ProposalDetails extends Component {
    
    state = {
        ...this.props.proposal,
        proposalId: ''
    }

    // On click event handler function to call the dispatcher action function to confirm a proposal and generate an invoice depending on the EDU decision regarding the proposal
    handleClick = (e) => {
        e.preventDefault();
        if(e.target.id === 'confirm'){
            this.state.decision = 'confirmed';
            this.state.proposalId = this.props.id;
            this.state.userEmail = this.props.proposal.userEmail;
            this.state.service = this.props.proposal.service;
            this.state.companyTaxId = this.props.proposal.companyTaxId;
            this.state.offerDescription = this.props.proposal.offerDescription;
            this.state.nOffers = this.props.proposal.nOffers;
            this.state.cost1 = this.props.proposal.cost1;
            this.state.cost2 = this.props.proposal.cost2;
            this.state.cost3 = this.props.proposal.cost3;
            this.state.userId = this.props.proposal.userId;
            this.state.authorCompanyName = this.props.proposal.authorCompanyName;
            this.state.companyEmail = this.props.proposal.companyEmail;
            this.state.authorCompanyId = this.props.proposal.authorCompanyId;
            this.state.proposalCreatedAt = this.props.proposal.proposalCreatedAt;
            this.props.confirmProposal(this.state);
            alert('The proposal is confirmed successfully');
            this.props.generateInvoice(this.state);
            this.props.history.push('/proposalList');
        } else if(e.target.id === 'reject'){
            this.state.decision = 'rejected';
            this.state.proposalId = this.props.id;
            this.state.userEmail = this.props.proposal.userEmail;
            this.state.service = this.props.proposal.service;
            this.state.companyTaxId = this.props.proposal.companyTaxId;
            this.state.offerDescription = this.props.proposal.offerDescription;
            this.state.nOffers = this.props.proposal.nOffers;
            this.state.cost1 = this.props.proposal.cost1;
            this.state.cost2 = this.props.proposal.cost2;
            this.state.cost3 = this.props.proposal.cost3;
            this.state.userId = this.props.proposal.userId;
            this.state.authorCompanyName = this.props.proposal.authorCompanyName;
            this.state.companyEmail = this.props.proposal.companyEmail;
            this.state.authorCompanyId = this.props.proposal.authorCompanyId;
            this.state.proposalCreatedAt = this.props.proposal.proposalCreatedAt;
            this.props.rejectProposal(this.state);
            alert('The proposal is rejected successfully');
            this.props.history.push('/proposalList');
        }
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
        const { proposal, auth, id } = this.props;

        window.$(document).ready(function(){
            window.$('.carousel').carousel();
        });
        console.log(proposal);
        if (!auth.uid) return <Redirect to="/signin" />
        
        

        if (proposal) {
            const offer1 = (proposal.nOffers === 'one offer') ? (
                <p>Cost of Offer 1: { proposal.cost1 } EUR</p>
            ): null;
            const offer2 = (proposal.nOffers === 'two offers') ? (
                <div>
                <p>Cost of Offer 1: { proposal.cost1 } EUR</p>
                <p>Cost of Offer 2: { proposal.cost2 } EUR</p>
                </div>
            ): null;
            const offer3 = (proposal.nOffers === 'three offers') ? (
                <div>
                <p>Cost of Offer 1: { proposal.cost1 } EUR</p>
                <p>Cost of Offer 2: { proposal.cost2 } EUR</p>
                <p>Cost of Offer 3: { proposal.cost3 } EUR</p>
                </div>
            ): null;

            const contenu = (proposal.proposalPhotos) ? (
                <div className="carousel">
                    { proposal.proposalPhotos && proposal.proposalPhotos.map((item) => {
                        console.log(item); 
                        return (   
                                    
                            <a className="carousel-item " key={item.toString()}><img className="materialboxed thumbnail responsive-img" width="650" src={item} /></a>                                                   
                                
                        )
                        }) 
                    }
                </div>
            ) : null;


            if(!proposal.decision){
                return (
                    <div className="container section service-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">Proposal: { id }</span>
                                <p>Offer Description: { proposal.offerDescription }</p>
                                <p>Offers Number: { proposal.nOffers }</p>
                                { offer1 }
                                { offer2 }
                                { offer3 }
                            </div>
                            { contenu }
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Created by {proposal.authorCompanyName}</div>
                                <div>{moment(proposal.proposalCreatedAt.toDate()).calendar()}</div>
                            </div>
                            <div className="input-field buttons">
                                <button className="btn green lighten-1 z-depth-0" id="confirm" type="submit" name="action" onClick={this.handleClick}>Confirm<i className="material-icons right">check</i></button>
                                <button className="btn red lighten-1 z-depth-0 right" id="reject" type="submit" name="action" onClick={this.handleClick}>Reject<i className="material-icons right">not_interested</i></button>
                            </div>
                        </div>
                    </div>
                )
            } else if(proposal.decision === 'confirmed'){
                return (
                    <div className="container section proposal-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">Proposal: { id }</span>
                                <p>Offer Description: { proposal.offerDescription }</p>
                                <p>Offers Number: { proposal.nOffers }</p>
                                { offer1 }
                                { offer2 }
                                { offer3 }
                            </div>
                            { contenu }
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Created by {proposal.authorCompanyName}</div>
                                <div>{moment(proposal.proposalCreatedAt.toDate()).calendar()}</div>
                            </div>
                            <div className="input-field buttons">
                                <button className="btn disabled">Confirmed<i className="material-icons right">check</i></button>
                            </div>
                        </div>
                    </div>
                )
            } else if(proposal.decision === 'rejected'){
                return (
                    <div className="container section proposal-details">
                        <div className="card z-depth-0">
                            <div className="card-content">
                                <span className="card-title">Proposal: { id }</span>
                                <p>Offer Description: { proposal.offerDescription }</p>
                                <p>Offers Number: { proposal.nOffers }</p>
                                { offer1 }
                                { offer2 }
                                { offer3 }
                            </div>
                            { contenu }
                            <div className="card-action grey lighten-4 grey-text">
                                <div>Created by {proposal.authorCompanyName}</div>
                                <div>{moment(proposal.proposalCreatedAt.toDate()).calendar()}</div>
                            </div>
                            <div className="input-field buttons">
                                <button className="btn disabled">Rejected<i className="material-icons right">not_interested</i></button>
                            </div>
                        </div>
                    </div>
                )
            }
        } else {
            return (
                <div className="container center">
                    <p>Loading Proposal...</p>
                </div>
            )
        }
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state, ownProps) => {
    const iden = ownProps.match.params.id;
    const proposals = state.firestore.data.proposals;
    const proposal = proposals ? proposals[iden] : null;
    return {
        proposal: proposal,
        auth: state.firebase.auth,
        id: iden
    }
}

// map the action dispatcher functions needed to the prop to use it in order to change the redux store state and register the confirmed service, rejected service and gnerated invoice in the Firebase Firestore
const mapDispatchToProps = (dispatch) => {
    return {
        confirmProposal: (proposal) => {dispatch(confirmProposal(proposal))},
        rejectProposal: (proposal) => {dispatch(rejectProposal(proposal))},
        generateInvoice: (invoice) => {dispatch(generateInvoice(invoice))}
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'proposals', orderBy: ['proposalCreatedAt', 'desc'] }      
    ])
)(ProposalDetails);