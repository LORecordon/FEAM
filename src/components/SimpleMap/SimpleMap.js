import React, { useMemo, useState } from "react";
import "./SimpleMap.css";
import SpinnerOfDoom from "../HomePage/SpinnerOfDoom";
import { Button, TextField } from "@mui/material";

import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import usePlacesAutocomplete, {
    getGeocode,
    getLatLng
} from "use-places-autocomplete";

import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from "@reach/combobox";

const libraries = ['places']

export default function SimpleMap(){
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAzZKv1qMj4zuF5Q0eM5vmZonlrTjm6eZ8",
        libraries
    })
    const [coordLoaded, setCoordsLoaded] = React.useState(false);
    const [dProps, setDProps] = React.useState({});

    React.useEffect(() => {
      if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, error);
      } else {
        console.log('Geolocation Not Supported')
      }
    }, [])

    function success(position) {
      //console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      setDProps({
        center: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        zoom: 11
      })
      setCoordsLoaded(true)
    }

    function error() {
      console.log("Unable to retrieve your location");
      setDProps({
        center: {
          lat: 0.00000,
          lng: 0.00000
        },
        zoom: 6
      })
      setCoordsLoaded(false)
    }

    if (!isLoaded && !coordLoaded) return <SpinnerOfDoom/>
    if (isLoaded){
        if (coordLoaded) {
            return <Map props={dProps}/>
        }
    }
    console.log("saved")
    return <SpinnerOfDoom/>
    
}

function Map({props}){
    const [selected, setSelected] = useState(null);
    const [mapref, setMapRef] = useState(null);
    const [latlng, setLatLng] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [creating, setCreating] = useState(false);

    //every time latlng changes, update the map center
    useMemo(() => {
        //if selected is null then set to props.center
        if (selected === null) {
            setMapCenter(props.center)
        } else {    
            setMapCenter(selected)
        }
    }, [selected])
    const handleOnLoad = map => {
        setMapRef(map);
    }
    const handleCenterChanged = () => {
        if (mapref) {
            const newCenter = mapref.getCenter();
            setLatLng([newCenter.lat(), newCenter.lng()])
        }
    }
    const handleSetLocation = () =>{
        console.log('You placed your marker on ' + latlng[0] + ', ' + latlng[1])
    }

    const handleMarkerClick = (event) => {
        //log the lat and lng for the marker 
        console.log('You clicked on ' + event.latLng.lat() + ', ' + event.latLng.lng())
        setSelectedMarker({latitude: event.latLng.lat(), longitude: event.latLng.lng()})
    }

    const handleAddMarker = () => {
        const mcords = [latlng[0], latlng[1]]
        setMarkers(prevTags => [...prevTags, mcords])
    }

    const handleNewLocation = () => {
        setCreating(true);
    }
    const handleAbortLocation = () => {
        setCreating(false);
    }

    return (
        <div className="map-popup">
            <div className="search-container">
                <SearchPlaces className={"search-box"} setSelected={setSelected}/>
            </div>
            {creating && <CreateLocation position={latlng} handleClose={handleAbortLocation}/>}
            <GoogleMap zoom={10} center={mapCenter} mapContainerClassName="map-container" onLoad={handleOnLoad} onCenterChanged={handleCenterChanged}>
                {/*<Marker position={{lat: latlng[0], lng: latlng[1]}} />
                {markers.map((val) =>{ return <Marker position={{lat:val[0], lng:val[1]}} onClick={handleMarkerClick} /> })}
                {selectedMarker && (
                    <InfoWindow className="marker-info" onCloseClick={() => setSelectedMarker(null)} position={{lat: selectedMarker.latitude, lng: selectedMarker.longitude}}>
                        <h4 style={{padding: "0", margin: "0"}}>Some Location</h4>
                    </InfoWindow>
                )}*/}

                <Marker position={{lat: latlng[0], lng: latlng[1]}} icon={{url: 'mapmarker.ico'}}/>
                {selected && <Marker position={{lat: selected.lat, lng: selected.lng}}/>}
            </GoogleMap>
            <button className="map-submit" onClick={handleNewLocation}>New Location</button>
        </div>
    )
}
//<div className="search-container">{
//                    <SearchPlaces className={"search-box"} setSelected={setSelected}/>
//                </div>
//
const SearchPlaces = ({setSelected}) => {
    const {
        ready,
        value,
        setValue,
        suggestions: {status, data},
        clearSuggestions
    } = usePlacesAutocomplete();

    const handleSelect = async (location) => {
        setValue(location, false);
        clearSuggestions();
        const result = await getGeocode({ address: location });
        const {lat, lng} = await getLatLng(result[0]);
        console.log(lat, lng)
        setSelected({lat, lng})
    }

    return <Combobox onSelect={handleSelect}>
        <ComboboxInput value={value} onChange={(e)=> setValue(e.target.value)} disabled={!ready} className="comboboxinput" placeholder="Search Places"/>
    
        <ComboboxPopover>
            <ComboboxList className="suggestions-ls">
                {status === "OK" && data.map(({place_id, description}) => <ComboboxOption key={place_id} value={description}/>)}
            </ComboboxList>
        </ComboboxPopover>

    </Combobox>
}

const CreateLocation = ({position, handleClose}) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleSubmit = () => {
        console.log(name, description, position)
        console.log("Setting to True")
        setUploading(true);
        //upload to database

        //Change all this fetch to a function for api post
        fetch('http://localhost:3001/api/locations')    
        .then(response => {
            // Check if the response status code is in the range of 200-299 (successful)
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }
            
            // Parse the response as JSON
            return response.json();
        })
        .then(data => {
            // Handle the data here (e.g., update the UI)
            console.log(data);
            setName("");
            setDescription("");
            setUploading(false);
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch operation
            console.error('Fetch error:', error);
            setUploading(false);
        });

        
    }
    if (uploading) return (
        <div className="create-location">
            <Button className="pop-close-button" onClick={handleClose}>
                <h1 style={{margin: "0", padding:"0"}}>X</h1>
            </Button>
            <h1>Uploading...</h1>
        </div>
    )
    return (
        <div className="create-location">
            <Button className="pop-close-button" onClick={handleClose}>
                <h1 style={{margin: "0", padding:"0"}}>X</h1>
            </Button>
            <h3>Location Name</h3>
            <TextField
                style={{ width: "100%", margin: "5px"}}
                type="text"
                label="Location Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <h3>Location Description</h3>
            <TextField
                style={{ width: "100%", margin: "5px"}}
                type="text"
                label="Location Description"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Button variant="contained" color="primary" className="new-trip-button" onClick={handleSubmit}>
                Post!
            </Button>
        </div>
    )
}

