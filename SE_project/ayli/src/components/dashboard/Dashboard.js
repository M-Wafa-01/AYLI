import React, { Component } from 'react';
import {
    InfoWindow,
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
  } from "react-google-maps";
import Geocode from "react-geocode";
import { Descriptions } from 'antd';
import AutoComplete from 'react-google-autocomplete';
import axios from 'axios';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';
import { Redirect } from 'react-router-dom';
import { fillIn } from '../../store/actions/serviceActions';
import { createService } from '../../store/actions/serviceActions';
import noUiSlider from 'nouislider'
import Nouislider from "nouislider-react";
import wNumb from 'wnumb'
import "nouislider/distribute/nouislider.css";

Geocode.setApiKey("AIzaSyD2xEnWGmR699ujB-8R7cLPPUY3P0Uob-s");

var lat = [];
var lng = [];
var formattedAddress = [];
var addressComponents = [];
var ville = [];
var mi = 0;
var ma = 0;
var hi = 0;
var ha = 0;
var ri = 0;
var ra = 0;
var ei = 0;
var ea = 0;
var company
// EDU Home Page. Class-based component that displays the map and the formatted address of the EDU position and interacts with the user with the filters, dragging the marker and entering the place to place the marker. 
export class MapContainer extends Component {

    state = {
        address: "",
        city: "",
        area: "",
        state: "",
        decision: '',
        serviceDescription: "",
        serviceHotel: '',
        serviceHostel: '',
        serviceRestaurant: '',
        serviceEntertainment: '',
        openingHours: 'Opening Time',
        seaView: 'Sea View',
        minHotelRoom: '',
        maxHotelRoom: '',
        minHostelRoom: '',
        maxHostelRoom: '',
        minMeal: '',
        maxMeal: '',
        minService: '',
        maxService: '',
        singles: '',
        couples: '',
        family: '',
        classic: '',
        modern: '',
        companyName: 'Enter Company Name',
        userEmail: '',
        companyId: '',
        zoom: 15,
        name: "",
        height: 400,
        mapPosition: {
            lat: 0,
            lng: 0
        },
        markerPosition: {
            lat: 0,
            lng: 0
        },
        filterType: 'Choose Filter',
        rating: 'Filter By Rating', 
        price: 'Filter By Standard Prices',
        distance: 'Near Me' 
    }

    // React predefined Life cycle hook that executes when first the component is mounted to the DOM.
    // Add a listener for the drop down buttons in the form.
    // According to the navigator geolocation value state( true if the user accepts the geolocation service => Permission allowed), getting information of the user current position
    componentDidMount(){
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.dropdown-button');
            var instances = window.M.Dropdown.init(elems, {});
          });  
        if(navigator.geolocation){

            if(this.props.userList && typeof(this.props.userList)!= "undefined"){
                for (let i = 0; i < this.props.userList.length; i++) {
                    var adr = this.props.userList[i].address;
                    axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
                    params:{
                        address: adr,
                        key: 'AIzaSyD2xEnWGmR699ujB-8R7cLPPUY3P0Uob-s'
                    }
                }).then( (response) => {
                    // Log full response
                    console.log(response);
        
                    // Formatted address
                    formattedAddress[i] = response.data.results[0].formatted_address;
                    lat[i] = response.data.results[0].geometry.location.lat;
                    lng[i] = response.data.results[0].geometry.location.lng;
                    console.log(formattedAddress[i]);
                    
                
                }).catch((error) => {
                    // Log error if existed
                    console.log(error);
                })
                }
                   
            }

            // save the user current position to the component state
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    mapPosition: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    markerPosition: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                }, () => {
                        Geocode.fromLatLng(position.coords.latitude, position.coords.longitude)
                        .then(response => {
                            const address = response.results[0].formatted_address,
                                addressArray = response.results[0].address_components,
                                city = this.getCity(addressArray),
                                area = this.getArea(addressArray),
                                state = this.getState(addressArray);
                            this.setState({
                                address: (address) ? address : "",
                                area: (area) ? area : "",
                                city: (city) ? city : "",
                                state: (state) ? state : ""                                    
                            })
                        })
                    }
                )
            })                       
        }   
    }

    // function to get the city name from the addressArray argument
    getCity = (addressArray) => {
        let city = '';
        for (let index = 0; index < addressArray.length; index++) {
            if(addressArray[index].types[0] && 'administrative_area_level_2' === addressArray[index].types[0]){
                city = addressArray[index].long_name;
                return city;
            }
            
        }
    }

    // function to get the area name from the addressArray argument
    getArea = (addressArray) => {
        let area = '';
        for (let index = 0; index < addressArray.length; index++) {
            if(addressArray[index].types[0]){
                for (let j = 0; j < addressArray.length; j++) {
                    if('sublocality_level_1' === addressArray[index].types[j] || 'locality' === addressArray[index].types[j]){
                        area = addressArray[index].long_name;
                        return area;
                    }                   
                }
            }            
        }
    }

    // Function to get the State name from the addressArray argument
    getState = (addressArray) => {
        let state = '';
        for (let index = 0; index < addressArray.length; index++) {
            for (let index = 0; index < addressArray.length; index++) {
                if(addressArray[index].types[0] && 'administrative_area_level_1' === addressArray[index].types[0]){
                    state = addressArray[index].long_name;
                    return state;
                }                
            }
        }
    }

    // Function to get the details of the marker when dragged and droped in the map
    onMarkerDragEnd = (event) => {
       
        let newLat = event.latLng.lat();
        let newLng = event.latLng.lng();
        
        Geocode.fromLatLng(newLat, newLng)
        .then(response => {
            const address = response.results[0].formatted_address,
                addressArray = response.results[0].address_components,
                city = this.getCity(addressArray),
                area = this.getArea(addressArray),
                state = this.getState(addressArray);

            this.setState({
                address: (address) ? address : "",
                area: (area) ? area : "",
                city: (city) ? city : "",
                state: (state) ? state : "",
                markerPosition: {
                lat: newLat,
                lng: newLng
                },
                mapPosition: {
                lat: newLat,
                lng: newLng
                }
            })
        })
    }

    // Funtion to get the details of the place typed in the input field by the user
    onPlaceSelected = (place) => {
        const address = place.formatted_address,
            addressArray = place.address_components,
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            state = this.getState(addressArray),
            newLat = place.geometry.location.lat(),
            newLng = place.geometry.location.lng();
        this.setState({
        address: (address) ? address : "",
        area: (area) ? area : "",
        city: (city) ? city : "",
        state: (state) ? state : "",
        markerPosition: {
            lat: newLat,
            lng: newLng
        },
        mapPosition: {
            lat: newLat,
            lng: newLng
        }
    })
    }

    // React predefined Life cycle hook that executes when first the component is mounted to the DOM.
    shouldComponentUpdate(nextProps, nextState) {
        // Update in all cases EXCEPT when markerPosition changes
        if (nextState.markerPosition !==  this.state.markerPosition ) {
            return true;
        } else {
        return true;
        }          
    }

    // On click event handler function to call the action dispatcher function to save the name of the company when clicked on the info window of the company in the map
    handleClick = (item) => {
        this.state.companyName = item;
        company = this.props.users ? this.props.users.filter(user => {
            return user.companyName === this.state.companyName
        }) : null;
        this.state.userEmail = this.props.userEmail;
        this.state.companyId = company;
        this.props.createService(this.state);
        alert('Your service is sent successfully');
        //this.props.fillIn(item);
        //this.props.history.push('/create_service');
    }

    // On click event handler function to set the price property of the state
    handleClickSecond = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            price : e.target.id
        })
    }

    // On click event handler function to set the distance property of the state
    handleClickFourth = (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            distance : e.target.id
        })
    }

    // On click event handler function to set the rating property of the state
    handleClickFifth = (e) => {
        e.preventDefault();
        if (e.target.id === ''){
            e.target.id = 'Filter By Rating';
        }
        this.setState({
            ...this.state,
            rating : e.target.id
        });
        console.log(this.state);
    }
    
    handleClickSixth= (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            openingHours: e.target.id
        })
    }

    handleClickSeventh= (e) => {
        e.preventDefault();
        this.setState({
            ...this.state,
            seaView: e.target.id
        })
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
        })
    }
    handleChange1 = (e) => {
        //document.write(e.target.checked);
        if (e.target.checked) {
            //alert ("hi");
            this.setState({
                [e.target.id]: 'YES'
            })
          } else {
            //alert ("bye");
            this.setState({
                [e.target.id]: 'NO'
            })
            
          }
    }

    handleChange4 = (e) => {
        this.setState({
            minHotelRoom: mi,
            maxHotelRoom: ma
        })
        
    }
    handleChange5 = (e) => {
        this.setState({
            minHostelRoom: hi,
            maxHostelRoom: ha
        })
        
    }
    handleChange6 = (e) => {
        this.setState({
            minMeal: ri,
            maxMeal: ra
        })
        
    }
    handleChange7 = (e) => {
        this.setState({
            minService: ei,
            maxService: ea
        })
        
    }

    // Render the component to the DOM
    render() {
       
        const { auth, userList } = this.props;

        // Redirect the user to the sign in page if it is not authenticated
        if (!auth.uid) return <Redirect to="/signin" />

        // Initialize the listener for the dropdown list
        window.$(document).ready(function () {
            window.$(".dropdown-button").dropdown();
        });
        window.$(".dropdown-button");

        window.$(document).ready(function ($) {
            var dollarPrefixFormat = wNumb({prefix: '€', decimals: 0})
            var slider = document.getElementById('test-slider');
            noUiSlider.create(slider, {
                start: [30, 350],
                connect: true,
                margin: 5,
                tooltips: [dollarPrefixFormat, dollarPrefixFormat],
                pips: {
                    mode: 'steps',
                    density: 5,
                    stepped: true,
                    format: dollarPrefixFormat
                },
                
                range: {
                    'min': 1,
                    'max': 500
                }
                
            }).on('change', function (values){
                mi=values[0];
                ma=values[1];
            });
            
        });

        window.$(document).ready(function ($) {
            var dollarPrefixFormat = wNumb({prefix: '€', decimals: 0})
            var slider2 = document.getElementById('test-slider2');
            noUiSlider.create(slider2, {
                start: [30, 80],
                connect: true,
                margin: 5,
                tooltips: [dollarPrefixFormat, dollarPrefixFormat],
                pips: {
                    mode: 'steps',
                    density: 5,
                    stepped: true,
                    format: dollarPrefixFormat
                },
                
                range: {
                    'min': 1,
                    'max': 100
                }
                
            }).on('change', function (values){
                hi=values[0];
                ha=values[1];
                
            });
        });

        window.$(document).ready(function ($) {
            var dollarPrefixFormat = wNumb({prefix: '€', decimals: 0})
            var slider3 = document.getElementById('test-slider3');
            noUiSlider.create(slider3, {
                start: [30, 80],
                connect: true,
                margin: 5,
                tooltips: [dollarPrefixFormat, dollarPrefixFormat],
                pips: {
                    mode: 'steps',
                    density: 5,
                    stepped: true,
                    format: dollarPrefixFormat
                },
                
                range: {
                    'min': 1,
                    'max': 100
                }
                
            }).on('change', function (values){
                ri=values[0];
                ra=values[1];
                
            });
        });

        window.$(document).ready(function ($) {
            var dollarPrefixFormat = wNumb({prefix: '€', decimals: 0})
            var slider4 = document.getElementById('test-slider4');
            noUiSlider.create(slider4, {
                start: [30, 80],
                connect: true,
                margin: 5,
                tooltips: [dollarPrefixFormat, dollarPrefixFormat],
                pips: {
                    mode: 'steps',
                    density: 5,
                    stepped: true,
                    format: dollarPrefixFormat
                },
                
                range: {
                    'min': 1,
                    'max': 100
                }
                
            }).on('change', function (values){
                ei=values[0];
                ea=values[1];
                
            });
        });

        // Evaluate the existance of SCs in the application
        if (userList) {

            var adr
            // get the details of the addresses of the SCs registered in the application
            for (let i = 0; i < this.props.userList.length; i++) {
                adr = this.props.userList[i].address;
                axios.get('https://maps.googleapis.com/maps/api/geocode/json',{
                params:{
                    address: adr,
                    key: 'AIzaSyD2xEnWGmR699ujB-8R7cLPPUY3P0Uob-s'
                }
            }).then( (response) => {
                // Log full response
                //console.log(response);

                // Formatted address
                formattedAddress[i] = response.data.results[0].formatted_address;
                addressComponents[i] = response.data.results[0].address_components;
                ville[i] = this.getCity(addressComponents[i]);
                lat[i] = response.data.results[0].geometry.location.lat;
                lng[i] = response.data.results[0].geometry.location.lng;
    
            }).catch((error) => {
                console.log(error);
            })
            }
                 
            //  Save the JSX code of the Google map and the different markers displayed on it     
            const MapWithAMarker = withScriptjs(withGoogleMap(props =>
            <GoogleMap
                defaultZoom={13}
                defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
            >
            
            {userList && userList.map((item, id) => {
                // Evaluate only the SCs in the same city of the user where he is localized
                //if (ville[id] === this.state.city){ 
                    var R = 6371.0710; // Radius of the Earth in miles
                    var rlat1 = this.state.markerPosition.lat * (Math.PI/180); // Convert degrees to radians
                    var rlat2 = Number(lat[id]) * (Math.PI/180); // Convert degrees to radians
                    var difflat = rlat2-rlat1; // Radian difference (latitudes)
                    var difflon = (Number(lng[id])-this.state.markerPosition.lng) * (Math.PI/180); // Radian difference (longitudes)
                    // Find the distance of the AYLI wrt the current user position
                    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));

                    //
                    const contenu = ((this.props.userList[id].serviceHotel === 'YES') && (this.props.userList[id].serviceHostel === 'YES') && (this.props.userList[id].serviceRestaurant === 'YES') && (this.props.userList[id].serviceEntertainment === 'YES')) ? (
                        <div>
                            <p>Hotel, Hostel, Restaurant, Entertainment</p>
                            <br />
                            <p>Hotel properties: </p>
                            <p>Sea View: { this.props.userList[id].seaView }</p>
                            <p>Minimum price for a hotel room: { this.props.userList[id].minHotelRoom } EUR</p>
                            <p>Maximum price for a hotel room: { this.props.userList[id].maxHotelRoom } EUR</p>
                            <p>Hostel, Restaurant and Entertainment properties: </p>
                            <p>Opening Time: { this.props.userList[id].openingTime }</p>
                            <p>Closing Time: { this.props.userList[id].closingTime }</p>
                            <p>Minimum price for a hostel room: { this.props.userList[id].minHostelRoom } EUR</p>
                            <p>Maximum price for a hostel room: { this.props.userList[id].maxHostelRoom } EUR</p>
                            <p>Minimum price for a meal: { this.props.userList[id].minMeal } EUR</p>
                            <p>Maximum price for a meal: { this.props.userList[id].maxMeal } EUR</p>
                            <p>Minimum price for an entertainment activity: { this.props.userList[id].minService } EUR</p>
                            <p>Maximum price for an entertainment activity: { this.props.userList[id].maxService } EUR</p>
                        </div>
                    ) : null;
                    const contenu1 = ((this.props.userList[id].serviceHotel !== 'YES') && (this.props.userList[id].serviceHostel === 'YES') && (this.props.userList[id].serviceRestaurant === 'YES') && (this.props.userList[id].serviceEntertainment === 'YES')) ? (
                        <div>
                            <p>Hostel, Restaurant, Entertainment</p>
                            <br />
                            <p>Opening Time: { this.props.userList[id].openingTime }</p>
                            <p>Closing Time: { this.props.userList[id].closingTime }</p>
                            <p>Minimum price for a hostel room: { this.props.userList[id].minHostelRoom } EUR</p>
                            <p>Maximum price for a hostel room: { this.props.userList[id].maxHostelRoom } EUR</p>
                            <p>Minimum price for a meal: { this.props.userList[id].minMeal } EUR</p>
                            <p>Maximum price for a meal: { this.props.userList[id].maxMeal } EUR</p>
                            <p>Minimum price for an entertainment activity: { this.props.userList[id].minService } EUR</p>
                            <p>Maximum price for an entertainment activity: { this.props.userList[id].maxService } EUR</p>
                        </div>
                    ) : null;
                    const contenu2 = ((this.props.userList[id].serviceHotel === 'YES') && (this.props.userList[id].serviceHostel !== 'YES') && (this.props.userList[id].serviceRestaurant === 'YES') && (this.props.userList[id].serviceEntertainment === 'YES')) ? (
                        <div>
                            <p>Hotel, Restaurant, Entertainment</p>
                            <br />
                            <p>Hotel properties: </p>
                            <p>Sea View: { this.props.userList[id].seaView }</p>
                            <p>Minimum price for a hotel room: { this.props.userList[id].minHotelRoom } EUR</p>
                            <p>Maximum price for a hotel room: { this.props.userList[id].maxHotelRoom } EUR</p>
                            <p>Restaurant and Entertainment properties: </p>
                            <p>Opening Time: { this.props.userList[id].openingTime }</p>
                            <p>Closing Time: { this.props.userList[id].closingTime }</p>
                            <p>Minimum price for a meal: { this.props.userList[id].minMeal } EUR</p>
                            <p>Maximum price for a meal: { this.props.userList[id].maxMeal }EUR</p>
                            <p>Minimum price for an entertainment activity: { this.props.userList[id].minService } EUR</p>
                            <p>Maximum price for an entertainment activity: { this.props.userList[id].maxService } EUR</p>
                        </div>
                    ) : null;
                    const contenu3 = ((this.props.userList[id].serviceHotel !== 'YES') && (this.props.userList[id].serviceHostel !== 'YES') && (this.props.userList[id].serviceRestaurant === 'YES') && (this.props.userList[id].serviceEntertainment === 'YES')) ? (
                        <div>
                            <p>Restaurant, Entertainment</p>
                            <br />
                            <p>Opening Time: { this.props.userList[id].openingTime }</p>
                            <p>Closing Time: { this.props.userList[id].closingTime }</p>
                            <p>Minimum price for a meal: { this.props.userList[id].minMeal } EUR</p>
                            <p>Maximum price for a meal: { this.props.userList[id].maxMeal } EUR</p>
                            <p>Minimum price for an entertainment activity: { this.props.userList[id].minService } EUR</p>
                            <p>Maximum price for an entertainment activity: { this.props.userList[id].maxService } EUR</p>
                        </div>
                    ) : null;
                    const contenu4 = ((this.props.userList[id].serviceHotel === 'YES') && (this.props.userList[id].serviceHostel !== 'YES') && (this.props.userList[id].serviceRestaurant !== 'YES') && (this.props.userList[id].serviceEntertainment === 'YES')) ? (
                        <div>
                            <p>Hotel, Entertainment</p>
                            <br />
                            <p>Hotel properties: </p>
                            <p>Sea View: { this.props.userList[id].seaView }</p>
                            <p>Minimum price for a hotel room: { this.props.userList[id].minHotelRoom } EUR</p>
                            <p>Maximum price for a hotel room: { this.props.userList[id].maxHotelRoom } EUR</p>
                            <p>Entertainment properties: </p>
                            <p>Opening Time: { this.props.userList[id].openingTime }</p>
                            <p>Closing Time: { this.props.userList[id].closingTime }</p>
                            <p>Minimum price for an entertainment activity: { this.props.userList[id].minService } EUR</p>
                            <p>Maximum price for an entertainment activity: { this.props.userList[id].maxService } EUR</p>
                        </div>
                    ) : null;
                    const contenu5 = ((this.props.userList[id].serviceHotel !== 'YES') && (this.props.userList[id].serviceHostel === 'YES') && (this.props.userList[id].serviceRestaurant !== 'YES') && (this.props.userList[id].serviceEntertainment === 'YES')) ? (
                        <div>
                            <p>Hostel, Entertainment</p>
                            <br />
                            <p>Opening Time: { this.props.userList[id].openingTime }</p>
                            <p>Closing Time: { this.props.userList[id].closingTime }</p>
                            <p>Minimum price for a hostel room: { this.props.userList[id].minHostelRoom } EUR</p>
                            <p>Maximum price for a hostel room: { this.props.userList[id].maxHostelRoom } EUR</p>
                            <p>Minimum price for an entertainment activity: { this.props.userList[id].minService } EUR</p>
                            <p>Maximum price for an entertainment activity: { this.props.userList[id].maxService } EUR</p>
                        </div>
                    ) : null;
                    const contenu6 = ((this.props.userList[id].serviceHotel !== 'YES') && (this.props.userList[id].serviceHostel === 'YES') && (this.props.userList[id].serviceRestaurant === 'YES') && (this.props.userList[id].serviceEntertainment !== 'YES')) ? (
                        <div>
                            <p>Hostel, Restaurant</p>
                            <br />
                            <p>Opening Time: { this.props.userList[id].openingTime }</p>
                            <p>Closing Time: { this.props.userList[id].closingTime }</p>
                            <p>Minimum price for a hostel room: { this.props.userList[id].minHostelRoom } EUR</p>
                            <p>Maximum price for a hostel room: { this.props.userList[id].maxHostelRoom } EUR</p>
                            <p>Minimum price for a meal: { this.props.userList[id].minMeal } EUR</p>
                            <p>Maximum price for a meal: { this.props.userList[id].maxMeal } EUR</p>
                        </div>
                    ) : null;
                    const contenu7 = ((this.props.userList[id].serviceHotel === 'YES') && (this.props.userList[id].serviceHostel !== 'YES') && (this.props.userList[id].serviceRestaurant === 'YES') && (this.props.userList[id].serviceEntertainment !== 'YES')) ? (
                        <div>
                            <p>Hotel, Restaurant</p>
                            <br />
                            <p>Hotel properties: </p>
                            <p>Sea View: { this.props.userList[id].seaView }</p>
                            <p>Minimum price for a hotel room: { this.props.userList[id].minHotelRoom } EUR</p>
                            <p>Maximum price for a hotel room: { this.props.userList[id].maxHotelRoom } EUR</p>
                            <p>Restaurant properties: </p>
                            <p>Opening Time: { this.props.userList[id].openingTime }</p>
                            <p>Closing Time: { this.props.userList[id].closingTime }</p>
                            <p>Minimum price for a meal: { this.props.userList[id].minMeal } EUR</p>
                            <p>Maximum price for a meal: { this.props.userList[id].maxMeal } EUR</p>
                        </div>
                    ) : null;
                    const contenu8 = ((this.props.userList[id].serviceHotel !== 'YES') && (this.props.userList[id].serviceHostel !== 'YES') && (this.props.userList[id].serviceRestaurant !== 'YES') && (this.props.userList[id].serviceEntertainment === 'YES')) ? (
                        <div>
                            <p>Entertainment</p>
                            <br />
                            <p>Opening Time: { this.props.userList[id].openingTime }</p>
                            <p>Closing Time: { this.props.userList[id].closingTime }</p>
                            <p>Minimum price for an entertainment activity: { this.props.userList[id].minService } EUR</p>
                            <p>Maximum price for an entertainment activity: { this.props.userList[id].maxService } EUR</p>
                        </div>
                    ) : null;
                    const contenu9 = ((this.props.userList[id].serviceHotel === 'YES') && (this.props.userList[id].serviceHostel !== 'YES') && (this.props.userList[id].serviceRestaurant !== 'YES') && (this.props.userList[id].serviceEntertainment !== 'YES')) ? (
                        <div>
                            <p>Hotel</p>
                            <br />
                            <p>Sea View: { this.props.userList[id].seaView }</p>
                            <p>Minimum price for a hotel room: { this.props.userList[id].minHotelRoom } EUR</p>
                            <p>Maximum price for a hotel room: { this.props.userList[id].maxHotelRoom } EUR</p>
                        </div>
                    ) : null;
                    const contenu10 = ((this.props.userList[id].serviceHotel !== 'YES') && (this.props.userList[id].serviceHostel === 'YES') && (this.props.userList[id].serviceRestaurant !== 'YES') && (this.props.userList[id].serviceEntertainment !== 'YES')) ? (
                        <div>
                            <p>Hostel</p>
                            <br />
                            <p>Opening Time: { this.props.userList[id].openingTime }</p>
                            <p>Closing Time: { this.props.userList[id].closingTime }</p>
                            <p>Minimum price for a hostel room: { this.props.userList[id].minHostelRoom } EUR</p>
                            <p>Maximum price for a hostel room: { this.props.userList[id].maxHostelRoom } EUR</p>
                        </div>
                    ) : null;
                    const contenu11 = ((this.props.userList[id].serviceHotel !== 'YES') && (this.props.userList[id].serviceHostel !== 'YES') && (this.props.userList[id].serviceRestaurant === 'YES') && (this.props.userList[id].serviceEntertainment !== 'YES')) ? (
                        <div>
                            <p>Retaurant</p>
                            <br />
                            <p>Opening Time: { this.props.userList[id].openingTime }</p>
                            <p>Closing Time: { this.props.userList[id].closingTime }</p>
                            <p>Minimum price for a meal: { this.props.userList[id].minMeal } EUR</p>
                            <p>Maximum price for a meal: { this.props.userList[id].maxMeal } EUR</p>
                        </div>
                    ) : null;

                    // set the marker of the AYLI
                    var marker = <Marker 
                            key={id}
                            position={{ lat: lat[id], lng: lng[id] }}
                            >
                            <InfoWindow
                            key={id}
                            >
                                <button onClick={() => {this.handleClick(this.props.userList[id].companyName)}}><strong>{this.props.userList[id].companyName}</strong><br/><p>Address: { formattedAddress[id] }</p>{ contenu } { contenu1 } { contenu2 } { contenu3 } { contenu4 } { contenu5 } { contenu6 } { contenu7 } { contenu8 } { contenu9 } { contenu10 } { contenu11 }<p>Distance from your current location: { d } km</p><p>Rating: { this.props.userList[id].rating } Stars</p></button>  
                                
                            </InfoWindow>
                            </Marker>
                    // Display the SC marker depending on the distance chosen from 'Filter By Distance' input
                    if ((this.state.distance === 'too close') && (d < 1)){
                        
                        if ((this.state.modern === 'YES') && (this.state.classic !== 'YES') && (item.placeStyle === 'modern style')){
                    
                    if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){

                        if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal))){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if (( parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    } 
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        }
                    } else {
                        //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                    }
                        } else if ((this.state.classic === 'YES') && (this.state.modern !== 'YES') && (item.placeStyle === 'classic style')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                
                                //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                }
                            } else {
                                //Hotel
                                if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                    if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                        
                                //Hostel
                                if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                                //Restaurant
                                if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }

                        
                                //Entertainment
                                if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minService) && (this.state.maxService)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minService) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                            }
                        } else if ((this.state.classic !== 'YES') && (this.state.modern !== 'YES')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((this.state.minHostelRoom <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                                }
                            } else {
                                //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                            }
                        }
                        
                    } else if ((this.state.distance === 'close') && (d < 5)){
                        
                        if ((this.state.modern === 'YES') && (this.state.classic !== 'YES') && (item.placeStyle === 'modern style')){
                    
                    if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){

                        if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal))){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if (( parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    } 
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        }
                    } else {
                        //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                    }
                        } else if ((this.state.classic === 'YES') && (this.state.modern !== 'YES') && (item.placeStyle === 'classic style')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                
                                //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                }
                            } else {
                                //Hotel
                                if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                    if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                        
                                //Hostel
                                if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                                //Restaurant
                                if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }

                        
                                //Entertainment
                                if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minService) && (this.state.maxService)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minService) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                            }
                        } else if ((this.state.classic !== 'YES') && (this.state.modern !== 'YES')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((this.state.minHostelRoom <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                                }
                            } else {
                                //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                            }
                        }
                        
                    } else if ((this.state.distance === 'far') && (d < 10)){
                        
                        if ((this.state.modern === 'YES') && (this.state.classic !== 'YES') && (item.placeStyle === 'modern style')){
                    
                    if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){

                        if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal))){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if (( parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    } 
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        }
                    } else {
                        //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                    }
                        } else if ((this.state.classic === 'YES') && (this.state.modern !== 'YES') && (item.placeStyle === 'classic style')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                
                                //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                }
                            } else {
                                //Hotel
                                if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                    if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                        
                                //Hostel
                                if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                                //Restaurant
                                if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }

                        
                                //Entertainment
                                if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minService) && (this.state.maxService)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minService) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                            }
                        } else if ((this.state.classic !== 'YES') && (this.state.modern !== 'YES')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((this.state.minHostelRoom <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                                }
                            } else {
                                //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                            }
                        }

                    } else if ((this.state.distance === 'too far') && (d < 20)){
                        
                        if ((this.state.modern === 'YES') && (this.state.classic !== 'YES') && (item.placeStyle === 'modern style')){
                    
                    if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){

                        if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal))){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if (( parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    } 
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        }
                    } else {
                        //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                    }
                        } else if ((this.state.classic === 'YES') && (this.state.modern !== 'YES') && (item.placeStyle === 'classic style')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                
                                //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                }
                            } else {
                                //Hotel
                                if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                    if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                        
                                //Hostel
                                if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                                //Restaurant
                                if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }

                        
                                //Entertainment
                                if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minService) && (this.state.maxService)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minService) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                            }
                        } else if ((this.state.classic !== 'YES') && (this.state.modern !== 'YES')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((this.state.minHostelRoom <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                                }
                            } else {
                                //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                            }
                        }
                    }
                    console.log(this.state);
                    //Hotel
                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                             if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                return marker
                                }
                            } 
                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                             if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                return marker
                                }
                            } 
                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')  || (this.state.seaView === '')){
                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                return marker
                                }
                            } 
                        }      
                        console.log(this.state);                 
                    }
                    
                    //Hostel
                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                return marker
                                }
                            }
                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                return marker
                                }
                            }
                        }                       
                    }
                    //Restaurant
                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                return marker
                                }
                            }
                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                return marker
                                }
                            }
                        }                       
                    }

                    
                    //Entertainment
                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                            if ((this.state.minService) && (this.state.maxService)){
                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                return marker
                                }
                            }
                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                            if ((this.state.minService) && (this.state.maxMeal)){
                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                return marker
                                }
                            }
                        }                       
                    }

                    // Display the SC marker depending on the rating chosen from 'Filter By Rating' input
                    if ((this.state.rating === 'oneStar') && (item.rating === 1)){
                        
                        if ((this.state.modern === 'YES') && (this.state.classic !== 'YES') && (item.placeStyle === 'modern style')){
                    
                    if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){

                        if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom )) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        }
                    } else {
                        //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                    }
                        } else if ((this.state.classic === 'YES') && (this.state.modern !== 'YES') && (item.placeStyle === 'classic style')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                
                                //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                           if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                }
                            } else {
                                //Hotel
                                if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                    if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom )) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                        
                                //Hostel
                                if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                                //Restaurant
                                if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }

                        
                                //Entertainment
                                if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minService) && (this.state.maxService)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minService) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                            }
                        } else if ((this.state.classic !== 'YES') && (this.state.modern !== 'YES')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom )<= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                                }
                            } else {
                                //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                            }
                        }
                    } else if ((this.state.rating === 'twoStar') && (item.rating === 2)){
                        
                        if ((this.state.modern === 'YES') && (this.state.classic !== 'YES') && (item.placeStyle === 'modern style')){
                    
                    if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){

                        if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom )) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        }
                    } else {
                        //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                    }
                        } else if ((this.state.classic === 'YES') && (this.state.modern !== 'YES') && (item.placeStyle === 'classic style')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                
                                //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                           if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                }
                            } else {
                                //Hotel
                                if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                    if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom )) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                        
                                //Hostel
                                if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                                //Restaurant
                                if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }

                        
                                //Entertainment
                                if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minService) && (this.state.maxService)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minService) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                            }
                        } else if ((this.state.classic !== 'YES') && (this.state.modern !== 'YES')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom )<= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                                }
                            } else {
                                //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                            }
                        }
                    } else if ((this.state.rating === 'threeStar') && (item.rating === 3)){
                        
                        if ((this.state.modern === 'YES') && (this.state.classic !== 'YES') && (item.placeStyle === 'modern style')){
                    
                    if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){

                        if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom )) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        }
                    } else {
                        //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                    }
                        } else if ((this.state.classic === 'YES') && (this.state.modern !== 'YES') && (item.placeStyle === 'classic style')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                
                                //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                           if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                }
                            } else {
                                //Hotel
                                if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                    if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom )) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                        
                                //Hostel
                                if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                                //Restaurant
                                if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }

                        
                                //Entertainment
                                if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minService) && (this.state.maxService)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minService) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                            }
                        } else if ((this.state.classic !== 'YES') && (this.state.modern !== 'YES')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom )<= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                                }
                            } else {
                                //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                            }
                        }
                    } else if ((this.state.rating === 'fourStar') && (item.rating === 4)){
                        
                        if ((this.state.modern === 'YES') && (this.state.classic !== 'YES') && (item.placeStyle === 'modern style')){
                    
                    if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){

                        if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom )) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        }
                    } else {
                        //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                    }
                        } else if ((this.state.classic === 'YES') && (this.state.modern !== 'YES') && (item.placeStyle === 'classic style')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                
                                //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                           if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                }
                            } else {
                                //Hotel
                                if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                    if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom )) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                        
                                //Hostel
                                if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                                //Restaurant
                                if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }

                        
                                //Entertainment
                                if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minService) && (this.state.maxService)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minService) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                            }
                        } else if ((this.state.classic !== 'YES') && (this.state.modern !== 'YES')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom )<= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                                }
                            } else {
                                //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                            }
                        }
                    } else if ((this.state.rating === 'fiveStar') && (item.rating === 5)){
                        
                        if ((this.state.modern === 'YES') && (this.state.classic !== 'YES') && (item.placeStyle === 'modern style')){
                    
                    if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){

                        if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        } 
                        if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                            
                            //Hotel
                            if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                    if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                        if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                
                            //Hostel
                            if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom )) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                        if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Restaurant
                            if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minMeal) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                            //Entertainment
                            if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                    if ((this.state.minService) && (this.state.maxService)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                    if ((this.state.minService) && (this.state.maxMeal)){
                                        if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                        return marker
                                        }
                                    }
                                }                       
                            }
                        }
                    } else {
                        //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                    }
                        } else if ((this.state.classic === 'YES') && (this.state.modern !== 'YES') && (item.placeStyle === 'classic style')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                
                                //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                           if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                }
                            } else {
                                //Hotel
                                if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                    if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom )) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                        if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                            if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                        
                                //Hostel
                                if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                            if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                                //Restaurant
                                if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minMeal) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }

                        
                                //Entertainment
                                if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                    if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                        if ((this.state.minService) && (this.state.maxService)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                        if ((this.state.minService) && (this.state.maxMeal)){
                                            if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                            return marker
                                            }
                                        }
                                    }                       
                                }
                            }
                        } else if ((this.state.classic !== 'YES') && (this.state.modern !== 'YES')){
                            if ((this.state.singles === 'YES') || (this.state.couples === 'YES') || (this.state.family=== 'YES')){
                                if ((this.state.singles === 'YES') && (item.couplesLevel === 'low couples level')){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom )<= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.couples === 'YES') && ((item.couplesLevel === 'medium couples level') || (item.couplesLevel === 'high couples level'))){
                                    
                                    //Hotel
                                    if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                                        if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                            if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                                if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                        
                                    //Hostel
                                    if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                                if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Restaurant
                                    if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minMeal) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                    //Entertainment
                                    if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                                        if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                            if ((this.state.minService) && (this.state.maxService)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                            if ((this.state.minService) && (this.state.maxMeal)){
                                                if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                                return marker
                                                }
                                            }
                                        }                       
                                    }
                                } 
                                if ((this.state.family === 'YES') && ((item.familyLevel === 'medium family level') || (item.familyLevel === 'high family level'))){
                                    
                                    //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                                }
                            } else {
                                //Hotel
                        if ((this.state.serviceHotel === 'YES') && (item.serviceHotel === 'YES') ){
                            if ((this.state.seaView === 'off-shore') && (item.seaView === 'off-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'on-shore') && (item.seaView === 'on-shore')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.seaView === 'all') || (this.state.seaView === 'Sea View')){
                                if ((this.state.minHotelRoom) && (this.state.maxHotelRoom)){
                                    if ((parseFloat(this.state.minHotelRoom) <= parseFloat(item.minHotelRoom) ) && (parseFloat(this.state.maxHotelRoom) >= parseFloat(item.maxHotelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        
                        //Hostel
                        if ((this.state.serviceHostel === 'YES') && (item.serviceHostel === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minHostelRoom) && (this.state.maxHostelRoom)){
                                    if ((parseFloat(this.state.minHostelRoom) <= parseFloat(item.minHostelRoom) ) && (parseFloat(this.state.maxHostelRoom) >= parseFloat(item.maxHostelRoom) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                        //Restaurant
                        if ((this.state.serviceRestaurant === 'YES') && (item.serviceRestaurant === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minMeal) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minMeal) <= parseFloat(item.minMeal) ) && (parseFloat(this.state.maxMeal) >= parseFloat(item.maxMeal) )){
                                    return marker
                                    }
                                }
                            }                       
                        }

                        
                        //Entertainment
                        if ((this.state.serviceEntertainment === 'YES') && (item.serviceEntertainment === 'YES') ){
                            if ((this.state.openingHours === '24 hours') && (item.openingTime === item.closingTime)){
                                if ((this.state.minService) && (this.state.maxService)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            } else if ((this.state.openingHours === 'All') || (this.state.openingHours === 'Opening Time')){
                                if ((this.state.minService) && (this.state.maxMeal)){
                                    if ((parseFloat(this.state.minService) <= parseFloat(item.minService) ) && (parseFloat(this.state.maxService) >= parseFloat(item.maxService) )){
                                    return marker
                                    }
                                }
                            }                       
                        }
                            }
                        }
                    }
                    
                    // Return all SCs markers without filitering if none is chosen
                    if ((this.state.rating === 'Filter By Rating') && (this.state.distance === 'Near Me') && (this.state.serviceHotel !== 'YES') && (this.state.serviceHostel !== 'YES') && (this.state.serviceRestaurant !== 'YES') && (this.state.serviceEntertainment !== 'YES')){
                        return marker
                    }
               // }

            })
            }
    
            <Marker
            draggable={true}
            onDragEnd={this.onMarkerDragEnd}
            position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
            >
            <InfoWindow>
                <div>
                Current Location
                </div>
            </InfoWindow>
            </Marker>

            <AutoComplete 
                style={{ width: "100%", height:'40px', paddingLeft: 16, marginTop: 2, marginBottom: '2rem' }}  
                types={['(regions)']}
                onPlaceSelected={this.onPlaceSelected}
            />

            </GoogleMap>
        ));

        //jhkhlk
        const hotel = (this.state.serviceHotel === 'YES') ? (
            <div className="hotel">
                <div className="row">
                    <div className="seaViews input-field col s3">
    
                        <ul id="seaView" className="dropdown-content validate">
                            <li><a id="off-shore" className="blue-text text-lighten-3" onClick={this.handleClickSeventh}>Off-shore</a></li>
                            <li><a id="on-shore" className="blue-text text-lighten-3" onClick={this.handleClickSeventh}>On-shore</a></li>
                            <li><a id="all" className="blue-text text-lighten-3" onClick={this.handleClickSeventh}>All</a></li>
                        </ul>
                        
                        <a className="btn dropdown-button #ef9a9a red lighten-3" id="botton" data-beloworigin="true" data-hover="true" data-activates="seaView" dropdown="true">{this.state.seaView}<i className="material-icons right">arrow_drop_down</i></a>
                        
                    </div>
                    
                </div>
                <br />
                <br />
                <div className="container">
                <h3 className="grey-text center-align" >Hotel Room Price Range</h3>
                <br />
                
                <div id="test-slider" onClick={this.handleChange4}></div>
                </div>
                <br />
                <br />
                <br />
            </div>
            ):(
            <div>
    
            </div>
            )

            const hostel = ((this.state.serviceHostel === 'YES')) ? (
                <div className="hostel">
                    <div className="container">
                    <h3 className="grey-text" >Hostel Room Price Range</h3>
                    <br />
                    <div id="test-slider2" onClick={this.handleChange5}></div>
                    </div>
                    <br />
                    <br />
                    <br />
                </div>
                ):(
                <div>
        
                </div>
                )
            const restaurant = ((this.state.serviceRestaurant === 'YES')) ? (
                <div className="restaurant">
                    <div className="container">
                    <h3 className="grey-text" >Restaurant Meal Price Range</h3>
                    <br />
                    <div id="test-slider3" onClick={this.handleChange6}></div>
                    </div>
                    <br />
                    <br />
                    <br />
                </div>
                ):(
                <div>
        
                </div>
                )
            const entertainment = ((this.state.serviceEntertainment === 'YES')) ? (
                <div className="entertainment">
                    <div className="container">
                    <h3 className="grey-text" >Entertainment Service Price Range</h3>
                    <br />
                    <div id="test-slider4" onClick={this.handleChange7}></div>
                    </div>
                    <br />
                    <br />
                    <br />
                </div>
                ):(
                <div>
        
                </div>
                )

                const others = ((this.state.serviceHostel === 'YES') || (this.state.serviceRestaurant === 'YES') || (this.state.serviceEntertainment === 'YES')) ? (
                    <div className="others">
                        <div className="row">
                            <div className="horraire input-field col s3">
            
                                <ul id="openingHours" className="dropdown-content validate">
                                    <li><a id="24 hours" className="blue-text text-lighten-3" onClick={this.handleClickSixth}>24 hours</a></li>
                                    <li><a id="All" className="blue-text text-lighten-3" onClick={this.handleClickSixth}>All</a></li>
                                </ul>
                                
                                <a className="btn dropdown-button #ef9a9a red lighten-3" id="botton" data-beloworigin="true" data-hover="true" data-activates="openingHours" dropdown="true">{this.state.openingHours}<i className="material-icons right">arrow_drop_down</i></a>
                                
                            </div>                           
                        </div>                        
                    </div>
                    ):(
                    <div>
            
                    </div>
                    )
    
    // JSX template to display the component on the browser
    return (
        <div>
            <Redirect to="/" />
            <div className="spot" style={{ padding:'1rem', margin:'0 auto', maxWidth: 1000 }}>
            
                <h1>Choose your AYLI</h1>
                <div className="row list">
                        <i className="col s31 small material-icons prefix">business</i>
                        <br/>
                        <br/>
                        <ul id="service" className="validate">
                        
                            <li className="col s3 push-s1">
                            <input id="serviceHotel" className="serviceHotel validate" type="checkbox" onChange={this.handleChange1}/>
                            <label id="serviceHotel1" htmlFor="serviceHotel">Hotel</label>   
                            </li>
                            <li className="col s2 push-s1">
                            <input id="serviceHostel" className="serviceHostel validate" type="checkbox" onChange={this.handleChange1}/>
                            <label id="serviceHostel1" htmlFor="serviceHostel">Hostel</label>   
                            </li>
                            <li className="col s2 push-s2">
                            <input id="serviceRestaurant" className="serviceRestaurant validate" type="checkbox" onChange={this.handleChange1}/>
                            <label id="serviceRestaurant1" htmlFor="serviceRestaurant">Restaurant</label>   
                            </li>
                            <li className="col s2 push-s3">
                            <input id="serviceEntertainment" className="serviceEntertainment validate" type="checkbox" onChange={this.handleChange1}/>
                            <label id="serviceEntertainment1" htmlFor="serviceEntertainment">Entertainment</label>   
                            </li>
                        </ul>
                        <br/>
                        <br/>
                    </div>
                    { hotel }
                    { others }
                    { hostel }
                    { restaurant }
                    { entertainment }
                <div className="row">
                    <div className="choose4 col s3 ">
                        <ul id="distance" className="dropdown-content">
                            <li><a id="too close" className="blue-text text-lighten-3" onClick={this.handleClickFourth} >Less than 1 km</a></li>
                            <li><a id="close" className="blue-text text-lighten-3" onClick={this.handleClickFourth}>Less than 5 km</a></li>
                            <li><a id="far" className="blue-text text-lighten-3" onClick={this.handleClickFourth}>less than 10 km</a></li>
                            <li><a id="too far" className="blue-text text-lighten-3" onClick={this.handleClickFourth}>less than 20 km</a></li>
                        </ul>
                        <a className="btn dropdown-button #ef9a9a red lighten-3" id="botton" data-beloworigin="true" data-hover="true" data-activates="distance" dropdown="true">{this.state.distance}<i className="material-icons right">arrow_drop_down</i></a>
                    </div>
                
                    <div className="choose5 col s6 ">
                        <ul id="rating1" className="dropdown-content">
                            <li><a id="oneStar" className="blue-text text-lighten-3" onClick={this.handleClickFifth} ><i className="material-icons">star</i></a></li>
                            <li><a id="twoStar" className="blue-text text-lighten-3" onClick={this.handleClickFifth}><i className="material-icons">star star</i></a></li>
                            <li><a id="threeStar" className="blue-text text-lighten-3" onClick={this.handleClickFifth}><i className="material-icons">star star star</i></a></li>
                            <li><a id="fourStar" className="blue-text text-lighten-3" onClick={this.handleClickFifth}><i className="material-icons">star star star star</i></a></li>
                            <li><a id="fiveStar" className="blue-text text-lighten-3" onClick={this.handleClickFifth}><i className="material-icons">star star star star star</i></a></li>
                        </ul>
                        <a className="btn dropdown-button #ef9a9a red lighten-3" id="botton" data-beloworigin="true" data-hover="true" data-activates="rating1" dropdown="true">{ this.state.rating }<i className="material-icons right">arrow_drop_down</i></a>
                    </div>

                </div>
                <br />
                <div className="row list">
                    <h3 className="grey-text">Company Preferences</h3>
                    
                    <br/>
                    <ul id="preference" className="validate">
                        
                        <li className="col s3 push-s1">
                        <input id="singles" className="singles validate" type="checkbox" onChange={this.handleChange1}/>
                        <label id="singles1" htmlFor="singles">For Singles</label>   
                        </li>
                        <li className="col s3 push-s1">
                        <input id="couples" className="couples validate" type="checkbox" onChange={this.handleChange1}/>
                        <label id="couples1" htmlFor="couples">For Couples</label>   
                        </li>
                        <li className="col s2 push-s1">
                        <input id="family" className="family validate" type="checkbox" onChange={this.handleChange1}/>
                        <label id="family1" htmlFor="family">For Families</label>   
                        </li>
                        <li className="col s2 push-s2">
                        <input id="classic" className="classic validate" type="checkbox" onChange={this.handleChange1}/>
                        <label id="classic1" htmlFor="classic">Classic Style</label>   
                        </li>
                        <li className="col s2 push-s3">
                        <input id="modern" className="modern validate" type="checkbox" onChange={this.handleChange1}/>
                        <label id="modern1" htmlFor="modern">Modern Style</label>   
                        </li>
                    </ul>
                    <br/>
                    <br/>
                </div>
                <h5 className="grey-text">Custom Specifications</h5>
                <div className="input-field col s12">
                    <label htmlFor="serviceDescription">This text will be directly forwarded to the chosen AYLI</label>
                    <textarea id="serviceDescription" className="materialize-textarea" onChange={this.handleChange}></textarea>
                </div>
                <br/>
                <Descriptions bordered>
                    <Descriptions.Item label="City">{this.state.city}</Descriptions.Item>
                    <Descriptions.Item label="Area">{this.state.area}</Descriptions.Item>
                    <Descriptions.Item label="State">{this.state.state}</Descriptions.Item>
                    <Descriptions.Item label="Address">{this.state.address}</Descriptions.Item>
                </Descriptions>       

                <MapWithAMarker
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyD2xEnWGmR699ujB-8R7cLPPUY3P0Uob-s&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                />
                        
            </div>
        </div>
    );
    
    } else {
    return (
        <ul className="right"></ul>
    )
    }
    }
}

// map the Redux store state to props to enable the current component to get and read the needed informations from the Redux store
const mapStateToProps = (state) => {
    const users = state.firestore.data.users;
    const users2 = state.firestore.ordered.users;
    const email = state.firebase.profile.email;
    const userList = users ? Object.values(users).filter((item) => {
        return ((item.userType === 'AYLI') && (item.adminDecision === 'ACCEPTED'))}) : null;

    const userList2 = users2 ? users2.filter(user1 => {return user1.userType === 'AYLI'}) : null ;
    
    console.log(userList)
    return {
        auth: state.firebase.auth,
        userList: userList,
        userEmail: email,
        users: userList2
    }
}

// map the action dispatcher needed to the prop to use it in order to change the redux store state.
const mapDispatchToProps = (dispatch) => {
    return {
        createService: (service) => {dispatch(createService(service));}
    }
}

// export the component and wrapping it by higher order components 'connect' and 'firestoreConnect' to connect to React Redux and to the Firebase Cloud Firestore. We use 'compose' to combine these components into one component to wrap the current component to export
export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    firestoreConnect([
        { collection: 'users' }
    ])
)(MapContainer);