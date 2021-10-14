
const initState = {
    proposals: [
        {id: '1', title: 'help me find peach', content: 'blah blah blah'},
        {id: '2', title: 'collect all the stars', content: 'blah blah blah'},
        {id: '3', title: 'egg hunt with yoshi', content: 'blah blah blah'}
    ]
}

// Evaluate the actions sent by the proposals action dispatcher functions
const proposalReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CREATE_PROPOSAL': 
            console.log('proposal request created', action.proposal);
            return state;
        case 'CREATE_PROPOSAL_ERROR':
            console.log('create proposal error', action.err);
            return state;
        case 'CREATE_CLAIM': 
            console.log('claim created', action.proposal);
            return state;
        case 'CREATE_CLAIM_ERROR':
            console.log('create claim error', action.err);
            return state;
        case 'CREATE_CARD': 
            console.log('card created', action.card);
            return state;
        case 'CREATE_CARD_ERROR':
            console.log('create card error', action.err);
            return state;
        case 'CREATE_STATUS': 
            console.log('status created', action.status);
            return state;
        case 'CREATE_STATUS_ERROR':
            console.log('create status error', action.err);
            return state;
        case 'CREATE_RATING': 
            console.log('rating created', action.status);
            return state;
        case 'CREATE_RATING_ERROR':
            console.log('create rating error', action.err);
            return state;
        case 'GENERATE_INVOICE': 
            console.log('generate invoice created', action.proposal);
            return state;
        case 'GENERATE_INVOICE_ERROR':
            console.log('generate invoice error', action.err);
            return state;
        case 'CONFIRM_PROPOSAL': 
            console.log('confirm proposal created', action.proposal);
            return state;
        case 'CONFIRM_PROPOSAL_ERROR':
            console.log('confirm proposal error', action.err);
            return state;
        case 'MODIFY_INVOICE': 
            console.log('modify invoice created', action.invoice);
            return state;
        case 'MODIFY_INVOICE_ERROR':
            console.log('modify invoice error', action.err);
            return state;
        case 'MODIFY_PROPOSAL': 
            console.log('modify proposal created', action.proposal);
            return state;
        case 'MODIFY_PROPOSAL_ERROR':
            console.log('modify proposal error', action.err);
            return state;
        case 'REJECT_PROPOSAL': 
            console.log('reject proposal created', action.proposal);
            return state;
        case 'REJECT_PROPOSAL_ERROR':
            console.log('reject proposal error', action.err);
            return state;
        default:
            return state;
    }
}

export default proposalReducer;