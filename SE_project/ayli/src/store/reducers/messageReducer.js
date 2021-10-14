const initState = {
    messages: [
        {id: '1', title: 'help me find peach', content: 'blah blah blah'},
        {id: '2', title: 'collect all the stars', content: 'blah blah blah'},
        {id: '3', title: 'egg hunt with yoshi', content: 'blah blah blah'}
    ]
}

// Evaluate the actions sent by the messaging action dispatcher functions
const messageReducer = (state = initState, action) => {
    switch (action.type) {
        case 'CREATE_MESSAGE':
            console.log('message created', action.message);
            return state;
        case 'CREATE_MESSAGE_ERROR':
            console.log('create message error', action.err);
            return state;
        case 'REPLY_MESSAGE':
        console.log('message replied', action.message);
        return state;
        case 'REPLY_MESSAGE_ERROR':
            console.log('reply message error', action.err);
            return state;
        default:
            return state;
    }
}

export default messageReducer;