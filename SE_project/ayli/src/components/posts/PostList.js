import React from 'react';
import PostSummary from './PostSummary';
import { Link } from 'react-router-dom';

// Functional component to add a link to each post and pass the post as props to the PostSummary component
const PostList = ({posts}) => {
    return(
        <div className="post-list section">
            { posts && posts.map(post => {
                return(
                    <Link to={'/post/' + post.id} key={post.id}>
                        <PostSummary post={post} />
                    </Link>
                )
            }) }
        </div>
    );
}

export default PostList;