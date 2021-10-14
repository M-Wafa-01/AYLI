import authReducer from './authReducer';
import serviceReducer from './serviceReducer';
import { combineReducers } from 'redux';
import { firestoreReducer } from 'redux-firestore';
import { firebaseReducer } from 'react-redux-firebase';
import postReducer from './postReducer';
import messageReducer from './messageReducer';
import proposalReducer from './proposalReducer';

// Combine all the reducers into one single reducer
const rootReducer = combineReducers({
    auth: authReducer,
    service: serviceReducer,
    post: postReducer,
    message: messageReducer,
    proposal: proposalReducer,
    firestore: firestoreReducer,
    firebase: firebaseReducer
});

export default rootReducer;