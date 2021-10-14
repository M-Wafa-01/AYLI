const initState = {
    services: [
        {id: '1', title: 'help me find peach', content: 'blah blah blah'},
        {id: '2', title: 'collect all the stars', content: 'blah blah blah'},
        {id: '3', title: 'egg hunt with yoshi', content: 'blah blah blah'}
    ],
    devices: [
        {deviceType: 'Select Device',
        model: 'jvh',
        manufacturer: 'ljnlk',
        photos: []}
    ],
    companyName: ''
}

// Evaluate the actions sent by the services action dispatcher functions
const serviceReducer = (state = initState, action) => {   
    switch (action.type) {
        case 'CREATE_SERVICE': 
            console.log('service request created', action.service);
            return state;
        case 'CREATE_SERVICE_ERROR':
            console.log('create service error', action.err);
            return state;
        case 'REGISTER_DEVICE': 
            console.log('device registered', action.device);
            return state;
        case 'REGISTER_DEVICE_EROOR':
            console.log('register device error', action.err);
            return state;
        case 'PASS_COMPANY_NAME':
            console.log('name passed', action.companyName);
            return state;
        case 'PASS_COMPANY_NAME_EROOR':
            console.log('pass name error', action.err);
            return state;
        case 'MODIFY_AUX_SUCCESS': 
            console.log('modify aux created', action.service);
            return state;
        case 'MODIFY_AUX_ERROR':
            console.log('modify aux error', action.err);
            return state;
        case 'CONFIRM_SERVICE': 
            console.log('confirm service created', action.service);
            return state;
        case 'CONFIRM_SERVICE_ERROR':
            console.log('confirm service error', action.err);
            return state;
        case 'MODIFY_SERVICE': 
            console.log('modify service created', action.service);
            return state;
        case 'MODIFY_SERVICE_ERROR':
            console.log('modify service error', action.err);
            return state;
        case 'REJECT_SERVICE': 
            console.log('reject service created', action.service);
            return state;
        case 'REJECT_SERVICE_ERROR':
            console.log('reject service error', action.err);
            return state;
        default: 
            return state;
    }  
}

export default serviceReducer;