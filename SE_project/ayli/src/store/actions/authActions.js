// Dispatcher action function that sign in the user into our application
export const signIn = (credentials) => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        
        firebase.auth().signInWithEmailAndPassword(
            credentials.email,
            credentials.password
        ).then(() => {
            dispatch({type: 'LOGIN_SUCCESS'})
        }).catch((err) => {
            dispatch({type: 'LOGIN_ERROR', err})
        });

    }
}

// Dispatcher action function that sign out in the user from our application
export const signOut = () => {
    return (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();

        firebase.auth().signOut().then(() => {
            dispatch({type: 'SIGNOUT_SUCCESS'})
        });
    }
}

// Dispatcher action function that signs up the user into our application and save its properties in the Firebase Cloud Firestore 
export const signUp = (newUser) => {
    return (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        console.log(newUser.userType);
        if (newUser.userType === 'Customer'){
            firebase.auth().createUserWithEmailAndPassword(
                newUser.email,
                newUser.password
            ).then((resp) => {
                
                return firestore.collection('users').doc(resp.user.uid).set({
                    userType: newUser.userType,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    phone: newUser.phone,
                    address: newUser.address,
                    email: newUser.email,
                    initials: newUser.firstName[0] + newUser.lastName[0]
                })
            }).then(() => {
                dispatch({type: 'SIGNUP_SUCCESS'})
            }).catch((err) => {
                dispatch({type: 'SIGNUP_ERROR', err})
            })
        } else if (newUser.userType === 'AYLI'){
            firebase.auth().createUserWithEmailAndPassword(
                newUser.email,
                newUser.password
            ).then((resp) => {
                
                return firestore.collection('users').doc(resp.user.uid).set({
                    userType: newUser.userType,
                    companyName: newUser.companyName,
                    serviceHotel: newUser.serviceHotel,
                    serviceHostel: newUser.serviceHostel,
                    serviceRestaurant: newUser.serviceRestaurant,
                    serviceEntertainment: newUser.serviceEntertainment,
                    openingTime: newUser.openingTime,
                    closingTime: newUser.closingTime,
                    minHotelRoom: newUser.minHotelRoom,
                    maxHotelRoom: newUser.maxHotelRoom,
                    minHostelRoom: newUser.minHostelRoom,
                    maxHostelRoom: newUser.maxHostelRoom,
                    minMeal: newUser.minMeal,
                    maxMeal: newUser.maxMeal,
                    minService: newUser.minService,
                    maxService: newUser.maxService,
                    minPrice: newUser.minPrice,
                    maxPrice: newUser.maxPrice,
                    couplesLevel: newUser.couplesLevel,
                    familyLevel: newUser.familyLevel,
                    customerRange: newUser.customerRange,
                    placeStyle: newUser.placeStyle,
                    seaView: newUser.seaView,
                    taxId: newUser.taxId,
                    phone: newUser.phone,
                    address: newUser.address,
                    email: newUser.email,
                    adminDecision: newUser.adminDecision,
                    duration: newUser.duration,
                    rating: newUser.rating,
                    responseTime: newUser.responseTime,
                    time: newUser.time,
                    initials: newUser.companyName[0]
                }) 
            }).then(() => {
                dispatch({type: 'SIGNUP_SUCCESS'})
            }).catch((err) => {
                dispatch({type: 'SIGNUP_ERROR', err})
            })
        }
    } 
}