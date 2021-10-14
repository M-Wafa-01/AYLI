const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  //functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

const createNotification = (notification => {
    return admin.firestore().collection('notifications')
        .add(notification)
        .then(doc => console.log('notification added', doc));
})

const createNotifClaim = (claim => {
    return admin.firestore().collection('claimNotifications')
        .add(claim)
        .then(doc => console.log('claim added', doc));
})

const createReceipt = (receipt => {
    return admin.firestore().collection('receipts')
        .add(receipt)
        .then(doc => console.log('receipt added', doc));
})

const createPropNotification = (proposal => {
    return admin.firestore().collection('propNotifications')
        .add(proposal)
        .then(doc => console.log('proposal notification added', doc));
})

const createReceiptCompany = (receipt => {
    return admin.firestore().collection('companyreceipts')
        .add(receipt)
        .then(doc => console.log('company receipt added', doc));
})

const createPropDecision = (decision => {
    return admin.firestore().collection('companyPropDecisions')
        .add(decision)
        .then(doc => console.log('Proposal decision added', doc));
})

const createServNotifications = (decision => {
    return admin.firestore().collection('createServNotifications')
        .add(decision)
        .then(doc => console.log('Create service notifications added', doc));
})

const createInvNotifications = (decision => {
    return admin.firestore().collection('createInvNotifications')
        .add(decision)
        .then(doc => console.log('Create service notifications added', doc));
})

const confirmServNotifications = (decision => {
    return admin.firestore().collection('confirmServNotifications')
        .add(decision)
        .then(doc => console.log('Confirm service notifications added', doc));
})

exports.claimLaunch = functions.firestore
    .document('/claims/{claimId}')
    .onCreate(doc => {

        const message = doc.data();
        const receipt = {
            content: 'Your claim is transferred',
            user: `${message.userFirstName} ${message.userLastName}`,
            authorId: `${message.userId}`,
            companyName: `${message.companyName}`,
            companyId: `${message.companyId}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return createNotifClaim(receipt);
});

exports.serviceConfirmed = functions.firestore
    .document('/confirmedServices/{confirmedServiceId}')
    .onCreate(doc => {

        const message = doc.data();
        const receipt = {
            content: 'Your service is confirmed',
            user: `${message.companyName}`,
            authorId: `${message.companyId}`,
            userId: `${message.authorId}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return confirmServNotifications(receipt);
});

exports.invoiceCreated = functions.firestore
    .document('/invoices/{invoiceId}')
    .onCreate(doc => {

        const message = doc.data();
        const receipt = {
            content: 'A new invoice is created',
            userName: `${message.authorFirstName} ${message.authorLastName}`,
            companyName: `${message.authorCompanyName}`,
            authorId: `${message.userId}`,
            companyId: `${message.authorCompanyId}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return createInvNotifications(receipt);
});

exports.serviceCreated = functions.firestore
    .document('/services/{serviceId}')
    .onCreate(doc => {

        const message = doc.data();
        const receipt = {
            content: 'A new service is created',
            user: `${message.authorFirstName} ${message.authorLastName}`,
            authorId: `${message.authorId}`,
            companyId: `${message.companyId[0].id}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return createServNotifications(receipt);
});

exports.proposalConfirmed = functions.firestore
    .document('/confirmedProposals/{confirmedProposalId}')
    .onCreate(doc => {

        const message = doc.data();
        const receipt = {
            content: 'Your proposal is accepted',
            user: `${message.authorFirstName} ${message.authorLastName}`,
            authorId: `${message.userId}`,
            companyId: `${message.authorCompanyId}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return createPropDecision(receipt);
});

exports.proposalRejected = functions.firestore
    .document('/rejectedProposals/{rejectedProposalId}')
    .onCreate(doc => {

        const message = doc.data();
        const receipt = {
            content: 'Your proposal is rejected',
            user: `${message.authorFirstName} ${message.authorLastName}`,
            authorId: `${message.userId}`,
            companyId: `${message.authorCompanyId}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return createPropDecision(receipt);
});

exports.replyMessageCreated = functions.firestore
    .document('/repmessages/{repmessageId}')
    .onCreate(doc => {

        const message = doc.data();
        const receipt = {
            content: 'You received a reply message',
            user: `${message.authorCompanyName}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return createReceiptCompany(receipt);
});

exports.proposalCreated = functions.firestore
    .document('/proposals/{proposalId}')
    .onCreate(doc => {

        const proposal = doc.data();
        const receipt = {
            content: 'You received a new proposal',
            user: `${proposal.authorCompanyName}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return createPropNotification(receipt);
});

exports.messageCreated = functions.firestore
    .document('/messages/{messageId}')
    .onCreate(doc => {

        const message = doc.data();
        const receipt = {
            content: 'You received a new message',
            user: `${message.authorFirstName} ${message.authorLastName}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        return createReceipt(receipt);
});

exports.postCreated = functions.firestore
    .document('/posts/{postId}')
    .onCreate(doc => {

        const post = doc.data();
        const userType = post.userType;
        if (userType === 'Customer'){
            var notification = {
            content: 'Added a new post',
            user: `${post.authorFirstName} ${post.authorLastName}`,
            time: admin.firestore.FieldValue.serverTimestamp()
        }
        } else {
            var notification = {
            content: 'Added a new post',
            user: `${post.authorCompanyName}`,
            time: admin.firestore.FieldValue.serverTimestamp()
            }
        }
        return createNotification(notification);
});

exports.userJoined = functions.auth.user()
    .onCreate(user => {
        return admin.firestore().collection('users')
            .doc(user.uid).get().then(doc => {

                const newUser = doc.data();
                const userType = newUser.userType;
                if (userType === 'Customer'){
                var notification = {
                    content: 'signed up',
                    user: `${newUser.firstName} ${newUser.lastName}`,
                    time: admin.firestore.FieldValue.serverTimestamp()
                }
            } else {
                var notification = {
                    content: 'signed up',
                    user: `${newUser.companyName}`,
                    time: admin.firestore.FieldValue.serverTimestamp()
                }
            }
                return createNotification(notification);

            })
});
