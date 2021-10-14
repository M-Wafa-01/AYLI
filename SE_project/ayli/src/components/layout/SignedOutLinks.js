import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

// Functional component to display the signed out links in the browser
class SignedOutLinks extends Component {
//const SignedOutLinks = () => {
    componentDidMount() {
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.dropdown-button');
            var instances = window.M.Dropdown.init(elems, {});
            
          });
    }

    render(){
        window.$(document).ready(function () {
            window.$(".dropdown-button").dropdown();
        });
    return(
        <div>
            
            <ul id="dropdown2" className="dropdown-content">
                <li><NavLink to='/signup'>Sign up</NavLink></li>
                <li><NavLink to='/signin'>Login</NavLink></li>                      
            </ul>
            <a className='btn-large out dropdown-button btn-floating waves-light #1b5e20 green darken-4' data-beloworigin="true" data-activates="dropdown2">
            <i class="material-icons">add</i>
            </a>
        </div>
    )
    }
}

export default SignedOutLinks;