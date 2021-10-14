// Dispatcher action function that creates a message of the EDU and save its fields in the Firebase Cloud Firestore 
export const createMessage = (message) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        firestore.collection('messages').add({
            ...message,
            authorFirstName: profile.firstName,
            authorLastName: profile.lastName,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'CREATE_MESSAGE', message: message });
        }).catch((err) => {
            dispatch({type: 'CREATE_MESSAGE_ERROR', err});
        }); 
    }
}

// Dispatcher action function that creates a message of the SCO and save its fields in the Firebase Cloud Firestore 
export const replyMessage = (message) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        firestore.collection('repmessages').add({
            ...message,
            authorCompanyName: profile.companyName,
            authorId: authorId,
            createdAt: new Date()
        }).then(() => {
            dispatch({ type: 'REPLY_MESSAGE', message: message });
        }).catch((err) => {
            dispatch({type: 'REPLY_MESSAGE_ERROR', err});
        }); 
    }
};