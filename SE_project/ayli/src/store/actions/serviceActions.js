// Dispatcher action function that creates a service of the EDU and save its fields in the Firebase Cloud Firestore
export const createService = (service) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        firestore.collection('services').add({
            serviceHotel: service.serviceHotel,
            serviceHostel: service.serviceHostel,
            serviceRestaurant: service.serviceRestaurant,
            serviceEntertainment: service.serviceEntertainment,
            seaView: service.seaView,
            openingHours: service.openingHours,
            minHotelRoom: service.minHotelRoom,
            maxHotelRoom: service.maxHotelRoom,
            minHostelRoom: service.minHostelRoom,
            maxHostelRoom: service.maxHostelRoom,
            minMeal: service.minMeal,
            maxMeal: service.maxMeal,
            minService: service.minService,
            maxService: service.maxService,
            singles: service.singles,
            couples: service.couples,
            family: service.family,
            classic: service.classic,
            modern: service.modern,
            serviceDescription: service.serviceDescription,
            companyName: service.companyName,
            decision: service.decision,
            authorFirstName: profile.firstName,
            authorLastName: profile.lastName,
            userEmail: service.userEmail,
            companyId: service.companyId,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => {
            dispatch({type: 'CREATE_SERVICE', service: service});
        }).catch((err) => {
            dispatch({type: 'CREATE_SERVICE_EROOR', err: err});
        });

        firestore.collection('aux').doc('test').set({
            companyName: service.companyName
        }).then(() => {
            dispatch({type: 'PASS_COMPANY_NAME', companyName: service.companyName});
        }).catch((err) => {
            dispatch({type: 'PASS_COMPANY_NAME_EROOR', err: err});
        });
        
    }
}

// Dispatcher action function that confirms a service by the SCO, update and save its fields in the Firebase Cloud Firestore 
export const confirmService = (service) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        const id = service.id;
        firestore.collection('repmessages').add({
            title: 'Your Service is confirmed',
            content: 'We are glad to inform you that that your service is accepted and soon you will get a proposal from the selected company.',
            companyEmail: profile.email,
            userEmail: service.userEmail,
            authorCompanyName: profile.companyName,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'REPLY_MESSAGE', service: service });
        }).catch((err) => {
            dispatch({type: 'REPLY_MESSAGE_ERROR', err});
        }); 
        firestore.collection('services').doc(id).set({
            serviceDescription: service.serviceDescription,
            companyName: service.companyName,
            decision: service.decision,
            authorFirstName: service.authorFirstName,
            authorLastName: service.authorLastName,
            userEmail: service.userEmail,
            companyId: service.companyId,
            authorId: service.authorId,
            createdAt: service.createdAt            
        }).then(() => {
            dispatch({type: 'MODIFY_SERVICE', service: service});
        }).catch((err) => {
            dispatch({type: 'MODIFY_SERVICE_ERROR', err: err});
        })
        firestore.collection('aux').doc(authorId).set({
            serviceId: id,
            companyId: service.companyId,
            authorId: service.authorId,
            createdAt: service.createdAt
        }).then(() => {
            dispatch({type: 'MODIFY_AUX_SUCCESS', service: service})
        }).catch((err) => {
            dispatch({type: 'MODIFY_AUX_ERROR', err:err})
        })
        firestore.collection('confirmedServices').add({
            ...service,
            confirmingCompanyName: profile.companyName,
            companyId: authorId,
            confirmedAt: new Date()
        }).then(() => {
            dispatch({type: 'CONFIRM_SERVICE', service: service});
        }).catch((err) => {
            dispatch({type: 'CONFIRM_SERVICE_ERROR', err: err});
        })        
    }
};

// Dispatcher action function that rejects a service by the SCO, update and save its fields in the Firebase Cloud Firestore 
export const rejectService = (service) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        const id = service.id;
        firestore.collection('repmessages').add({
            title: 'Your Service is rejected',
            content: 'We are sorry to inform you that that your service is rejected due to the unavailablity of the seleted service center. \n Your service is forwarded to all the pther service centers and soon you will get a confirmation. Of course, feel comfortable to contact other Service Centers.',
            companyEmail: profile.email,
            userEmail: service.userEmail,
            authorCompanyName: profile.companyName,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'REPLY_MESSAGE', service: service });
        }).catch((err) => {
            dispatch({type: 'REPLY_MESSAGE_ERROR', err});
        }); 
        firestore.collection('services').doc(id).set({
            serviceDescription: service.serviceDescription,
            companyName: service.companyName,
            decision: service.decision,
            authorFirstName: service.authorFirstName,
            authorLastName: service.authorLastName,
            userEmail: service.userEmail,
            companyId: service.companyId,
            authorId: service.authorId,
            createdAt: service.createdAt            
        }).then(() => {
            dispatch({type: 'MODIFY_SERVICE', service: service});
        }).catch((err) => {
            dispatch({type: 'MODIFY_SERVICE_ERROR', err: err});
        })
        firestore.collection('rejectedServices').add({
            ...service,
            confirmingCompanyName: profile.companyName,
            companyId: authorId,
            confirmedAt: new Date()
        }).then(() => {
            dispatch({type: 'REJECT_SERVICE', service: service});
        }).catch((err) => {
            dispatch({type: 'REJECT_SERVICE_ERROR', err: err});
        })        
    }
};

// Dispatcher action function that pushes the rejected and eliminated services(due to the timeout of the SCO response time) by the SCO into the buffer, update and save its fields in the Firebase Cloud Firestore 
export const pushBuffer = (service) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        const id = service.id;
        firestore.collection('repmessages').add({
            title: 'Your Service is rejected',
            content: 'We are sorry to inform you that that your service is rejected due to the unavailablity of the seleted service center. \n Your service is forwarded to all the pther service centers and soon you will get a confirmation. Of course, feel comfortable to contact other Service Centers.',
            companyEmail: profile.email,
            userEmail: service.userEmail,
            authorCompanyName: profile.companyName,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'REPLY_MESSAGE', service: service });
        }).catch((err) => {
            dispatch({type: 'REPLY_MESSAGE_ERROR', err});
        }); 
        firestore.collection('services').doc(id).set({
            serviceDescription: service.serviceDescription,
            companyName: service.companyName,
            decision: 'rejected',
            authorFirstName: service.authorFirstName,
            authorLastName: service.authorLastName,
            companyId: service.companyId,
            userEmail: service.userEmail,
            authorId: service.authorId,
            createdAt: service.createdAt            
        }).then(() => {
            dispatch({type: 'MODIFY_SERVICE', service: service});
        }).catch((err) => {
            dispatch({type: 'MODIFY_SERVICE_ERROR', err: err});
        })
        firestore.collection('rejectedServices').add({
            ...service,
            confirmingCompanyName: profile.companyName,
            companyId: authorId,
            confirmedAt: new Date()
        }).then(() => {
            dispatch({type: 'REJECT_SERVICE', service: service});
        }).catch((err) => {
            dispatch({type: 'REJECT_SERVICE_ERROR', err: err});
        })        
    }
};

// Dispatcher action function that takes the company Name selected on the map by the EDU, update and save its fields in the Firebase Cloud Firestore 
export const fillIn = (name) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        
        const firestore = getFirestore();
        firestore.collection('aux').doc('test').set({
            companyName: name
        }).then(() => {
            dispatch({type: 'PASS_COMPANY_NAME', companyName: name});
        }).catch((err) => {
            dispatch({type: 'PASS_COMPANY_NAME_EROOR', err: err});
        })
        
    }
}

// Dispatcher action function that creates a device of the EDU and save its fields in the Firebase Cloud Firestore 
export const registerDevice = (device) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        const photos = device.photos ? device.photos.map(item => {
            return item.url
        }) : null;
        console.log(photos);
        firestore.collection('devices').add({
            deviceType: device.deviceType,
            model: device.model,
            manufacturer: device.manufacturer,
            photos: photos,
            ownerFirstName: profile.firstName,
            ownerLastName: profile.lastName,
            ownerId: authorId,
            createdAt: new Date()
        }).then(() => {
            console.log(device);
            dispatch({type: 'REGISTER_DEVICE', device: device});
        }).catch((err) => {
            console.log(profile.firstName);
            dispatch({type: 'REGISTER_DEVICE_EROOR', err: err});
        })
        
    }
}