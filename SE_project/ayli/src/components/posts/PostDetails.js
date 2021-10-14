import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import moment from 'moment';

// Functional component to display the post details depending on the user type of the current signed in user
class PostDetails extends Component {
//const PostDetails = (props) => {
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function() {
        var elems = document.querySelectorAll('.carousel');
        var instances = window.M.Carousel.init(elems, {});
        });
    }

    render(){
    const { post, auth } = this.props;

    window.$(document).ready(function(){
        window.$('.carousel').carousel();
    });

    if (!auth.uid) return <Redirect to="/signin" />

    if (post) {
        const contenu = (post.postPhotos) ? (
            <div className="carousel">
                { post.postPhotos && post.postPhotos.map((item) => {
                    console.log(item); 
                    return (   
                                
                        <a className="carousel-item " key={item.toString()}><img className="materialboxed thumbnail responsive-img" width="650" src={item} /></a>                                                   
                            
                    )
                    }) 
                }
            </div>
        ) : null;

        const content = (post.userType === 'Customer') ? (
            <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">{ post.title }</span>
                        <p>{ post.content }</p>
                        { contenu }
                    </div>
                    <div className="card-action grey lighten-4 grey-text">
                        <div>Posted by { post.authorFirstName } { post.authorLastName }</div>
                        <div>{moment(post.createdAt.toDate()).calendar()}</div>
                    </div>
                </div>
        ) : (
            <div className="card z-depth-0">
                    <div className="card-content">
                        <span className="card-title">{ post.title }</span>
                        <p>{ post.content }</p>
                        { contenu }
                    </div>
                    <div className="card-action grey lighten-4 grey-text">
                        <div>Posted by { post.authorCompanyName }</div>
                        <div>{moment(post.createdAt.toDate()).calendar()}</div>
                    </div>
                </div>
        );
        return (
            <div className="container section post-details">
                { content }
            </div>
        )
    } else {
        return (
            <div className="container center">
                <p>Loading post...</p>
            </div>
        )
    }
}
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state, ownProps) => {
    const id = ownProps.match.params.id;
    const posts = state.firestore.data.posts;
    const post = posts ? posts[id] : null;
    return {
        post: post, 
        auth: state.firebase.auth
    }
}

// export the component and wrapping it by higher order components 'connect' to connect to React Redux.
export default compose(
    connect(mapStateToProps),
    firestoreConnect([
        { collection: 'posts' }
    ])
)(PostDetails);