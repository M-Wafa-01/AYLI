import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

// Functional component to display a preview of the post depending on the user type of the current signed in user 
const PostSummary = ({ post }) => {

    const content = (post.userType === 'Customer') ? (
        <div className="card-content grey-text text-darken-3">
            <span className="card-title">{post.title}</span>
            <div>Posted by { post.authorFirstName } { post.authorLastName }</div> 
            <p className="grey-text">{moment(post.createdAt.toDate()).calendar()}</p>
        </div>   
    ) : (
        <div className="card-content grey-text text-darken-3">
            <span className="card-title">{post.title}</span>
            <div>Posted by { post.authorCompanyName }</div> 
            <p className="grey-text">{moment(post.createdAt.toDate()).calendar()}</p>
        </div> 
    );
    return(
        <div className="card z-depth-0 post-summary">
            { content }
        </div>
    );
    
}


export default (PostSummary);