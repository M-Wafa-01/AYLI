import React from 'react';
import ProposalSummary from './ProposalSummary';
import { Link } from 'react-router-dom';

// Functional component to add a link to each proposal and pass the proposal as props to the ProposalSummary component
const ProposalList = ({proposals}) => {
    return(
        <div className="service-list section">
            { proposals && proposals.map(proposal => {
                return(
                    <Link to={'/proposal/' + proposal.id} key={proposal.id}>
                        <ProposalSummary proposal={proposal} />
                    </Link>
                )
            }) }
        </div>
    )
}

export default ProposalList;

