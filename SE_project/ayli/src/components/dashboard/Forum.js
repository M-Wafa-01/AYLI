import React, { Component } from 'react';
import Notifications from './Notifications';
import PostList from '../posts/PostList';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';

// class-based component to display the posts and the corresponding notifications and pass the posts as props to PostList component and the notifications as props to the Notifcation component
class Forum extends Component {
    render(){
        const { posts, auth, notifications } = this.props;
        if (!auth.uid) return <Redirect to="/signin" />

        return(
            <div className="dashboard container">
                <div className="row">
                    <div className="col s12 m6">
                        <PostList posts={posts} />
                    </div>
                    <div className="col s12 m5 offset-m1">
                        <Notifications notifications={notifications}/>
                    </div>
                </div>
            </div>
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const posts = state.firestore.ordered.posts;
    return {
        posts: posts,
        auth: state.firebase.auth,
        notifications: state.firestore.ordered.notifications
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'posts', orderBy: ['createdAt', 'desc'] },
        { collection: 'notifications', limit: 3, orderBy: ['time', 'desc'] }
    ])
)(Forum);