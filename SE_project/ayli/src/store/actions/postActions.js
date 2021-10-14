// Dispatcher action function that creates a post and save its fields in the Firebase Cloud Firestore 
export const createPost = (post) => {
    return (dispatch, getState, { getFirebase, getFirestore }) => {
        // make async call to database
        const firestore = getFirestore();
        const profile = getState().firebase.profile;
        const authorId = getState().firebase.auth.uid;
        const userType = profile ? profile.userType : null;
        const photos = post.postPhotos ? post.postPhotos.map(item => {
            return item.url
        }) : null;
        if (userType === 'AYLI'){
            firestore.collection('posts').add({
                title: post.title,
                content: post.content,
                userType: post.userType,
                postPhotos: photos,
                errors: post.errors,
                authorCompanyName: profile.companyName,
                authorId: authorId,
                createdAt: new Date()
            }).then(() => {
                dispatch({ type: 'CREATE_POST', post: post });
            }).catch((err) => {
                dispatch({type: 'CREATE_POST_ERROR', err});
            });
        }
    }
};