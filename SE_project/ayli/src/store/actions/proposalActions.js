// Dispatcher action function that creates a proposal of the SCO and save its fields in the Firebase Cloud Firestore 
export const createProposal = (proposal) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorCompanyId = getState().firebase.auth.uid;
        const photos = proposal.proposalPhotos ? proposal.proposalPhotos.map(item => {
            return item.url
        }) : null;
        firestore.collection('proposals').add({
            userEmail: proposal.userEmail,
            offerDescription: proposal.offerDescription,
            proposalPhotos: photos,
            nOffers: proposal.nOffers,
            cost1: proposal.cost1,
            cost2: proposal.cost2,
            cost3: proposal.cost3,
            userId: proposal.userId,
            decision: proposal.decision,
            service: proposal.service,
            companyTaxId: profile.taxId,
            authorCompanyName: profile.companyName,
            companyEmail: profile.email,
            authorCompanyId: authorCompanyId,
            proposalCreatedAt: new Date()
        }).then(() => {
            dispatch({type: 'CREATE_PROPOSAL', proposal: proposal});
        }).catch((err) => {
            dispatch({type: 'CREATE_PROPOSAL_ERROR', err: err});
        })
        
    }
};

// Dispatcher action function that creates a claim of the SCO and save its fields in the Firebase Cloud Firestore 
export const createClaim = (claim) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        firestore.collection('claims').add({
            ...claim,
            userFirstName: profile.firstName,
            userLastName: profile.lastName,
            userEmail: profile.email,
            userId: authorId,
            claimCreatedAt: new Date()
        }).then(() => {
            dispatch({type: 'CREATE_CLAIM', claim: claim});
        }).catch((err) => {
            dispatch({type: 'CREATE_CLAIM_ERROR', err: err});
        })
        
    }
};

// Dispatcher action function that creates a payment of the EDU and save its fields in the Firebase Cloud Firestore, create a confirmation message to the EDU, creates a confirmation message to the EDU or a message to the delivery company depending on if the EDU choosed the delivery option or not 
export const createCard = (card) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        const id = card.invoiceId;
        console.log(id)
        const invoice = card.invoice;
        firestore.collection('invoices').doc(id).set({
            userEmail: invoice.userEmail,
            service: invoice.service,
            companyTaxId: invoice.companyTaxId,
            offerDescription: invoice.offerDescription,
            proposalPhotos: invoice.proposalPhotos,
            nOffers: invoice.nOffers,
            cost1: invoice.cost1,
            cost2: invoice.cost2,
            cost3: invoice.cost3,
            userId: invoice.userId,
            decision: invoice.decision,
            authorCompanyName: invoice.authorCompanyName,
            companyEmail: invoice.companyEmail,
            authorCompanyId: invoice.authorCompanyId,
            proposalCreatedAt: invoice.proposalCreatedAt,
            payment: 'PENDING',
            proposalId: invoice.proposalId,
            authorFirstName: invoice.authorFirstName,
            authorLastName: invoice.authorLastName,
            invoiceCreatedAt: invoice.invoiceCreatedAt
        }).then(() => {
            dispatch({type: 'MODIFY_INVOICE', invoice: invoice});
        }).catch((err) => {
            dispatch({type: 'MODIFY_INVOICE_ERROR', err: err});
        })
        firestore.collection('repmessages').add({
            title: 'Your payment is confirmed',
            content: 'We are glad to confirm your payment registration. The payment will be proceeded after 24 hours from your device reception and in case of no claims.',
            companyEmail: invoice.companyEmail,
            userEmail: invoice.userEmail,
            userFirstName: profile.firstName,
            userLastName: profile.lastName,
            authorCompanyName: invoice.authorCompanyName,
            authorId: invoice.authorCompanyId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'REPLY_MESSAGE', invoice: invoice });
        }).catch((err) => {
            dispatch({type: 'REPLY_MESSAGE_ERROR', err});
        });  
        firestore.collection('cards').add({
            cardNumber: card.number,
            cardOwnerName: card.name,
            cardExpiryDate: card.expiry,
            cardCvcCode: card.cvc,
            invoiceId: card.invoiceId,
            service: invoice.service,
            companyId: card.companyId,
            userFirstName: profile.firstName,
            userLastName: profile.lastName,
            userEmail: profile.email,
            userId: authorId,
            cardCreatedAt: new Date()
        }).then(() => {
            dispatch({type: 'CREATE_CARD', card: card});
        }).catch((err) => {
            dispatch({type: 'CREATE_CARD_ERROR', err: err});
        })
        
    }
};

// Dispatcher action function that creates an invoice and save its fields in the Firebase Cloud Firestore 
export const generateInvoice = (invoice) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        firestore.collection('invoices').add({
            ...invoice,
            service: invoice.service,
            payment: 'NOT YET',
            authorFirstName: profile.firstName,
            authorLastName: profile.lastName,
            invoiceCreatedAt: new Date()
        }).then(() => {
            dispatch({type: 'GENERATE_INVOICE', invoice: invoice});
        }).catch((err) => {
            dispatch({type: 'GENERATE_INVOICE_ERROR', err: err});
        })        
    }
};

// Dispatcher action function that updates the status of the device and save its fields in the Firebase Cloud Firestore 
export const confirmStatus = (status) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorCompanyId = getState().firebase.auth.uid;
        const id = status.invoiceId;
        firestore.collection('serviceStatus').doc(id).set({
            ...status,
            authorCompanyName: profile.companyName,
            authorCompanyId: authorCompanyId,
            createdAt: new Date()
        }).then(() => {
            dispatch({type: 'CREATE_STATUS', status: status});
        }).catch((err) => {
            dispatch({type: 'CREATE_STATUS_ERROR', err: err});
        })       
    }
};

// Dispatcher action function that rates the SCO and save its fields in the Firebase Cloud Firestore 
export const createRating = (status) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorCompanyId = getState().firebase.auth.uid;
        const id = status.invoiceId;
        const company = status.invoice.service.companyId[0];
        console.log(company.id)
        firestore.collection('users').doc(company.id).set({
            address: company.address,
            adminDecision: company.adminDecision,
            companyName: company.companyName,
            duration: company.duration,
            email: company.email,
            initials: company.initials,
            serviceHotel: company.serviceHotel,
            serviceHostel: company.serviceHostel,
            serviceRestaurant: company.serviceRestaurant,
            serviceEntertainment: company.serviceEntertainment,
            openingTime: company.openingTime,
            closingTime: company.closingTime,
            minHotelRoom: company.minHotelRoom,
            maxHotelRoom: company.maxHotelRoom,
            minHostelRoom: company.minHostelRoom,
            maxHostelRoom: company.maxHostelRoom,
            minMeal: company.minMeal,
            maxMeal: company.maxMeal,
            minService: company.minService,
            maxService: company.maxService,
            minPrice: company.minPrice,
            maxPrice: company.maxPrice,
            couplesLevel: company.couplesLevel,
            familyLevel: company.familyLevel,
            customerRange: company.customerRange,
            placeStyle: company.placeStyle,
            seaView: company.seaView,
            phone: company.phone,
            rating: status.rating,
            responseTime: company.responseTime,
            taxId: company.taxId,
            time: company.time,
            userType: company.userType,
            modifiedAt: new Date()
        }).then(() => {
            dispatch({type: 'CREATE_RATING', status: status});
        }).catch((err) => {
            dispatch({type: 'CREATE_RATING_ERROR', err: err});
        })       
    }
};

// Dispatcher action function that confirms a proposal of the SCO, update and save its fields in the Firebase Cloud Firestore 
export const confirmProposal = (proposal) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const id = proposal.proposalId;
        const authorId = getState().firebase.auth.uid;
        firestore.collection('messages').add({
            title: 'Your Proposal is confirmed',
            content: 'We are glad to inform you that that your proposal is accepted.',
            companyEmail: proposal.companyEmail,
            userEmail: profile.email,
            authorFirstName: profile.firstName,
            authorLastName: profile.lastName,
            authorCompanyName: proposal.authorCompanyName,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'CREATE_MESSAGE', proposal: proposal });
        }).catch((err) => {
            dispatch({type: 'CREATE_MESSAGE_ERROR', err});
        }); 
        firestore.collection('proposals').doc(id).set({
            userEmail: proposal.userEmail,
            service: proposal.service,
            companyTaxId: proposal.companyTaxId,
            offerDescription: proposal.offerDescription,
            proposalPhotos: proposal.proposalPhotos,
            nOffers: proposal.nOffers,
            cost1: proposal.cost1,
            cost2: proposal.cost2,
            cost3: proposal.cost3,
            userId: proposal.userId,
            decision: 'confirmed',
            authorCompanyName: proposal.authorCompanyName,
            companyEmail: proposal.companyEmail,
            authorCompanyId: proposal.authorCompanyId,
            proposalCreatedAt: proposal.proposalCreatedAt
        }).then(() => {
            dispatch({type: 'MODIFY_PROPOSAL', proposal: proposal});
        }).catch((err) => {
            dispatch({type: 'MODIFY_PROPOSAL_ERROR', err: err});
        })
        firestore.collection('confirmedProposals').add({
            ...proposal,
            authorFirstName: profile.firstName,
            authorLastName: profile.lastName,
            createdAt: new Date()
        }).then(() => {
            console.log(proposal);
            dispatch({type: 'CONFIRM_PROPOSAL', proposal: proposal});
        }).catch((err) => {
            console.log(proposal);
            dispatch({type: 'CONFIRM_PROPOSAL_ERROR', err: err});
        })        
    }
};

// Dispatcher action function that rejects a proposal of the SCO, update and save its fields in the Firebase Cloud Firestore 
export const rejectProposal = (proposal) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const id = proposal.proposalId;
        const authorId = getState().firebase.auth.uid;
        firestore.collection('messages').add({
            title: 'Your Proposal is rejected',
            content: 'We are sorry to inform you that that your proposal is rejected.',
            companyEmail: proposal.companyEmail,
            userEmail: profile.email,
            authorFirstName: profile.firstName,
            authorLastName: profile.lastName,
            authorCompanyName: proposal.authorCompanyName,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'CREATE_MESSAGE', proposal: proposal });
        }).catch((err) => {
            dispatch({type: 'CREATE_MESSAGE_ERROR', err});
        }); 
        firestore.collection('proposals').doc(id).set({
            userEmail: proposal.userEmail,
            companyTaxId: proposal.companyTaxId,
            service: proposal.service,
            offerDescription: proposal.offerDescription,
            proposalPhotos: proposal.proposalPhotos,
            nOffers: proposal.nOffers,
            cost1: proposal.cost1,
            cost2: proposal.cost2,
            cost3: proposal.cost3,
            userId: proposal.userId,
            decision: proposal.decision,
            authorCompanyName: proposal.authorCompanyName,
            companyEmail: proposal.companyEmail,
            authorCompanyId: proposal.authorCompanyId,
            proposalCreatedAt: proposal.proposalCreatedAt
        }).then(() => {
            dispatch({type: 'MODIFY_PROPOSAL', proposal: proposal});
        }).catch((err) => {
            dispatch({type: 'MODIFY_PROPOSAL_ERROR', err: err});
        })
        firestore.collection('rejectedProposals').add({
            ...proposal,
            authorFirstName: profile.firstName,
            authorLastName: profile.lastName,
            createdAt: new Date()
        }).then(() => {
            dispatch({type: 'REJECT_PROPOSAL', proposal: proposal});
        }).catch((err) => {
            dispatch({type: 'REJECT_PROPOSAL_ERROR', err: err});
        })        
    }
};