import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createPost } from '../../store/actions/postActions';
import { storage } from '../../config/fbConfig';
import { Redirect } from 'react-router-dom';

var i = 0;
// class-based component to create a new post
class CreatePost extends Component {

    state = {
        title: '',
        content: '',
        userType: '',
        postPhotos: [
            { image: null, url: '' }
        ],
        errors: {}
    }

    // On change event handler function to set the input fields values of the post form to the state
    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }

    // On change event handler function to import images to the state
    handleChangeFile = (e) => {
    
        if(e.target.files[0]){
            var stateCopy = Object.assign({}, this.state);
            stateCopy.postPhotos = stateCopy.postPhotos.slice();
            stateCopy.postPhotos[i] = Object.assign({}, stateCopy.postPhotos[i]);
            stateCopy.postPhotos[i].image = e.target.files[0];
            this.setState(stateCopy);
      
            const image = stateCopy.postPhotos[i].image;
            if ((image !== null) ){
            const uploadTask = storage.ref(`images/${image.name}`).put(image);
            uploadTask.on('state_changed', 
            (snaphot) => {
                // progress function
            }, 
            (error) => {
                // error function
                console.log(error);
            }, 
            () => {
                // complete function
                storage.ref('images').child(image.name).getDownloadURL().then(url => {
                    console.log(url);
                    
                    stateCopy.postPhotos[i-1] = Object.assign({}, stateCopy.postPhotos[i-1]);
                    stateCopy.postPhotos[i-1].url = url;
                    this.setState(stateCopy);
                })
            });
            }      
        }
        i++;   
        }

    // On submit form event handler function to call the dispatcher action function to add the post to the Firebase database and redirect the user to the forum window
    handleSubmit = (e) => {
        e.preventDefault();
        this.state.userType = this.props.userType;
        if(this.validate() ){
            this.props.createPost(this.state);
            alert('Your post is published successfully');
            this.props.history.push('/forum');
        }
    }

    // Function too evaluate the input fields values of the form
    validate = () => {
        let errors = {};
        let isValid = true;
    
        if (!this.state.title) {
            isValid = false;
            errors["titleerr"] = "Please enter your post title.";
        } else {errors["titleerr"] = ""}
        if (!this.state.content) {
            isValid = false;
            errors["contenterr"] = "Please enter your post content.";
        } else { errors["contenterr"] = "" }

        this.setState({
            errors: errors
            });

        return isValid;
    }

    // Render the component to the DOM
    render() {
        const { auth } = this.props;
        if (!auth.uid) return <Redirect to="/signin" />

        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="white">
                    <h5 className="grey-text text-darken-3">Create new post</h5>
                    <div className="input-field">
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" onChange={this.handleChange}/>
                        <div className="text-danger">{this.state.errors.titleerr}</div>
                    </div>
                    <div className="input-field">
                        <label htmlFor="content">Post Content</label>
                        <textarea id="content" className="materialize-textarea" onChange={this.handleChange}></textarea>
                        <div className="text-danger">{this.state.errors.contenterr}</div>
                    </div>
                    <br />
                    <div className="file-field input-field multiImage-second">
                        <div className="btn #ef9a9a red lighten-3">
                            <span><i className="material-icons left">cloud_upload</i>File</span>
                            <input id="servicePhoto" type="file" multiple onChange={this.handleChangeFile} />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" placeholder="Upload one or more files"/>
                        </div>
                        <ul className="list-inline imgList row">
                            { this.state.postPhotos && this.state.postPhotos.map((item) => {
                                //console.log(item);
                                //console.log(this.state);
                                const id = Math.random();  
                                if(item.url){ 
                                    return (   
                                        
                                        <li key={id}>
                                            <div className="col s2">                                                  
                                                <img className="materialboxed thumbnail responsive-img" width="650" height="650" src={item.url} />                                                  
                                            </div>
                                        </li>
                                            
                                    )
                                }
                                }) 
                                
                            }
                        </ul>
                    </div>
                    <div className="input-field">
                        <button className="btn light-blue lighten-3">Post</button>
                    </div>
                </form>
            </div>
        )
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations
const mapStateToProps = (state) => {
    const userType = state.firebase.profile.userType;
    return {
        auth: state.firebase.auth,
        userType: userType
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state and post on the forum
const mapDispatchToProps = (dispatch) => {
    return {
        createPost: (post) => {
            dispatch(createPost(post));
        }
    }
}

// export the component and wrapping it by higher order components 'connect' to connect to React Redux.
export default connect(mapStateToProps, mapDispatchToProps)(CreatePost);